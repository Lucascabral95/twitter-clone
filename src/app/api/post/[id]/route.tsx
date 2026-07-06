import { NextResponse } from "next/server";
import DAOPosteos from "@/models/DAO/DAOPosteos";
import { handleRouteError } from "@/infrastructure/http/handleRouteError";

export async function GET(req: Request, { params }: { params: { id: number } }) {
    try {
        const { id } = params;
        const data = await DAOPosteos.obtenerPosteoPorID(id);

        return NextResponse.json({ result: data }, { status: 200 });
    } catch (error) {
        return handleRouteError(error);
    }
}