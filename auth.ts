import { PrismaAdapter } from "@auth/prisma-adapter";
import type { UserRole } from "@prisma/client";
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/auth.config";
import {
  getCredentialsAuthReadiness,
  getRegistrationReadiness
} from "@/lib/auth-env";
import {
  logAuthEnvironmentSnapshot,
  logAuthError,
  logAuthEvent
} from "@/lib/auth-diagnostics";
import { findCredentialsUserByEmail, normalizeAuthEmail, verifyPassword } from "@/lib/credentials-auth";
import { db } from "@/lib/db";

const adminEmail = process.env.AUTH_ADMIN_EMAIL?.trim().toLowerCase();
const adminPassword = process.env.AUTH_ADMIN_PASSWORD;

if (process.env.NODE_ENV === "development" && (!adminEmail || !adminPassword)) {
  console.warn(
    "[auth] Test admin credentials are disabled. Set AUTH_ADMIN_EMAIL and AUTH_ADMIN_PASSWORD."
  );
}

class CredentialsConfigurationError extends CredentialsSignin {
  code = "credentials_unavailable";
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
        logAuthEnvironmentSnapshot("credentials.authorize");
        const email =
          typeof credentials.email === "string"
            ? normalizeAuthEmail(credentials.email)
            : "";
        const password =
          typeof credentials.password === "string" ? credentials.password : "";
        const authReadiness = getCredentialsAuthReadiness();
        const registrationReadiness = getRegistrationReadiness();

        logAuthEvent("credentials.authorize.start", {
          hasEmail: email.length > 0,
          hasPassword: password.length > 0,
          adminCredentialsConfigured: Boolean(adminEmail && adminPassword),
          credentialsConfigured: authReadiness.configured,
          registrationConfigured: registrationReadiness.configured
        });

        if (!authReadiness.configured) {
          logAuthEvent("credentials.authorize.blocked", {
            reason: "missing-auth-config",
            missing: authReadiness.missing
          });
          throw new CredentialsConfigurationError();
        }

        if (adminEmail && adminPassword && email === adminEmail && password === adminPassword) {
          logAuthEvent("credentials.authorize.admin-success", {
            adminEmailConfigured: true
          });
          return {
            id: "toolmarket-env-admin",
            name: "ToolMarket Admin",
            email: adminEmail,
            role: "ADMIN"
          };
        }

        if (!email || !password) {
          logAuthEvent("credentials.authorize.invalid-input", {
            hasEmail: email.length > 0,
            hasPassword: password.length > 0
          });
          return null;
        }

        try {
          const credentialsUser = await findCredentialsUserByEmail(email);

          logAuthEvent("credentials.authorize.user-lookup", {
            foundCredentialsUser: Boolean(credentialsUser)
          });

          if (!credentialsUser) {
            return null;
          }

          const passwordMatches = await verifyPassword(password, credentialsUser.passwordHash);

          logAuthEvent("credentials.authorize.password-compare", {
            passwordMatches
          });

          if (!passwordMatches) {
            return null;
          }

          logAuthEvent("credentials.authorize.success", {
            role: credentialsUser.user.role
          });

          return {
            id: credentialsUser.user.id,
            name: credentialsUser.user.name ?? undefined,
            email: credentialsUser.user.email ?? email,
            role: credentialsUser.user.role
          };
        } catch (error) {
          logAuthError("credentials.authorize.exception", error, {
            hasEmail: email.length > 0
          });
          throw new CredentialsConfigurationError();
        }
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
        try {
          const dbUser = await db.user.findUnique({
            where: { id: userId },
            select: { id: true, role: true }
          });

          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role;
          }
        } catch (error) {
          logAuthError("credentials.jwt.user-sync-failed", error, {
            userId
          });
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
  },
  logger: {
    error(error: Error) {
      console.error(
        `[auth:logger] error ${JSON.stringify({
          message: error.message,
          name: error.name
        })}`
      );
    },
    warn(code) {
      console.warn(`[auth:logger] ${code}`);
    },
    debug(message: string, metadata?: unknown) {
      console.info(
        `[auth:logger] ${message} ${JSON.stringify({
          hasMetadata: metadata !== undefined && metadata !== null
        })}`
      );
    }
  }
});

export const { handlers, auth, signIn, signOut } = nextAuth;
export const { GET, POST } = handlers;
