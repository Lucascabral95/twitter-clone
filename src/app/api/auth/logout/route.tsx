import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import DAORefreshTokens from "@/models/DAO/DAORefreshTokens";
import { clearAuthCookies, hashRefreshToken } from "@/infrastructure/auth/session";
import { REFRESH_COOKIE } from "@/infrastructure/auth/constants";

export async function GET() {
    try {
        const refreshToken = cookies().get(REFRESH_COOKIE)?.value;

        if (refreshToken) {
            const stored = await DAORefreshTokens.buscarPorHash(hashRefreshToken(refreshToken));
            if (stored) {
                await DAORefreshTokens.revocar(stored.id);
            }
        }

        clearAuthCookies();
        return NextResponse.json({ result: "Sesion cerrada" }, { status: 200 });
    } catch {
        return NextResponse.json({ result: "Error al cerrar sesion" }, { status: 500 });
    }
}