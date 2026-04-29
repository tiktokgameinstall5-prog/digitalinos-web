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

export function UserActions({
  userId,
  role,
  email,
}: {
  userId: string;
  role: "USER" | "ADMIN";
  email: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  function toggleAdmin() {
    start(async () => {
      const newRole = role === "ADMIN" ? "USER" : "ADMIN";
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) {
        toast.error("Could not update role.");
        return;
      }
      toast.success(`Role updated to ${newRole}.`);
      router.refresh();
    });
  }

  function deleteUser() {
    if (!confirm(`Delete ${email}? All licenses will be revoked.`)) return;
    start(async () => {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if (!res.ok) {
        toast.error("Could not delete user.");
        return;
      }
      toast.success("User deleted.");
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
        <DropdownMenuItem onClick={toggleAdmin}>
          {role === "ADMIN" ? "Demote to user" : "Promote to admin"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={deleteUser}
          className="text-destructive focus:text-destructive"
        >
          Delete user
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
