import { NextResponse } from "next/server";
import DAOReposteos from "@/models/DAO/DAOReposteos";
import DAOPosteos from "@/models/DAO/DAOPosteos";
import DAONotificaciones from "@/models/DAO/DAONotificaciones";
import { handleRouteError } from "@/infrastructure/http/handleRouteError";
import { logger } from "@/infrastructure/logger";

export async function POST(req: Request) {
    try {
        const { posteo_id, reposteador_id } = await req.json();

        if (!posteo_id || !reposteador_id) {
            return NextResponse.json({ result: "Faltan datos" }, { status: 400 });
        }

        const results = await DAOReposteos.createReposteo({
            posteo_id: posteo_id,
            reposteador_id: reposteador_id
         });

        if (results) {
            // Best-effort: si falla la notificación no debe romper la creación del reposteo.
            DAOPosteos.getPosteosById(Number(posteo_id))
                .then((posteo) => DAONotificaciones.crear(posteo.creador_id, "repost", Number(reposteador_id), Number(posteo_id)))
                .catch((err) => logger.error("Error al crear notificación de reposteo", err));

            return NextResponse.json({ result: results }, { status: 200 });
        } else {
            return NextResponse.json({ result: "Error al crear el reposteo" }, { status: 400 });
        }
    } catch (error) {
        return handleRouteError(error);
    }
}