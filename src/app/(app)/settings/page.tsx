export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChangePasswordForm } from "./change-password-form";
import { DeleteAccountForm } from "./delete-account-form";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const session = await auth();
  const userId = (session!.user as { id?: string }).id!;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true, createdAt: true, role: true, passwordHash: true },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile and security.
        </p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Profile</h2>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <Row label="Email">{user?.email}</Row>
          <Row label="Name">{user?.name ?? "—"}</Row>
          <Row label="Role">{user?.role}</Row>
          <Row label="Member since">
            {user?.createdAt ? user.createdAt.toDateString() : "—"}
          </Row>
        </CardContent>
      </Card>

      {user?.passwordHash ? (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Change password</h2>
            <p className="text-sm text-muted-foreground">
              Use a unique password you don&apos;t use anywhere else.
            </p>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Billing</h2>
          <p className="text-sm text-muted-foreground">
            Payments are processed manually via EasyPaisa, NayaPay, JazzCash,
            or Binance Pay. Submit a transaction ID at checkout and an admin
            activates your license.
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            See your active licenses and pending submissions on the{" "}
            <a className="underline hover:text-foreground" href="/dashboard">
              dashboard
            </a>
            .
          </p>
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader>
          <h2 className="text-lg font-semibold text-destructive">Danger zone</h2>
          <p className="text-sm text-muted-foreground">
            Delete your account and all associated licenses. This cannot be undone.
          </p>
        </CardHeader>
        <CardContent>
          <DeleteAccountForm />
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border/40 py-2 last:border-b-0 last:pb-0">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-right">{children}</span>
    </div>
  );
}
