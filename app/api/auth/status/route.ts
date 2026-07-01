import { NextResponse } from "next/server";
import { getDatabaseConnectionDiagnostics, logAuthEnvironmentSnapshot } from "@/lib/auth-diagnostics";
import { getAuthStatus } from "@/lib/auth-env";

export async function GET() {
  logAuthEnvironmentSnapshot("auth.status");
  const authStatus = getAuthStatus();
  const dbDiagnostics = await getDatabaseConnectionDiagnostics("auth.status");

  return NextResponse.json({
    ...authStatus,
    databaseReachable: dbDiagnostics.connected
  });
}
