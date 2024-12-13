import db from "@/services/neon";
import { compare, hash } from "bcrypt";

interface CustomError {
  error: string;
  status: number;
}
interface Usuario {
  id: number;
  nombre: string;
  email: string;
  password: string;
  identificador: string;
  fecha_creacion: string;
}

interface CreacionUsuario {
  name: string,
  email: string,
  password: string,
  identificador: string
}

interface User {
  email: string;
  password: string;
}

class daoUsuarios {
  constructor() {
    this.initializeDB();
  }

  async initializeDB(): Promise<void> {
    try {
      await db();
    } catch (error) {
      console.log(error);
      throw error as CustomError;
    }
  }

  async getAllUsers(): Promise<Usuario[]> {
    try {
      const data = await db();
      const users = await data`select * from usuarios`;
      return users as Usuario[];
    } catch (error) {
      throw error as CustomError;
    }
  }

  async getUserByIdentificador(id: number): Promise<Usuario> {
    try {

      if (isNaN(Number(id))) {
        throw { error: "Usuario no encontrado", status: 400 } as CustomError;
      }

      const data = await db();
      const user = await data`SELECT * FROM usuarios WHERE id = ${id}`;

      if (user.length === 0) {
        throw { error: "Usuario no encontrado", status: 404 } as CustomError;
      }

      return user[0] as Usuario;
    } catch (error) {
      throw error as CustomError;
    }
  }

  async createUser(user: CreacionUsuario): Promise<Usuario> {
    try {
      const data = await db();

      const existingUser = await data`select * from usuarios where email = ${user.email}`;

      if (existingUser.length > 0) {
        throw { error: "El usuario ya se encuentra registrado", status: 404 } as CustomError;
      }

      user.password = await hash(user.password, 10);

      const newUser = await data`insert into usuarios (nombre, email, password, identificador) values (${user.name}, ${user.email}, ${user.password}, ${user.identificador})`;
      return newUser[0] as Usuario;
    } catch (error) {
      throw error as CustomError;
    }
  }

  async loginUser(user: User) {
    try {
      const data = await db();
      const existingUser = await data`select * from usuarios where email = ${user.email}`;

      if (existingUser.length === 0) {
        throw { error: "El usuario no se encuentra registrado", status: 404 } as CustomError;
      }

      const verificacionPassword = await compare(
        user.password,
        existingUser[0].password
      );

      if (!verificacionPassword) {
        throw { error: "Contraseña incorrecta", status: 401 } as CustomError;
      }

      return { result: "Acceso permitido", usuario: existingUser[0] };
    } catch (error: unknown) {
      throw error as CustomError;
    }
  }
}

export default new daoUsuarios();