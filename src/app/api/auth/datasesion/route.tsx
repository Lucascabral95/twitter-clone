import { getSessionUser } from "@/infrastructure/auth/session";
import { jsonNoStore } from "@/infrastructure/http/jsonNoStore";

export async function GET() {
  const user = await getSessionUser();

  if (!user) {
    return jsonNoStore({ result: "No hay sesion" }, { status: 401 });
  }

  return jsonNoStore({ result: user }, { status: 200 });
}
