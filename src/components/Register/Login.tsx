'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { IoMdClose } from 'react-icons/io';

import { useLogin } from '@/presentation/hooks/useLogin';
import { useModalDismiss } from '@/presentation/hooks/useModalDismiss';
import Spinner from '@/components/Spinner/Spinner';
import './Register.scss';

interface LoginProps {
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose }) => {
  const modalRef = useModalDismiss<HTMLDivElement>(onClose);

  const {
    register,
    onSubmit,
    formState: { errors, isSubmitting },
  } = useLogin();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="register"
    >
      <div className="contenedor-register" ref={modalRef} role="dialog" aria-modal="true">
        <div className="superior">
          <div className="icono" onClick={onClose}>
            <IoMdClose className="icon" />
          </div>
          <div className="imagen-register">
            <Image className="imagen" src="/img/twitter.svg" alt="Logo" width={28} height={28} />
          </div>
          <div className="icono"></div>
        </div>

        <div className="medio">
          <div className="medio-titulo">
            <h3>Iniciá sesión</h3>
          </div>

          <form className="formulario" onSubmit={onSubmit} noValidate>
            <div className="formulario-interno">
              <div
                className="contenedor-input"
                style={{ border: errors.email ? '1px solid red' : '1px solid #71767b68' }}
              >
                <input
                  type="email"
                  placeholder="Correo electronico"
                  disabled={isSubmitting}
                  {...register('email')}
                />
              </div>
              {errors.email ? (
                <div className="contenedor-texto-de-error">
                  <p className="texto-de-error">{errors.email.message}</p>
                </div>
              ) : (
                <div className="texto-aclaratorio">
                  <p>¿Cómo es tu correo electrónico?</p>
                </div>
              )}

              <div
                className="contenedor-input"
                style={{ border: errors.password ? '1px solid red' : '1px solid #71767b68' }}
              >
                <input
                  type="password"
                  placeholder="Contraseña"
                  disabled={isSubmitting}
                  {...register('password')}
                />
              </div>
              {errors.password ? (
                <div className="contenedor-texto-de-error">
                  <p className="texto-de-error">{errors.password.message}</p>
                </div>
              ) : (
                <div className="texto-aclaratorio">
                  <p>Elegí una contraseña segura</p>
                </div>
              )}

              {errors.root && (
                <div className="contenedor-texto-de-error">
                  <p className="texto-de-error">{errors.root.message}</p>
                </div>
              )}

              <div className="contenedor-creacion-cuenta">
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Spinner /> : 'Iniciar sesión'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
