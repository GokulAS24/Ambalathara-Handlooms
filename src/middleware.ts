import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

// Server Actions POST to the same /admin/* URL as the page they're called
// from. They're already gated individually via requireAdmin() in each
// action. Routing them through NextAuth's auth()-wrapped middleware (even
// when the callback itself no-ops) still triggers its own session-cookie
// handling and corrupts the action's response, so we bypass NextAuth
// entirely for non-GET requests instead of just no-oping inside it.
export default async function middleware(req: NextRequest) {
  if (req.method !== "GET") return NextResponse.next();

  const session = await auth();
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = req.nextUrl.pathname === "/admin/login";

  if (isAdminRoute && !isLoginRoute && !session) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
