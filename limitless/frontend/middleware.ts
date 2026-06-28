import { NextResponse, type NextRequest } from "next/server";

const PROTECTED = ["/dashboard", "/messages", "/ask"];
const AUTH_COOKIE = "__session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  const isLoginPage = pathname.startsWith("/login");

  const sessionCookie = request.cookies.get(AUTH_COOKIE)?.value;

  if (isProtected && !sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/messages/:path*", "/ask/:path*", "/login"],
};
