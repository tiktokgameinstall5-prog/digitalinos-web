"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function PaymentRowActions({
  id,
  userEmail,
  plan,
}: {
  id: string;
  userEmail: string;
  plan: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  function call(action: "approve" | "reject", reviewerNote?: string) {
    start(async () => {
      const res = await fetch(`/api/admin/payments/${id}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action, reviewerNote }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(j?.error ?? "Could not update submission.");
        return;
      }
      if (action === "approve" && j?.license?.key) {
        toast.success(
          `Approved — license ${j.license.key} issued to ${userEmail}.`,
        );
      } else {
        toast.success(`Submission ${action}d.`);
      }
      router.refresh();
    });
  }

  return (
    <div className="flex justify-end gap-2">
      <Button
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() => {
          const note = prompt(
            `Reject this ${plan} submission? Optional note for the log:`,
          );
          if (note === null) return;
          call("reject", note || undefined);
        }}
      >
        Reject
      </Button>
      <Button
        size="sm"
        disabled={pending}
        onClick={() => {
          if (!confirm(`Approve and issue a ${plan} license to ${userEmail}?`)) {
            return;
          }
          call("approve");
        }}
      >
        Approve
      </Button>
    </div>
  );
}
