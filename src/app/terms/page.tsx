import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 py-16">
        <article className="prose prose-neutral mx-auto max-w-3xl px-4 sm:px-6 dark:prose-invert">
          <h1>Terms of Service</h1>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().getFullYear()}
          </p>
          <p>
            These Terms govern your access to and use of the Digitalinos software
            and website (the &quot;Service&quot;). By creating an account or
            activating a license key you agree to these Terms.
          </p>

          <h2>1. The Service</h2>
          <p>
            Digitalinos is a desktop video processing application. All video
            processing happens on your own computer; we do not upload, store, or
            view your video files. The web service only manages your account,
            license keys, and activity logs.
          </p>

          <h2>2. Free trial and licenses</h2>
          <p>
            You may process up to 10 videos for free without a license. After
            that, continued use requires a valid, active license key. Licenses
            are time-limited (1 month, 3 months, or 1 year) and bound to the
            number of devices included with your plan.
          </p>

          <h2>3. Acceptable use</h2>
          <p>
            You may not: (a) attempt to bypass license checks; (b) share or
            resell license keys; (c) reverse-engineer the software; (d) use the
            Service to process illegal content or content you do not have rights
            to.
          </p>

          <h2>4. Refunds</h2>
          <p>
            Because a license key is delivered digitally and is usable
            immediately, all sales are final. If the software does not work on
            your machine due to a platform issue, contact support within 7 days.
          </p>

          <h2>5. Liability</h2>
          <p>
            The Service is provided &quot;as is&quot;. To the maximum extent
            permitted by law, Digitalinos is not liable for any indirect or
            consequential damages arising from use of the Service.
          </p>

          <h2>6. Changes</h2>
          <p>
            We may update these Terms from time to time. Material changes will be
            communicated via email or in-app notice.
          </p>

          <h2>Contact</h2>
          <p>
            Questions: <a href="mailto:tiktokgameinstall6@gmail.com">tiktokgameinstall6@gmail.com</a>
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
