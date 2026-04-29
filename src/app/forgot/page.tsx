import Link from "next/link";
import { AuthShell } from "@/components/marketing/auth-shell";

export const metadata = { title: "Forgot password" };

export default function ForgotPage() {
  return (
    <AuthShell
      title="Reset your password"
      subtitle="We'll wire this up to your email provider next."
      footer={
        <>
          Remembered it?{" "}
          <Link href="/login" className="font-medium text-foreground hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
        Password reset emails are not enabled yet. For now, please contact
        support at{" "}
        <a href="mailto:support@digitalinos.app" className="underline">
          support@digitalinos.app
        </a>{" "}
        and we&apos;ll reset it manually within a few hours.
      </div>
    </AuthShell>
  );
}
