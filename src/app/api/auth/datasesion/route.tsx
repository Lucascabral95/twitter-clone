import { NextResponse } from "next/server";
import { getSessionUser } from "@/infrastructure/auth/session";

export async function GET() {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ result: "No hay sesion" }, { status: 401 });
  }

  return NextResponse.json({ result: user }, { status: 200 });
}
