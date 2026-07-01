import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const { errorResponse } = await requireAdmin();

  if (errorResponse) {
    return errorResponse;
  }

  try {
    const users = await db.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        createdAt: true,
        email: true,
        emailVerified: true,
        id: true,
        name: true,
        role: true,
        accounts: {
          take: 1,
          select: {
            provider: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        users: users.map((user) => ({
          createdAt: user.createdAt.toISOString(),
          email: user.email ?? "",
          id: user.id,
          name: user.name?.trim() || "მომხმარებელი",
          role: user.role,
          status: user.emailVerified || user.accounts.length ? "აქტიური" : "მოლოდინში",
        })),
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      { error: "მომხმარებლების წამოღება ვერ მოხერხდა. გადაამოწმეთ ბაზასთან კავშირი." },
      { status: 500 }
    );
  }
}
