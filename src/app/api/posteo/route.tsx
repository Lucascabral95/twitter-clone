import { NextResponse, NextRequest } from "next/server";
import DAOPosteos, { DEFAULT_POSTEOS_LIMIT } from "@/models/DAO/DAOPosteos";
import { getSessionUser } from "@/infrastructure/auth/session";
import { handleRouteError } from "@/infrastructure/http/handleRouteError";

const MAX_POSTEOS_LIMIT = 50;

function parseLimit(raw: string | null): number {
    if (!raw) return DEFAULT_POSTEOS_LIMIT;
    const parsed = Number(raw);
    if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_POSTEOS_LIMIT;
    return Math.min(parsed, MAX_POSTEOS_LIMIT);
}

function parseCursor(raw: string | null): number | undefined {
    if (!raw) return undefined;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : undefined;
}

export async function GET(req: NextRequest) {
    try {
        const creadorId = req.nextUrl.searchParams.get("creador_id");
        const q = req.nextUrl.searchParams.get("q");
        const limit = parseLimit(req.nextUrl.searchParams.get("limit"));
        const cursor = parseCursor(req.nextUrl.searchParams.get("cursor"));

        if (q) {
            const results = await DAOPosteos.searchPosteos(q, limit);
            return NextResponse.json({ result: results }, { status: 200 });
        }

        const { rows, hasMore } = creadorId
            ? await DAOPosteos.getPosteosByCreador(Number(creadorId), limit, cursor)
            : await DAOPosteos.getAllPosteos(limit, cursor);

        const nextCursor = hasMore ? rows[rows.length - 1].posteo_id : null;

        return NextResponse.json(
            { result: rows, pagination: { limit, nextCursor, hasMore } },
            { status: 200 }
        );
    } catch (error) {
        return handleRouteError(error);
    }
}

export async function POST(req: NextRequest) {
    try {
        const user = await getSessionUser();

        if (!user) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const { titulo, contenido } = await req.json();

        if (!titulo || !contenido) {
            return NextResponse.json({ result: "Faltan datos" }, { status: 400 });
        }

        const results = await DAOPosteos.createPosteo({ titulo, contenido, creador_id: user.id });

        if (!results) {
            return NextResponse.json({ result: "Error al crear el posteo" }, { status: 400 });
        }

        return NextResponse.json({ result: results }, { status: 200 });
    } catch (error) {
        return handleRouteError(error);
    }
}