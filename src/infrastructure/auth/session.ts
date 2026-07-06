import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { randomBytes, createHash } from "crypto";

import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  ACCESS_EXPIRY,
  ACCESS_MAX_AGE,
  REFRESH_MAX_AGE,
  getSecretKey,
} from "./constants";

export interface SessionPayload {
  id: number;
  email: string;
  nombre: string;
  identificador: string;
  fecha_creacion: string;
}

const cookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge,
});

export const signSession = async (payload: SessionPayload): Promise<string> => {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_EXPIRY)
    .sign(getSecretKey());
};

export const getSessionUser = async (): Promise<SessionPayload | null> => {
  try {
    const token = cookies().get(ACCESS_COOKIE)?.value;

    if (!token) return null;

    const { payload } = await jwtVerify(token, getSecretKey());

    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
};

export const generarRefreshToken = () => {
  const token = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const expira = new Date(Date.now() + REFRESH_MAX_AGE * 1000);

  return { token, tokenHash, expira };
};

export const hashRefreshToken = (token: string): string =>
  createHash("sha256").update(token).digest("hex");

export const setAccessCookie = (token: string): void => {
  cookies().set(ACCESS_COOKIE, token, cookieOptions(ACCESS_MAX_AGE));
};

export const setRefreshCookie = (token: string): void => {
  cookies().set(REFRESH_COOKIE, token, cookieOptions(REFRESH_MAX_AGE));
};

export const clearAuthCookies = (): void => {
  cookies().delete(ACCESS_COOKIE);
  cookies().delete(REFRESH_COOKIE);
};
