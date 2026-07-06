import { useEffect } from 'react';

import useStore from '@/zustand';

export const useHomeData = () => {
  const getCookieLogueo = useStore((s) => s.getCookieLogueo);
  const datosLogueo = useStore((s) => s.datosLogueo);
  const getTweetsByID = useStore((s) => s.getTweetsByID);
  const limit = useStore((s) => s.limit);
  const getDatosPersonalesByID = useStore((s) => s.getDatosPersonalesByID);
  const datosPersonales = useStore((s) => s.datosPersonales);
  const misSeguidos = useStore((s) => s.misSeguidos);
  const seguidores = useStore((s) => s.seguidores);
  const obtenerSeguidores = useStore((s) => s.obtenerSeguidores);
  const getMisSeguidos = useStore((s) => s.getMisSeguidos);
  const posteosHome = useStore((s) => s.posteosHome);
  const getTweetsOfHome = useStore((s) => s.getTweetsOfHome);
  const change = useStore((s) => s.change);
  const hasMoreTweetsHome = useStore((s) => s.hasMoreTweetsHome);
  const loadMoreTweetsHome = useStore((s) => s.loadMoreTweetsHome);

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
    hasMoreTweetsHome,
    loadMoreTweetsHome,
  };
};
