/**
 * Desktop-callable endpoint to release THIS device from a license.
 *
 * Unauthenticated by design — the desktop app has no web session — but
 * scoped narrowly: the caller must supply both the license key AND the
 * hardware_id of the exact device being released. We only delete the
 * matching device row. An attacker would need the key anyway, and at
 * worst could grief by releasing their own device (the rightful user
 * just re-activates).
 *
 * Request body:
 *   { key: string; hardware_id: string }
 *
 * Response (200):
 *   { ok: true; released: boolean }   // released=false if no such device
 *
 * Response (4xx):
 *   { ok: false; error: string; code: "NOT_FOUND" | "INVALID" | "RATE" }
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashHardwareId, normaliseLicenseKey } from "@/lib/license";
import { logAction } from "@/lib/logger";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  key: z.string().min(8),
  hardware_id: z.string().min(4).max(512),
});

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rl = rateLimit(`release-device:${ip}`, { limit: 30, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Rate limited", code: "RATE" },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON", code: "INVALID" },
      { status: 400 },
    );
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid payload", code: "INVALID" },
      { status: 400 },
    );
  }

  const key = normaliseLicenseKey(parsed.data.key);
  const hwHash = hashHardwareId(parsed.data.hardware_id);

  const license = await prisma.license.findUnique({
    where: { key },
    include: { devices: true },
  });
  if (!license) {
    return NextResponse.json(
      { ok: false, error: "License not found", code: "NOT_FOUND" },
      { status: 404 },
    );
  }

  const device = license.devices.find((d) => d.hardwareId === hwHash);
  if (!device) {
    return NextResponse.json({ ok: true, released: false });
  }

  await prisma.device.delete({ where: { id: device.id } });
  await logAction(
    license.userId,
    "license.device.release.desktop",
    { key, deviceId: device.id, hostname: device.hostname },
    req,
  );

  return NextResponse.json({ ok: true, released: true });
}
