import { NextResponse } from "next/server";
import { getRegistrationReadiness } from "@/lib/auth-env";
import {
  getDatabaseConnectionDiagnostics,
  logAuthEnvironmentSnapshot,
  logAuthError,
  logAuthEvent
} from "@/lib/auth-diagnostics";
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
  logAuthEnvironmentSnapshot("auth.register");
  const body = (await request.json().catch(() => null)) as RegisterRequestBody | null;

  const firstName = typeof body?.firstName === "string" ? body.firstName.trim() : "";
  const lastName = typeof body?.lastName === "string" ? body.lastName.trim() : "";
  const email = typeof body?.email === "string" ? normalizeAuthEmail(body.email) : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const captchaToken = typeof body?.captchaToken === "string" ? body.captchaToken : "";
  const registrationReadiness = getRegistrationReadiness();

  logAuthEvent("auth.register.start", {
    hasFirstName: firstName.length > 0,
    hasLastName: lastName.length > 0,
    hasEmail: email.length > 0,
    hasPassword: password.length > 0,
    hasCaptchaToken: captchaToken.trim().length > 0,
    registrationConfigured: registrationReadiness.configured
  });

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

  if (!registrationReadiness.configured) {
    logAuthEvent("auth.register.blocked", {
      reason: "missing-recaptcha-config",
      missing: registrationReadiness.missing
    });

    return NextResponse.json(
      {
        error:
          "რეგისტრაცია დროებით მიუწვდომელია, რადგან reCAPTCHA-ის production კონფიგურაცია არ არის სრულად ჩართული.",
        field: "captcha"
      },
      { status: 500 }
    );
  }

  const recaptchaResult = await verifyRecaptchaToken(captchaToken, getClientIp(request));

  logAuthEvent("auth.register.recaptcha", {
    success: recaptchaResult.success,
    code: recaptchaResult.success ? "ok" : recaptchaResult.code
  });

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

  const dbDiagnostics = await getDatabaseConnectionDiagnostics("auth.register");

  if (!dbDiagnostics.connected) {
    return NextResponse.json(
      { error: "რეგისტრაციის სერვერი მონაცემთა ბაზას ვერ დაუკავშირდა. გთხოვთ სცადოთ თავიდან." },
      { status: 500 }
    );
  }

  try {
    const existingUser = await credentialsUserExists(email);

    logAuthEvent("auth.register.lookup", {
      existingUser: Boolean(existingUser)
    });

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

    const user = await createCredentialsUser({
      email,
      firstName,
      lastName,
      password
    });

    logAuthEvent("auth.register.insert", {
      inserted: true,
      hasUserId: Boolean(user.id)
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
  } catch (error) {
    logAuthError("auth.register.exception", error, {
      hasEmail: email.length > 0
    });

    return NextResponse.json(
      { error: "რეგისტრაცია ვერ შესრულდა. გთხოვთ სცადოთ თავიდან." },
      { status: 500 }
    );
  }
}
