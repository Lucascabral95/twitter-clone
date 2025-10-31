'use client';
import React from 'react';
import Image from 'next/image';

import Footer from '@/components/Footer/Footer';
import Register from '@/components/Register/Register';
import Login from '@/components/Register/Login';
import { useAuthModals } from '@/presentation/hooks';
import './App.scss';

const Home: React.FC = () => {
  const { isOpenRegister, isOpenLogin, openRegister, openLogin, closeRegister, closeLogin } = useAuthModals();

  return (
    <div className="pagina-principal">
      <div className="pagina-principal-contenedor">
        <div className="secciones-inicio">
          <div className="contenedores-medios">
            <div className="medio-contenedor medio-contenedor-logo">
              <div className="imagen-logo">
                <Image
                  className="imagen"
                  src="/img/twitter.svg"
                  alt="Logo"
                  width={380}
                  height={340}
                />
              </div>
            </div>

            <div className="medio-contenedor medio-contenedor-form">
              <div className="imagen-de-logo">
                <Image
                  className="imagen-d-e-logo"
                  src="/img/twitter.svg"
                  alt="Logo"
                  width={100}
                  height={100}
                />
              </div>

              <div className="titulo-home">
                <h2>Lo que está pasando ahora</h2>
              </div>

              <div className="subtitulo-home">
                <h3>Unite hoy</h3>
              </div>

              <div className="crear-cuenta">
                <button className="crear-cuenta-boton" onClick={openRegister}>
                  Crear cuenta
                </button>
              </div>

              <div className="terminos-condiciones">
                <p>
                  Al registrarte, aceptás los Términos y Condiciones y la Política de privacidad,
                  incluida la política de Uso de Cookies.
                </p>
              </div>

              <div className="tenes-cuenta">
                <div className="texto">
                  <p>¿Ya tenés una cuenta?</p>
                </div>

                {isOpenRegister && (
                  <Register setIsOpenRegister={closeRegister} setIsOpenLogin={openLogin} />
                )}

                <div className="boton-inicio-sesion">
                  <button onClick={openLogin}>Iniciar sesión</button>
                </div>

                {isOpenLogin && <Login setIsOpenLogin={closeLogin} />}
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Home;
