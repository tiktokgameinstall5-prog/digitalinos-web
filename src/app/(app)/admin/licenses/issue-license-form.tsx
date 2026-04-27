"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PLANS } from "@/lib/plans";

export function IssueLicenseForm() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [plan, setPlan] = useState<"STARTER" | "PRO" | "STUDIO">("PRO");
  const [issuedKey, setIssuedKey] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim() || undefined;
    const days = fd.get("days") ? Number(fd.get("days")) : undefined;

    start(async () => {
      const res = await fetch("/api/admin/licenses", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, plan, days }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(j?.error ?? "Could not issue license.");
        return;
      }
      toast.success("License issued.");
      setIssuedKey(j.license.key);
      router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      <form
        onSubmit={onSubmit}
        className="grid gap-3 sm:grid-cols-[1fr_160px_120px_auto] sm:items-end"
      >
        <div className="space-y-1.5">
          <Label htmlFor="email">User email (optional)</Label>
          <Input id="email" name="email" type="email" placeholder="user@example.com" />
        </div>
        <div className="space-y-1.5">
          <Label>Plan</Label>
          <select
            value={plan}
            onChange={(e) =>
              setPlan(e.target.value as "STARTER" | "PRO" | "STUDIO")
            }
            className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
          >
            {PLANS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.durationLabel})
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="days">Days (override)</Label>
          <Input id="days" name="days" type="number" placeholder="auto" />
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? "Issuing…" : "Issue"}
        </Button>
      </form>
      {issuedKey ? (
        <div className="rounded-md border border-brand/50 bg-brand/5 p-3 text-sm">
          <p className="font-medium">New key issued:</p>
          <code className="mt-1 block font-mono text-foreground">{issuedKey}</code>
        </div>
      ) : null}
    </div>
  );
}
