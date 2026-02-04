import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest, response: NextResponse) {
  // attempt to read cookies
  const userCookie = request.cookies.get("user") || null;
  const token = request.cookies.get("token") || null;
  const user = userCookie ? JSON.parse(userCookie.value) : null;

  if (!token || !user) {
    return NextResponse.redirect(
      new URL("/sign-in", request.url)
    );
  }

  const role = user?.role;
  const path = request.nextUrl.pathname;

  if (
    (role === "student" && path.startsWith("/recruiter")) ||
    (role === "recruiter" && path.startsWith("/student"))
  ) {
    return NextResponse.redirect(
      new URL("/access-denied", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/student/:path*", "/recruiter/:path*"],
};
