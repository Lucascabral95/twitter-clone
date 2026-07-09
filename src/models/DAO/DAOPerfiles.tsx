import db from "@/services/neon";
import { UserProfile } from "@/infrastructure/interfaces/profile.interface";
import { SessionPayload } from "@/infrastructure/auth/session";

interface CustomError {
  error: string;
  status: number;
}

class DAOPerfiles {
  async getPerfilByUsuarioId(usuarioId: number, viewer: SessionPayload | null): Promise<UserProfile> {
    try {
      if (isNaN(Number(usuarioId))) {
        throw { error: "Usuario no encontrado", status: 400 } as CustomError;
      }

      const data = await db();
      const rows = await data`
        select
          u.id,
          u.nombre,
          u.email,
          u.identificador,
          u.fecha_creacion,
          dp.id as datos_id,
          dp.biografia,
          dp.localizacion,
          dp.sitio_web,
          dp.cumpleanos,
          dp.created_at as datos_created_at,
          dp.updated_at as datos_updated_at,
          (select count(*)::int from seguimientos where id_mio = ${usuarioId}) as seguidos,
          (select count(*)::int from seguimientos where id_a_seguir = ${usuarioId}) as seguidores,
          exists(
            select 1 from seguimientos
            where id_mio = ${viewer?.id ?? null} and id_a_seguir = ${usuarioId}
          ) as lo_sigo
        from usuarios u
        left join datos_personales dp on dp.usuario_id = u.id
        where u.id = ${usuarioId}
      `;

      if (rows.length === 0) {
        throw { error: "Usuario no encontrado", status: 404 } as CustomError;
      }

      const row = rows[0];

      return {
        usuario: {
          id: row.id,
          nombre: row.nombre,
          email: row.email,
          identificador: row.identificador,
          fecha_creacion: row.fecha_creacion,
        },
        datosPersonales: row.datos_id
          ? {
              id: row.datos_id,
              biografia: row.biografia,
              localizacion: row.localizacion,
              sitio_web: row.sitio_web,
              cumpleanos: row.cumpleanos,
              usuario_id: row.id,
              created_at: row.datos_created_at,
              updated_at: row.datos_updated_at,
            }
          : null,
        stats: {
          seguidos: row.seguidos ?? 0,
          seguidores: row.seguidores ?? 0,
        },
        relacion: {
          viewerId: viewer?.id ?? null,
          esMiPerfil: viewer?.id === row.id,
          loSigo: Boolean(row.lo_sigo),
        },
      };
    } catch (error) {
      throw error as CustomError;
    }
  }
}

export default new DAOPerfiles();
