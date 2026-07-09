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
    isRedirecting,
    formState: { errors, isSubmitting },
  } = useLogin();
  const estaProcesando = isSubmitting || isRedirecting;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="register"
    >
      <div className="contenedor-register" ref={modalRef} role="dialog" aria-modal="true" aria-busy={estaProcesando}>
        <div className="superior">
          <button type="button" className="icono" onClick={onClose} aria-label="Cerrar login" disabled={estaProcesando}>
            <IoMdClose className="icon" />
          </button>
          <div className="imagen-register">
            <Image className="imagen" src="/img/twitter.svg" alt="Logo" width={28} height={28} />
          </div>
          <div className="icono" aria-hidden="true"></div>
        </div>

        <div className="medio">
          <div className="medio-titulo">
            <h3>Iniciá sesión</h3>
          </div>

          <form className="formulario" onSubmit={onSubmit} noValidate>
            <div className="formulario-interno">
              <div className={errors.email ? 'contenedor-input error' : 'contenedor-input'}>
                <input
                  type="email"
                  placeholder="Correo electronico"
                  disabled={estaProcesando}
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

              <div className={errors.password ? 'contenedor-input error' : 'contenedor-input'}>
                <input
                  type="password"
                  placeholder="Contraseña"
                  disabled={estaProcesando}
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

              {estaProcesando && (
                <div className="estado-login" role="status" aria-live="polite">
                  <span aria-hidden="true" className="estado-login-spinner"><Spinner /></span>
                  <p>{isRedirecting ? 'Entrando a tu inicio...' : 'Verificando tus datos...'}</p>
                </div>
              )}

              <div className="contenedor-creacion-cuenta">
                <button type="submit" disabled={estaProcesando} aria-busy={estaProcesando}>
                  {estaProcesando ? 'Ingresando...' : 'Iniciar sesión'}
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

