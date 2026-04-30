/**
 * Typed, validated environment variables.
 * Import `env` from here instead of touching `process.env` directly.
 */
import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().min(1).optional(),

  AUTH_SECRET: z.string().min(1).optional(),
  AUTH_URL: z.string().url().optional(),
  AUTH_TRUST_HOST: z.string().optional(),

  AUTH_GOOGLE_ID: z.string().optional(),
  AUTH_GOOGLE_SECRET: z.string().optional(),

  LICENSE_PRIVATE_KEY_B64: z.string().optional(),
  LICENSE_PUBLIC_KEY_B64: z.string().optional(),

  ADMIN_EMAIL: z.string().email().optional(),
  FREE_TRIAL_VIDEO_LIMIT: z.string().default("10"),
  OFFLINE_GRACE_DAYS: z.string().default("30"),

  NEXT_PUBLIC_APP_NAME: z.string().default("Digitalinos"),
  NEXT_PUBLIC_APP_URL: z.string().default("http://localhost:3000"),
  NEXT_PUBLIC_DESKTOP_DOWNLOAD_URL: z.string().default(
    "/downloads/Digitalinos-v0.2.1.zip",
  ),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.warn(
    "[env] Environment validation warnings:",
    parsed.error.flatten().fieldErrors,
  );
}

export const env = {
  ...(parsed.success ? parsed.data : schema.parse({})),
  GOOGLE_ENABLED: Boolean(
    process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET,
  ),
  FREE_TRIAL_VIDEO_LIMIT_N: Number(process.env.FREE_TRIAL_VIDEO_LIMIT ?? 10),
  OFFLINE_GRACE_DAYS_N: Number(process.env.OFFLINE_GRACE_DAYS ?? 30),
};
