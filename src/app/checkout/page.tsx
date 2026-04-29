export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { auth } from "@/auth";
import { PLANS, type PlanId, type Currency } from "@/lib/plans";
import { CheckoutFlow } from "./checkout-flow";

export const metadata = { title: "Checkout" };

const ALL_PLANS: PlanId[] = ["STARTER", "PRO", "STUDIO"];
const ALL_CURRENCIES: Currency[] = ["PKR", "USDT"];

interface PageProps {
  searchParams: Promise<{
    plan?: string;
    currency?: string;
  }>;
}

export default async function CheckoutPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const planParam = (sp.plan ?? "PRO").toUpperCase();
  const plan = (ALL_PLANS as string[]).includes(planParam)
    ? (planParam as PlanId)
    : "PRO";

  const currencyParam = (sp.currency ?? "").toUpperCase();
  const currency = (ALL_CURRENCIES as string[]).includes(currencyParam)
    ? (currencyParam as Currency)
    : null;

  const session = await auth();
  if (!session?.user?.email) {
    const next = encodeURIComponent(
      `/checkout?plan=${plan}${currency ? `&currency=${currency}` : ""}`,
    );
    redirect(`/login?next=${next}`);
  }

  const planDetails = PLANS.find((p) => p.id === plan)!;

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <div className="mb-8">
              <Link
                href="/pricing"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Back to pricing
              </Link>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Checkout — {planDetails.name}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Pay manually using EasyPaisa, NayaPay, JazzCash, or Binance Pay.
                After you submit the transaction ID, an admin reviews and
                activates your license — usually within a few hours.
              </p>
            </div>
            <CheckoutFlow plan={plan} initialCurrency={currency} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
