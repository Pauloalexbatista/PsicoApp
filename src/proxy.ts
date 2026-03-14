import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth";

const authRoutes = ["/login"];

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

  const cookie = request.cookies.get("session")?.value;
  const session = cookie ? await decrypt(cookie).catch(() => null) : null;

  // Redirect unauthenticated users to login for all non-auth routes
  if (!isAuthRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  // Redirect authenticated users away from the login page
  if (isAuthRoute && session) {
    if (session.user.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.nextUrl));
    } else {
      return NextResponse.redirect(new URL("/", request.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
