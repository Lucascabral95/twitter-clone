import db from "@/services/neon";

interface CustomError {
    error: string;
    status: number;
}

interface DatosPersonales {
    id: number;
    biografia: string;
    localizacion: string;
    sitio_web: string;
    cumpleanos: string;
    usuario_id: number;
    created_at: string;
    updated_at: string;
}

interface CreacionDatosPersonales {
    biografia: string;
    localizacion: string;
    sitio_web: string;
    cumpleanos: string;
    usuario_id: number;
}

class DAODatosPersonales {
    async createDatosPersonales(datosPersonales: CreacionDatosPersonales): Promise<CreacionDatosPersonales> {
        try {
            const data = await db();
            const datos = await data`insert into datos_personales (biografia, localizacion, sitio_web, cumpleanos, usuario_id) 
         values (${datosPersonales.biografia}, ${datosPersonales.localizacion}, ${datosPersonales.sitio_web}, ${datosPersonales.cumpleanos}, ${datosPersonales.usuario_id}) returning *`;

            return datos[0] as CreacionDatosPersonales;
        } catch (error) {
            throw error as CustomError;
        }
    }

    async getDatosPersonalesByID(id: number): Promise<DatosPersonales[]> {
        try {

            if (isNaN(Number(id))) {
                throw { error: "Sin datos", status: 400 } as CustomError;
            }

            const data = await db();
            const datos = await data`select * from datos_personales where usuario_id = ${id}`;

            if (datos.length === 0) {
                throw { error: "Sin datos", status: 404 };
            }

            return datos as DatosPersonales[];
        } catch (error) {
            throw error as CustomError;
        }
    }

    async updateDatosPersonalesById(id: number, datosPersonales: CreacionDatosPersonales): Promise<DatosPersonales> {
        try {

            if (isNaN(Number(id))) {
                throw { error: "Sin datos", status: 400 } as CustomError;
            }

            const data = await db();
            const datos = await data`update datos_personales set biografia = ${datosPersonales.biografia}, localizacion = ${datosPersonales.localizacion}, sitio_web = ${datosPersonales.sitio_web}, cumpleanos = ${datosPersonales.cumpleanos} where usuario_id = ${id} returning *`;

            return datos[0] as DatosPersonales;
        } catch (error) {
            throw error as CustomError;
        }
    }
}

export default new DAODatosPersonales();