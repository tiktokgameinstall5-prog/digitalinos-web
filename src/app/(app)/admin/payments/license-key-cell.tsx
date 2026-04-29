"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/**
 * Admin-only widget that shows the issued licence key alongside a one-click
 * "copy to clipboard" affordance. Used in the Payments table so admins can
 * easily forward the key to the user via email / WhatsApp / etc.
 */
export function LicenseKeyCell({ licenseKey }: { licenseKey: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard
      .writeText(licenseKey)
      .then(() => {
        setCopied(true);
        toast.success(`License ${licenseKey} copied to clipboard.`);
        window.setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => toast.error("Could not copy."));
  }

  return (
    <div className="inline-flex max-w-full items-center gap-1.5 rounded border border-border/40 bg-muted/30 px-2 py-1">
      <code
        className="truncate font-mono text-xs"
        title={licenseKey}
      >
        {licenseKey}
      </code>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copy license key ${licenseKey}`}
        className={cn(
          "shrink-0 rounded p-1 transition-colors",
          copied
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-muted-foreground hover:bg-background hover:text-foreground",
        )}
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </button>
    </div>
  );
}
