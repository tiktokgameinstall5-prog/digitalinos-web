/**
 * Admin "test mode" — grants the calling admin a 1-hour license on the
 * requested plan so they can test plan-gated UI without going through the
 * real payment flow. Not exposed to regular users.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminFromSession } from "@/lib/require-admin";
import { logAction } from "@/lib/logger";
import { generateLicenseKey, planMaxDevices } from "@/lib/license";

const TEST_MINUTES = 60;
const TEST_NOTE_PREFIX = "admin-test-mode";

const schema = z.object({
  plan: z.enum(["STARTER", "PRO", "STUDIO"]),
});

export async function POST(req: Request) {
  const adminCheck = await requireAdminFromSession();
  if ("response" in adminCheck) return adminCheck.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Revoke any previous test-mode licenses so admin always has at most one active.
  await prisma.license.updateMany({
    where: {
      userId: adminCheck.userId,
      notes: { startsWith: TEST_NOTE_PREFIX },
      status: "ACTIVE",
    },
    data: { status: "REVOKED" },
  });

  let key = generateLicenseKey();
  for (let i = 0; i < 5; i++) {
    const exists = await prisma.license.findUnique({ where: { key } });
    if (!exists) break;
    key = generateLicenseKey();
  }
  const expiresAt = new Date(Date.now() + TEST_MINUTES * 60 * 1000);

  const license = await prisma.license.create({
    data: {
      key,
      plan: parsed.data.plan,
      userId: adminCheck.userId,
      maxDevices: planMaxDevices(parsed.data.plan),
      expiresAt,
      notes: `${TEST_NOTE_PREFIX}: ${parsed.data.plan} — auto-expires in ${TEST_MINUTES}m`,
    },
  });

  await logAction(
    adminCheck.userId,
    "admin.test-mode.grant",
    { plan: parsed.data.plan, key, minutes: TEST_MINUTES },
    req,
  );

  return NextResponse.json({
    ok: true,
    license: { key: license.key, plan: license.plan, expiresAt: license.expiresAt },
  });
}

export async function DELETE(req: Request) {
  const adminCheck = await requireAdminFromSession();
  if ("response" in adminCheck) return adminCheck.response;

  const result = await prisma.license.updateMany({
    where: {
      userId: adminCheck.userId,
      notes: { startsWith: TEST_NOTE_PREFIX },
      status: "ACTIVE",
    },
    data: { status: "REVOKED" },
  });

  await logAction(
    adminCheck.userId,
    "admin.test-mode.revoke",
    { revoked: result.count },
    req,
  );

  return NextResponse.json({ ok: true, revoked: result.count });
}
