import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE_NAME } from "@/lib/session";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedPath = path.startsWith("/home");
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (isProtectedPath && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home/:path*"],
};
