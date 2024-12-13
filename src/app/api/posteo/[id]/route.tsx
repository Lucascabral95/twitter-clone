import { NextResponse, NextRequest } from "next/server";
import DAOPosteos from "@/models/DAO/DAOPosteos";

interface CustomError {
    error: string;
    status: number;
}

export async function GET(req: NextRequest, { params }: { params: { id: number } }) {
    try {
        const { id } = params;

        const data = await DAOPosteos.getPosteosById(id);

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

export async function PUT(req: Request, { params }: { params: { id: number } }) {
    const { id } = params;

    try {
        if(!id) {
            throw { error: "Error al dar like al posteo", status: 400 };
        }
        const data = await DAOPosteos.addLikePosteo(id);
        
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