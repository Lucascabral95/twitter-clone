import db from "@/services/neon";

interface CustomError {
  error: string;
  status: number;
}

export interface RefreshTokenRow {
  id: string;
  user_id: number;
  token_hash: string;
  expira: string;
  revocado: boolean;
  creado: string;
}

class daoRefreshTokens {
  async crear(userId: number, tokenHash: string, expira: Date): Promise<RefreshTokenRow> {
    try {
      const data = await db();
      const rows = await data`
        insert into refresh_tokens (user_id, token_hash, expira)
        values (${userId}, ${tokenHash}, ${expira.toISOString()})
        returning id, user_id, token_hash, expira, revocado, creado
      `;
      return rows[0] as RefreshTokenRow;
    } catch (error) {
      throw error as CustomError;
    }
  }

  async buscarPorHash(tokenHash: string): Promise<RefreshTokenRow | null> {
    try {
      const data = await db();
      const rows = await data`
        select id, user_id, token_hash, expira, revocado, creado
        from refresh_tokens
        where token_hash = ${tokenHash}
      `;
      return (rows[0] as RefreshTokenRow) ?? null;
    } catch (error) {
      throw error as CustomError;
    }
  }

  async revocar(id: string): Promise<void> {
    try {
      const data = await db();
      await data`update refresh_tokens set revocado = true where id = ${id}`;
    } catch (error) {
      throw error as CustomError;
    }
  }

  async revocarTodosDelUsuario(userId: number): Promise<void> {
    try {
      const data = await db();
      await data`update refresh_tokens set revocado = true where user_id = ${userId}`;
    } catch (error) {
      throw error as CustomError;
    }
  }
}

export default new daoRefreshTokens();
