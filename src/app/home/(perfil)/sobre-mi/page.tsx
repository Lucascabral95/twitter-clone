'use client';
import React from 'react';

import SobreMi from '@/components/SobreMi/SobreMi';
import useStore from '@/zustand';

const SobreMiPerfil: React.FC = () => {
  const datosLogueo = useStore((s) => s.datosLogueo);

  return <SobreMi id={Number(datosLogueo?.id)} editable />;
};

export default SobreMiPerfil;
