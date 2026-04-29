import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminFromSession } from "@/lib/require-admin";
import { logAction } from "@/lib/logger";

const patchSchema = z.object({
  status: z.enum(["ACTIVE", "REVOKED"]).optional(),
  notes: z.string().max(500).optional(),
  expiresAt: z.string().datetime().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const adminCheck = await requireAdminFromSession();
  if ("response" in adminCheck) return adminCheck.response;

  const { id } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const data: { status?: "ACTIVE" | "REVOKED"; notes?: string; expiresAt?: Date } = {};
  if (parsed.data.status) data.status = parsed.data.status;
  if (parsed.data.notes !== undefined) data.notes = parsed.data.notes;
  if (parsed.data.expiresAt) data.expiresAt = new Date(parsed.data.expiresAt);

  const updated = await prisma.license.update({ where: { id }, data });
  await logAction(adminCheck.userId, "admin.license.update", { id, ...data }, req);
  return NextResponse.json({ ok: true, license: updated });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const adminCheck = await requireAdminFromSession();
  if ("response" in adminCheck) return adminCheck.response;
  const { id } = await params;
  await prisma.license.delete({ where: { id } });
  await logAction(adminCheck.userId, "admin.license.delete", { id }, req);
  return NextResponse.json({ ok: true });
}
