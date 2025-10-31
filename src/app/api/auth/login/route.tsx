import { NextResponse, NextRequest } from "next/server";
import DAOUsuarios from "@/models/DAO/DAOUsuarios";
import { sign } from "jsonwebtoken";
import { cookies } from "next/headers";
import { serialize } from "cookie";

interface CustomError {
  error: string;
  status: number;
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const cookieStore = cookies();

    if (!email || !password) {
      return NextResponse.json({ result: "Faltan datos" }, { status: 400 });
    }

    const acceso = await DAOUsuarios.loginUser({
      email: email.toLowerCase(),
      password: password
    });

    const token = sign(
      {
        id: acceso.usuario.id,
        nombre: acceso.usuario.nombre,
        email: acceso.usuario.email,
        identificador: acceso.usuario.identificador,
        fecha_creacion: acceso.usuario.fecha_creacion,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1y"
      }
    );

    const serializacion = serialize("myToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });

    cookieStore.set("myToken", serializacion);

    return NextResponse.json({ result: `Acceso permitido` }, { status: 200 });
  } catch (error) {
    const customError = error as CustomError;

    if (customError && customError.error && customError.status) {
      return NextResponse.json({ error: customError.error }, { status: customError.status });
    } else {
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
}

export async function GET() {
  try {
    const cook = cookies().getAll();

    return NextResponse.json({ result: cook }, { status: 401 });
  } catch {
    return NextResponse.json({ result: "Error" }, { status: 500 });
  }
}
