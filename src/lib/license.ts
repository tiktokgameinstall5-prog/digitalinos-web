/**
 * License key signing + verification.
 *
 * We issue short-lived (24h) signed JWTs to the desktop app on every verify
 * call. The app caches the JWT and keeps working offline for up to
 * OFFLINE_GRACE_DAYS days before requiring a new check-in.
 *
 * Keys are RSA-2048 (RS256). Private key stays on the server; public key is
 * embedded into the desktop binary.
 */
import crypto from "node:crypto";
import jwt, { type Algorithm } from "jsonwebtoken";
import { env } from "./env";

const ALG: Algorithm = "RS256";
const JWT_TTL_SECONDS = 60 * 60 * 24; // 24h

export interface LicenseTokenPayload {
  sub: string; // license key
  uid: string; // user id
  plan: "STARTER" | "PRO" | "STUDIO";
  exp_at: number; // license expiry (unix seconds) — separate from jwt exp
  hw: string; // hardware fingerprint hash bound to this token
  iss: "digitalinos";
  iat?: number;
  exp?: number;
}

function decodeB64(b64: string): string {
  return Buffer.from(b64, "base64").toString("utf8");
}

export function getPrivateKey(): string | null {
  if (!env.LICENSE_PRIVATE_KEY_B64) return null;
  return decodeB64(env.LICENSE_PRIVATE_KEY_B64);
}

export function getPublicKey(): string | null {
  if (!env.LICENSE_PUBLIC_KEY_B64) return null;
  return decodeB64(env.LICENSE_PUBLIC_KEY_B64);
}

export function signLicenseToken(
  payload: Omit<LicenseTokenPayload, "iss" | "iat" | "exp">,
): string {
  const key = getPrivateKey();
  if (!key) {
    throw new Error(
      "LICENSE_PRIVATE_KEY_B64 is not configured. Generate an RSA keypair and set it in env.",
    );
  }
  return jwt.sign({ ...payload, iss: "digitalinos" }, key, {
    algorithm: ALG,
    expiresIn: JWT_TTL_SECONDS,
  });
}

export function verifyLicenseToken(token: string): LicenseTokenPayload | null {
  const key = getPublicKey();
  if (!key) return null;
  try {
    return jwt.verify(token, key, {
      algorithms: [ALG],
      issuer: "digitalinos",
    }) as LicenseTokenPayload;
  } catch {
    return null;
  }
}

/**
 * Generate a human-friendly license key with a short checksum.
 * Format: DGIT-XXXX-XXXX-XXXX-XXXX (uppercase hex).
 */
export function generateLicenseKey(): string {
  const bytes = crypto.randomBytes(8).toString("hex").toUpperCase();
  const groups = bytes.match(/.{1,4}/g) ?? [];
  return `DGIT-${groups.join("-")}`;
}

/**
 * Normalise a license key input from the user.
 */
export function normaliseLicenseKey(input: string): string {
  return input.trim().toUpperCase().replace(/\s+/g, "").replace(/--+/g, "-");
}

export function hashHardwareId(raw: string): string {
  return crypto.createHash("sha256").update(raw.trim()).digest("hex");
}

export function planDurationDays(plan: "STARTER" | "PRO" | "STUDIO"): number {
  switch (plan) {
    case "STARTER":
      return 30;
    case "PRO":
      return 90;
    case "STUDIO":
      return 365;
  }
}

export function planMaxDevices(plan: "STARTER" | "PRO" | "STUDIO"): number {
  return plan === "STUDIO" ? 2 : 1;
}
