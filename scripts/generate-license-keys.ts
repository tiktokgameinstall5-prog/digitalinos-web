/**
 * Generate an RSA-2048 keypair for signing license tokens.
 *
 * Usage:
 *   npm run keys:generate
 *
 * Paste the two base64 values into your .env file (LICENSE_PRIVATE_KEY_B64 and
 * LICENSE_PUBLIC_KEY_B64). The public key will also be embedded in the desktop
 * app so it can verify tokens offline.
 */
import crypto from "node:crypto";

const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
});

const privPem = privateKey.export({ type: "pkcs8", format: "pem" }) as string;
const pubPem = publicKey.export({ type: "spki", format: "pem" }) as string;

console.log("LICENSE_PRIVATE_KEY_B64=" + Buffer.from(privPem).toString("base64"));
console.log("LICENSE_PUBLIC_KEY_B64=" + Buffer.from(pubPem).toString("base64"));
console.log();
console.log("# Public key (PEM) — embed in the desktop app:");
console.log(pubPem);
