/**
 * User submits a manual payment (EasyPaisa / NayaPay / JazzCash / Binance Pay).
 * The submission goes into a pending queue for an admin to approve via
 * `/admin/payments`. Approval issues the license.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logAction } from "@/lib/logger";
import { planPrice, type Currency, type PlanId } from "@/lib/plans";
import { getMethod } from "@/lib/payment-methods";

const schema = z.object({
  plan: z.enum(["STARTER", "PRO", "STUDIO"]),
  currency: z.enum(["PKR", "USDT"]),
  method: z.enum(["EASYPAISA", "NAYAPAY", "JAZZCASH", "BINANCE"]),
  txnId: z.string().trim().min(4).max(120),
  senderName: z.string().trim().max(120).optional(),
  senderContact: z.string().trim().max(120).optional(),
  notes: z.string().trim().max(1000).optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
  const data = parsed.data;

  // Method must match the chosen currency (PKR methods can't be used for USDT etc.)
  const methodDef = getMethod(data.method);
  if (!methodDef || methodDef.currency !== data.currency) {
    return NextResponse.json(
      { error: `Method ${data.method} cannot be used for ${data.currency}.` },
      { status: 400 },
    );
  }

  const amount = planPrice(data.plan as PlanId, data.currency as Currency);

  const submission = await prisma.paymentSubmission.create({
    data: {
      userId,
      plan: data.plan,
      currency: data.currency,
      method: data.method,
      amount,
      txnId: data.txnId,
      senderName: data.senderName,
      senderContact: data.senderContact,
      notes: data.notes,
    },
    select: { id: true, status: true, plan: true, amount: true, currency: true },
  });

  await logAction(
    userId,
    "payment.submit",
    {
      id: submission.id,
      plan: data.plan,
      currency: data.currency,
      method: data.method,
      amount,
    },
    req,
  );

  return NextResponse.json({ ok: true, submission });
}
