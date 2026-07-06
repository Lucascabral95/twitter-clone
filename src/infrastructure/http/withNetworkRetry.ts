import { AxiosError } from 'axios';

const esErrorDeRed = (error: unknown): boolean =>
    error instanceof AxiosError && !error.response;

// Reintento único y silencioso para lecturas GET ante caídas de red/timeout
// (sin `error.response`, es decir sin llegar a tocar el servidor). No se
// reintentan errores 4xx/5xx: esos ya llegaron al servidor y repetirlos no
// cambia el resultado.
export async function withNetworkRetry<T>(fn: () => Promise<T>, delayMs: number = 300): Promise<T> {
    try {
        return await fn();
    } catch (error) {
        if (!esErrorDeRed(error)) throw error;

        await new Promise((resolve) => setTimeout(resolve, delayMs));
        return fn();
    }
}
