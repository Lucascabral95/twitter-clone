import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function middleware(request: Request) {
  const cookieStore = cookies();
  const cookie = cookieStore.get("myToken");
  const cadena = cookie?.value?.split("=")[1]?.split(";")[0] as string;

  if (!cookie) return NextResponse.redirect(new URL("/", request.url));

  try {
    await jwtVerify(
      cadena,
      new TextEncoder().encode(process.env.JWT_SECRET as string)
    );

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/home/:path*", "/feed"],
};