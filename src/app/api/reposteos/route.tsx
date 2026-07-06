import { NextResponse } from "next/server";
import DAOReposteos from "@/models/DAO/DAOReposteos";
import { handleRouteError } from "@/infrastructure/http/handleRouteError";

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
            return NextResponse.json({ result: results }, { status: 200 });
        } else {
            return NextResponse.json({ result: "Error al crear el reposteo" }, { status: 400 });
        }
    } catch (error) {
        return handleRouteError(error);
    }
}