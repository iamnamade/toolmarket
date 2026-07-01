import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user) {
    return {
      errorResponse: NextResponse.json({ error: "ავტორიზაცია საჭიროა." }, { status: 401 }),
      session: null,
    };
  }

  if (session.user.role !== "ADMIN") {
    return {
      errorResponse: NextResponse.json({ error: "ამ მოქმედებისთვის ადმინისტრატორის წვდომაა საჭირო." }, { status: 403 }),
      session,
    };
  }

  return {
    errorResponse: null,
    session,
  };
}
