import { NextResponse } from "next/server";
import DAOComentarios from "@/models/DAO/DAOComentarios";

interface CustomError {
    error: string;
    status: number;
}

export async function GET(req: Request, { params }: { params: { id: number } }) {
    const { id } = params;
    try {
        const results = await DAOComentarios.getAllCommetsByIdPost(Number(id));
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

export async function POST(req: Request) {
    try {
        const { emisor_id, id_del_posteo, contenido } = await req.json();

        if (!emisor_id || !id_del_posteo || !contenido) {
            return NextResponse.json({ result: "Faltan datos" }, { status: 400 });
        }

        const results = await DAOComentarios.createComment({
            emisor_id: emisor_id,
            id_del_posteo: id_del_posteo,
            contenido: contenido
        });

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

export async function PUT(req: Request, { params }: { params: { id: number } }) {
    const { id } = params;

    try {
        if (!id) {
            return NextResponse.json({ result: "Faltan datos" }, { status: 400 });
        }

        const results = await DAOComentarios.addLikeComment(id);
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