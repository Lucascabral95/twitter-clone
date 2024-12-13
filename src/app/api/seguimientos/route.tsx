import { NextResponse } from "next/server";
import DAOSeguimientos from "@/models/DAO/DAOSeguimientos";

interface CustomError {
    error: string;
    status: number;
}

export async function GET() {
    try {
        const seguimientos = await DAOSeguimientos.getSeguimientosFull();
        
        return NextResponse.json({ result: seguimientos }, { status: 200 });
    } catch (error) {
        const customError = error as CustomError;

        if (customError && customError.error && customError.status) {
            return NextResponse.json({ error: customError.error }, { status: customError.status });
        } else {
            return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        }
    }
}