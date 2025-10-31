import { NextResponse, NextRequest } from 'next/server';
import { sign } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { serialize } from 'cookie';

import DAOUsuarios from '@/models/DAO/DAOUsuarios'; 
import { CustomError } from '@/infrastructure/interfaces';

const JWT_SECRET = process.env.JWT_SECRET as string;
const NODE_ENV = process.env.NODE_ENV;
const TOKEN_EXPIRY = '1y';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const validateLoginInput = (email: string, password: string) => {
  if (!email || !password) {
    throw { error: 'Faltan datos', status: 400 } as CustomError;
  }
};

const generateToken = (usuario: any) => {
  return sign(
    {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      identificador: usuario.identificador,
      fecha_creacion: usuario.fecha_creacion,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
};

const createCookie = (token: string) => {
  return serialize('myToken', token, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  });
};

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    
    validateLoginInput(email, password);

    const acceso = await DAOUsuarios.loginUser({
      email: email.toLowerCase(),
      password: password,
    });

    const token = generateToken(acceso.usuario);
    const serializacion = createCookie(token);
    const cookieStore = cookies();
    cookieStore.set('myToken', serializacion);

    return NextResponse.json({ result: 'Acceso permitido' }, { status: 200 });
  } catch (error) {
    const customError = error as CustomError;

    if (customError?.error && customError?.status) {
      return NextResponse.json({ error: customError.error }, { status: customError.status });
    }
    
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cook = cookies().getAll();
    return NextResponse.json({ result: cook }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

