'use client';

import React from 'react';
import CardSecciones from '@/components/EstructuraMain/CardSecciones';
import HeaderDinamico from '@/components/Header/HeaderDinamico';
import NotFound from '@/components/NotFound/NotFound';
import Loading from '@/components/Loading/Loading';
import { useUserData } from '@/presentation/hooks';

const UserID: React.FC = () => {
  const { error, loading, posteosUser, userId } = useUserData();

  if (loading) {
    return <Loading />;
  }

  return (
    <section>
      {!error ? (
        <>
          <HeaderDinamico id={userId} />
          <CardSecciones id={userId} publicaciones={posteosUser} />
        </>
      ) : (
        <NotFound error={error} />
      )}
    </section>
  );
};

export default UserID;
