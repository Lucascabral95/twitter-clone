import { NextResponse } from "next/server";
import DAOSeguimientos from "@/models/DAO/DAOSeguimientos";
import { handleRouteError } from "@/infrastructure/http/handleRouteError";

export async function GET(req: Request, { params }: { params: { id: number } }) {
    const { id } = params;
    try {
        const results = await DAOSeguimientos.getSeguimientosSeguidoresById(Number(id));

        return NextResponse.json({ result: results }, { status: 200 });
    } catch (error) {
        return handleRouteError(error);
    }
};