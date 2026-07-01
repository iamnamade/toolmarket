import { db } from "@/lib/db";
import {
  getAuthEnvironmentPresence,
  getAuthStatus,
  getCredentialsAuthReadiness,
  getRegistrationReadiness
} from "@/lib/auth-env";

const globalForAuthDiagnostics = globalThis as typeof globalThis & {
  __toolmarketAuthEnvLogs?: Set<string>;
};

function getLoggedContexts() {
  if (!globalForAuthDiagnostics.__toolmarketAuthEnvLogs) {
    globalForAuthDiagnostics.__toolmarketAuthEnvLogs = new Set<string>();
  }

  return globalForAuthDiagnostics.__toolmarketAuthEnvLogs;
}

export function getSafeErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown error";
}

export function logAuthEvent(scope: string, details: Record<string, unknown>) {
  console.info(`[auth:diag] ${scope} ${JSON.stringify(details)}`);
}

export function logAuthError(scope: string, error: unknown, details: Record<string, unknown> = {}) {
  console.error(
    `[auth:diag] ${scope} ${JSON.stringify({
      ...details,
      error: getSafeErrorMessage(error)
    })}`
  );
}

export function logAuthEnvironmentSnapshot(context: string) {
  const loggedContexts = getLoggedContexts();

  if (loggedContexts.has(context)) {
    return;
  }

  loggedContexts.add(context);

  const authStatus = getAuthStatus();
  const presence = getAuthEnvironmentPresence();
  const credentials = getCredentialsAuthReadiness();
  const registration = getRegistrationReadiness();

  console.info(
    `[auth:env] ${context} ${JSON.stringify({
      env: presence,
      authCoreMissing: credentials.missing,
      registrationMissing: registration.missing,
      googleConfigured: authStatus.googleConfigured,
      usesLegacyGoogleEnv: authStatus.usesLegacyGoogleEnv,
      recaptchaConfigured: authStatus.recaptchaConfigured,
      resendConfigured: authStatus.resendConfigured,
      adminCredentialsConfigured: authStatus.adminCredentialsConfigured
    })}`
  );
}

export async function getDatabaseConnectionDiagnostics(context: string) {
  try {
    await db.$queryRaw`SELECT 1`;
    logAuthEvent(`${context}.db`, { connected: true });

    return {
      connected: true as const
    };
  } catch (error) {
    logAuthError(`${context}.db`, error, { connected: false });

    return {
      connected: false as const,
      error: getSafeErrorMessage(error)
    };
  }
}
