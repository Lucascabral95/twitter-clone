"use client";
import React, { useState } from "react";
import "./Register.scss";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

interface RegisterProps {
  setIsOpenLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const Register: React.FC<RegisterProps> = ({ setIsOpenLogin }) => {
  const router = useRouter();
  const [errorEmail, setErrorEmail] = useState<string>("");
  const [errorPassword, setErrorPassword] = useState<string>("");


  const crearCuenta = async (event: React.FormEvent<HTMLFormElement>, formData: FormData) => {
    event.preventDefault();
    const email = formData.get("email");
    const password = formData.get("password");
    try {
      const result = await axios.post("/api/auth/login", {
        email: email,
        password: password,
      });

      if (result.status === 200 || result.status === 201) {
        router.push("/home");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response && (error.response.status === 404)) {
          setErrorEmail(error.response.data.error);
        } else if (error.response && (error.response.status === 401)) {
          setErrorPassword(error.response.data.error);
        }
      } else {
        console.error('Error desconocido:', error);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="register">
      <div className="contenedor-register">
        <div className="superior">
          <div className="icono" onClick={() => setIsOpenLogin(false)}>
            <IoMdClose className="icon" />
          </div>
          <div className="imagen-register">
            <Image
              className="imagen"
              src="/img/twitter.svg"
              alt="Logo"
              width={28}
              height={28}
            />
          </div>
          <div className="icono"></div>
        </div>
        <div className="medio">
          <div className="medio-titulo">
            <h3> Iniciá sesión </h3>
          </div>
          <form className="formulario" onSubmit={(event) => crearCuenta(event, new FormData(event.currentTarget))} >
            <div className="formulario-interno">
              <div className="contenedor-input" style={{ border: errorEmail ? "1px solid red" : "1px solid #71767B" }}>
                <input type="email" name="email" placeholder="Correo electronico" required
                />
              </div>
              {errorEmail ? (
                <div className="contenedor-texto-de-error">
                  <p className="texto-de-error"> {errorEmail} </p>
                </div>
              ) : (
                <div className="texto-aclaratorio">
                  <p> Cómo es tu correo electrónico? </p>
                </div>
              )}
              <div className="contenedor-input" style={{ border: errorPassword ? "1px solid red" : "1px solid #71767B" }}>
                <input type="password" name="password" placeholder="Contraseña" required
                />
              </div>
              {errorPassword ? (
                <div className="contenedor-texto-de-error">
                  <p className="texto-de-error"> {errorPassword} </p>
                </div>
              ) :
                <div className="texto-aclaratorio">
                  <p> Elegí una contraseña segura </p>
                </div>
              }
              <div className="contenedor-creacion-cuenta">
                <button type="submit"> Iniciar sesión </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default Register;
