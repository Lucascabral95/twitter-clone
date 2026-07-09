'use client';
import React from 'react';

import Loading from '@/components/Loading/Loading';
import SobreMi from '@/components/SobreMi/SobreMi';
import useStore from '@/zustand';

const SobreMiPerfil: React.FC = () => {
  const userId = useStore((s) => s.datosLogueo?.id);

  if (!userId) return <Loading />;

  return <SobreMi id={userId} editable />;
};

export default SobreMiPerfil;
