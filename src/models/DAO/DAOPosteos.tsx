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
}

interface CreacionPosteo {
    creador_id: number;
    titulo: string;
    contenido: string;
}

class DAOPosteos {
    constructor() {
        this.initializeDB();
    }

    async initializeDB(): Promise<void> {
        try {
            await db();
        } catch (error) {
            throw error as CustomError;
        }
    }

    async getAllPosteos(): Promise<Posteos[]> {
        try {
            const data = await db();
            const posteos = await data`SELECT * FROM usuarios_posteos order by posteo_id asc`;
            return posteos.reverse() as Posteos[];
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
            const posteo = await data`select * from usuarios_posteos where posteo_id = ${id}`;

            const filteredPosteos = posteo.filter((posteo) => posteo.creador_id === id);

            if (filteredPosteos.length === 0) {
                throw { error: "El usuario aún no tiene posteos", status: 404 } as CustomError;
            }

            return filteredPosteos[0] as Posteos;
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
            const posteo = await data`select * from usuarios_posteos where posteo_id = ${id}`;

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
            const newPosteo = await data`insert into posteos (titulo, contenido, creador_id) values (${posteo.titulo}, ${posteo.contenido}, ${posteo.creador_id}) returning *`;
            return newPosteo[0] as Posteos;
        } catch (error) {
            throw error as CustomError;
        }
    }

    async deletePosteoByID(id: number): Promise<Posteos> {
        try {
            const data = await db();
            const deletedPosteo = await data`delete from posteos where id = ${id}`;
            return deletedPosteo[0] as Posteos;
        } catch (error) {
            throw error as CustomError;
        }
    }

    async addLikePosteo(id: number): Promise<Posteos> {
        try {

            if (isNaN(Number(id))) {
                throw { error: "Error al dar like al posteo", status: 400 } as CustomError;
            }
            const data = await db();
            const posteo = await data`update posteos set likes = likes = 1 where id = ${id} returning *`;

            if (posteo.length === 0) {
                throw { error: "Error al dar like al posteo", status: 400 } as CustomError;
            }

            return posteo[0] as Posteos;
        } catch (error) {
            throw error as CustomError;
        }
    }
}

export default new DAOPosteos();