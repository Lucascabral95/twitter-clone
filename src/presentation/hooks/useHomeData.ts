import { useEffect } from 'react';
import moment from 'moment';
moment.locale('es');

import useStore from '@/zustand';

export const useHomeData = () => {
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
    change,
  } = useStore();

  useEffect(() => {
    const fetchInitialData = async () => {
      await getCookieLogueo();
      await getTweetsByID();
      await obtenerSeguidores();
      await getMisSeguidos();
    };

    fetchInitialData();
  }, [getCookieLogueo, getTweetsByID, obtenerSeguidores, getMisSeguidos, limit]);

  useEffect(() => {
    if (datosLogueo?.id) {
      getDatosPersonalesByID(datosLogueo.id);
    }
  }, [datosLogueo?.id, getDatosPersonalesByID]);

  useEffect(() => {
    getTweetsOfHome();
  }, [getTweetsOfHome, change]);

  return {
    datosLogueo,
    datosPersonales,
    misSeguidos,
    seguidores,
    posteosHome,
  };
};
