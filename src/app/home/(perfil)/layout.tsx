'use client';
import React from 'react';

import Header from '@/components/Header/Header';
import PerfilTabs from '@/components/EstructuraMain/PerfilTabs';
import { useHomeData } from '@/presentation/hooks';

const PerfilLayout = ({ children }: { children: React.ReactNode }) => {
  const { datosLogueo, datosPersonales, misSeguidos, seguidores } = useHomeData();

  return (
    <div className="home">
      <div className="contenedor-home">
        <Header
          dataUser={datosLogueo}
          misDatosPersonales={datosPersonales}
          seguidos={misSeguidos}
          seguidores={seguidores}
        />
        <div className="main-interior">
          <PerfilTabs base="/home" />
          {children}
        </div>
      </div>
    </div>
  );
};

export default PerfilLayout;
