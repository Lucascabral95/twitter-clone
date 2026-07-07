import db from "@/services/neon";

interface CustomError {
    error: string;
    status: number;
}

interface Posteos {
    id: number;
    nombre: string;
    email: string;
    fecha_creacion: string;
    identificador: string;
    posteo_id: number;
    titulo: string;
    contenido: string;
    created_at: string;
    updated_at: string;
    creador_id: number;
    likes: number;
    comentarios_count: number;
    reposteos_count: number;
    imagen_url: string | null;
    imagen_public_id: string | null;
}

interface CreacionPosteo {
    creador_id: number;
    titulo: string;
    contenido: string;
    imagen_url?: string | null;
    imagen_public_id?: string | null;
}

export interface PosteosPaginados {
    rows: Posteos[];
    hasMore: boolean;
}

export const DEFAULT_POSTEOS_LIMIT = 20;

// Lecturas contra la vista `usuarios_posteos` (join con usuarios), escrituras contra la
// tabla base `posteos`. Los SELECT son de columnas explícitas: si la vista cambia de forma,
// esto falla ruidosamente en vez de arrastrar un drift de esquema silencioso.
class DAOPosteos {
    // Paginación keyset sobre posteo_id (desc): se pide `limit + 1` filas para saber
    // si hay una página siguiente sin una query de COUNT(*) aparte.
    async getAllPosteos(limit: number = DEFAULT_POSTEOS_LIMIT, cursor?: number): Promise<PosteosPaginados> {
        try {
            const data = await db();
            const posteos = cursor
                ? await data`
                    SELECT id, nombre, email, fecha_creacion, identificador, posteo_id,
                           titulo, contenido, created_at, updated_at, creador_id, likes,
                           comentarios_count, reposteos_count, imagen_url, imagen_public_id
                    FROM usuarios_posteos where posteo_id < ${cursor} order by posteo_id desc limit ${limit + 1}
                `
                : await data`
                    SELECT id, nombre, email, fecha_creacion, identificador, posteo_id,
                           titulo, contenido, created_at, updated_at, creador_id, likes,
                           comentarios_count, reposteos_count, imagen_url, imagen_public_id
                    FROM usuarios_posteos order by posteo_id desc limit ${limit + 1}
                `;

            const hasMore = posteos.length > limit;
            const rows = (hasMore ? posteos.slice(0, limit) : posteos) as Posteos[];

            return { rows, hasMore };
        } catch (error) {
            throw error as CustomError;
        }
    }

    async getPosteosByCreador(creadorId: number, limit: number = DEFAULT_POSTEOS_LIMIT, cursor?: number): Promise<PosteosPaginados> {
        try {

            if (isNaN(Number(creadorId))) {
                throw { error: "ID debe ser numeral.", status: 400 } as CustomError;
            }

            const data = await db();
            const posteos = cursor
                ? await data`
                    SELECT id, nombre, email, fecha_creacion, identificador, posteo_id,
                           titulo, contenido, created_at, updated_at, creador_id, likes,
                           comentarios_count, reposteos_count, imagen_url, imagen_public_id
                    FROM usuarios_posteos where creador_id = ${creadorId} and posteo_id < ${cursor} order by posteo_id desc limit ${limit + 1}
                `
                : await data`
                    SELECT id, nombre, email, fecha_creacion, identificador, posteo_id,
                           titulo, contenido, created_at, updated_at, creador_id, likes,
                           comentarios_count, reposteos_count, imagen_url, imagen_public_id
                    FROM usuarios_posteos where creador_id = ${creadorId} order by posteo_id desc limit ${limit + 1}
                `;

            const hasMore = posteos.length > limit;
            const rows = (hasMore ? posteos.slice(0, limit) : posteos) as Posteos[];

            return { rows, hasMore };
        } catch (error) {
            throw error as CustomError;
        }
    }

