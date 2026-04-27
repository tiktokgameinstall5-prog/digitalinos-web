"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Download,
  ShieldCheck,
  Users,
  KeyRound,
  ScrollText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/marketing/logo";

const userLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/download", label: "Download", icon: Download },
  { href: "/settings", label: "Settings", icon: Settings },
];

const adminLinks = [
  { href: "/admin", label: "Admin overview", icon: ShieldCheck },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/licenses", label: "Licenses", icon: KeyRound },
  { href: "/admin/logs", label: "Logs", icon: ScrollText },
];

export function Sidebar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  return (
    <aside className="hidden w-60 shrink-0 border-r border-border/60 bg-background md:flex md:flex-col">
      <div className="flex h-14 items-center border-b border-border/60 px-5">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3 text-sm">
        <SidebarGroup label="Account">
          {userLinks.map((l) => (
            <SidebarLink key={l.href} {...l} active={isActive(pathname, l.href)} />
          ))}
        </SidebarGroup>

        {isAdmin ? (
          <SidebarGroup label="Admin">
            {adminLinks.map((l) => (
              <SidebarLink
                key={l.href}
                {...l}
                active={isActive(pathname, l.href)}
              />
            ))}
          </SidebarGroup>
        ) : null}
      </nav>
    </aside>
  );
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard" || href === "/admin") return pathname === href;
  return pathname.startsWith(href);
}

function SidebarGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <p className="mb-1 px-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function SidebarLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
        active
          ? "bg-muted font-medium text-foreground"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      )}
    >
      <Icon className="size-4" />
      <span>{label}</span>
    </Link>
  );
}
