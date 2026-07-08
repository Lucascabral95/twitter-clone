import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

import { ACCESS_COOKIE, REFRESH_COOKIE, getSecretKey } from "@/infrastructure/auth/constants";

const PUBLIC_API_PATHS = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/logout",
  "/api/auth/refresh",
  "/api/health",
];

const tryRefreshSession = async (request: NextRequest): Promise<NextResponse | null> => {
  try {
    const refreshRes = await fetch(new URL("/api/auth/refresh", request.url), {
      method: "POST",
      headers: { cookie: request.headers.get("cookie") ?? "" },
      cache: "no-store",
    });

    if (!refreshRes.ok) return null;

    const response = NextResponse.next();
    const setCookieHeaders = refreshRes.headers.getSetCookie?.() ?? [];

    setCookieHeaders.forEach((cookie) => response.headers.append("set-cookie", cookie));

    return response;
  } catch {
    return null;
  }
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApiRoute = pathname.startsWith("/api");

  if (isApiRoute && PUBLIC_API_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const unauthorized = () =>
    isApiRoute
      ? NextResponse.json({ error: "No autorizado" }, { status: 401 })
      : NextResponse.redirect(new URL("/", request.url));

  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;

  if (accessToken) {
    try {
      await jwtVerify(accessToken, getSecretKey());
      return NextResponse.next();
    } catch {
      // Access token expirado/invalido: si es una navegación de página y hay refresh token,
      // intentamos renovar la sesión de forma transparente antes de rechazar.
    }
  }

  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;

  if (!isApiRoute && refreshToken) {
    const refreshed = await tryRefreshSession(request);
    if (refreshed) return refreshed;
  }

  return unauthorized();
}

export const config = {
  matcher: ["/home/:path*", "/feed", "/api/:path*"],
};
