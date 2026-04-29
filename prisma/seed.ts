/**
 * Seed script — creates an admin user and sample licenses for local dev.
 *
 * Run:  npm run db:seed
 *
 * Defaults:
 *   admin email    : admin@digitalinos.app  (override via ADMIN_EMAIL)
 *   admin password : AdminPass123!          (override via ADMIN_PASSWORD)
 */
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import {
  generateLicenseKey,
  planDurationDays,
  planMaxDevices,
} from "../src/lib/license";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL ?? "admin@digitalinos.app").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "AdminPass123!";

  const passwordHash = await bcrypt.hash(adminPassword, 12);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN", passwordHash },
    create: {
      email: adminEmail,
      name: "Digitalinos Admin",
      role: "ADMIN",
      passwordHash,
    },
  });
  console.log(`✓ Admin ready: ${admin.email}  (password: ${adminPassword})`);

  for (const plan of ["STARTER", "PRO", "STUDIO"] as const) {
    const key = generateLicenseKey();
    const days = planDurationDays(plan);
    await prisma.license.create({
      data: {
        key,
        userId: admin.id,
        plan,
        maxDevices: planMaxDevices(plan),
        expiresAt: new Date(Date.now() + days * 24 * 3600 * 1000),
        notes: "Seed key",
      },
    });
    console.log(`✓ ${plan} key: ${key}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
