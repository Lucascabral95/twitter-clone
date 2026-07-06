import { NextResponse } from "next/server";
import DAOUsuarios from "@/models/DAO/DAOUsuarios";
import { handleRouteError } from "@/infrastructure/http/handleRouteError";

export async function GET(req: Request, { params }: { params: { id: number } }) {
    const { id } = params;
    try {
        const data = await DAOUsuarios.getUserByIdentificador(id);

        return NextResponse.json({ result: data }, { status: 200 });
    } catch (error) {
        return handleRouteError(error);
    }
}