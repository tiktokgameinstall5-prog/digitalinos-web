import { NextResponse } from "next/server";
import { auth } from "@/auth";

const ADMIN_PREFIXES = ["/admin"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  const needsAdmin = ADMIN_PREFIXES.some((p) => pathname.startsWith(p));
  const role = (session.user as { role?: "USER" | "ADMIN" } | undefined)?.role;
  if (needsAdmin && role !== "ADMIN") {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*", "/admin/:path*"],
};
