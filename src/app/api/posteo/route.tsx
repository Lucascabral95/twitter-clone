import { NextResponse, NextRequest } from "next/server";
import DAOPosteos from "@/models/DAO/DAOPosteos";

interface CustomError {
    error: string;
    status: number;
}

export async function GET() {
    try {
        const results = await DAOPosteos.getAllPosteos();

        if (!results) {
            return NextResponse.json({ result: "Error al obtener los posteos" }, { status: 400 });
        }

        return NextResponse.json({ result: results }, { status: 200 });
    } catch (error) {
        const customError = error as CustomError;

        if (customError && customError.error && customError.status) {
            return NextResponse.json({ error: customError.error }, { status: customError.status });
        } else {
            return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        }
    }
}

export async function POST(req: NextRequest) {
    try {
        const { titulo, contenido, creador_id } = await req.json();

        if (!titulo || !contenido || !creador_id) {
            return NextResponse.json({ result: "Faltan datos" }, { status: 400 });
        }

        const results = await DAOPosteos.createPosteo({ titulo, contenido, creador_id });

        if (!results) {
            return NextResponse.json({ result: "Error al crear el posteo" }, { status: 400 });
        }

        return NextResponse.json({ result: results }, { status: 200 });
    } catch (error) {
        const customError = error as CustomError;

        if (customError && customError.error && customError.status) {
            return NextResponse.json({ error: customError.error }, { status: customError.status });
        } else {
            return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        }
    }
}