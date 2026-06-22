export type AuthStatus = {
  googleConfigured: boolean;
  missing: string[];
  callbackUrl: string;
  provider: "google";
  usesLegacyGoogleEnv: boolean;
};

export function getGoogleAuthCredentials() {
  const authGoogleId = process.env.AUTH_GOOGLE_ID;
  const authGoogleSecret = process.env.AUTH_GOOGLE_SECRET;
  const legacyGoogleId = process.env.GOOGLE_CLIENT_ID;
  const legacyGoogleSecret = process.env.GOOGLE_CLIENT_SECRET;

  return {
    clientId: authGoogleId ?? legacyGoogleId,
    clientSecret: authGoogleSecret ?? legacyGoogleSecret,
    usesLegacyGoogleEnv: Boolean(!authGoogleId && legacyGoogleId)
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
