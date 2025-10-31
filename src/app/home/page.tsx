'use client';
import React from 'react';

import Header from '@/components/Header/Header';
import CardSecciones from '@/components/EstructuraMain/CardSecciones';
import { useHomeData } from '@/presentation/hooks';

const Home: React.FC = () => {
  const { datosLogueo, datosPersonales, misSeguidos, seguidores, posteosHome } = useHomeData();

  return (
    <div className="home">
      <div className="contenedor-home">
        <Header
          dataUser={datosLogueo}
          misDatosPersonales={datosPersonales}
          seguidos={misSeguidos}
          seguidores={seguidores}
        />
        <CardSecciones id={Number(datosLogueo?.id)} publicaciones={posteosHome} />
      </div>
    </div>
  );
};

export default Home;
