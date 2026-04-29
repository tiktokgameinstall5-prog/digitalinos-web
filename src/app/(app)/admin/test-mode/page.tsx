export const dynamic = "force-dynamic";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TestModeForm } from "./test-mode-form";

export const metadata = { title: "Test mode" };

const TEST_NOTE_PREFIX = "admin-test-mode";

export default async function TestModePage() {
  const session = await auth();
  const userId = (session!.user as { id?: string }).id!;

  const active = await prisma.license.findFirst({
    where: {
      userId,
      status: "ACTIVE",
      expiresAt: { gt: new Date() },
      notes: { startsWith: TEST_NOTE_PREFIX },
    },
    orderBy: { issuedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Test mode</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Grant yourself a temporary 1-hour license on any plan so you can test
          plan-gated UI. This is for admins only and is not part of the public
          SaaS — the license auto-expires after 1 hour.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Status</h2>
            {active ? (
              <Badge variant="default">
                ACTIVE · {active.plan}
              </Badge>
            ) : (
              <Badge variant="secondary">Inactive</Badge>
            )}
          </div>
          {active ? (
            <p className="text-xs text-muted-foreground">
              Expires {active.expiresAt.toLocaleString("en-US")} · Key{" "}
              <code className="font-mono">{active.key}</code>
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              No test-mode license is currently active for your admin account.
            </p>
          )}
        </CardHeader>
        <CardContent>
          <TestModeForm hasActive={Boolean(active)} />
        </CardContent>
      </Card>
    </div>
  );
}
