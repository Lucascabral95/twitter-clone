import { NextResponse, NextRequest } from "next/server";
import DAONotificaciones, { DEFAULT_NOTIFICACIONES_LIMIT } from "@/models/DAO/DAONotificaciones";
import { getSessionUser } from "@/infrastructure/auth/session";
import { handleRouteError } from "@/infrastructure/http/handleRouteError";
import { jsonNoStore } from "@/infrastructure/http/jsonNoStore";

const MAX_NOTIFICACIONES_LIMIT = 50;

function parseLimit(raw: string | null): number {
    if (!raw) return DEFAULT_NOTIFICACIONES_LIMIT;
    const parsed = Number(raw);
    if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_NOTIFICACIONES_LIMIT;
    return Math.min(parsed, MAX_NOTIFICACIONES_LIMIT);
}

function parseCursor(raw: string | null): number | undefined {
    if (!raw) return undefined;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : undefined;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const user = await getSessionUser();
        if (!user) {
            return jsonNoStore({ error: "No autorizado" }, { status: 401 });
        }

        const limit = parseLimit(req.nextUrl.searchParams.get("limit"));
        const cursor = parseCursor(req.nextUrl.searchParams.get("cursor"));

        const { rows, hasMore } = await DAONotificaciones.getByUsuario(user.id, limit, cursor);
        const nextCursor = hasMore ? rows[rows.length - 1].id : null;

        return jsonNoStore(
            { result: rows, pagination: { limit, nextCursor, hasMore } },
            { status: 200 }
        );
    } catch (error) {
        return handleRouteError(error);
    }
}
