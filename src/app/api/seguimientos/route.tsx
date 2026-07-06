import { NextResponse } from "next/server";
import DAOSeguimientos from "@/models/DAO/DAOSeguimientos";
import { handleRouteError } from "@/infrastructure/http/handleRouteError";

export async function GET() {
    try {
        const seguimientos = await DAOSeguimientos.getSeguimientosFull();

        return NextResponse.json({ result: seguimientos }, { status: 200 });
    } catch (error) {
        return handleRouteError(error);
    }
}