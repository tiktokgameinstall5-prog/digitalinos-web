import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    price: "$9",
    period: "1 month",
    devices: "1 device",
    popular: false,
    features: ["Unlimited video processing", "All quality templates", "Email support"],
  },
  {
    name: "Pro",
    price: "$19",
    period: "3 months",
    devices: "1 device",
    popular: true,
    features: [
      "Everything in Starter",
      "Save your presets",
      "Priority support",
      "Best value per month",
    ],
  },
  {
    name: "Studio",
    price: "$59",
    period: "1 year",
    devices: "2 devices",
    popular: false,
    features: [
      "Everything in Pro",
      "2 device activations",
      "Annual savings (~50%)",
      "Direct line to support",
    ],
  },
];

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
          {plans.map((p) => (
            <div
              key={p.name}
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
                  {p.price}
                </div>
                <div className="text-sm text-muted-foreground">
                  / {p.period}
                </div>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {p.devices}
              </div>
              <ul className="mt-6 space-y-2.5 text-sm">
                {p.features.map((f) => (
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
                <Link href="/pricing">
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
