'use client';
import React from 'react';

import HeaderDinamico from '@/components/Header/HeaderDinamico';
import PerfilTabs from '@/components/EstructuraMain/PerfilTabs';
import NotFound from '@/components/NotFound/NotFound';
import SkeletonTweet from '@/components/Skeleton/SkeletonTweet';
import { useUserData } from '@/presentation/hooks';

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const { error, loading, userId } = useUserData();

  if (loading) {
    return <SkeletonTweet />;
  }

  if (error) {
    return <NotFound error={error} />;
  }

  return (
    <section>
      <HeaderDinamico id={userId} />
      <div className="main-interior">
        <PerfilTabs base={`/home/user/${userId}`} />
        {children}
      </div>
    </section>
  );
};

export default UserLayout;
