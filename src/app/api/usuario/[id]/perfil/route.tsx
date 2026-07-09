import { NextResponse } from "next/server";
import DAOPerfiles from "@/models/DAO/DAOPerfiles";
import { getSessionUser } from "@/infrastructure/auth/session";
import { handleRouteError } from "@/infrastructure/http/handleRouteError";
import { jsonNoStore } from "@/infrastructure/http/jsonNoStore";

export async function GET(req: Request, { params }: { params: { id: number } }): Promise<NextResponse> {
  try {
    const viewer = await getSessionUser();
    const perfil = await DAOPerfiles.getPerfilByUsuarioId(Number(params.id), viewer);

    return jsonNoStore({ result: perfil }, { status: 200 });
  } catch (error) {
    return handleRouteError(error);
  }
}
