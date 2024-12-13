"use client";
import React, { useState } from "react";
import { z } from "zod";
import "./Register.scss";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";
import axios, { AxiosError } from "axios";
import { motion } from "motion/react";

interface RegisterProps {
  setIsOpenRegister: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ValidationErrors {
  [key: string]: string[] | undefined;
}

const registerSchema = z.object({
  nombre: z
    .string().refine(value => value.trim().split(" ").length >= 2, { message: "Debe ingresar un nombre y un apellido" }),
  email: z.string().email({ message: "Debe ser un correo válido" }),
  password: z
    .string()
    .min(8, { message: "Debe tener al menos 8 caracteres" })
    .refine((value) => /[A-Z]/.test(value) && /[a-z]/.test(value) && /[0-9]/.test(value), {
      message: "La contraseña debe tener al menos una mayuscula, una minuscula y un numero",
    }),
});

const Register: React.FC<RegisterProps> = ({ setIsOpenRegister, setIsOpenLogin }) => {
  const [error, setError] = useState<ValidationErrors>({});
  const [errorSimple, setErrorSimple] = useState<string | null>(null);

  const crearCuenta = async (event: React.FormEvent<HTMLFormElement>, formData: FormData) => {
    event.preventDefault();
    const nombre = formData.get("nombre");
    const email = formData.get("email");
    const password = formData.get("password");

    const verificacionZObject = registerSchema.safeParse({ nombre, email, password });

    if (!verificacionZObject.success) {
      setError(verificacionZObject.error.flatten().fieldErrors);
      console.log(verificacionZObject.error.flatten().fieldErrors);
      return;
    }

    try {
      const result = await axios.post("/api/auth/register", {
        nombre: nombre,
        email: email,
        password: password,
      });

      if (result.status === 200 || result.status === 201) {
        setIsOpenRegister(false);
        setIsOpenLogin(true);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          console.log(error.response.data.error);
          setErrorSimple(error.response.data.error);
        } else {
          console.log(error);
        }
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="register"
    >
      <div className="contenedor-register">
        <div className="superior">
          <div className="icono" onClick={() => setIsOpenRegister(false)}>
            <IoMdClose className="icon" />
          </div>
          <div className="imagen-register">
            <Image className="imagen" src="/img/twitter.svg" alt="Logo" width={28} height={28} />
          </div>
          <div className="icono"></div>
        </div>
        <div className="medio">
          <div className="medio-titulo">
            <h3> Crear cuenta </h3>
          </div>
          <form className="formulario" onSubmit={(event) => crearCuenta(event, new FormData(event.currentTarget))} >
            <div className="formulario-interno">
              <div className="contenedor-input" style={{ border: error.nombre ? "1px solid red" : "1px solid #71767b68" }} >
                <input type="text" name="nombre" placeholder="Nombre y apellido" required />
              </div>
              {error.nombre ? (
                <div className="contenedor-texto-de-error">
                  {error.nombre.map((item, index: number) => (
                    <p className="texto-de-error" key={index}>
                      {item}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="texto-aclaratorio">
                  <p> Cuál es tu nombre? </p>
                </div>
              )}
              <div className="contenedor-input" style={{ border: error.email || errorSimple ? "1px solid red" : "1px solid #71767b68" }} >
                <input type="email" name="email" placeholder="Correo electronico" required />
              </div>
              {error.email ? (
                <div className="contenedor-texto-de-error">
                  <p className="texto-de-error"> {error.email[0]} </p>
                </div>
              ) : (
                <div className="texto-aclaratorio">
                  <p> Cómo es tu correo electrónico? </p>
                </div>
              )}
              <div className="contenedor-input" style={{ border: error.password ? "1px solid red" : "1px solid #71767b68" }}>
                <input type="password" name="password" placeholder="Contraseña" required />
              </div>
              {error.password ? (
                <div className="contenedor-texto-de-error">
                  {error.password.map((item, index: number) => (
                    <p className="texto-de-error" key={index}>
                      {item}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="texto-aclaratorio">
                  <p> Elegí una contraseña segura </p>
                </div>
              )}
              {errorSimple && (
                <div className="contenedor-texto-de-error">
                  <p className="texto-de-error"> {errorSimple} </p>
                </div>
              )}
              <div className="contenedor-creacion-cuenta">
                <button type="submit"> Crear cuenta </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default Register;
