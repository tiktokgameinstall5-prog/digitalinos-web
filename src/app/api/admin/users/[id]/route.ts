import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminFromSession } from "@/lib/require-admin";
import { logAction } from "@/lib/logger";

const patchSchema = z.object({
  role: z.enum(["USER", "ADMIN"]).optional(),
  name: z.string().max(120).optional(),
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

  const updated = await prisma.user.update({
    where: { id },
    data: parsed.data,
    select: { id: true, email: true, role: true, name: true },
  });

  await logAction(
    adminCheck.userId,
    "admin.user.update",
    { target: id, ...parsed.data },
    req,
  );

  return NextResponse.json({ ok: true, user: updated });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const adminCheck = await requireAdminFromSession();
  if ("response" in adminCheck) return adminCheck.response;

  const { id } = await params;
  if (id === adminCheck.userId) {
    return NextResponse.json(
      { error: "You cannot delete your own account here." },
      { status: 400 },
    );
  }
  await prisma.user.delete({ where: { id } });
  await logAction(adminCheck.userId, "admin.user.delete", { target: id }, req);
  return NextResponse.json({ ok: true });
}
