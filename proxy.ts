import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedPath = path.startsWith("/home");
  const session = request.cookies.get(
    process.env.SESSION_COOKIE_NAME as string,
  )?.value;

  if (isProtectedPath && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home/:path*"],
};