    // Feed "Inicio": posteos propios y de usuarios seguidos. Mismo paginado keyset que el resto de los listados.
    async getFeedDeSeguidos(miId: number, limit: number = DEFAULT_POSTEOS_LIMIT, cursor?: number): Promise<PosteosPaginados> {
        try {

            if (isNaN(Number(miId))) {
                throw { error: "ID debe ser numeral.", status: 400 } as CustomError;
            }

            const data = await db();
            const posteos = cursor
                ? await data`
                    SELECT id, nombre, email, fecha_creacion, identificador, posteo_id,
                           titulo, contenido, created_at, updated_at, creador_id, likes,
                           comentarios_count, reposteos_count, imagen_url, imagen_public_id
                    FROM usuarios_posteos
                    where (creador_id = ${miId} or creador_id in (select id_a_seguir from seguimientos where id_mio = ${miId}))
                      and posteo_id < ${cursor}
                    order by posteo_id desc limit ${limit + 1}
                `
                : await data`
                    SELECT id, nombre, email, fecha_creacion, identificador, posteo_id,
                           titulo, contenido, created_at, updated_at, creador_id, likes,
                           comentarios_count, reposteos_count, imagen_url, imagen_public_id
                    FROM usuarios_posteos
                    where creador_id = ${miId} or creador_id in (select id_a_seguir from seguimientos where id_mio = ${miId})
                    order by posteo_id desc limit ${limit + 1}
                `;

            const hasMore = posteos.length > limit;
            const rows = (hasMore ? posteos.slice(0, limit) : posteos) as Posteos[];

            return { rows, hasMore };
        } catch (error) {
            throw error as CustomError;
        }
    }

    async searchPosteos(query: string, limit: number = DEFAULT_POSTEOS_LIMIT): Promise<Posteos[]> {
        try {
            const data = await db();
            const like = `%${query}%`;
            const posteos = await data`
                SELECT id, nombre, email, fecha_creacion, identificador, posteo_id,
                       titulo, contenido, created_at, updated_at, creador_id, likes,
                       comentarios_count, reposteos_count, imagen_url, imagen_public_id
                FROM usuarios_posteos
                where titulo ILIKE ${like} or contenido ILIKE ${like} or nombre ILIKE ${like}
                order by posteo_id desc limit ${limit}
            `;

            return posteos as Posteos[];
        } catch (error) {
            throw error as CustomError;
        }
    }

    async getPosteosById(id: number): Promise<Posteos> {
        try {

            if(isNaN(Number(id))) {
                throw { error: "ID debe ser numeral.", status: 400 } as CustomError;
            }

            const data = await db();
            const posteo = await data`
                SELECT id, nombre, email, fecha_creacion, identificador, posteo_id,
                       titulo, contenido, created_at, updated_at, creador_id, likes,
                       comentarios_count, reposteos_count, imagen_url, imagen_public_id
                FROM usuarios_posteos where posteo_id = ${id}
            `;

            if (posteo.length === 0) {
                throw { error: "El usuario aún no tiene posteos", status: 404 } as CustomError;
            }

            return posteo[0] as Posteos;
        } catch (error) {
            throw error as CustomError;
        }
    }

    async obtenerPosteoPorID(id: number): Promise<Posteos[]> {
        try {

            if (isNaN(Number(id))) {
                throw { error: "ID debe ser numeral.", status: 400 } as CustomError;
            }

            const data = await db();
            const posteo = await data`
                SELECT id, nombre, email, fecha_creacion, identificador, posteo_id,
                       titulo, contenido, created_at, updated_at, creador_id, likes,
                       comentarios_count, reposteos_count, imagen_url, imagen_public_id
                FROM usuarios_posteos where posteo_id = ${id}
            `;

            if (posteo.length === 0) {
                throw { error: "Posteo no encontrado.", status: 404 } as CustomError;
            }

            return posteo as Posteos[];
        } catch (error) {
            throw error as CustomError;
        }
    }

    async createPosteo(posteo: CreacionPosteo): Promise<Posteos> {
        try {
            const data = await db();
            const newPosteo = await data`
                insert into posteos (titulo, contenido, creador_id, imagen_url, imagen_public_id)
                values (${posteo.titulo}, ${posteo.contenido}, ${posteo.creador_id}, ${posteo.imagen_url ?? null}, ${posteo.imagen_public_id ?? null})
                returning *
            `;
            return newPosteo[0] as Posteos;
        } catch (error) {
            throw error as CustomError;
        }
    }

