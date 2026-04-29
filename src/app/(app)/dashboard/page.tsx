export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  Clock,
  Download,
  KeyRound,
  Laptop,
  ShieldCheck,
  Sparkles,
  Video,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { PLANS } from "@/lib/plans";
import { ActivateLicenseForm } from "./activate-license-form";
import { DeviceRow } from "./device-row";

export const metadata = { title: "Dashboard" };

function formatDate(d: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

function daysUntil(target: Date): number {
  const ms = target.getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}

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

  const now = new Date();
  const active = licenses.find((l) => l.status === "ACTIVE" && l.expiresAt > now);
  const activePlan = active ? PLANS.find((p) => p.id === active.plan) : null;
  const totalDevices = licenses.reduce((sum, l) => sum + l.devices.length, 0);
  const trialLimit = env.FREE_TRIAL_VIDEO_LIMIT_N ?? 10;

  const firstName = session?.user?.name?.split(" ")[0];

  return (
    <div className="space-y-8">
      {/* Welcome heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Welcome back{firstName ? `, ${firstName}` : ""}.
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your licenses, devices, and downloads in one place.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="/install">
              <BookOpen className="mr-2 size-4" />
              Install guide
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/dashboard/download">
              <Download className="mr-2 size-4" />
              Download app
            </Link>
          </Button>
        </div>
      </div>

      {/* Hero status card */}
      <Card className="overflow-hidden border-brand/20 bg-gradient-to-br from-brand/5 via-background to-background">
        <CardContent className="grid gap-6 p-6 md:grid-cols-[1.4fr_1fr] md:gap-8 md:p-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-brand">
              <ShieldCheck className="size-3.5" />
              {active ? "Subscription active" : "Free trial"}
            </div>
            <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
              {active
                ? `${activePlan?.name ?? active.plan} plan — unlimited renders`
                : `${trialLimit} free videos per device`}
            </h2>
            <p className="mt-2 max-w-prose text-sm text-muted-foreground">
              {active ? (
                <>
                  You can render unlimited videos on up to{" "}
                  <span className="font-medium text-foreground">
                    {active.maxDevices} device{active.maxDevices > 1 ? "s" : ""}
                  </span>
                  . Currently in use:{" "}
                  <span className="font-medium text-foreground">
                    {active.devices.length}
                  </span>
                  .
                </>
              ) : (
                <>
                  No subscription — every device gets {trialLimit} free renders.
                  Activate a license below to unlock unlimited processing.
                </>
              )}
            </p>

            {active ? (
              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>License period</span>
                  <span className="font-medium text-foreground">
                    {daysUntil(active.expiresAt)} days remaining
                  </span>
                </div>
                <Progress
                  value={Math.max(
                    1,
                    Math.min(
                      100,
                      (daysUntil(active.expiresAt) /
                        Math.max(1, activePlan?.durationDays ?? 30)) *
                        100,
                    ),
                  )}
                  className="h-2"
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Issued {formatDate(active.issuedAt)}</span>
                  <span>Expires {formatDate(active.expiresAt)}</span>
                </div>
              </div>
            ) : (
              <div className="mt-5">
                <ActivateLicenseForm />
              </div>
            )}

            {!active ? (
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild size="sm">
                  <Link href="/pricing">
                    <Sparkles className="mr-2 size-4" />
                    Buy a license
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/install">See how it works</Link>
                </Button>
              </div>
            ) : null}
          </div>

          {/* Stat panel */}
          <div className="grid grid-cols-2 gap-3 self-start">
            <StatTile
              icon={<KeyRound className="size-4" />}
              label="Plan"
              value={active ? (activePlan?.name ?? active.plan) : "Trial"}
            />
            <StatTile
              icon={<Laptop className="size-4" />}
              label="Devices"
              value={`${totalDevices}`}
              hint={
                active ? `of ${active.maxDevices} max` : "unlimited on trial"
              }
            />
            <StatTile
              icon={<Video className="size-4" />}
              label="Free renders"
              value={active ? "Unlimited" : `${trialLimit}/device`}
            />
            <StatTile
              icon={<Clock className="size-4" />}
              label={active ? "Days left" : "License"}
              value={active ? `${daysUntil(active.expiresAt)}` : "None"}
              hint={active ? "until renewal" : "activate below"}
            />
          </div>
        </CardContent>
      </Card>

      {/* If active, still allow re-activate / activate-on-another-device */}
      {active ? (
        <Card>
          <CardHeader className="space-y-1 pb-3">
            <h3 className="text-base font-semibold">Activate another key</h3>
            <p className="text-sm text-muted-foreground">
              Got an additional license? Paste it here to add it to your account.
            </p>
          </CardHeader>
          <CardContent>
            <ActivateLicenseForm />
          </CardContent>
        </Card>
      ) : null}

      {/* Quick actions */}
      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Quick actions
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <ActionTile
            icon={<Download className="size-5" />}
            title="Download app"
            description="Windows-ready ZIP with launcher."
            href="/dashboard/download"
            cta="Get the app"
          />
          <ActionTile
            icon={<BookOpen className="size-5" />}
            title="Install guide"
            description="Step-by-step setup + usage tutorial."
            href="/install"
            cta="Open guide"
          />
          <ActionTile
            icon={<Sparkles className="size-5" />}
            title="Pricing"
            description="Compare plans, buy more keys."
            href="/pricing"
            cta="View plans"
          />
          <ActionTile
            icon={<ShieldCheck className="size-5" />}
            title="Account"
            description="Password, email, security."
            href="/settings"
            cta="Settings"
          />
        </div>
      </section>

      {/* Licenses list */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Your licenses
          </h3>
          <span className="text-xs text-muted-foreground">
            {licenses.length} total
          </span>
        </div>
        {licenses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-brand/10 text-brand">
                <KeyRound className="size-5" />
              </div>
              <div>
                <p className="font-medium">No licenses yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pick a plan to unlock unlimited videos on this account.
                </p>
              </div>
              <Button asChild size="sm">
                <Link href="/pricing">
                  Browse plans <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {licenses.map((lic) => {
              const plan = PLANS.find((p) => p.id === lic.plan);
              const expired = lic.expiresAt < now;
              const revoked = lic.status === "REVOKED";
              const isActive = !expired && !revoked;
              return (
                <Card
                  key={lic.id}
                  className={
                    isActive ? "border-brand/30 bg-brand/[0.02]" : undefined
                  }
                >
                  <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <KeyRound className="size-4 shrink-0 text-muted-foreground" />
                        <code className="truncate text-sm font-medium">
                          {lic.key}
                        </code>
                      </div>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {plan?.name ?? lic.plan}
                        </span>
                        <span>·</span>
                        <Calendar className="size-3" />
                        <span>{formatDate(lic.expiresAt)}</span>
                        {isActive ? (
                          <>
                            <span>·</span>
                            <span>{daysUntil(lic.expiresAt)} days left</span>
                          </>
                        ) : null}
                      </p>
                    </div>
                    <Badge
                      variant={isActive ? "default" : "secondary"}
                      className={
                        isActive
                          ? "border-brand/30 bg-brand/15 text-brand hover:bg-brand/20"
                          : ""
                      }
                    >
                      {revoked ? "Revoked" : expired ? "Expired" : "Active"}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Laptop className="size-3.5" />
                        Devices
                      </span>
                      <span className="font-medium text-foreground">
                        {lic.devices.length} / {lic.maxDevices}
                      </span>
                    </div>
                    {lic.devices.length === 0 ? (
                      <p className="rounded-md border border-dashed border-border/60 px-3 py-4 text-center text-xs text-muted-foreground">
                        No devices activated yet — paste this key in the desktop
                        app to bind it.
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

      {/* Tips footer card */}
      <Card className="border-dashed bg-muted/30">
        <CardContent className="flex flex-col gap-3 p-5 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-brand/15 text-brand">
              <Check className="size-4" />
            </div>
            <div>
              <p className="font-medium">100% offline processing</p>
              <p className="text-xs text-muted-foreground">
                Your videos never leave your machine. Licenses verify online once
                a week.
              </p>
            </div>
          </div>
          <Button asChild variant="ghost" size="sm" className="self-start sm:self-auto">
            <Link href="/install">
              Read the guide <ArrowRight className="ml-1 size-3" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/60 p-3">
      <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <span className="text-brand">{icon}</span>
        {label}
      </div>
      <div className="mt-1 truncate text-lg font-semibold">{value}</div>
      {hint ? (
        <div className="text-[11px] text-muted-foreground">{hint}</div>
      ) : null}
    </div>
  );
}

function ActionTile({
  icon,
  title,
  description,
  href,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 rounded-lg border border-border/60 bg-card/40 p-5 transition hover:-translate-y-0.5 hover:border-brand/30 hover:bg-card hover:shadow-sm"
    >
      <div className="flex size-10 items-center justify-center rounded-lg bg-brand/10 text-brand transition group-hover:bg-brand/15">
        {icon}
      </div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-brand opacity-0 transition group-hover:opacity-100">
        {cta} <ArrowRight className="size-3" />
      </div>
    </Link>
  );
}
