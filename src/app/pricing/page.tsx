import Link from "next/link";
import { Check } from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PLANS } from "@/lib/plans";

export const metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                Simple pricing. One-time, time-boxed.
              </h1>
              <p className="mt-4 text-pretty text-muted-foreground">
                Pay once for the window you need. No auto-renew surprises. Your
                license is bound to your PC and works offline.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {PLANS.map((plan) => (
                <Card
                  key={plan.id}
                  className={cn(
                    "relative flex flex-col border-border/60",
                    plan.popular && "border-brand/60 shadow-[0_10px_40px_-20px_rgba(27,181,196,0.45)]",
                  )}
                >
                  {plan.popular ? (
                    <Badge className="absolute right-6 top-6 bg-brand text-brand-foreground">
                      Most popular
                    </Badge>
                  ) : null}
                  <CardHeader className="space-y-1">
                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {plan.tagline}
                    </p>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-semibold tracking-tight">
                        ${plan.priceUsd}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        / {plan.durationLabel}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {plan.maxDevices} device{plan.maxDevices > 1 ? "s" : ""} ·{" "}
                      {plan.durationDays} days of access
                    </p>

                    <Button
                      asChild
                      className="mt-6 w-full"
                      variant={plan.popular ? "default" : "outline"}
                    >
                      <Link href={`/signup?plan=${plan.id}`}>
                        Get {plan.name}
                      </Link>
                    </Button>

                    <ul className="mt-6 space-y-2.5 text-sm">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                          <span className="text-foreground/90">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            <p className="mx-auto mt-10 max-w-xl text-center text-xs text-muted-foreground">
              All plans include a free 10-video trial before you buy. Every plan is
              a one-time payment — no auto-renewals. Prices in USD, taxes may apply.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
