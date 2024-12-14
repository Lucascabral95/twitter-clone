"use client"
import moment from 'moment';
moment.locale('es');
import React, { useEffect } from "react";
import Header from "@/components/Header/Header";
import CardSecciones from "@/components/EstructuraMain/CardSecciones";
import useStore from '@/zustand';

const Home: React.FC = () => {
  const {
    getCookieLogueo,
    datosLogueo,
    getTweetsByID,
    limit,
    getDatosPersonalesByID,
    datosPersonales,
    misSeguidos,
    seguidores,
    obtenerSeguidores,
    getMisSeguidos,
    posteosHome,
    getTweetsOfHome, 
    change
  } = useStore();

  useEffect(() => {
    const fetchData = async () => {
      await getTweetsByID();
      await getCookieLogueo();
      await obtenerSeguidores();
      await getMisSeguidos();
    };

    fetchData();
  }, [getCookieLogueo, getTweetsByID, limit]);

  useEffect(() => {
    if (datosLogueo?.id) {
      getDatosPersonalesByID(datosLogueo.id);
    }
  }, [datosLogueo?.id]);
  
  useEffect(() => {
       getTweetsOfHome();
  }, [getTweetsOfHome, change])

  return (
    <div className="home">
      <div className="contenedor-home">

        <Header dataUser={datosLogueo} misDatosPersonales={datosPersonales} seguidos={misSeguidos} seguidores={seguidores} />
        <CardSecciones id={Number(datosLogueo?.id)} publicaciones={posteosHome} />

      </div>
    </div>
  );
};

export default Home;
