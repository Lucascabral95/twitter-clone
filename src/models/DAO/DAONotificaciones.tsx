import db from "@/services/neon";

interface CustomError {
    error: string;
    status: number;
}

export type TipoNotificacion = 'like' | 'follow' | 'comment' | 'repost';

export interface Notificacion {
    id: number;
    usuario_id: number;
    tipo: TipoNotificacion;
    actor_id: number;
    entidad_id: number | null;
    leida: boolean;
    created_at: string;
    actor_nombre: string;
    actor_email: string;
}

export interface NotificacionesPaginadas {
    rows: Notificacion[];
    hasMore: boolean;
}

export const DEFAULT_NOTIFICACIONES_LIMIT = 20;

class DAONotificaciones {
    // Best-effort: se llama desde los handlers de like/follow/comment/repost sin
    // bloquear su respuesta ante un fallo (el caller decide si loguea el error).
    // No se notifica a uno mismo (ej: dar like a tu propio posteo).
    async crear(usuarioId: number, tipo: TipoNotificacion, actorId: number, entidadId: number | null): Promise<void> {
        if (usuarioId === actorId) return;

        const data = await db();
        await data`
            insert into notificaciones (usuario_id, tipo, actor_id, entidad_id)
            values (${usuarioId}, ${tipo}, ${actorId}, ${entidadId})
        `;
    }

    async getByUsuario(usuarioId: number, limit: number = DEFAULT_NOTIFICACIONES_LIMIT, cursor?: number): Promise<NotificacionesPaginadas> {
        try {
            if (isNaN(Number(usuarioId))) {
                throw { error: "ID debe ser numeral.", status: 400 } as CustomError;
            }

            const data = await db();
            const rows = cursor
                ? await data`
                    select n.id, n.usuario_id, n.tipo, n.actor_id, n.entidad_id, n.leida, n.created_at,
                           u.nombre as actor_nombre, u.email as actor_email
                    from notificaciones n
                    join usuarios u on u.id = n.actor_id
                    where n.usuario_id = ${usuarioId} and n.id < ${cursor}
                    order by n.id desc limit ${limit + 1}
                `
                : await data`
                    select n.id, n.usuario_id, n.tipo, n.actor_id, n.entidad_id, n.leida, n.created_at,
                           u.nombre as actor_nombre, u.email as actor_email
                    from notificaciones n
                    join usuarios u on u.id = n.actor_id
                    where n.usuario_id = ${usuarioId}
                    order by n.id desc limit ${limit + 1}
                `;

            const hasMore = rows.length > limit;
            return { rows: (hasMore ? rows.slice(0, limit) : rows) as Notificacion[], hasMore };
        } catch (error) {
            throw error as CustomError;
        }
    }

    async contarNoLeidas(usuarioId: number): Promise<number> {
        try {
            if (isNaN(Number(usuarioId))) {
                throw { error: "ID debe ser numeral.", status: 400 } as CustomError;
            }

            const data = await db();
            const rows = await data`
                select count(*)::int as total from notificaciones where usuario_id = ${usuarioId} and leida = false
            `;

            return rows[0]?.total ?? 0;
        } catch (error) {
            throw error as CustomError;
        }
    }

    async marcarTodasLeidas(usuarioId: number): Promise<void> {
        try {
            if (isNaN(Number(usuarioId))) {
                throw { error: "ID debe ser numeral.", status: 400 } as CustomError;
            }

            const data = await db();
            await data`update notificaciones set leida = true where usuario_id = ${usuarioId} and leida = false`;
        } catch (error) {
            throw error as CustomError;
        }
    }
}

export default new DAONotificaciones();
