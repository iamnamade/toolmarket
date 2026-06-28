import { PrismaAdapter } from "@auth/prisma-adapter";
import type { UserRole } from "@prisma/client";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/auth.config";
import { findCredentialsUserByEmail, normalizeAuthEmail, verifyPassword } from "@/lib/credentials-auth";
import { db } from "@/lib/db";

const adminEmail = process.env.AUTH_ADMIN_EMAIL?.trim().toLowerCase();
const adminPassword = process.env.AUTH_ADMIN_PASSWORD;

if (process.env.NODE_ENV === "development" && (!adminEmail || !adminPassword)) {
  console.warn(
    "[auth] Test admin credentials are disabled. Set AUTH_ADMIN_EMAIL and AUTH_ADMIN_PASSWORD."
  );
}

const nextAuth = NextAuth({
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt"
  },
  ...authConfig,
  providers: [
    ...(authConfig.providers ?? []),
    Credentials({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const email =
          typeof credentials.email === "string"
            ? normalizeAuthEmail(credentials.email)
            : "";
        const password =
          typeof credentials.password === "string" ? credentials.password : "";

        if (adminEmail && adminPassword && email === adminEmail && password === adminPassword) {
          return {
            id: "toolmarket-env-admin",
            name: "ToolMarket Admin",
            email: adminEmail,
            role: "ADMIN"
          };
        }

        if (!email || !password) {
          return null;
        }

        const credentialsUser = await findCredentialsUserByEmail(email);

        if (!credentialsUser) {
          return null;
        }

        const passwordMatches = await verifyPassword(password, credentialsUser.passwordHash);

        if (!passwordMatches) {
          return null;
        }

        return {
          id: credentialsUser.user.id,
          name: credentialsUser.user.name ?? undefined,
          email: credentialsUser.user.email ?? email,
          role: credentialsUser.user.role
        };
      }
    })
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? token.sub ?? "";
        token.role = (user.role as UserRole | undefined) ?? "USER";
      }

      const userId = token.sub ?? token.id;

      if (typeof userId === "string" && userId.length > 0) {
        const dbUser = await db.user.findUnique({
          where: { id: userId },
          select: { id: true, role: true }
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : token.sub ?? "";
        session.user.role = (token.role as UserRole | undefined) ?? "USER";
      }

      return session;
    }
  }
});

export const { handlers, auth, signIn, signOut } = nextAuth;
export const { GET, POST } = handlers;
