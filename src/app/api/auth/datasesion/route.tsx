import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";

export async function GET() {
  try {
    const result = cookies().get("myToken");

    if (!result) {
      return NextResponse.json({ result: "No hay token" }, { status: 401 });
    }

    const token = result.value.split("=")[1].split(";")[0]
    const deshasheado = verify(token, process.env.JWT_SECRET as string);

    return NextResponse.json({ result: deshasheado }, { status: 200 });
  } catch {
    return NextResponse.json({ result: "Error" }, { status: 500 });
  }
}