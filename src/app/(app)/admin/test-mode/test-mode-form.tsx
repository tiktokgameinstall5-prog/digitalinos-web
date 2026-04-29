"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { PlanId } from "@/lib/plans";

export function TestModeForm({ hasActive }: { hasActive: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [plan, setPlan] = useState<PlanId>("PRO");

  function grant() {
    start(async () => {
      const res = await fetch("/api/admin/test-mode", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(j?.error ?? "Could not grant test license.");
        return;
      }
      toast.success(`Granted ${plan} for 1 hour. Key: ${j.license.key}`);
      router.refresh();
    });
  }

  function revoke() {
    if (!confirm("Revoke any active test-mode license?")) return;
    start(async () => {
      const res = await fetch("/api/admin/test-mode", { method: "DELETE" });
      if (!res.ok) {
        toast.error("Could not revoke.");
        return;
      }
      toast.success("Revoked.");
      router.refresh();
    });
  }

  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
      <div className="space-y-1.5">
        <label htmlFor="plan" className="text-sm font-medium">
          Plan
        </label>
        <select
          id="plan"
          value={plan}
          onChange={(e) => setPlan(e.target.value as PlanId)}
          className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
        >
          <option value="STARTER">Starter (1h test)</option>
          <option value="PRO">Pro (1h test)</option>
          <option value="STUDIO">Studio (1h test)</option>
        </select>
      </div>
      <Button onClick={grant} disabled={pending}>
        {pending ? "Working…" : hasActive ? "Replace with new 1h license" : "Grant 1h license"}
      </Button>
      <Button
        variant="outline"
        onClick={revoke}
        disabled={pending || !hasActive}
      >
        Revoke
      </Button>
    </div>
  );
}
