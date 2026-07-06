import { NextResponse } from "next/server";
import DAOSeguimientos from "@/models/DAO/DAOSeguimientos";
import { getSessionUser } from "@/infrastructure/auth/session";
import { handleRouteError } from "@/infrastructure/http/handleRouteError";

export async function POST(req: Request) {
    try {
        const user = await getSessionUser();

        if (!user) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const { id_a_seguir } = await req.json();

        const results = await DAOSeguimientos.createSeguimiento(user.id, Number(id_a_seguir));

        return NextResponse.json({ result: results }, { status: 200 });
    } catch (error) {
        return handleRouteError(error);
    }
}

export async function GET(req: Request, { params }: { params: { id: number } }) {
    const { id } = params;
    try {
        const results = await DAOSeguimientos.getSeguimientosById(Number(id));

        return NextResponse.json({ result: results }, { status: 200 });
    } catch (error) {
        return handleRouteError(error);
    }
}

export async function DELETE(req: Request) {
    try {
        const user = await getSessionUser();

        if (!user) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const { id_a_seguir } = await req.json();

        const results = await DAOSeguimientos.deleteSeguimientosByID(user.id, Number(id_a_seguir));

        return NextResponse.json({ result: results }, { status: 200 });
    } catch (error) {
        return handleRouteError(error);
    }
}
