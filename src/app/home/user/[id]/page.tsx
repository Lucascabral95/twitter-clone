'use client';
import React from 'react';
import { useParams } from 'next/navigation';

import CardTweet from '@/components/EstructuraMain/CardTweet';
import useStore from '@/zustand';

const InicioUsuario: React.FC = () => {
  const { id } = useParams();
  const userId = Number(id);
  const posteosUser = useStore((s) => s.posteosUser);
  const posteosUserOwnerId = useStore((s) => s.posteosUserOwnerId);
  const hasMoreTweetsUser = useStore((s) => s.hasMoreTweetsUser);
  const loadMoreTweetsUser = useStore((s) => s.loadMoreTweetsUser);
  const isCurrentUserFeed = Number.isFinite(userId) && posteosUserOwnerId === userId;

  return (
    <CardTweet
      posteos={isCurrentUserFeed ? posteosUser : []}
      hasMore={isCurrentUserFeed ? hasMoreTweetsUser : false}
      onLoadMore={() => loadMoreTweetsUser(userId)}
    />
  );
};

export default InicioUsuario;
