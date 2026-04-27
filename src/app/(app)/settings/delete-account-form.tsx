"use client";

import { useTransition } from "react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DeleteAccountForm() {
  const [pending, start] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const confirmText = new FormData(e.currentTarget).get("confirm");
    if (confirmText !== "DELETE") {
      toast.error('Type "DELETE" to confirm.');
      return;
    }
    start(async () => {
      const res = await fetch("/api/account/delete", { method: "POST" });
      if (!res.ok) {
        toast.error("Could not delete account. Contact support.");
        return;
      }
      toast.success("Account deleted.");
      signOut({ callbackUrl: "/" });
    });
  }

  return (
    <form onSubmit={onSubmit} className="max-w-sm space-y-3">
      <Input name="confirm" placeholder='Type "DELETE" to confirm' />
      <Button type="submit" variant="destructive" disabled={pending}>
        {pending ? "Deleting…" : "Permanently delete account"}
      </Button>
    </form>
  );
}
