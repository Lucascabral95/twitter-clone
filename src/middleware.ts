import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

import { ACCESS_COOKIE, getSecretKey } from "@/infrastructure/auth/constants";

const PUBLIC_API_PATHS = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/logout",
  "/api/auth/refresh",
  "/api/health",
];

export async function middleware(request: Request) {
  const { pathname } = new URL(request.url);
  const isApiRoute = pathname.startsWith("/api");

  if (isApiRoute && PUBLIC_API_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const unauthorized = () =>
    isApiRoute
      ? NextResponse.json({ error: "No autorizado" }, { status: 401 })
      : NextResponse.redirect(new URL("/", request.url));

  const cookieStore = cookies();
  const cookie = cookieStore.get(ACCESS_COOKIE);

  if (!cookie) return unauthorized();

  try {
    await jwtVerify(cookie.value, getSecretKey());

    return NextResponse.next();
  } catch {
    return unauthorized();
  }
}

export const config = {
  matcher: ["/home/:path*", "/feed", "/api/:path*"],
};
