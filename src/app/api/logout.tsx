import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const cookieStore = cookies();
        cookieStore.delete("myToken");
        
        return NextResponse.json({ result: "Sesion cerrada" }, { status: 200 });
    } catch {
        return NextResponse.json({ result: "Error al cerrar sesion" }, { status: 500 });
    }
}