    async deletePosteoByID(id: number): Promise<Posteos> {
        try {
            const data = await db();
            const deletedPosteo = await data`delete from posteos where id = ${id} returning *`;

            if (deletedPosteo.length === 0) {
                throw { error: "Posteo no encontrado", status: 404 } as CustomError;
            }

            return deletedPosteo[0] as Posteos;
        } catch (error) {
            throw error as CustomError;
        }
    }

    async updatePosteo(id: number, cambios: { titulo?: string; contenido?: string }): Promise<Posteos> {
        try {
            const data = await db();
            const updated = await data`
                update posteos
                set titulo = coalesce(${cambios.titulo ?? null}, titulo),
                    contenido = coalesce(${cambios.contenido ?? null}, contenido),
                    updated_at = now()
                where id = ${id}
                returning *
            `;

            if (updated.length === 0) {
                throw { error: "Posteo no encontrado", status: 404 } as CustomError;
            }

            return updated[0] as Posteos;
        } catch (error) {
            throw error as CustomError;
        }
    }

    // Like idempotente por usuario respaldado por `posteos_likes`: si no existía el par
    // (usuario, posteo) lo crea y suma; si ya existía, lo borra y resta (unlike). El
    // conteo denormalizado `posteos.likes` se mantiene en sync en el mismo método.
    async toggleLike(usuarioId: number, posteoId: number): Promise<{ liked: boolean; likes: number; creador_id: number | null }> {
        try {
            if (isNaN(Number(usuarioId)) || isNaN(Number(posteoId))) {
                throw { error: "Error al dar like al posteo", status: 400 } as CustomError;
            }

            const data = await db();
            const inserted = await data`
                insert into posteos_likes (usuario_id, posteo_id) values (${usuarioId}, ${posteoId})
                on conflict (usuario_id, posteo_id) do nothing
                returning *
            `;

            if (inserted.length > 0) {
                const posteo = await data`update posteos set likes = likes + 1 where id = ${posteoId} returning likes, creador_id`;
                return { liked: true, likes: posteo[0]?.likes ?? 0, creador_id: posteo[0]?.creador_id ?? null };
            }

            await data`delete from posteos_likes where usuario_id = ${usuarioId} and posteo_id = ${posteoId}`;
            const posteo = await data`update posteos set likes = greatest(likes - 1, 0) where id = ${posteoId} returning likes, creador_id`;

            return { liked: false, likes: posteo[0]?.likes ?? 0, creador_id: posteo[0]?.creador_id ?? null };
        } catch (error) {
            throw error as CustomError;
        }
    }

    async getPosteoLikeadoPorUsuario(usuarioId: number, posteoId: number): Promise<boolean> {
        try {
            if (isNaN(Number(usuarioId)) || isNaN(Number(posteoId))) {
                return false;
            }

            const data = await db();
            const rows = await data`
                select 1 from posteos_likes where usuario_id = ${usuarioId} and posteo_id = ${posteoId}
            `;

            return rows.length > 0;
        } catch (error) {
            throw error as CustomError;
        }
    }

    async incrementarComentariosCount(idDelPosteo: number): Promise<void> {
        try {
            const data = await db();
            await data`update posteos set comentarios_count = comentarios_count + 1 where id = ${idDelPosteo}`;
        } catch (error) {
            throw error as CustomError;
        }
    }

    async incrementarReposteosCount(posteoId: number): Promise<void> {
        try {
            const data = await db();
            await data`update posteos set reposteos_count = reposteos_count + 1 where id = ${posteoId}`;
        } catch (error) {
            throw error as CustomError;
        }
    }

    async decrementarReposteosCount(posteoId: number): Promise<void> {
        try {
            const data = await db();
            await data`update posteos set reposteos_count = greatest(reposteos_count - 1, 0) where id = ${posteoId}`;
        } catch (error) {
            throw error as CustomError;
        }
    }
}

export default new DAOPosteos();



