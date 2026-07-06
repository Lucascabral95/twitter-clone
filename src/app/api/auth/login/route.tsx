import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

import DAOUsuarios from '@/models/DAO/DAOUsuarios';
import { CustomError } from '@/infrastructure/interfaces';
import { signSession, SESSION_COOKIE, MAX_AGE, SessionPayload } from '@/infrastructure/auth/session';

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

    const token = await signSession(payload);

    cookies().set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: MAX_AGE,
    });

    return NextResponse.json({ result: 'Acceso permitido' }, { status: 200 });
  } catch (error) {
    const customError = error as CustomError;

    if (customError?.error && customError?.status) {
      return NextResponse.json({ error: customError.error }, { status: customError.status });
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
