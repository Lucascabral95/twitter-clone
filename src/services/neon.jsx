// Compat shim: la implementación real vive en `./db.ts` (Pool con reintentos,
// health check y graceful shutdown). Se mantiene este archivo para no tocar
// los ~9 sitios que importan `@/services/neon`.
export { default } from "./db";
