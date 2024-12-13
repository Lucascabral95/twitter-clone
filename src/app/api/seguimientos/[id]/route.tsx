import { NextResponse } from "next/server";
import DAOSeguimientos from "@/models/DAO/DAOSeguimientos";

interface CustomError {
    error: string;
    status: number;
}

export async function POST(req: Request, { params }: { params: { id: number } }) {
    const { id } = params;
    try {
        const { id_a_seguir } = await req.json();

        const results = await DAOSeguimientos.createSeguimiento(Number(id), Number(id_a_seguir));

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

export async function GET(req: Request, { params }: { params: { id: number } }) {
    const { id } = params;
    try {
        const results = await DAOSeguimientos.getSeguimientosById(Number(id));

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

export async function DELETE(req: Request, { params }: { params: { id: number } }) {
    const { id } = params;
    const { id_a_seguir } = await req.json();
    try {
        const results = await DAOSeguimientos.deleteSeguimientosByID(Number(id), Number(id_a_seguir));

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