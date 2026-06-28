import { randomBytes, scrypt as nodeScrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import type { UserRole } from "@prisma/client";
import { db } from "@/lib/db";

const scrypt = promisify(nodeScrypt);
const CREDENTIALS_PROVIDER_ID = "credentials";
const HASH_KEY_LENGTH = 64;
const SALT_LENGTH = 16;

type CredentialsUser = {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRole;
};

export function normalizeAuthEmail(value: string) {
  return value.trim().toLowerCase();
}

async function derivePasswordHash(password: string, salt: Buffer) {
  const derivedKey = (await scrypt(password, salt, HASH_KEY_LENGTH)) as Buffer;

  return derivedKey.toString("hex");
}

export async function hashPassword(password: string) {
  const salt = randomBytes(SALT_LENGTH);
  const derivedKey = await derivePasswordHash(password, salt);

  return `${salt.toString("hex")}:${derivedKey}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  const [saltHex, hashHex] = storedHash.split(":");

  if (!saltHex || !hashHex) {
    return false;
  }

  const salt = Buffer.from(saltHex, "hex");
  const expectedHash = Buffer.from(hashHex, "hex");
  const actualHash = Buffer.from(await derivePasswordHash(password, salt), "hex");

  if (expectedHash.length !== actualHash.length) {
    return false;
  }

  return timingSafeEqual(expectedHash, actualHash);
}

export async function findCredentialsUserByEmail(email: string): Promise<{
  passwordHash: string;
  user: CredentialsUser;
} | null> {
  const normalizedEmail = normalizeAuthEmail(email);
  // The current auth schema has no dedicated password column, so credentials
  // hashes live on the credentials account row.
  const credentialsAccount = await db.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider: CREDENTIALS_PROVIDER_ID,
        providerAccountId: normalizedEmail
      }
    },
    select: {
      access_token: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      }
    }
  });

  if (!credentialsAccount?.access_token) {
    return null;
  }

  return {
    passwordHash: credentialsAccount.access_token,
    user: credentialsAccount.user
  };
}

export async function credentialsUserExists(email: string) {
  const normalizedEmail = normalizeAuthEmail(email);

  return db.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      id: true
    }
  });
}

export async function createCredentialsUser({
  email,
  firstName,
  lastName,
  password
}: {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}) {
  const normalizedEmail = normalizeAuthEmail(email);
  const passwordHash = await hashPassword(password);
  const displayName = [firstName.trim(), lastName.trim()].filter(Boolean).join(" ");

  return db.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: normalizedEmail,
        name: displayName
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    await tx.account.create({
      data: {
        userId: user.id,
        type: CREDENTIALS_PROVIDER_ID,
        provider: CREDENTIALS_PROVIDER_ID,
        providerAccountId: normalizedEmail,
        access_token: passwordHash
      }
    });

    return user;
  });
}
