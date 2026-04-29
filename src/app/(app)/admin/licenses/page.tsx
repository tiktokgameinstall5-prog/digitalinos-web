export const dynamic = "force-dynamic";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { IssueLicenseForm } from "./issue-license-form";
import { LicenseRowActions } from "./license-row-actions";

export const metadata = { title: "Licenses" };

export default async function AdminLicensesPage() {
  const licenses = await prisma.license.findMany({
    orderBy: { issuedAt: "desc" },
    take: 200,
    include: {
      user: { select: { email: true } },
      _count: { select: { devices: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Licenses</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Issue, view, or revoke license keys.
        </p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold">Issue a new license</h2>
          <p className="text-sm text-muted-foreground">
            Enter a user email (they must already have an account) or leave empty
            to create an unclaimed key you can send later.
          </p>
        </CardHeader>
        <CardContent>
          <IssueLicenseForm />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Devices</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {licenses.map((l) => {
                const expired = l.expiresAt < new Date();
                return (
                  <TableRow key={l.id}>
                    <TableCell className="font-mono text-xs">{l.key}</TableCell>
                    <TableCell>{l.plan}</TableCell>
                    <TableCell>{l.user?.email ?? "—"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {l.expiresAt.toDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          l.status === "ACTIVE" && !expired ? "default" : "secondary"
                        }
                      >
                        {l.status === "ACTIVE" && expired ? "EXPIRED" : l.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {l._count.devices} / {l.maxDevices}
                    </TableCell>
                    <TableCell className="text-right">
                      <LicenseRowActions id={l.id} status={l.status} />
                    </TableCell>
                  </TableRow>
                );
              })}
              {licenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No licenses yet.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
