import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 py-16">
        <article className="prose prose-neutral mx-auto max-w-3xl px-4 sm:px-6 dark:prose-invert">
          <h1>Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().getFullYear()}
          </p>
          <p>
            Digitalinos is designed to minimise the data we collect. Your videos
            never leave your computer.
          </p>

          <h2>What we collect</h2>
          <ul>
            <li>
              <strong>Account data</strong>: email address, a hashed password
              (bcrypt), and optional profile name / avatar from Google sign-in.
            </li>
            <li>
              <strong>License data</strong>: which plan you bought, its expiry
              date, and which devices you activated it on (identified by a
              one-way hash of CPU/motherboard/MAC).
            </li>
            <li>
              <strong>Activity logs</strong>: timestamps and IP addresses of
              logins, license activations, and admin actions (for security and
              abuse prevention).
            </li>
            <li>
              <strong>Trial device counter</strong>: an anonymous per-device
              counter tracking how many videos have been processed before a
              license is entered. This counter is a hash; it does not identify
              you personally.
            </li>
          </ul>

          <h2>What we do <em>not</em> collect</h2>
          <ul>
            <li>Your video files, thumbnails, durations, or titles.</li>
            <li>Metadata about the footage you process.</li>
            <li>Any usage telemetry beyond license verification pings.</li>
          </ul>

          <h2>Third parties</h2>
          <p>
            We use the following sub-processors: Vercel (hosting), Supabase /
            Postgres (database), and — if you sign in with Google — Google OAuth.
            Payments are processed manually via EasyPaisa, NayaPay, JazzCash, or Binance Pay — no card data is collected.
          </p>

          <h2>Your rights</h2>
          <p>
            You can delete your account and all associated data from the settings
            page at any time. For requests under GDPR/CCPA, email{" "}
            <a href="mailto:privacy@digitalinos.app">privacy@digitalinos.app</a>.
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
