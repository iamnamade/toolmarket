export type AuthStatus = {
  adminCredentialsConfigured: boolean;
  googleConfigured: boolean;
  missing: string[];
  credentialsConfigured: boolean;
  databaseConfigured: boolean;
  recaptchaConfigured: boolean;
  resendConfigured: boolean;
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

export type AuthEnvironmentPresence = {
  DATABASE_URL: boolean;
  DIRECT_URL: boolean;
  AUTH_SECRET: boolean;
  AUTH_URL: boolean;
  NEXTAUTH_URL: boolean;
  NEXT_PUBLIC_APP_URL: boolean;
  AUTH_ADMIN_EMAIL: boolean;
  AUTH_ADMIN_PASSWORD: boolean;
  GOOGLE_CLIENT_ID: boolean;
  GOOGLE_CLIENT_SECRET: boolean;
  AUTH_GOOGLE_ID: boolean;
  AUTH_GOOGLE_SECRET: boolean;
  NEXT_PUBLIC_SUPABASE_URL: boolean;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: boolean;
  SUPABASE_SERVICE_ROLE_KEY: boolean;
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: boolean;
  RECAPTCHA_SECRET_KEY: boolean;
  RESEND_API_KEY: boolean;
  RESEND_FROM_EMAIL: boolean;
};

export function getAuthEnvironmentPresence(): AuthEnvironmentPresence {
  return {
    DATABASE_URL: Boolean(readTrimmedEnv(process.env.DATABASE_URL)),
    DIRECT_URL: Boolean(readTrimmedEnv(process.env.DIRECT_URL)),
    AUTH_SECRET: Boolean(readTrimmedEnv(process.env.AUTH_SECRET)),
    AUTH_URL: Boolean(readTrimmedEnv(process.env.AUTH_URL)),
    NEXTAUTH_URL: Boolean(readTrimmedEnv(process.env.NEXTAUTH_URL)),
    NEXT_PUBLIC_APP_URL: Boolean(readTrimmedEnv(process.env.NEXT_PUBLIC_APP_URL)),
    AUTH_ADMIN_EMAIL: Boolean(readTrimmedEnv(process.env.AUTH_ADMIN_EMAIL)),
    AUTH_ADMIN_PASSWORD: Boolean(readTrimmedEnv(process.env.AUTH_ADMIN_PASSWORD)),
    GOOGLE_CLIENT_ID: Boolean(readTrimmedEnv(process.env.GOOGLE_CLIENT_ID)),
    GOOGLE_CLIENT_SECRET: Boolean(readTrimmedEnv(process.env.GOOGLE_CLIENT_SECRET)),
    AUTH_GOOGLE_ID: Boolean(readTrimmedEnv(process.env.AUTH_GOOGLE_ID)),
    AUTH_GOOGLE_SECRET: Boolean(readTrimmedEnv(process.env.AUTH_GOOGLE_SECRET)),
    NEXT_PUBLIC_SUPABASE_URL: Boolean(readTrimmedEnv(process.env.NEXT_PUBLIC_SUPABASE_URL)),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(readTrimmedEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)),
    SUPABASE_SERVICE_ROLE_KEY: Boolean(readTrimmedEnv(process.env.SUPABASE_SERVICE_ROLE_KEY)),
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: Boolean(readTrimmedEnv(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY)),
    RECAPTCHA_SECRET_KEY: Boolean(readTrimmedEnv(process.env.RECAPTCHA_SECRET_KEY)),
    RESEND_API_KEY: Boolean(readTrimmedEnv(process.env.RESEND_API_KEY)),
    RESEND_FROM_EMAIL: Boolean(readTrimmedEnv(process.env.RESEND_FROM_EMAIL))
  };
}

export function getCredentialsAuthReadiness() {
  const presence = getAuthEnvironmentPresence();
  const missing: string[] = [];

  if (!presence.AUTH_SECRET) {
    missing.push("AUTH_SECRET");
  }

  if (!presence.DATABASE_URL) {
    missing.push("DATABASE_URL");
  }

  if (!presence.AUTH_URL && !presence.NEXTAUTH_URL) {
    missing.push("AUTH_URL or NEXTAUTH_URL");
  }

  return {
    configured: missing.length === 0,
    missing
  };
}

export function getRegistrationReadiness() {
  const presence = getAuthEnvironmentPresence();
  const missing: string[] = [];

  if (!presence.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
    missing.push("NEXT_PUBLIC_RECAPTCHA_SITE_KEY");
  }

  if (!presence.RECAPTCHA_SECRET_KEY) {
    missing.push("RECAPTCHA_SECRET_KEY");
  }

  return {
    configured: missing.length === 0,
    missing
  };
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
  const presence = getAuthEnvironmentPresence();
  const credentials = getCredentialsAuthReadiness();
  const registration = getRegistrationReadiness();
  const resendConfigured = Boolean(getResendConfig());
  const appUrl = process.env.AUTH_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
  const missing: string[] = [];

  if (!presence.AUTH_SECRET) {
    missing.push("AUTH_SECRET");
  }

  if (!presence.AUTH_URL && !presence.NEXTAUTH_URL) {
    missing.push("AUTH_URL or NEXTAUTH_URL");
  }

  if (!presence.DATABASE_URL) {
    missing.push("DATABASE_URL");
  }

  if (!clientId) {
    missing.push("AUTH_GOOGLE_ID or GOOGLE_CLIENT_ID");
  }

  if (!clientSecret) {
    missing.push("AUTH_GOOGLE_SECRET or GOOGLE_CLIENT_SECRET");
  }

  return {
    adminCredentialsConfigured: presence.AUTH_ADMIN_EMAIL && presence.AUTH_ADMIN_PASSWORD,
    googleConfigured: missing.length === 0,
    missing,
    credentialsConfigured: credentials.configured,
    databaseConfigured: presence.DATABASE_URL,
    recaptchaConfigured: registration.configured,
    resendConfigured,
    callbackUrl: `${appUrl.replace(/\/$/, "")}/api/auth/callback/google`,
    provider: "google",
    usesLegacyGoogleEnv
  };
}
