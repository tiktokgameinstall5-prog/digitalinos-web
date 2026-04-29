import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLANS, formatPrice } from "@/lib/plans";

const FEATURES: Record<string, string[]> = {
  STARTER: ["Unlimited video processing", "All quality templates", "Email support"],
  PRO: [
    "Everything in Starter",
    "Save your presets",
    "Priority support",
    "Best value per month",
  ],
  STUDIO: [
    "Everything in Pro",
    "2 device activations",
    "Annual savings",
    "Direct line to support",
  ],
};

const DEVICES_LABEL: Record<string, string> = {
  STARTER: "1 device",
  PRO: "1 device",
  STUDIO: "2 devices",
};

export function PricingTeaser() {
  return (
    <section id="pricing-teaser" className="border-t border-border/60 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Pricing
          </p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Pay once, own the time window.
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            No auto-renew. No surprise charges. Pick a window, process as much
            as you want, come back when you need more.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.id}
              className={
                p.popular
                  ? "relative rounded-2xl border-2 border-brand bg-card p-6 shadow-sm"
                  : "relative rounded-2xl border border-border/60 bg-card p-6"
              }
            >
              {p.popular ? (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-brand-foreground">
                  Most popular
                </div>
              ) : null}
              <div className="text-sm font-semibold">{p.name}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <div className="text-4xl font-semibold tracking-tight">
                  {formatPrice(p.pricePkr, "PKR")}
                </div>
                <div className="text-sm text-muted-foreground">/ month</div>
              </div>
              <div className="text-xs text-muted-foreground">
                or {formatPrice(p.priceUsdt, "USDT")} / month via Binance Pay
              </div>
              <div className="mt-1 text-xs text-brand">
                Up to 30% off with 12 months
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {DEVICES_LABEL[p.id] ?? "1 device"}
              </div>
              <ul className="mt-6 space-y-2.5 text-sm">
                {(FEATURES[p.id] ?? []).map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant={p.popular ? "default" : "outline"}
                className="mt-6 w-full"
              >
                <Link href={`/checkout?plan=${p.id}`}>
                  Choose {p.name}
                  <ArrowRight className="ml-2 size-3.5" />
                </Link>
              </Button>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Every plan starts with a 10-video free trial — no credit card
          required.
        </p>
      </div>
    </section>
  );
}
