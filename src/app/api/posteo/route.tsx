import { NextResponse, NextRequest } from "next/server";
import DAOPosteos from "@/models/DAO/DAOPosteos";
import { getSessionUser } from "@/infrastructure/auth/session";
import { handleRouteError } from "@/infrastructure/http/handleRouteError";

export async function GET(req: NextRequest) {
    try {
        const creadorId = req.nextUrl.searchParams.get("creador_id");
        const q = req.nextUrl.searchParams.get("q");

        const results = q
            ? await DAOPosteos.searchPosteos(q)
            : creadorId
                ? await DAOPosteos.getPosteosByCreador(Number(creadorId))
                : await DAOPosteos.getAllPosteos();

        if (!results) {
            return NextResponse.json({ result: "Error al obtener los posteos" }, { status: 400 });
        }

        return NextResponse.json({ result: results }, { status: 200 });
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