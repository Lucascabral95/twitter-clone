import { NextResponse } from "next/server";
import DAOComentarios from "@/models/DAO/DAOComentarios";
import DAOPosteos from "@/models/DAO/DAOPosteos";
import DAONotificaciones from "@/models/DAO/DAONotificaciones";
import { handleRouteError } from "@/infrastructure/http/handleRouteError";
import { logger } from "@/infrastructure/logger";

export async function GET(req: Request, { params }: { params: { id: number } }) {
    const { id } = params;
    try {
        const results = await DAOComentarios.getAllCommetsByIdPost(Number(id));
        return NextResponse.json({ result: results }, { status: 200 });
    } catch (error) {
        return handleRouteError(error);
    }
}

export async function POST(req: Request) {
    try {
        const { emisor_id, id_del_posteo, contenido, parent_id } = await req.json();

        if (!emisor_id || !id_del_posteo || !contenido) {
            return NextResponse.json({ result: "Faltan datos" }, { status: 400 });
        }

        const results = await DAOComentarios.createComment({
            emisor_id: emisor_id,
            id_del_posteo: id_del_posteo,
            contenido: contenido,
            parent_id: parent_id ?? null
        });

        // Best-effort: si falla la notificación no debe romper la creación del comentario.
        DAOPosteos.getPosteosById(Number(id_del_posteo))
            .then((posteo) => DAONotificaciones.crear(posteo.creador_id, "comment", Number(emisor_id), Number(id_del_posteo)))
            .catch((err) => logger.error("Error al crear notificación de comentario", err));

        return NextResponse.json({ result: results }, { status: 200 });
    } catch (error) {
        return handleRouteError(error);
    }
}

export async function PUT(req: Request, { params }: { params: { id: number } }) {
    const { id } = params;

    try {
        if (!id) {
            return NextResponse.json({ result: "Faltan datos" }, { status: 400 });
        }

        const results = await DAOComentarios.addLikeComment(id);
        return NextResponse.json({ result: results }, { status: 200 });
    } catch (error) {
        return handleRouteError(error);
    }
}