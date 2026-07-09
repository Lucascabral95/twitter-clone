'use client';
import React from 'react';
import { useParams } from 'next/navigation';

import CardTweet from '@/components/EstructuraMain/CardTweet';
import { useReposteos } from '@/presentation/hooks';

const ReposteosUsuario: React.FC = () => {
  const { id } = useParams();
  const reposteos = useReposteos(Number(id));

  return <CardTweet posteos={reposteos} mensajeVacio="Este usuario no tiene reposteos." />;
};

export default ReposteosUsuario;
