'use client';
import React from 'react';

import CardTweet from '@/components/EstructuraMain/CardTweet';
import SkeletonTweet from '@/components/Skeleton/SkeletonTweet';
import useStore from '@/zustand';

const InicioPerfil: React.FC = () => {
  const loading = useStore((s) => s.loading);
  const posteosHome = useStore((s) => s.posteosHome);
  const hasMoreTweetsHome = useStore((s) => s.hasMoreTweetsHome);
  const loadMoreTweetsHome = useStore((s) => s.loadMoreTweetsHome);

  if (loading && posteosHome.length === 0) {
    return <SkeletonTweet />;
  }

  return (
    <CardTweet posteos={posteosHome} hasMore={hasMoreTweetsHome} onLoadMore={loadMoreTweetsHome} />
  );
};

export default InicioPerfil;
