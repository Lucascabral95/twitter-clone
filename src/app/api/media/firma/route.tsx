import { NextResponse } from "next/server";
import cloudinary, { ensureCloudinaryConfigured, POSTEOS_IMAGENES_FOLDER } from "@/services/cloudinary";
import { getSessionUser } from "@/infrastructure/auth/session";
import { handleRouteError } from "@/infrastructure/http/handleRouteError";

// El middleware ya protege `/api/:path*`, pero igual resolvemos el usuario aca:
// la carpeta de destino se deriva de su id, asi el cliente no puede subir fuera
// de su propio scope.
export async function GET() {
    try {
        const user = await getSessionUser();

        if (!user) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const timestamp = Math.round(Date.now() / 1000);
        const folder = `${POSTEOS_IMAGENES_FOLDER}/${user.id}`;
        const { apiKey, apiSecret, cloudName } = ensureCloudinaryConfigured();

        const signature = cloudinary.utils.api_sign_request(
            { folder, timestamp },
            apiSecret
        );

        return NextResponse.json(
            {
                result: {
                    timestamp,
                    signature,
                    folder,
                    apiKey,
                    cloudName,
                },
            },
            { status: 200, headers: { "Cache-Control": "no-store" } }
        );
    } catch (error) {
        return handleRouteError(error);
    }
}
