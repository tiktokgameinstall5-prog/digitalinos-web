"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function AppHeader({
  email,
  name,
  role,
}: {
  email: string;
  name?: string | null;
  role: "USER" | "ADMIN";
}) {
  const initials = (name ?? email).slice(0, 2).toUpperCase();
  return (
    <header className="flex h-14 items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur sm:px-6">
      <div className="text-sm text-muted-foreground">
        {role === "ADMIN" ? "Admin console" : "Your account"}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none">
          <Avatar className="size-8 border border-border/60">
            <AvatarFallback className="text-xs font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="text-sm font-medium">{name ?? "Account"}</div>
            <div className="text-xs text-muted-foreground">{email}</div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/settings">Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/download">Download app</Link>
          </DropdownMenuItem>
          {role === "ADMIN" ? (
            <DropdownMenuItem asChild>
              <Link href="/admin">Admin panel</Link>
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-destructive focus:text-destructive"
          >
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
