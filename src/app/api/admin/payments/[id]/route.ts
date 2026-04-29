/**
 * Admin endpoints for a payment submission:
 *   POST   { action: "approve" }  → issues a license, links it, returns the key
 *   POST   { action: "reject", reviewerNote? } → marks rejected
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminFromSession } from "@/lib/require-admin";
import { logAction } from "@/lib/logger";
import {
  generateLicenseKey,
  planDurationDays,
  planMaxDevices,
} from "@/lib/license";

const schema = z.object({
  action: z.enum(["approve", "reject"]),
  reviewerNote: z.string().trim().max(1000).optional(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const adminCheck = await requireAdminFromSession();
  if ("response" in adminCheck) return adminCheck.response;

  const { id } = await params;

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

  const submission = await prisma.paymentSubmission.findUnique({
    where: { id },
    include: { user: { select: { id: true, email: true } } },
  });
  if (!submission) {
    return NextResponse.json({ error: "Submission not found" }, { status: 404 });
  }
  if (submission.status !== "PENDING") {
    return NextResponse.json(
      { error: `Submission is already ${submission.status.toLowerCase()}.` },
      { status: 409 },
    );
  }

  if (parsed.data.action === "reject") {
    const updated = await prisma.paymentSubmission.update({
      where: { id },
      data: {
        status: "REJECTED",
        reviewedAt: new Date(),
        reviewedById: adminCheck.userId,
        reviewerNote: parsed.data.reviewerNote,
      },
    });
    await logAction(
      adminCheck.userId,
      "admin.payment.reject",
      { id, userId: submission.userId },
      req,
    );
    return NextResponse.json({ ok: true, submission: updated });
  }

  // Approve: issue license, link to submission.
  let key = generateLicenseKey();
  for (let i = 0; i < 5; i++) {
    const exists = await prisma.license.findUnique({ where: { key } });
    if (!exists) break;
    key = generateLicenseKey();
  }
  const days = planDurationDays(submission.plan);
  const maxDevices = planMaxDevices(submission.plan);
  const expiresAt = new Date(Date.now() + days * 24 * 3600 * 1000);

  const result = await prisma.$transaction(async (tx) => {
    const license = await tx.license.create({
      data: {
        key,
        plan: submission.plan,
        userId: submission.userId,
        maxDevices,
        expiresAt,
        notes: `Approved payment ${submission.id} (${submission.method} ${submission.currency} ${submission.amount}, txn ${submission.txnId})`,
      },
    });
    const updated = await tx.paymentSubmission.update({
      where: { id },
      data: {
        status: "APPROVED",
        reviewedAt: new Date(),
        reviewedById: adminCheck.userId,
        reviewerNote: parsed.data.reviewerNote,
        licenseId: license.id,
      },
    });
    return { license, submission: updated };
  });

  await logAction(
    adminCheck.userId,
    "admin.payment.approve",
    {
      id,
      userId: submission.userId,
      key: result.license.key,
      plan: submission.plan,
    },
    req,
  );

  return NextResponse.json({
    ok: true,
    license: { key: result.license.key, expiresAt: result.license.expiresAt },
    submission: result.submission,
    user: { email: submission.user.email },
  });
}
