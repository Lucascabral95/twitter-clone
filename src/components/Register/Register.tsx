'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { IoMdClose } from 'react-icons/io';

import { useRegister } from '@/presentation/hooks/useRegister';
import './Register.scss';

interface RegisterProps {
  setIsOpenRegister: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const Register: React.FC<RegisterProps> = ({ setIsOpenRegister, setIsOpenLogin }) => {
  const { error, errorSimple, isLoading, handleRegister } = useRegister(
    () => setIsOpenRegister(false),
    () => setIsOpenLogin(true)
  );

  const renderFieldError = (fieldName: 'nombre' | 'email' | 'password') => {
    if (error[fieldName]) {
      return (
        <div className="contenedor-texto-de-error">
          {error[fieldName]?.map((item, index) => (
            <p className="texto-de-error" key={index}>
              {item}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderFieldHint = (fieldName: 'nombre' | 'email' | 'password') => {
    const hints = {
      nombre: '¿Cuál es tu nombre?',
      email: '¿Cómo es tu correo electrónico?',
      password: 'Elige una contraseña segura',
    };

    if (!error[fieldName]) {
      return (
        <div className="texto-aclaratorio">
          <p>{hints[fieldName]}</p>
        </div>
      );
    }
    return null;
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
            <h3>Crear cuenta</h3>
          </div>

          <form className="formulario" onSubmit={handleRegister}>
            <div className="formulario-interno">
              <div
                className="contenedor-input"
                style={{ border: error.nombre ? '1px solid red' : '1px solid #71767b68' }}
              >
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre y apellido"
                  disabled={isLoading}
                  required
                />
              </div>
              {renderFieldError('nombre')}
              {renderFieldHint('nombre')}

              <div
                className="contenedor-input"
                style={{ border: error.email || errorSimple ? '1px solid red' : '1px solid #71767b68' }}
              >
                <input
                  type="email"
                  name="email"
                  placeholder="Correo electrónico"
                  disabled={isLoading}
                  required
                />
              </div>
              {renderFieldError('email')}
              {renderFieldHint('email')}

              <div
                className="contenedor-input"
                style={{ border: error.password ? '1px solid red' : '1px solid #71767b68' }}
              >
                <input
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  disabled={isLoading}
                  required
                />
              </div>
              {renderFieldError('password')}
              {renderFieldHint('password')}

              {errorSimple && (
                <div className="contenedor-texto-de-error">
                  <p className="texto-de-error">{errorSimple}</p>
                </div>
              )}

              <div className="contenedor-creacion-cuenta">
                <button type="submit" disabled={isLoading}>
                  {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default Register;
