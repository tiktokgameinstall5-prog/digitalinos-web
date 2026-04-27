"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

export function LicenseRowActions({
  id,
  status,
}: {
  id: string;
  status: "ACTIVE" | "REVOKED" | "EXPIRED";
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  function setStatus(newStatus: "ACTIVE" | "REVOKED") {
    start(async () => {
      const res = await fetch(`/api/admin/licenses/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        toast.error("Could not update license.");
        return;
      }
      toast.success("License updated.");
      router.refresh();
    });
  }

  function deleteLicense() {
    if (!confirm("Delete license and all its device bindings?")) return;
    start(async () => {
      const res = await fetch(`/api/admin/licenses/${id}`, { method: "DELETE" });
      if (!res.ok) {
        toast.error("Could not delete license.");
        return;
      }
      toast.success("License deleted.");
      router.refresh();
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={pending}>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {status !== "REVOKED" ? (
          <DropdownMenuItem onClick={() => setStatus("REVOKED")}>
            Revoke
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => setStatus("ACTIVE")}>
            Reactivate
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={deleteLicense}
          className="text-destructive focus:text-destructive"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
