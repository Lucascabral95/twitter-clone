import { NextResponse, NextRequest } from "next/server";
import DAOUsuarios from "@/models/DAO/DAOUsuarios";
import { v4 as uuidv4 } from "uuid";

interface CustomError {
  error: string;
  status: number;
}

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

    return NextResponse.json({ result: user }, { status: 201 });

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
