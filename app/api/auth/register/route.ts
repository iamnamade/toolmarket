import { NextResponse } from "next/server";
import { createCredentialsUser, credentialsUserExists, normalizeAuthEmail } from "@/lib/credentials-auth";
import { verifyRecaptchaToken } from "@/lib/recaptcha";

type RegisterRequestBody = {
  captchaToken?: unknown;
  email?: unknown;
  firstName?: unknown;
  lastName?: unknown;
  password?: unknown;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? null;
  }

  return request.headers.get("x-real-ip");
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as RegisterRequestBody | null;

  const firstName = typeof body?.firstName === "string" ? body.firstName.trim() : "";
  const lastName = typeof body?.lastName === "string" ? body.lastName.trim() : "";
  const email = typeof body?.email === "string" ? normalizeAuthEmail(body.email) : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const captchaToken = typeof body?.captchaToken === "string" ? body.captchaToken : "";

  if (!firstName) {
    return NextResponse.json(
      { error: "სახელი აუცილებელია.", field: "firstName" },
      { status: 400 }
    );
  }

  if (!lastName) {
    return NextResponse.json(
      { error: "გვარი აუცილებელია.", field: "lastName" },
      { status: 400 }
    );
  }

  if (!email) {
    return NextResponse.json(
      { error: "ელ. ფოსტა აუცილებელია.", field: "email" },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "გთხოვთ მიუთითოთ სწორი ელ. ფოსტა.", field: "email" },
      { status: 400 }
    );
  }

  if (!password) {
    return NextResponse.json(
      { error: "პაროლი აუცილებელია.", field: "password" },
      { status: 400 }
    );
  }

  const recaptchaResult = await verifyRecaptchaToken(captchaToken, getClientIp(request));

  if (!recaptchaResult.success) {
    return NextResponse.json(
      { error: recaptchaResult.message, field: "captcha" },
      {
        status:
          recaptchaResult.code === "missing-secret" || recaptchaResult.code === "request-failed"
            ? 500
            : 400
      }
    );
  }

  const existingUser = await credentialsUserExists(email);

  if (existingUser) {
    return NextResponse.json(
      { error: "ამ ელ. ფოსტით ანგარიში უკვე არსებობს.", field: "email" },
      { status: 409 }
    );
  }

  const adminEmail = process.env.AUTH_ADMIN_EMAIL?.trim().toLowerCase();

  if (adminEmail && email === adminEmail) {
    return NextResponse.json(
      { error: "ამ ელ. ფოსტით რეგისტრაცია მიუწვდომელია.", field: "email" },
      { status: 409 }
    );
  }

  try {
    const user = await createCredentialsUser({
      email,
      firstName,
      lastName,
      password
    });

    return NextResponse.json(
      {
        user: {
          email: user.email,
          id: user.id,
          name: user.name
        }
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "რეგისტრაცია ვერ შესრულდა. გთხოვთ სცადოთ თავიდან." },
      { status: 500 }
    );
  }
}
