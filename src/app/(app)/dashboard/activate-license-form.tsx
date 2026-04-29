"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ActivateLicenseForm() {
  const router = useRouter();
  const [key, setKey] = useState("");
  const [pending, start] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    start(async () => {
      const res = await fetch("/api/license/redeem", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ key }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(json?.error ?? "Could not activate license.");
        return;
      }
      toast.success("License added to your account.");
      setKey("");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row sm:items-end">
      <div className="flex-1 space-y-1.5">
        <Label htmlFor="license-key" className="text-xs">
          Enter a license key
        </Label>
        <Input
          id="license-key"
          value={key}
          onChange={(e) => setKey(e.target.value.toUpperCase())}
          placeholder="DGIT-XXXX-XXXX-XXXX-XXXX"
          className="font-mono"
        />
      </div>
      <Button type="submit" disabled={!key || pending}>
        {pending ? "Activating…" : "Activate"}
      </Button>
    </form>
  );
}
