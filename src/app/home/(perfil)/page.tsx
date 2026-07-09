'use client';
import React from 'react';

import CardTweet from '@/components/EstructuraMain/CardTweet';
import useStore from '@/zustand';

const InicioPerfil: React.FC = () => {
  const posteosHome = useStore((s) => s.posteosHome);
  const hasMoreTweetsHome = useStore((s) => s.hasMoreTweetsHome);
  const loadMoreTweetsHome = useStore((s) => s.loadMoreTweetsHome);

  return (
    <CardTweet
      posteos={posteosHome}
      hasMore={hasMoreTweetsHome}
      onLoadMore={loadMoreTweetsHome}
      mensajeVacio="Todavía no tenés posteos."
    />
  );
};

export default InicioPerfil;
