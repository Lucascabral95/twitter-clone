import { NextResponse, NextRequest } from "next/server";
import DAOUsuarios from "@/models/DAO/DAOUsuarios";
import DAORefreshTokens from "@/models/DAO/DAORefreshTokens";
import { v4 as uuidv4 } from "uuid";
import { handleRouteError } from "@/infrastructure/http/handleRouteError";
import {
  signSession,
  generarRefreshToken,
  setAccessCookie,
  setRefreshCookie,
  SessionPayload,
} from "@/infrastructure/auth/session";

export async function POST(req: NextRequest) {
  try {
    const { nombre, email, password } = await req.json();

    if (!nombre || !email || !password) {
      return NextResponse.json({ result: "Faltan datos" }, { status: 400 });
    }

    const user = await DAOUsuarios.createUser({
      name: nombre,
      email: email.toLowerCase(),
      password: password,
      identificador: uuidv4(),
    });

    const payload: SessionPayload = {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      identificador: user.identificador,
      fecha_creacion: user.fecha_creacion,
    };

    const accessToken = await signSession(payload);
    const { token: refreshToken, tokenHash, expira } = generarRefreshToken();

    await DAORefreshTokens.crear(user.id, tokenHash, expira);

    setAccessCookie(accessToken);
    setRefreshCookie(refreshToken);

    return NextResponse.json({ result: user }, { status: 201 });

  } catch (error) {
    return handleRouteError(error);
  }
}

export async function GET() {
  try {
    const data = await DAOUsuarios.getAllUsers();

    if (!data) {
      return NextResponse.json(
        { result: "Error al obtener los usuarios" },
        { status: 400 }
      );
    }

    return NextResponse.json({ result: data }, { status: 200 });
  } catch {
    return NextResponse.json({ result: "Error" }, { status: 500 });
  }
}
