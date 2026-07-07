import { v2 as cloudinary } from "cloudinary";

interface CloudinaryConfig {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
}

export const POSTEOS_IMAGENES_FOLDER = "twitter-clone/posteos";
const CLOUDINARY_HOST = "res.cloudinary.com";
const VERSION_SEGMENT_REGEX = /^v\d+$/;
let configured = false;

export function getCloudinaryConfig(): CloudinaryConfig {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
        throw new Error(
            "Faltan variables de entorno de Cloudinary: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET"
        );
    }

    return { cloudName, apiKey, apiSecret };
}

export function ensureCloudinaryConfigured(): CloudinaryConfig {
    const config = getCloudinaryConfig();

    if (!configured) {
        cloudinary.config({
            cloud_name: config.cloudName,
            api_key: config.apiKey,
            api_secret: config.apiSecret,
            secure: true,
        });
        configured = true;
    }

    return config;
}

function getPublicIdFromCloudinaryUrl(imagenUrl: string, cloudName: string): string | null {
    try {
        const url = new URL(imagenUrl);

        if (url.protocol !== "https:" || url.hostname !== CLOUDINARY_HOST) return null;

        const [urlCloudName, resourceType, deliveryType, ...rest] = url.pathname
            .split("/")
            .filter(Boolean)
            .map(decodeURIComponent);

        if (urlCloudName !== cloudName || resourceType !== "image" || deliveryType !== "upload") {
            return null;
        }

        if (rest.length < 2 || !VERSION_SEGMENT_REGEX.test(rest[0])) return null;

        return rest
            .slice(1)
            .join("/")
            .replace(/\.[^/.]+$/, "");
    } catch {
        return null;
    }
}

// El cliente sube directo a Cloudinary y luego envia la URL al crear el posteo.
// Validamos cloud, ruta, public_id y scope de usuario para no persistir URLs arbitrarias.
export function esImagenCloudinaryValida(
    imagenUrl: string,
    imagenPublicId: string,
    userId: number
): boolean {
    const prefijoEsperado = `${POSTEOS_IMAGENES_FOLDER}/${userId}/`;
    const { cloudName } = getCloudinaryConfig();
    const publicIdDesdeUrl = getPublicIdFromCloudinaryUrl(imagenUrl, cloudName);

    return Boolean(
        publicIdDesdeUrl &&
        imagenPublicId.startsWith(prefijoEsperado) &&
        publicIdDesdeUrl === imagenPublicId
    );
}

export default cloudinary;
