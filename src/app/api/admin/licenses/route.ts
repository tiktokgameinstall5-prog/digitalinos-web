import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminFromSession } from "@/lib/require-admin";
import {
  generateLicenseKey,
  planDurationDays,
  planMaxDevices,
} from "@/lib/license";
import { logAction } from "@/lib/logger";

const schema = z.object({
  email: z.string().email().optional(),
  plan: z.enum(["STARTER", "PRO", "STUDIO"]),
  days: z.number().int().positive().max(3650).optional(),
  maxDevices: z.number().int().min(1).max(10).optional(),
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

  const days = parsed.data.days ?? planDurationDays(parsed.data.plan);
  const maxDevices = parsed.data.maxDevices ?? planMaxDevices(parsed.data.plan);

  let userId = adminCheck.userId; // default: attached to the issuing admin
  if (parsed.data.email) {
    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email.toLowerCase() },
    });
    if (!user) {
      return NextResponse.json(
        { error: `User not found: ${parsed.data.email}` },
        { status: 404 },
      );
    }
    userId = user.id;
  }

  // Generate unique key (retry on collision, extremely unlikely)
  let key = generateLicenseKey();
  for (let i = 0; i < 5; i++) {
    const exists = await prisma.license.findUnique({ where: { key } });
    if (!exists) break;
    key = generateLicenseKey();
  }

  const license = await prisma.license.create({
    data: {
      key,
      plan: parsed.data.plan,
      userId,
      maxDevices,
      expiresAt: new Date(Date.now() + days * 24 * 3600 * 1000),
    },
  });

  await logAction(
    adminCheck.userId,
    "admin.license.issue",
    { key, plan: parsed.data.plan, days, userId },
    req,
  );

  return NextResponse.json({ ok: true, license });
}
