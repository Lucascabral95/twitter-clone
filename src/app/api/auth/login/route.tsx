import { NextResponse, NextRequest } from 'next/server';

import DAOUsuarios from '@/models/DAO/DAOUsuarios';
import DAORefreshTokens from '@/models/DAO/DAORefreshTokens';
import { CustomError } from '@/infrastructure/interfaces';
import { handleRouteError } from '@/infrastructure/http/handleRouteError';
import {
  signSession,
  generarRefreshToken,
  setAccessCookie,
  setRefreshCookie,
  SessionPayload,
} from '@/infrastructure/auth/session';

const validateLoginInput = (email: string, password: string) => {
  if (!email || !password) {
    throw { error: 'Faltan datos', status: 400 } as CustomError;
  }
};

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    validateLoginInput(email, password);

    const acceso = await DAOUsuarios.loginUser({
      email: email.toLowerCase(),
      password: password,
    });

    const usuario = acceso.usuario;
    const payload: SessionPayload = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      identificador: usuario.identificador,
      fecha_creacion: usuario.fecha_creacion,
    };

    const accessToken = await signSession(payload);
    const { token: refreshToken, tokenHash, expira } = generarRefreshToken();

    await DAORefreshTokens.crear(usuario.id, tokenHash, expira);

    setAccessCookie(accessToken);
    setRefreshCookie(refreshToken);

    return NextResponse.json({ result: 'Acceso permitido' }, { status: 200 });
  } catch (error) {
    return handleRouteError(error);
  }
}
