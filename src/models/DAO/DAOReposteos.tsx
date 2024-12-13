import db from "@/services/neon";

interface CustomError {
    error: string;
    status: number;
}

interface Reposteos {
    id: number;
    posteo_id: number;
    reposteador_id: number;
    created_at: string;
}

interface CreacionReposteos {
    posteo_id: number;
    reposteador_id: number;
}

class DAOReposteos {

    async getAllReposteos(): Promise<Reposteos[]> {
        try {
            const data = await db();
            const results = await data`select * from reposteos order by created_at desc returning *`;
            return results as Reposteos[];
        } catch (error) {
            throw error as CustomError;
        }
    }

    async getReposteoById(id: number): Promise<Reposteos[]> {
        try {

            if(isNaN(Number(id))) {
                throw { error: "El usuario aun no realizo ningun reposteo", status: 400 } as CustomError;
            }

            const data = await db();
            const results = await data`select * from reposteos_usuarios where id = ${id} order by created_at desc`;

            if(results.length === 0) {
                throw { error: "El usuario aún no realizo ningun reposteo", status: 404 } as CustomError;
            }
            
            return results as Reposteos[];
        } catch (error) {
            throw error as CustomError;
        }
    }

    async createReposteo(reposteo: CreacionReposteos): Promise<Reposteos> {
        try {
            const data = await db();
            const results = await data`insert into reposteos (posteo_id, reposteador_id) values (${reposteo.posteo_id}, ${reposteo.reposteador_id}) returning *`;

            if(results.length === 0) {
                throw { error: "Error al crear el reposteo", status: 400 } as CustomError;
            }
            
            return results[0] as Reposteos;
        } catch (error) {
            throw error as CustomError;
        }
    }

    async deleteReposteoById(id: number) {
        try {

            if(isNaN(Number(id))) {
                throw { error: "El usuario aun no realizo ningun reposteo", status: 400 };
            }

            const data = await db();
            const results = await data`delete from reposteos where id = ${id} returning *`;

            if(results.length === 0) {
                throw { error: "El usuario aun no realizo ningun reposteo", status: 404 } as CustomError;
            }

            return results;
        } catch (error) {
            throw error as CustomError;
        }
    }
}

export default new DAOReposteos();