import { PrismaAdapter } from "@auth/prisma-adapter";
import type { UserRole } from "@prisma/client";
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { db } from "@/lib/db";

const nextAuth = NextAuth({
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt"
  },
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? token.sub ?? "";
        token.role = (user.role as UserRole | undefined) ?? "USER";
      }

      const userId = token.sub ?? token.id;

      if (typeof userId === "string" && userId.length > 0) {
        const dbUser = await db.user.findUnique({
          where: { id: userId },
          select: { id: true, role: true }
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
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
  }
});

export const { handlers, auth, signIn, signOut } = nextAuth;
export const { GET, POST } = handlers;
