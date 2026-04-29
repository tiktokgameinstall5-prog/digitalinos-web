"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  formatPrice,
  getPlan,
  planPrice,
  type Currency,
  type PlanId,
} from "@/lib/plans";
import {
  getMethodsForCurrency,
  type PaymentMethodId,
} from "@/lib/payment-methods";

interface CheckoutFlowProps {
  plan: PlanId;
  initialCurrency: Currency | null;
}

export function CheckoutFlow({ plan, initialCurrency }: CheckoutFlowProps) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const planDetails = getPlan(plan);
  const [currency, setCurrency] = useState<Currency | null>(initialCurrency);
  const [method, setMethod] = useState<PaymentMethodId | null>(null);

  const methods = useMemo(
    () => (currency ? getMethodsForCurrency(currency) : []),
    [currency],
  );

  const amount = currency ? planPrice(plan, currency) : null;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!currency || !method || amount == null) return;
    const fd = new FormData(e.currentTarget);
    const txnId = String(fd.get("txnId") ?? "").trim();
    const senderName = String(fd.get("senderName") ?? "").trim() || undefined;
    const senderContact =
      String(fd.get("senderContact") ?? "").trim() || undefined;
    const notes = String(fd.get("notes") ?? "").trim() || undefined;

    if (txnId.length < 4) {
      toast.error("Enter the transaction ID from your payment receipt.");
      return;
    }

    start(async () => {
      const res = await fetch("/api/payment/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          plan,
          currency,
          method,
          txnId,
          senderName,
          senderContact,
          notes,
        }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(j?.error ?? "Could not submit payment.");
        return;
      }
      toast.success("Payment submitted — admin will review shortly.");
      router.push("/dashboard?from=checkout");
    });
  }

  return (
    <div className="space-y-6">
      {/* Plan summary */}
      <Card>
        <CardContent className="flex items-start justify-between gap-4 p-5 sm:p-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Plan
            </p>
            <h2 className="mt-1 text-xl font-semibold">{planDetails.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {planDetails.durationLabel} · {planDetails.maxDevices} device
              {planDetails.maxDevices > 1 ? "s" : ""}
            </p>
          </div>
          {amount != null && currency ? (
            <div className="text-right">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Amount
              </p>
              <p className="mt-1 text-2xl font-semibold tracking-tight">
                {formatPrice(amount, currency)}
              </p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Step 1: currency picker */}
      <Card>
        <CardHeader>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Step 1
          </p>
          <h3 className="text-base font-semibold">
            Choose how you want to pay
          </h3>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <CurrencyButton
            active={currency === "PKR"}
            onClick={() => {
              setCurrency("PKR");
              setMethod(null);
            }}
            title="Pakistani Rupees"
            subtitle="EasyPaisa · NayaPay · JazzCash"
            price={formatPrice(planDetails.pricePkr, "PKR")}
          />
          <CurrencyButton
            active={currency === "USDT"}
            onClick={() => {
              setCurrency("USDT");
              setMethod(null);
            }}
            title="USDT"
            subtitle="Binance Pay only"
            price={formatPrice(planDetails.priceUsdt, "USDT")}
          />
        </CardContent>
      </Card>

      {/* Step 2: payment method instructions */}
      {currency ? (
        <Card>
          <CardHeader>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Step 2
            </p>
            <h3 className="text-base font-semibold">
              {currency === "PKR"
                ? "Send Rs. to one of these accounts"
                : "Send USDT to this Binance Pay account"}
            </h3>
            <p className="text-sm text-muted-foreground">
              Send exactly{" "}
              <span className="font-medium text-foreground">
                {amount != null ? formatPrice(amount, currency) : ""}
              </span>{" "}
              and copy the transaction ID from your receipt.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {methods.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id)}
                className={cn(
                  "block w-full rounded-lg border p-4 text-left transition-colors",
                  method === m.id
                    ? "border-brand bg-brand/5"
                    : "border-border/60 hover:bg-muted/40",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{m.label}</span>
                      <Badge variant="secondary" className="text-[10px]">
                        {m.currency}
                      </Badge>
                    </div>
                    <dl className="mt-2 grid gap-1 text-sm">
                      <CopyRow label={m.accountLabel} value={m.account} />
                      <CopyRow label={m.holderLabel} value={m.holder} />
                      {m.secondary ? (
                        <CopyRow
                          label={m.secondary.label}
                          value={m.secondary.value}
                        />
                      ) : null}
                    </dl>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {m.instructions}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "mt-1 grid size-5 shrink-0 place-items-center rounded-full border",
                      method === m.id
                        ? "border-brand bg-brand text-brand-foreground"
                        : "border-border",
                    )}
                  >
                    {method === m.id ? <Check className="size-3" /> : null}
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {/* Step 3: transaction id form */}
      {currency && method ? (
        <Card>
          <CardHeader>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Step 3
            </p>
            <h3 className="text-base font-semibold">
              Submit your transaction ID
            </h3>
            <p className="text-sm text-muted-foreground">
              Once submitted, an admin reviews the payment and activates the
              license. The license key shows up on your dashboard.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="txnId">
                  Transaction ID <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="txnId"
                  name="txnId"
                  required
                  placeholder="TID / TRX / Receipt reference number"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="senderName">Your name (sender)</Label>
                <Input
                  id="senderName"
                  name="senderName"
                  placeholder="As it appears on the receipt"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="senderContact">Sender phone / contact</Label>
                <Input
                  id="senderContact"
                  name="senderContact"
                  placeholder="03XX-XXXXXXX or Binance username"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  placeholder="Anything else admin should know"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-2">
                <Link
                  href="/dashboard"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  I&apos;ll come back later
                </Link>
                <Button type="submit" disabled={pending}>
                  {pending ? "Submitting…" : "Submit for review"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function CurrencyButton({
  active,
  onClick,
  title,
  subtitle,
  price,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  subtitle: string;
  price: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg border p-4 text-left transition-colors",
        active
          ? "border-brand bg-brand/5"
          : "border-border/60 hover:bg-muted/40",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-semibold">{title}</div>
          <div className="mt-0.5 text-xs text-muted-foreground">
            {subtitle}
          </div>
        </div>
        <div className="text-right text-sm font-semibold">{price}</div>
      </div>
    </button>
  );
}

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => {
        toast.error("Could not copy");
      });
  }
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">{label}:</span>
      <span className="font-mono text-sm">{value}</span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          copy();
        }}
        className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        aria-label={`Copy ${label}`}
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </button>
    </div>
  );
}
