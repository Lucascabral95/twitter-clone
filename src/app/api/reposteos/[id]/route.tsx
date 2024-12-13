import { NextResponse } from "next/server";
import DAOReposteos from "@/models/DAO/DAOReposteos";

interface CustomError {
    error: string;
    status: number;
}

export async function GET(req: Request, { params }: { params: { id: number } }) {
    const { id } = params;
    try {
        const results = await DAOReposteos.getReposteoById(Number(id));

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
    try {
        const results = await DAOReposteos.deleteReposteoById(Number(id));

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