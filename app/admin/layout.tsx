import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  // TODO(security): Consider MFA or step-up authentication for sensitive admin actions.
  if (!session?.user) {
    redirect("/auth?callbackUrl=%2Fadmin");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  return children;
}

