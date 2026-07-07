/** @type {import('next').NextConfig} */
const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME || "**";

const nextConfig = {
  // `ws` (usado por el Pool de @neondatabase/serverless) rompe su optimizacion
  // nativa bufferutil si webpack lo bundlea para las Route Handlers: el require
  // opcional se resuelve a un stub sin `.mask()` en vez de fallar limpiamente,
  // y explota recien al enviar el primer frame real. Se lo excluye del bundle
  // para que use el `require` nativo de Node en runtime.
  experimental: {
    serverComponentsExternalPackages: ["@neondatabase/serverless", "ws"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: `/${cloudinaryCloudName}/image/upload/**` },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },
};

export default nextConfig;
