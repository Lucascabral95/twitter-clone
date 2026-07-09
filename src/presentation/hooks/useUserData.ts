import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import useStore from '@/zustand';
import { DataUser } from '@/infrastructure/interfaces';
import { useProfileData } from './useProfileData';

function getErrorMessage(error: unknown): string {
  const responseError = (error as { response?: { data?: { error?: string } } })?.response?.data?.error;
  return responseError ?? 'Usuario no encontrado';
}

export const useUserData = () => {
  const { id } = useParams();
  const userId = Number(id);
  const validUserId = Number.isFinite(userId) && userId > 0;
  const getTweetsByIDUser = useStore((s) => s.getTweetsByIDUser);
  const posteosUser = useStore((s) => s.posteosUser);
  const posteosUserOwnerId = useStore((s) => s.posteosUserOwnerId);
  const loadingTweetsUser = useStore((s) => s.loadingTweetsUser);
  const posteosUserError = useStore((s) => s.posteosUserError);
  const hasMoreTweetsUser = useStore((s) => s.hasMoreTweetsUser);
  const loadMoreTweetsUser = useStore((s) => s.loadMoreTweetsUser);
  const { profile, error: profileError, loading: profileLoading } = useProfileData(validUserId ? userId : null);

  useEffect(() => {
    if (!validUserId) return;
    getTweetsByIDUser(userId);
  }, [getTweetsByIDUser, userId, validUserId]);

  const tweetsReady = validUserId && posteosUserOwnerId === userId;
  const error = !validUserId
    ? 'Usuario no encontrado'
    : profileError
      ? getErrorMessage(profileError)
      : posteosUserError;
  const loading = validUserId && !error && (profileLoading || loadingTweetsUser || !tweetsReady);

  return {
    dataUser: profile?.usuario ?? ({} as DataUser),
    error,
    loading,
    posteosUser: tweetsReady ? posteosUser : [],
    userId,
    hasMoreTweetsUser: tweetsReady ? hasMoreTweetsUser : false,
    loadMoreTweetsUser: () => loadMoreTweetsUser(userId),
  };
};
