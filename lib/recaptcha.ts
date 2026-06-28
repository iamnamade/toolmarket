import { getRecaptchaSecretKey } from "@/lib/auth-env";

type RecaptchaApiResponse = {
  success?: boolean;
  hostname?: string;
  challenge_ts?: string;
  "error-codes"?: string[];
};

export type RecaptchaVerificationResult =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
      code: "missing-secret" | "missing-token" | "request-failed" | "verification-failed";
    };

export async function verifyRecaptchaToken(
  token: string,
  remoteIp?: string | null
): Promise<RecaptchaVerificationResult> {
  const secretKey = getRecaptchaSecretKey();

  if (!secretKey) {
    return {
      success: false,
      code: "missing-secret",
      message: "reCAPTCHA-ის სერვერული კონფიგურაცია ვერ მოიძებნა."
    };
  }

  const normalizedToken = token.trim();

  if (!normalizedToken) {
    return {
      success: false,
      code: "missing-token",
      message: "გთხოვთ დაადასტუროთ, რომ რობოტი არ ხართ."
    };
  }

  const body = new URLSearchParams({
    secret: secretKey,
    response: normalizedToken
  });

  const normalizedRemoteIp = remoteIp?.trim();

  if (normalizedRemoteIp) {
    body.set("remoteip", normalizedRemoteIp);
  }

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body,
      cache: "no-store"
    });

    if (!response.ok) {
      return {
        success: false,
        code: "request-failed",
        message: "reCAPTCHA-ის შემოწმება დროებით ვერ შესრულდა. სცადეთ თავიდან."
      };
    }

    const payload = (await response.json()) as RecaptchaApiResponse;

    if (!payload.success) {
      return {
        success: false,
        code: "verification-failed",
        message: "reCAPTCHA-ის შემოწმება ვერ შესრულდა. გთხოვთ სცადოთ თავიდან."
      };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      code: "request-failed",
      message: "reCAPTCHA-ის შემოწმება დროებით ვერ შესრულდა. სცადეთ თავიდან."
    };
  }
}
