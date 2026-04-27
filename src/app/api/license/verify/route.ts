/**
 * Called by the desktop app. Validates a license key against a hardware
 * fingerprint and returns a signed short-lived JWT.
 *
 * Request body:
 *   { key: string; hardware_id: string; hostname?: string;
 *     platform?: string; app_version?: string; app_hash?: string }
 *
 * Response (200):
 *   { ok: true; token: string; plan: "STARTER"|"PRO"|"STUDIO";
 *     expires_at: number; ttl_seconds: number }
 *
 * Response (4xx):
 *   { ok: false; error: string; code: "NOT_FOUND"|"REVOKED"|"EXPIRED"|
 *                                      "DEVICE_LIMIT"|"INVALID" }
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  hashHardwareId,
  normaliseLicenseKey,
  signLicenseToken,
} from "@/lib/license";
import { logAction } from "@/lib/logger";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  key: z.string().min(8),
  hardware_id: z.string().min(4).max(512),
  hostname: z.string().max(128).optional(),
  platform: z.string().max(32).optional(),
  app_version: z.string().max(32).optional(),
  app_hash: z.string().max(128).optional(),
});

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rl = rateLimit(`verify:${ip}`, { limit: 60, windowMs: 60_000 });
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
    await logAction(null, "license.verify.miss", { key }, req);
    return NextResponse.json(
      { ok: false, error: "License not found", code: "NOT_FOUND" },
      { status: 404 },
    );
  }
  if (license.status === "REVOKED") {
    return NextResponse.json(
      { ok: false, error: "License revoked", code: "REVOKED" },
      { status: 403 },
    );
  }
  if (license.expiresAt < new Date()) {
    await prisma.license.update({
      where: { id: license.id },
      data: { status: "EXPIRED" },
    });
    return NextResponse.json(
      { ok: false, error: "License expired", code: "EXPIRED" },
      { status: 403 },
    );
  }

  // Find or create device binding.
  let device = license.devices.find(
    (d) => d.hardwareId === hwHash && !d.releasedAt,
  );
  if (!device) {
    const activeDevices = license.devices.filter((d) => !d.releasedAt);
    if (activeDevices.length >= license.maxDevices) {
      await logAction(
        license.userId,
        "license.verify.device_limit",
        { key, max: license.maxDevices },
        req,
      );
      return NextResponse.json(
        {
          ok: false,
          error: `Device limit reached (${license.maxDevices}). Release a device from your account.`,
          code: "DEVICE_LIMIT",
        },
        { status: 403 },
      );
    }
    device = await prisma.device.create({
      data: {
        licenseId: license.id,
        hardwareId: hwHash,
        hostname: parsed.data.hostname,
        platform: parsed.data.platform,
        appVersion: parsed.data.app_version,
      },
    });
    await logAction(
      license.userId,
      "license.device.activate",
      { key, hostname: parsed.data.hostname, platform: parsed.data.platform },
      req,
    );
  } else {
    await prisma.device.update({
      where: { id: device.id },
      data: {
        lastSeenAt: new Date(),
        hostname: parsed.data.hostname ?? device.hostname,
        platform: parsed.data.platform ?? device.platform,
        appVersion: parsed.data.app_version ?? device.appVersion,
      },
    });
  }

  // Issue token.
  const token = signLicenseToken({
    sub: license.key,
    uid: license.userId,
    plan: license.plan,
    exp_at: Math.floor(license.expiresAt.getTime() / 1000),
    hw: hwHash,
  });

  await logAction(license.userId, "license.verify.ok", { key }, req);

  return NextResponse.json({
    ok: true,
    token,
    plan: license.plan,
    expires_at: Math.floor(license.expiresAt.getTime() / 1000),
    ttl_seconds: 60 * 60 * 24,
  });
}
