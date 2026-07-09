'use client';
import React from 'react';
import { useParams } from 'next/navigation';

import CardTweet from '@/components/EstructuraMain/CardTweet';
import useStore from '@/zustand';

const InicioUsuario: React.FC = () => {
  const { id } = useParams();
  const posteosUser = useStore((s) => s.posteosUser);
  const hasMoreTweetsUser = useStore((s) => s.hasMoreTweetsUser);
  const loadMoreTweetsUser = useStore((s) => s.loadMoreTweetsUser);

  return (
    <CardTweet
      posteos={posteosUser}
      hasMore={hasMoreTweetsUser}
      onLoadMore={() => loadMoreTweetsUser(Number(id))}
    />
  );
};

export default InicioUsuario;
