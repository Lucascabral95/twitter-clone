const mockQuery = jest.fn();
const mockOn = jest.fn();
const mockEnd = jest.fn();

jest.mock("@neondatabase/serverless", () => {
  const PoolMock = jest.fn().mockImplementation(() => ({
    query: mockQuery,
    on: mockOn,
    end: mockEnd,
    totalCount: 1,
    idleCount: 1,
    waitingCount: 0,
  }));

  return {
    Pool: PoolMock,
    neonConfig: {},
  };
});

jest.mock("ws", () => ({}));

describe("db (pool)", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    delete (globalThis as { __neonPool?: unknown }).__neonPool;
    delete (globalThis as { __neonShutdownRegistered?: unknown }).__neonShutdownRegistered;
    mockQuery.mockReset();
    process.env.DATABASE_URL = "postgresql://test";
  });

  it("crea el Pool (de forma perezosa, en el primer query) con los defaults esperados", async () => {
    mockQuery.mockResolvedValue({ rows: [] });
    const { Pool } = await import("@neondatabase/serverless");
    const { checkHealth } = await import("@/services/db");

    expect(Pool).not.toHaveBeenCalled();

    await checkHealth();

    expect(Pool).toHaveBeenCalledWith(
      expect.objectContaining({
        connectionString: "postgresql://test",
        max: 10,
        idleTimeoutMillis: 30_000,
        connectionTimeoutMillis: 5_000,
        maxUses: 7_500,
      })
    );
  });

  it("respeta overrides por variables de entorno", async () => {
    mockQuery.mockResolvedValue({ rows: [] });
    process.env.DB_POOL_MAX = "25";

    const { Pool } = await import("@neondatabase/serverless");
    const { checkHealth } = await import("@/services/db");
    await checkHealth();

    expect(Pool).toHaveBeenCalledWith(expect.objectContaining({ max: 25 }));

    delete process.env.DB_POOL_MAX;
  });

  it("db() devuelve una tagged-template que ejecuta la query parametrizada y retorna las filas", async () => {
    mockQuery.mockResolvedValue({ rows: [{ id: 1 }] });

    const db = (await import("@/services/db")).default;
    const sql = await db();
    const rows = await sql`select * from usuarios where id = ${5}`;

    expect(mockQuery).toHaveBeenCalledWith("select * from usuarios where id = $1", [5]);
    expect(rows).toEqual([{ id: 1 }]);
  });

  it("reintenta ante un error transitorio de conexión y luego funciona", async () => {
    process.env.DB_RETRY_BASE_MS = "1";
    process.env.DB_RETRY_MAX_MS = "1";
    const transientError = Object.assign(new Error("connection failure"), { code: "08006" });
    mockQuery.mockRejectedValueOnce(transientError).mockResolvedValueOnce({ rows: [{ ok: true }] });

    const db = (await import("@/services/db")).default;
    const sql = await db();
    const rows = await sql`select 1`;

    expect(mockQuery).toHaveBeenCalledTimes(2);
    expect(rows).toEqual([{ ok: true }]);

    delete process.env.DB_RETRY_BASE_MS;
    delete process.env.DB_RETRY_MAX_MS;
  });

  it("no reintenta errores de constraint/sintaxis", async () => {
    const constraintError = Object.assign(new Error("duplicate key"), { code: "23505" });
    mockQuery.mockRejectedValue(constraintError);

    const db = (await import("@/services/db")).default;
    const sql = await db();

    await expect(sql`insert into x values (1)`).rejects.toBe(constraintError);
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });

  it("agota los reintentos configurados y propaga el último error transitorio", async () => {
    process.env.DB_RETRY_ATTEMPTS = "2";
    process.env.DB_RETRY_BASE_MS = "1";
    process.env.DB_RETRY_MAX_MS = "1";
    const transientError = new Error("ECONNRESET");
    mockQuery.mockRejectedValue(transientError);

    const db = (await import("@/services/db")).default;
    const sql = await db();

    await expect(sql`select 1`).rejects.toBe(transientError);
    expect(mockQuery).toHaveBeenCalledTimes(3); // intento inicial + 2 reintentos

    delete process.env.DB_RETRY_ATTEMPTS;
    delete process.env.DB_RETRY_BASE_MS;
    delete process.env.DB_RETRY_MAX_MS;
  });

  it("no construye el Pool con solo importar el módulo (evita abrir conexiones reales en next build)", async () => {
    const { Pool } = await import("@neondatabase/serverless");
    await import("@/services/db");

    expect(Pool).not.toHaveBeenCalled();
  });

  it("checkHealth ejecuta select 1 y devuelve las estadísticas del pool", async () => {
    mockQuery.mockResolvedValue({ rows: [] });

    const { checkHealth } = await import("@/services/db");
    const health = await checkHealth();

    expect(mockQuery).toHaveBeenCalledWith("select 1");
    expect(health).toMatchObject({ ok: true, total: 1, idle: 1, waiting: 0 });
    expect(typeof health.latencyMs).toBe("number");
  });
});
