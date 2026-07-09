'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { IoMdClose } from 'react-icons/io';

import { useRegister } from '@/presentation/hooks/useRegister';
import { useModalDismiss } from '@/presentation/hooks/useModalDismiss';
import Spinner from '@/components/Spinner/Spinner';
import PasswordChecklist from '@/components/PasswordChecklist/PasswordChecklist';
import './Register.scss';

interface RegisterProps {
  onClose: () => void;
}

const Register: React.FC<RegisterProps> = ({ onClose }) => {
  const modalRef = useModalDismiss<HTMLDivElement>(onClose);

  const {
    register,
    onSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useRegister(onClose);

  const password = watch('password', '');

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
          <button type="button" className="icono" onClick={onClose} aria-label="Cerrar registro">
            <IoMdClose className="icon" />
          </button>
          <div className="imagen-register">
            <Image className="imagen" src="/img/twitter.svg" alt="Logo" width={28} height={28} />
          </div>
          <div className="icono"></div>
        </div>

        <div className="medio">
          <div className="medio-titulo">
            <h3>Crear cuenta</h3>
          </div>

          <form className="formulario" onSubmit={onSubmit} noValidate>
            <div className="formulario-interno">
              <div className={errors.nombre ? 'contenedor-input error' : 'contenedor-input'}>
                <input
                  type="text"
                  placeholder="Nombre y apellido"
                  disabled={isSubmitting}
                  {...register('nombre')}
                />
              </div>
              {errors.nombre ? (
                <div className="contenedor-texto-de-error">
                  <p className="texto-de-error">{errors.nombre.message}</p>
                </div>
              ) : (
                <div className="texto-aclaratorio">
                  <p>¿Cuál es tu nombre?</p>
                </div>
              )}

              <div className={errors.email ? 'contenedor-input error' : 'contenedor-input'}>
                <input
                  type="email"
                  placeholder="Correo electrónico"
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

              <div className={errors.password ? 'contenedor-input error' : 'contenedor-input'}>
                <input
                  type="password"
                  placeholder="Contraseña"
                  disabled={isSubmitting}
                  {...register('password')}
                />
              </div>
              <PasswordChecklist password={password} />

              {errors.root && (
                <div className="contenedor-texto-de-error">
                  <p className="texto-de-error">{errors.root.message}</p>
                </div>
              )}

              <div className="contenedor-creacion-cuenta">
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Spinner /> : 'Crear cuenta'}
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
