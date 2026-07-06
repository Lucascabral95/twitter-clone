import { NextResponse } from "next/server";
import DAONotificaciones from "@/models/DAO/DAONotificaciones";
import { getSessionUser } from "@/infrastructure/auth/session";
import { handleRouteError } from "@/infrastructure/http/handleRouteError";

export async function PUT() {
    try {
        const user = await getSessionUser();
        if (!user) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        await DAONotificaciones.marcarTodasLeidas(user.id);

        return NextResponse.json({ result: "ok" }, { status: 200 });
    } catch (error) {
        return handleRouteError(error);
    }
}
