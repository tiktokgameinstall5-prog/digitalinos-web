import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the Devin preview tunnel (and any additional origins via env var)
  // to load Next.js dev resources (HMR, CSS chunks, etc).
  allowedDevOrigins: [
    "*.devinapps.com",
    "*.vercel.app",
    ...((process.env.NEXT_ALLOWED_DEV_ORIGINS ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)),
  ],
};

export default nextConfig;
