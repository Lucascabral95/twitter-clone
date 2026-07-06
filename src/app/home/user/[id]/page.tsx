'use client';

import React from 'react';
import CardSecciones from '@/components/EstructuraMain/CardSecciones';
import HeaderDinamico from '@/components/Header/HeaderDinamico';
import NotFound from '@/components/NotFound/NotFound';
import SkeletonTweet from '@/components/Skeleton/SkeletonTweet';
import { useUserData } from '@/presentation/hooks';

const UserID: React.FC = () => {
  const { error, loading, posteosUser, userId, hasMoreTweetsUser, loadMoreTweetsUser } = useUserData();

  if (loading) {
    return <SkeletonTweet />;
  }

  return (
    <section>
      {!error ? (
        <>
          <HeaderDinamico id={userId} />
          <CardSecciones
            id={userId}
            publicaciones={posteosUser}
            hasMorePublicaciones={hasMoreTweetsUser}
            onLoadMorePublicaciones={loadMoreTweetsUser}
          />
        </>
      ) : (
        <NotFound error={error} />
      )}
    </section>
  );
};

export default UserID;
