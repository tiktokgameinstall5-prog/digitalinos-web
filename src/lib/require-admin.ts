import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function requireAdminFromSession() {
  const session = await auth();
  const role = (session?.user as { role?: "USER" | "ADMIN" } | undefined)?.role;
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId || role !== "ADMIN") {
    return {
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    } as const;
  }
  return { userId, role } as const;
}
