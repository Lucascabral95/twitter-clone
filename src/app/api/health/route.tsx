import { NextResponse } from "next/server";
import { checkHealth } from "@/services/db";

// Un health check no debe pre-renderizarse ni cachearse estáticamente: siempre
// tiene que golpear la base en vivo. Sin esto, `next build` intenta generar la
// respuesta en build time (sin conexión real disponible) y falla.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const health = await checkHealth();
    return NextResponse.json({ result: health }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Database unavailable" },
      { status: 503 }
    );
  }
}
