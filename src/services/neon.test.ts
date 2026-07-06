// La implementación real (Pool, reintentos, health check) vive en `./db.ts` y se
// prueba en `db.test.ts`. Este archivo solo verifica que el shim de compatibilidad
// siga reexportando el mismo `db` que usan los ~9 DAO que importan `@/services/neon`.
import dbFromNeonShim from "@/services/neon";
import dbFromDb from "@/services/db";

describe("neon.jsx (compat shim)", () => {
  it("reexporta el mismo default export que ./db", () => {
    expect(dbFromNeonShim).toBe(dbFromDb);
  });
});
