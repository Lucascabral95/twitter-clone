import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "myToken";
export const TOKEN_EXPIRY = "7d";
export const MAX_AGE = 60 * 60 * 24 * 7;

export interface SessionPayload {
  id: number;
  email: string;
  nombre: string;
  identificador: string;
  fecha_creacion: string;
}

const getSecretKey = () => new TextEncoder().encode(process.env.JWT_SECRET as string);

export const signSession = async (payload: SessionPayload): Promise<string> => {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(getSecretKey());
};

export const getSessionUser = async (): Promise<SessionPayload | null> => {
  try {
    const token = cookies().get(SESSION_COOKIE)?.value;

    if (!token) return null;

    const { payload } = await jwtVerify(token, getSecretKey());

    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
};
