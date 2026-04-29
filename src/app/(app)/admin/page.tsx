export const dynamic = "force-dynamic";

import Link from "next/link";
import { Users, KeyRound, ScrollText, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Admin" };

export default async function AdminOverviewPage() {
  const now = new Date();
  const dayAgo = new Date(now.getTime() - 24 * 3600 * 1000);
  const [userCount, activeLicenses, totalLicenses, trialDevices, last24hLogs] =
    await Promise.all([
      prisma.user.count(),
      prisma.license.count({
        where: { status: "ACTIVE", expiresAt: { gt: now } },
      }),
      prisma.license.count(),
      prisma.trialPing.count(),
      prisma.log.count({ where: { createdAt: { gt: dayAgo } } }),
    ]);

  const stats = [
    { label: "Users", value: userCount, href: "/admin/users", icon: Users },
    {
      label: "Active licenses",
      value: `${activeLicenses} / ${totalLicenses}`,
      href: "/admin/licenses",
      icon: KeyRound,
    },
    {
      label: "Trial devices",
      value: trialDevices,
      href: "/admin/users",
      icon: Activity,
    },
    {
      label: "Events (24h)",
      value: last24hLogs,
      href: "/admin/logs",
      icon: ScrollText,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Snapshot of accounts, licenses, and activity.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="transition-colors hover:bg-muted/40">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </p>
                  <s.icon className="size-4 text-muted-foreground" />
                </div>
                <p className="mt-2 text-2xl font-semibold">{s.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
