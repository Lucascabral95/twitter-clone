import { NextResponse } from "next/server";
import DAOReposteos from "@/models/DAO/DAOReposteos";
import { handleRouteError } from "@/infrastructure/http/handleRouteError";

export async function GET(req: Request, { params }: { params: { id: number } }) {
    const { id } = params;
    try {
        const results = await DAOReposteos.getReposteoById(Number(id));

        return NextResponse.json({ result: results }, { status: 200 });
    } catch (error) {
        return handleRouteError(error);
    }
}

export async function DELETE(req: Request, { params }: { params: { id: number } }) {
    const { id } = params;
    try {
        const results = await DAOReposteos.deleteReposteoById(Number(id));

        return NextResponse.json({ result: results }, { status: 200 });
    } catch (error) {
        return handleRouteError(error);
    }
}