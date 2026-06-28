import type { NextAuthConfig } from "next-auth";
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

if (process.env.NODE_ENV === "development" && (!googleClientId || !googleClientSecret)) {
  console.warn(
    "[auth] Google OAuth is disabled. Set AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET " +
      "or GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET."
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
      : [])
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
