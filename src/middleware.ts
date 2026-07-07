import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Protects /admin routes: only STAFF, ADMIN, and SUPER_ADMIN may enter.
 * Everyone else is redirected to the login page.
 */
export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const role = token?.role as string | undefined;
  const allowed = ["STAFF", "ADMIN", "SUPER_ADMIN"];

  if (!token || !role || !allowed.includes(role)) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
