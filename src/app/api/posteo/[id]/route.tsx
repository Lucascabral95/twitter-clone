import { NextResponse, NextRequest } from "next/server";
import DAOPosteos from "@/models/DAO/DAOPosteos";
import { handleRouteError } from "@/infrastructure/http/handleRouteError";

export async function GET(req: NextRequest, { params }: { params: { id: number } }) {
    try {
        const { id } = params;

        const data = await DAOPosteos.getPosteosById(id);

        return NextResponse.json({ result: data }, { status: 200 });
    } catch (error) {
        return handleRouteError(error);
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
        return handleRouteError(error);
    }
}