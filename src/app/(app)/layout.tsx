import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Sidebar } from "@/components/app-shell/sidebar";
import { AppHeader } from "@/components/app-shell/header";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = session.user as {
    email: string;
    name?: string | null;
    role?: "USER" | "ADMIN";
  };
  const role = user.role ?? "USER";

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isAdmin={role === "ADMIN"} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader email={user.email} name={user.name} role={role} />
        <div className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </div>
      </div>
    </div>
  );
}
