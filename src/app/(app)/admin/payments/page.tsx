export const dynamic = "force-dynamic";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { formatPrice, type Currency } from "@/lib/plans";
import { PaymentRowActions } from "./payment-row-actions";

export const metadata = { title: "Payments" };

const STATUS_VARIANTS: Record<
  "PENDING" | "APPROVED" | "REJECTED",
  "default" | "secondary" | "destructive"
> = {
  PENDING: "default",
  APPROVED: "secondary",
  REJECTED: "destructive",
};

const METHOD_LABELS: Record<string, string> = {
  EASYPAISA: "EasyPaisa",
  NAYAPAY: "NayaPay",
  JAZZCASH: "JazzCash",
  BINANCE: "Binance Pay",
};

function formatDate(d: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default async function AdminPaymentsPage() {
  const submissions = await prisma.paymentSubmission.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    take: 200,
    include: {
      user: { select: { email: true, name: true } },
      license: { select: { key: true } },
    },
  });

  const pendingCount = submissions.filter((s) => s.status === "PENDING").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Payments</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manual payment submissions from EasyPaisa, NayaPay, JazzCash, or
          Binance Pay. Approve to issue a license; reject to mark invalid.
        </p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold">
            {pendingCount} pending review
          </h2>
          <p className="text-sm text-muted-foreground">
            Approving issues a license for the user automatically.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Submitted</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Txn ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                      {formatDate(s.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{s.user.email}</div>
                      {s.senderName ? (
                        <div className="text-xs text-muted-foreground">
                          Sender: {s.senderName}
                        </div>
                      ) : null}
                    </TableCell>
                    <TableCell>{s.plan}</TableCell>
                    <TableCell>
                      {METHOD_LABELS[s.method] ?? s.method}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatPrice(s.amount, s.currency as Currency)}
                    </TableCell>
                    <TableCell>
                      <code className="font-mono text-xs">{s.txnId}</code>
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANTS[s.status]}>
                        {s.status}
                      </Badge>
                      {s.status === "APPROVED" && s.license ? (
                        <div className="mt-1 font-mono text-[10px] text-muted-foreground">
                          {s.license.key}
                        </div>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-right">
                      {s.status === "PENDING" ? (
                        <PaymentRowActions
                          id={s.id}
                          userEmail={s.user.email}
                          plan={s.plan}
                        />
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {submissions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center text-muted-foreground"
                    >
                      No payment submissions yet.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
