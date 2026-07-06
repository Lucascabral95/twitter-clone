import { NextResponse, NextRequest } from "next/server";
import DAOUsuarios from "@/models/DAO/DAOUsuarios";

interface CustomError {
    error: string;
    status: number;
}

export async function GET(req: NextRequest) {
    try {
        const q = req.nextUrl.searchParams.get("q");
        const results = q ? await DAOUsuarios.searchUsuarios(q) : await DAOUsuarios.getAllUsers();

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