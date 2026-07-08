'use client';
import React from 'react';

import CardTweet from '@/components/EstructuraMain/CardTweet';
import useStore from '@/zustand';
import { useReposteos } from '@/presentation/hooks';

const ReposteosPerfil: React.FC = () => {
  const datosLogueo = useStore((s) => s.datosLogueo);
  const reposteos = useReposteos(datosLogueo?.id);

  return <CardTweet posteos={reposteos} />;
};

export default ReposteosPerfil;
