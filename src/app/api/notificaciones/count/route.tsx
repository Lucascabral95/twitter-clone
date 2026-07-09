import { NextResponse } from "next/server";
import DAONotificaciones from "@/models/DAO/DAONotificaciones";
import { getSessionUser } from "@/infrastructure/auth/session";
import { handleRouteError } from "@/infrastructure/http/handleRouteError";
import { jsonNoStore } from "@/infrastructure/http/jsonNoStore";

export async function GET(): Promise<NextResponse> {
    try {
        const user = await getSessionUser();
        if (!user) {
            return jsonNoStore({ error: "No autorizado" }, { status: 401 });
        }

        const total = await DAONotificaciones.contarNoLeidas(user.id);

        return jsonNoStore({ result: { total } }, { status: 200 });
    } catch (error) {
        return handleRouteError(error);
    }
}
