import { NextResponse } from "next/server";
import DAOPosteos from "@/models/DAO/DAOPosteos";

interface CustomError {
    error: string;
    status: number;
}

export async function GET(req: Request, { params }: { params: { id: number } }) {
    try {
        const { id } = params;
        const data = await DAOPosteos.obtenerPosteoPorID(id);

        return NextResponse.json({ result: data }, { status: 200 });
    } catch (error) {
        const customError = error as CustomError;

        if (customError && customError.error && customError.status) {
            return NextResponse.json({ error: customError.error }, { status: customError.status });
        } else {
            return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        }
    }
}