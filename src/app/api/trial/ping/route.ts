/**
 * Anonymous per-device trial counter.
 *
 * Desktop app calls this each time a video processing job completes in trial
 * mode. Server increments a counter keyed to hardware fingerprint hash. This
 * prevents users from resetting their local trial counter by uninstalling the
 * app or deleting the trial.json file.
 *
 * Request body:
 *   { hardware_id: string; platform?: string; app_version?: string }
 *
 * Response:
 *   { ok: true; videos_used: number; videos_limit: number; exhausted: boolean }
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashHardwareId } from "@/lib/license";
import { env } from "@/lib/env";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  hardware_id: z.string().min(4).max(512),
  platform: z.string().max(32).optional(),
  app_version: z.string().max(32).optional(),
});

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rl = rateLimit(`trial:${ip}`, { limit: 30, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Rate limited" },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  const fp = hashHardwareId(parsed.data.hardware_id);
  const limit = env.FREE_TRIAL_VIDEO_LIMIT_N;

  const updated = await prisma.trialPing.upsert({
    where: { deviceFp: fp },
    create: {
      deviceFp: fp,
      videoCount: 1,
      platform: parsed.data.platform,
      appVersion: parsed.data.app_version,
    },
    update: {
      videoCount: { increment: 1 },
      lastSeenAt: new Date(),
      platform: parsed.data.platform,
      appVersion: parsed.data.app_version,
    },
    select: { videoCount: true },
  });

  return NextResponse.json({
    ok: true,
    videos_used: updated.videoCount,
    videos_limit: limit,
    exhausted: updated.videoCount >= limit,
  });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const hwRaw = url.searchParams.get("hardware_id");
  if (!hwRaw) {
    return NextResponse.json({ ok: false, error: "Missing hardware_id" }, { status: 400 });
  }
  const fp = hashHardwareId(hwRaw);
  const limit = env.FREE_TRIAL_VIDEO_LIMIT_N;
  const row = await prisma.trialPing.findUnique({ where: { deviceFp: fp } });
  const count = row?.videoCount ?? 0;
  return NextResponse.json({
    ok: true,
    videos_used: count,
    videos_limit: limit,
    exhausted: count >= limit,
  });
}
