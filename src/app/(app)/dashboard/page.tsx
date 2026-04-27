export const dynamic = "force-dynamic";

import Link from "next/link";
import { Download, KeyRound, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { PLANS } from "@/lib/plans";
import { ActivateLicenseForm } from "./activate-license-form";
import { DeviceRow } from "./device-row";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  const userId = (session!.user as { id?: string }).id!;

  const licenses = await prisma.license.findMany({
    where: { userId },
    orderBy: { issuedAt: "desc" },
    include: {
      devices: { orderBy: { lastSeenAt: "desc" } },
    },
  });

  const active = licenses.find((l) => l.status === "ACTIVE" && l.expiresAt > new Date());

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back{session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}.
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your licenses, devices, and downloads.
        </p>
      </div>

      {/* License status card */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              License status
            </p>
            <h2 className="mt-1 text-lg font-semibold">
              {active
                ? `${PLANS.find((p) => p.id === active.plan)?.name ?? active.plan} · active`
                : "No active license"}
            </h2>
            {active ? (
              <p className="mt-1 text-sm text-muted-foreground">
                Expires {active.expiresAt.toDateString()} · bound to {active.devices.length} /
                {" "}
                {active.maxDevices} device{active.maxDevices > 1 ? "s" : ""}
              </p>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">
                You&apos;re on the free trial ({env.FREE_TRIAL_VIDEO_LIMIT_N} videos).
                Enter a license key to unlock unlimited processing.
              </p>
            )}
          </div>
          {active ? (
            <Badge className="bg-brand text-brand-foreground">Active</Badge>
          ) : (
            <Badge variant="secondary">Trial</Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <ActivateLicenseForm />
          {!active ? (
            <Button asChild variant="outline">
              <Link href="/pricing">
                <Sparkles className="mr-2 size-4" />
                Buy a license
              </Link>
            </Button>
          ) : null}
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <Download className="size-5" />
            </div>
            <h3 className="text-base font-semibold">Download Digitalinos</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Windows installer + launcher. macOS / Linux available via source.
            </p>
            <Button asChild className="mt-4" size="sm">
              <Link href="/dashboard/download">Get the app</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <ShieldCheck className="size-5" />
            </div>
            <h3 className="text-base font-semibold">Security tips</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Never share your license key. If you sell / replace a PC, release the
              device slot first.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Licenses list */}
      <section>
        <h3 className="mb-3 text-base font-semibold">Your licenses</h3>
        {licenses.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              You don&apos;t have any licenses yet.{" "}
              <Link href="/pricing" className="text-foreground underline">
                Pick a plan
              </Link>{" "}
              to get started.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {licenses.map((lic) => {
              const plan = PLANS.find((p) => p.id === lic.plan);
              const expired = lic.expiresAt < new Date();
              const revoked = lic.status === "REVOKED";
              return (
                <Card key={lic.id}>
                  <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <KeyRound className="size-4 text-muted-foreground" />
                        <code className="text-sm font-medium">{lic.key}</code>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {plan?.name ?? lic.plan} · expires {lic.expiresAt.toDateString()}
                      </p>
                    </div>
                    <Badge
                      variant={revoked || expired ? "secondary" : "default"}
                      className={
                        !revoked && !expired
                          ? "bg-brand text-brand-foreground"
                          : ""
                      }
                    >
                      {revoked ? "Revoked" : expired ? "Expired" : "Active"}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Devices ({lic.devices.length} / {lic.maxDevices})
                    </p>
                    {lic.devices.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No devices activated yet.
                      </p>
                    ) : (
                      <ul className="space-y-2">
                        {lic.devices.map((d) => (
                          <DeviceRow
                            key={d.id}
                            id={d.id}
                            hostname={d.hostname}
                            platform={d.platform}
                            lastSeenAt={d.lastSeenAt.toISOString()}
                          />
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
