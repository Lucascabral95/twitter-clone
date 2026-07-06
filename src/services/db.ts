import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { logger } from "@/infrastructure/logger";

neonConfig.webSocketConstructor = ws;

type GlobalWithPool = typeof globalThis & {
    __neonPool?: Pool;
    __neonShutdownRegistered?: boolean;
};

const globalForPool = globalThis as GlobalWithPool;

function envInt(name: string, fallback: number): number {
    const raw = process.env[name];
    if (!raw) return fallback;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : fallback;
}

const POOL_MAX = envInt("DB_POOL_MAX", 10);
const IDLE_TIMEOUT_MS = envInt("DB_IDLE_TIMEOUT_MS", 30_000);
const CONNECTION_TIMEOUT_MS = envInt("DB_CONN_TIMEOUT_MS", 5_000);
const MAX_USES = envInt("DB_MAX_USES", 7_500);

const RETRY_ATTEMPTS = envInt("DB_RETRY_ATTEMPTS", 3);
const RETRY_BASE_MS = envInt("DB_RETRY_BASE_MS", 100);
const RETRY_MAX_MS = envInt("DB_RETRY_MAX_MS", 2_000);

function createPool(): Pool {
    const newPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        max: POOL_MAX,
        idleTimeoutMillis: IDLE_TIMEOUT_MS,
        connectionTimeoutMillis: CONNECTION_TIMEOUT_MS,
        maxUses: MAX_USES,
    });

    newPool.on("error", (err) => {
        logger.error("[db-pool] error en un cliente ocioso", err);
    });

    return newPool;
}

// Construcción perezosa: recién se crea el Pool (y su primera conexión real)
// en el primer query, no al importar el módulo. Next.js carga este archivo
// transitivamente al recolectar datos de todas las rutas durante `next build`,
// así que construir el Pool de forma eager abriría un WebSocket real en build time.
// Cacheado en globalThis para sobrevivir al hot-reload de Next en dev.
function getPool(): Pool {
    if (!globalForPool.__neonPool) {
        globalForPool.__neonPool = createPool();
    }
    return globalForPool.__neonPool;
}

const RETRYABLE_PG_CODES = new Set([
    "08000", // connection_exception
    "08001", // sqlclient_unable_to_establish_sqlconnection
    "08003", // connection_does_not_exist
    "08004", // sqlserver_rejected_establishment_of_sqlconnection
    "08006", // connection_failure
    "08007", // transaction_resolution_unknown
    "57P01", // admin_shutdown
    "40001", // serialization_failure
    "40P01", // deadlock_detected
]);

const RETRYABLE_MESSAGE_SUBSTRINGS = [
    "ECONNRESET",
    "ETIMEDOUT",
    "EPIPE",
    "Connection terminated",
    "connection timeout",
];

function isRetryable(error: unknown): boolean {
    const err = error as { code?: string; message?: string };

    if (err?.code && RETRYABLE_PG_CODES.has(err.code)) return true;
    if (err?.message) {
        return RETRYABLE_MESSAGE_SUBSTRINGS.some((needle) => err.message!.includes(needle));
    }
    return false;
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Backoff exponencial con "full jitter": delay = random(0, min(maxDelay, base * 2^intento)).
// Solo reintenta errores transitorios de conexión; nunca violaciones de constraint/sintaxis.
async function withRetry<T>(operation: () => Promise<T>): Promise<T> {
    let attempt = 0;

    while (true) {
        try {
            return await operation();
        } catch (error) {
            if (attempt >= RETRY_ATTEMPTS || !isRetryable(error)) {
                throw error;
            }

            const exponentialDelay = RETRY_BASE_MS * 2 ** attempt;
            const delay = Math.random() * Math.min(RETRY_MAX_MS, exponentialDelay);

            logger.error(
                `[db-pool] error transitorio, reintentando en ${Math.round(delay)}ms (intento ${attempt + 1}/${RETRY_ATTEMPTS})`,
                error
            );

            await sleep(delay);
            attempt++;
        }
    }
}

type SqlTag = (strings: TemplateStringsArray, ...values: unknown[]) => Promise<any[]>;

// Shim tagged-template: preserva el contrato existente (`const data = await db(); await data\`select ...\``)
// para que los DAO no necesiten cambiar de sintaxis al pasar de neon() HTTP a un Pool TCP real.
const sql: SqlTag = (strings, ...values) => {
    let text = strings[0];
    for (let i = 0; i < values.length; i++) {
        text += `$${i + 1}` + strings[i + 1];
    }

    return withRetry(async () => {
        const result = await getPool().query(text, values);
        return result.rows;
    });
};

const db = async (): Promise<SqlTag> => sql;

export default db;

export interface PoolHealth {
    ok: boolean;
    latencyMs: number;
    total: number;
    idle: number;
    waiting: number;
}

export async function checkHealth(): Promise<PoolHealth> {
    const start = Date.now();
    const activePool = getPool();
    await activePool.query("select 1");

    return {
        ok: true,
        latencyMs: Date.now() - start,
        total: activePool.totalCount,
        idle: activePool.idleCount,
        waiting: activePool.waitingCount,
    };
}

async function shutdown(signal: string): Promise<void> {
    logger.log(`[db-pool] ${signal} recibido, cerrando pool de conexiones...`);

    try {
        // Solo cierra el pool si llegó a crearse; nunca abre una conexión nueva
        // solo para cerrarla en el shutdown.
        if (globalForPool.__neonPool) {
            await globalForPool.__neonPool.end();
        }
    } catch (error) {
        logger.error("[db-pool] error cerrando el pool", error);
    } finally {
        process.exit(0);
    }
}

if (!globalForPool.__neonShutdownRegistered) {
    process.once("SIGTERM", () => void shutdown("SIGTERM"));
    process.once("SIGINT", () => void shutdown("SIGINT"));
    globalForPool.__neonShutdownRegistered = true;
}
