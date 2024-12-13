import db from "@/services/neon";

interface CustomError {
  error: string;
  status: number;
}

class DAOSeguimientos {
  async createSeguimiento(idMio: number, idASeguir: number) {
    try {

      const data = await db()
      const fullSeguimiento = await data`select * from seguimientos where id_mio = ${idMio} and id_a_seguir = ${idASeguir}`;

      if (fullSeguimiento.length > 0) {
        throw { error: "Ya seguís a este usuario", status: 400 } as CustomError;
      }

      if (isNaN(Number(idMio)) || isNaN(Number(idASeguir))) throw { error: "No se pudo seguir al usuario", status: 400 } as CustomError;
      const result = await data`insert into seguimientos (id_mio, id_a_seguir) values (${idMio}, ${idASeguir}) returning *`;

      if (!result || result.length === 0) {
        throw { error: "No se pudo realizar el seguimiento", status: 404 } as CustomError;
      }

      return result[0];
    } catch (error) {
      throw error as CustomError;
    }
  }

  async getSeguimientosById(id: number) {
    try {

      if (isNaN(Number(id))) {
        throw { error: "No se pudo seguir al usuario", status: 400 } as CustomError;
      }

      const data = await db();
      const seguimientos = await data`select * from seguimientos_usuarios where id_mio = ${id}`;

      return seguimientos;
    } catch (error) {
      throw error as CustomError;
    }
  }

  async getSeguimientosSeguidoresById(id: number) {
    try {

      if (isNaN(Number(id))) {
        throw { error: "No se pudo seguir al usuario", status: 400 } as CustomError;
      }

      const data = await db();
      const seguimientos = await data`select * from seguimientos_usuarios where id_a_seguir = ${id}`;

      return seguimientos;
    } catch (error) {
      throw error as CustomError;
    }
  }

  async deleteSeguimientosByID(id: number, id_del_usuario: number) {
    try {

      if (isNaN(Number(id))) {
        throw { error: "No se pudo seguir al usuario", status: 400 } as CustomError;
      }

      const data = await db();
      const seguimientos = await data`delete from seguimientos where id_mio = ${id} and id_a_seguir = ${id_del_usuario}`;

      return seguimientos;
    } catch (error) {
      throw error as CustomError;
    }
  }

  async getSeguimientosFull() {
    try {
      const data = await db();
      const seguimientos = await data`select * from seguimientos_usuarios`;

      return seguimientos;
    } catch (error) {
      throw error as CustomError;
    }
  }
}

export default new DAOSeguimientos();