import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import DAOUsuarios from "@/models/DAO/DAOUsuarios";
import DAORefreshTokens from "@/models/DAO/DAORefreshTokens";
import {
  signSession,
  generarRefreshToken,
  hashRefreshToken,
  setAccessCookie,
  setRefreshCookie,
  clearAuthCookies,
  SessionPayload,
} from "@/infrastructure/auth/session";
import { REFRESH_COOKIE } from "@/infrastructure/auth/constants";

export async function POST() {
  try {
    const refreshToken = cookies().get(REFRESH_COOKIE)?.value;

    if (!refreshToken) {
      clearAuthCookies();
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const tokenHash = hashRefreshToken(refreshToken);
    const stored = await DAORefreshTokens.buscarPorHash(tokenHash);

    if (!stored || stored.revocado || new Date(stored.expira) < new Date()) {
      clearAuthCookies();
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const usuario = await DAOUsuarios.getUserByIdentificador(stored.user_id);

    const payload: SessionPayload = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      identificador: usuario.identificador,
      fecha_creacion: usuario.fecha_creacion,
    };

    await DAORefreshTokens.revocar(stored.id);

    const accessToken = await signSession(payload);
    const nuevo = generarRefreshToken();
    await DAORefreshTokens.crear(usuario.id, nuevo.tokenHash, nuevo.expira);

    setAccessCookie(accessToken);
    setRefreshCookie(nuevo.token);

    return NextResponse.json({ result: "Sesion renovada" }, { status: 200 });
  } catch {
    clearAuthCookies();
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
}
