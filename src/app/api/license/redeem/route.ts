/**
 * Redeem a license key: attach an existing unclaimed license to the current user.
 * Admins can pre-issue keys and send them to customers; the customer enters the
 * key on their dashboard to bind it to their account.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { normaliseLicenseKey } from "@/lib/license";
import { logAction } from "@/lib/logger";

const schema = z.object({ key: z.string().min(8) });

export async function POST(req: Request) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid license key" }, { status: 400 });
  }
  const key = normaliseLicenseKey(parsed.data.key);

  const license = await prisma.license.findUnique({ where: { key } });
  if (!license) {
    return NextResponse.json({ error: "License not found" }, { status: 404 });
  }
  if (license.status !== "ACTIVE") {
    return NextResponse.json({ error: "License is not active" }, { status: 400 });
  }
  if (license.expiresAt < new Date()) {
    await prisma.license.update({
      where: { id: license.id },
      data: { status: "EXPIRED" },
    });
    return NextResponse.json({ error: "License has expired" }, { status: 400 });
  }
  if (license.userId && license.userId !== userId) {
    return NextResponse.json(
      { error: "License is already attached to another account" },
      { status: 409 },
    );
  }

  const updated = await prisma.license.update({
    where: { id: license.id },
    data: { userId },
    select: { id: true, key: true, plan: true, expiresAt: true },
  });

  await logAction(userId, "license.redeem", { key }, req);
  return NextResponse.json({ ok: true, license: updated });
}
