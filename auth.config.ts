import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { getGoogleAuthCredentials } from "@/lib/auth-env";

const userRoles = ["USER", "ADMIN"] as const;
type UserRole = (typeof userRoles)[number];

function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && userRoles.includes(value as UserRole);
}

function getTokenUserId(tokenId: unknown, tokenSub: string | undefined) {
  return typeof tokenId === "string" ? tokenId : tokenSub ?? "";
}

const { clientId: googleClientId, clientSecret: googleClientSecret } =
  getGoogleAuthCredentials();
const adminEmail = process.env.AUTH_ADMIN_EMAIL?.trim().toLowerCase();
const adminPassword = process.env.AUTH_ADMIN_PASSWORD;

if (process.env.NODE_ENV === "development" && (!googleClientId || !googleClientSecret)) {
  console.warn(
    "[auth] Google OAuth is disabled. Set AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET " +
      "or GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET."
  );
}

if (process.env.NODE_ENV === "development" && (!adminEmail || !adminPassword)) {
  console.warn(
    "[auth] Test admin credentials are disabled. Set AUTH_ADMIN_EMAIL and AUTH_ADMIN_PASSWORD."
  );
}

export const authConfig = {
  pages: {
    signIn: "/auth"
  },
  providers: [
    ...(googleClientId && googleClientSecret
      ? [
          Google({
            clientId: googleClientId,
            clientSecret: googleClientSecret
          })
        ]
      : []),
    Credentials({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const email =
          typeof credentials.email === "string"
            ? credentials.email.trim().toLowerCase()
            : "";
        const password =
          typeof credentials.password === "string" ? credentials.password : "";

        if (!adminEmail || !adminPassword) {
          return null;
        }

        if (email !== adminEmail || password !== adminPassword) {
          return null;
        }

        return {
          id: "toolmarket-env-admin",
          name: "ToolMarket Admin",
          email: adminEmail,
          role: "ADMIN"
        };
      }
    })
  ],
  trustHost: true,
  callbacks: {
    session({ session, token }) {
      if (session.user) {
        session.user.id = getTokenUserId(token.id, token.sub);
        session.user.role = isUserRole(token.role) ? token.role : "USER";
      }

      return session;
    }
  }
} satisfies NextAuthConfig;
