import db from "@/services/neon";

interface CustomError {
    error: string;
    status: number;
}

interface Comentarios {
    id: number;
    emisor_id: number;
    id_del_posteo: number;
    likes: number;
    contenido: string;
    created_at: string;
    updated_at: string
}

interface ComentariosDePosteos {
    comentario_id: number;
    emisor_id: number;
    id_del_posteo: number;
    comentario_likes: number;
    comentario_contenido: string;
    comentario_created_at: string;
    comentario_updated_at: string
    posteo_id: number;
    titulo: string;
    posteo_contenido: string;
    posteo_created_at: string;
    posteo_updated_at: string;
    creador_id: number;
    posteo_likes: number;
    usuario_id: number;
    nombre: string;
    email: string;
    fecha_creacion: string;
    identificador: string;
}

interface CreacionComentario {
    emisor_id: number;
    id_del_posteo: number;
    contenido: string
}

class DAOComentarios {

    async getAllComments(): Promise<Comentarios[]> {
        try {
            const data = await db();
            const comments = await data`select * from comentarios order by created_at asc`;

            return comments as Comentarios[]; 
        } catch (error) {
            throw error as CustomError;
        }
    }

    async getAllCommetsByIdPost(id: number): Promise<ComentariosDePosteos[]> {
        try {
            if (isNaN(id)) {
                throw { error: "El id debe ser un número", status: 400 } as CustomError;
            }

            const data = await db();
            const comments = await data`select * from comentarios_de_posteos_new where id_del_posteo = ${id} order by comentario_created_at asc`;

            if (comments.length === 0) {
                throw { error: "No existen comentarios para este posteo", status: 404 } as CustomError;
            }

            return comments.reverse() as ComentariosDePosteos[];
        } catch (error) {
            throw error as CustomError;
        }
    }

    async createComment(comment: CreacionComentario): Promise<Comentarios> {
        try {
            const data = await db();
            const newComment = await data`insert into comentarios (emisor_id, id_del_posteo, contenido) 
            values (${comment.emisor_id}, ${comment.id_del_posteo}, ${comment.contenido}) returning *`;

            if (newComment.length === 0) {
                throw { error: "Error al crear el comentario", status: 400 } as CustomError;
            }

            return newComment[0] as Comentarios;
        } catch (error) {
            throw error as CustomError;
        }
    }

    async addLikeComment(id: number): Promise<Comentarios> {
        try {
            const data = await db();
            const comment = await data`update comentarios set likes = likes + 1 where id = ${id} returning *`;

            if (comment.length === 0) {
                throw { error: "Error al dar like al comentario", status: 400 } as CustomError;
            }

            return comment[0] as Comentarios;
        } catch (error) {
            throw error as CustomError;
        }
    }
}

export default new DAOComentarios();