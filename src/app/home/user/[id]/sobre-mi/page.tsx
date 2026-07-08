'use client';
import React from 'react';
import { useParams } from 'next/navigation';

import SobreMi from '@/components/SobreMi/SobreMi';

const SobreMiUsuario: React.FC = () => {
  const { id } = useParams();

  return <SobreMi id={Number(id)} />;
};

export default SobreMiUsuario;
