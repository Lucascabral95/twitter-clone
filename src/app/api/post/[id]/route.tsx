import { NextResponse } from "next/server";
import DAOPosteos from "@/models/DAO/DAOPosteos";
import { getSessionUser } from "@/infrastructure/auth/session";
import { handleRouteError } from "@/infrastructure/http/handleRouteError";

export async function GET(req: Request, { params }: { params: { id: number } }) {
    try {
        const { id } = params;
        const data = await DAOPosteos.obtenerPosteoPorID(id);

        const user = await getSessionUser();
        const yaLikeado = user && data[0]
            ? await DAOPosteos.getPosteoLikeadoPorUsuario(user.id, data[0].posteo_id)
            : false;

        const result = data.map((posteo) => ({ ...posteo, ya_likeado: yaLikeado }));

        return NextResponse.json({ result }, { status: 200 });
    } catch (error) {
        return handleRouteError(error);
    }
}