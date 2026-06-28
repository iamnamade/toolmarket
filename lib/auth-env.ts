export type AuthStatus = {
  googleConfigured: boolean;
  missing: string[];
  callbackUrl: string;
  provider: "google";
  usesLegacyGoogleEnv: boolean;
};

export type ResendConfig = {
  apiKey: string;
  fromEmail: string;
};

function readTrimmedEnv(value: string | undefined) {
  const normalized = value?.trim();

  return normalized ? normalized : null;
}

export function getGoogleAuthCredentials() {
  const authGoogleId = readTrimmedEnv(process.env.AUTH_GOOGLE_ID);
  const authGoogleSecret = readTrimmedEnv(process.env.AUTH_GOOGLE_SECRET);
  const legacyGoogleId = readTrimmedEnv(process.env.GOOGLE_CLIENT_ID);
  const legacyGoogleSecret = readTrimmedEnv(process.env.GOOGLE_CLIENT_SECRET);

  return {
    clientId: authGoogleId ?? legacyGoogleId,
    clientSecret: authGoogleSecret ?? legacyGoogleSecret,
    usesLegacyGoogleEnv: Boolean(!authGoogleId && legacyGoogleId)
  };
}

export function getRecaptchaSiteKey() {
  return readTrimmedEnv(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY);
}

export function getRecaptchaSecretKey() {
  return readTrimmedEnv(process.env.RECAPTCHA_SECRET_KEY);
}

export function getResendConfig(): ResendConfig | null {
  const apiKey = readTrimmedEnv(process.env.RESEND_API_KEY);
  const fromEmail = readTrimmedEnv(process.env.RESEND_FROM_EMAIL);

  if (!apiKey || !fromEmail) {
    return null;
  }

  return {
    apiKey,
    fromEmail
  };
}

export function getAuthStatus(): AuthStatus {
  const { clientId, clientSecret, usesLegacyGoogleEnv } = getGoogleAuthCredentials();
  const appUrl = process.env.AUTH_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
  const missing: string[] = [];

  if (!process.env.AUTH_SECRET) {
    missing.push("AUTH_SECRET");
  }

  if (!process.env.AUTH_URL && !process.env.NEXTAUTH_URL) {
    missing.push("AUTH_URL or NEXTAUTH_URL");
  }

  if (!process.env.DATABASE_URL) {
    missing.push("DATABASE_URL");
  }

  if (!clientId) {
    missing.push("AUTH_GOOGLE_ID or GOOGLE_CLIENT_ID");
  }

  if (!clientSecret) {
    missing.push("AUTH_GOOGLE_SECRET or GOOGLE_CLIENT_SECRET");
  }

  return {
    googleConfigured: missing.length === 0,
    missing,
    callbackUrl: `${appUrl.replace(/\/$/, "")}/api/auth/callback/google`,
    provider: "google",
    usesLegacyGoogleEnv
  };
}
