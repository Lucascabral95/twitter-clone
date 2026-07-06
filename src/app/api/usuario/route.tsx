import { NextResponse, NextRequest } from "next/server";
import DAOUsuarios from "@/models/DAO/DAOUsuarios";
import { handleRouteError } from "@/infrastructure/http/handleRouteError";

export async function GET(req: NextRequest) {
    try {
        const q = req.nextUrl.searchParams.get("q");
        const results = q ? await DAOUsuarios.searchUsuarios(q) : await DAOUsuarios.getAllUsers();

        return NextResponse.json({ result: results }, { status: 200 });
    } catch (error) {
        return handleRouteError(error);
    }
}