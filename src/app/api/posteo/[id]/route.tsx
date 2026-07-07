import { NextResponse, NextRequest } from "next/server";
import DAOPosteos from "@/models/DAO/DAOPosteos";
import DAONotificaciones from "@/models/DAO/DAONotificaciones";
import { getSessionUser } from "@/infrastructure/auth/session";
import { handleRouteError } from "@/infrastructure/http/handleRouteError";
import { logger } from "@/infrastructure/logger";
import cloudinary, { ensureCloudinaryConfigured } from "@/services/cloudinary";

export async function GET(req: NextRequest, { params }: { params: { id: number } }) {
    try {
        const { id } = params;

        const data = await DAOPosteos.getPosteosById(id);

        return NextResponse.json({ result: data }, { status: 200 });
    } catch (error) {
        return handleRouteError(error);
    }
}

export async function PUT(req: Request, { params }: { params: { id: number } }) {
    const { id } = params;

    try {
        const user = await getSessionUser();
        if (!user) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        if(!id) {
            throw { error: "Error al dar like al posteo", status: 400 };
        }

        const data = await DAOPosteos.toggleLike(user.id, Number(id));

        if (data.liked && data.creador_id) {
            // Best-effort: si falla la notificación no debe romper la respuesta del like.
            DAONotificaciones.crear(data.creador_id, "like", user.id, Number(id)).catch((err) =>
                logger.error("Error al crear notificación de like", err)
            );
        }

        return NextResponse.json({ result: data }, { status: 200 });
    } catch (error) {
        return handleRouteError(error);
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: number } }) {
    try {
        const user = await getSessionUser();
        if (!user) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const { id } = params;
        const posteo = await DAOPosteos.getPosteosById(id);

        if (posteo.creador_id !== user.id) {
            return NextResponse.json({ error: "No podés editar el posteo de otro usuario" }, { status: 403 });
        }

        const { titulo, contenido } = await req.json();

        if (!titulo && !contenido) {
            return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
        }

        const results = await DAOPosteos.updatePosteo(Number(id), { titulo, contenido });

        return NextResponse.json({ result: results }, { status: 200 });
    } catch (error) {
        return handleRouteError(error);
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: number } }) {
    try {
        const user = await getSessionUser();
        if (!user) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const { id } = params;
        const posteo = await DAOPosteos.getPosteosById(id);

        if (posteo.creador_id !== user.id) {
            return NextResponse.json({ error: "No podés borrar el posteo de otro usuario" }, { status: 403 });
        }

        const results = await DAOPosteos.deletePosteoByID(Number(id));

        if (results.imagen_public_id) {
            // Best-effort: si Cloudinary falla en borrar el asset, no debe romper la
            // respuesta de borrado del posteo (ya fue borrado en la DB).
            ensureCloudinaryConfigured();
            cloudinary.uploader.destroy(results.imagen_public_id).catch((err) =>
                logger.error("Error al borrar imagen de Cloudinary", err)
            );
        }

        return NextResponse.json({ result: results }, { status: 200 });
    } catch (error) {
        return handleRouteError(error);
    }
}

