'use client';
import React from 'react';
import Image from 'next/image';

import Footer from '@/components/Footer/Footer';
import Register from '@/components/Register/Register';
import Login from '@/components/Register/Login';
import { useAuthModals } from '@/presentation/hooks';
import './page.scss';

const Home: React.FC = () => {
  const { isOpenRegister, isOpenLogin, openRegister, openLogin, closeRegister, closeLogin } = useAuthModals();

  return (
    <div className="landing">
      <div className="split">
        <div className="panel-logo">
          <div className="mark">
            <Image src="/img/twitter.svg" alt="Logo" width={48} height={48} priority />
          </div>
        </div>

        <div className="panel-form">
          <div className="lockup">
            <div className="mark">
              <Image src="/img/twitter.svg" alt="Logo" width={20} height={20} />
            </div>
          </div>

          <h1>Lo que está pasando ahora</h1>
          <h2 className="sub">Unite hoy</h2>

          <button className="btn-primary" onClick={openRegister}>
            Crear cuenta
          </button>

          <p className="terms">
            Al registrarte, aceptás los Términos y Condiciones y la Política de privacidad,
            incluida la política de Uso de Cookies.
          </p>

          <div className="tenes-cuenta">
            <p>¿Ya tenés una cuenta?</p>
            <button className="btn-secondary" onClick={openLogin}>
              Iniciar sesión
            </button>
          </div>
        </div>
      </div>

      <Footer />

      {isOpenRegister && <Register onClose={closeRegister} />}
      {isOpenLogin && <Login onClose={closeLogin} />}
    </div>
  );
};

export default Home;
