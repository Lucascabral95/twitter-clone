import { NextResponse } from "next/server";
import DAOUsuarios from "@/models/DAO/DAOUsuarios";

interface CustomError {
    error: string;
    status: number;
}

export async function GET(req: Request, { params }: { params: { id: number } }) {
    const { id } = params;
    try {
        const data = await DAOUsuarios.getUserByIdentificador(id);

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