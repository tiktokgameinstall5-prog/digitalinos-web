"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function DeviceRow({
  id,
  hostname,
  platform,
  lastSeenAt,
}: {
  id: string;
  hostname?: string | null;
  platform?: string | null;
  lastSeenAt: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  function release() {
    if (!confirm("Release this device? The app on that PC will stop working.")) {
      return;
    }
    start(async () => {
      const res = await fetch("/api/license/release", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ deviceId: id }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        toast.error(j?.error ?? "Could not release device.");
        return;
      }
      toast.success("Device released. Slot is free.");
      router.refresh();
    });
  }

  return (
    <li className="flex items-center justify-between rounded-md border border-border/60 bg-background px-3 py-2 text-sm">
      <div>
        <div className="font-medium">
          {hostname ?? "Unnamed device"}
          {platform ? (
            <span className="ml-2 text-xs text-muted-foreground">
              {platform}
            </span>
          ) : null}
        </div>
        <div className="text-xs text-muted-foreground">
          Last seen: {new Date(lastSeenAt).toLocaleString()}
        </div>
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={release}
        disabled={pending}
      >
        {pending ? "Releasing…" : "Release"}
      </Button>
    </li>
  );
}
