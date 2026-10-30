 import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const tokenName = process.env.NEXT_PUBLIC_TOKEN_NAME || "accessToken";
  const token = request.cookies.get(tokenName)?.value;
  const { pathname } = request.nextUrl;

  const isAuthRoute =
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/register");

  const isProtectedRoute = pathname.startsWith("/dashboard");

  // If user is already authenticated and tries to visit login or register
  if (token && isAuthRoute) {
    const dashboardUrl = new URL("/dashboard/my-profile", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // If user tries to access protected dashboard routes without a token
  if (!token && isProtectedRoute) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

export default proxy;
