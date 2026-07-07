import type { ImageLoaderProps } from "next/image";

// Loader custom para las imágenes de posteos: en vez de que Next re-optimice un
// asset que Cloudinary ya sirve por CDN, insertamos las transformaciones de
// Cloudinary (f_auto,q_auto,w_<width>) directo en la URL.
export function cloudinaryLoader({ src, width, quality }: ImageLoaderProps): string {
    if (!src.includes("res.cloudinary.com")) return src;

    const params = [`f_auto`, `q_${quality ?? "auto"}`, `w_${width}`].join(",");
    return src.replace("/upload/", `/upload/${params}/`);
}

export default cloudinaryLoader;
