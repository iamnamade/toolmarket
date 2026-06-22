import { NextResponse } from "next/server";
import { getAuthStatus } from "@/lib/auth-env";

export function GET() {
  return NextResponse.json(getAuthStatus());
}
