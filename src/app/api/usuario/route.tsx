import { NextResponse } from "next/server";
import DAOUsuarios from "@/models/DAO/DAOUsuarios";

interface CustomError {
    error: string;
    status: number;
}

export async function GET() {
    try {
        const results = await DAOUsuarios.getAllUsers();

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