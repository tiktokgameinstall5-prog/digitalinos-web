import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Hero } from "@/components/marketing/hero";
import { TrustStrip } from "@/components/marketing/trust-strip";
import { Features } from "@/components/marketing/features";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Stats } from "@/components/marketing/stats";
import { Comparison } from "@/components/marketing/comparison";
import { PricingTeaser } from "@/components/marketing/pricing-teaser";
import { FAQ } from "@/components/marketing/faq";
import { CTA } from "@/components/marketing/cta";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TrustStrip />
        <Features />
        <HowItWorks />
        <Stats />
        <Comparison />
        <PricingTeaser />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
