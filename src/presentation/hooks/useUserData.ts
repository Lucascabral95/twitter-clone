import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import useStore from '@/zustand';
import { DataUser } from '@/infrastructure/interfaces';
import { userService } from '@/infrastructure/services';

export const useUserData = () => {
  const { id } = useParams();
  const { getTweetsByIDUser, posteosUser } = useStore();
  const [dataUser, setDataUser] = useState<DataUser>({} as DataUser);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getTweetsByIDUser(Number(id));
  }, [getTweetsByIDUser, id]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) return;

      const result = await userService.getUserById(Number(id));
      if (result && result.success) {
        setDataUser(result.data ?? ({} as DataUser));
      } else if (result) {
        setError(result.error);
      }
      setLoading(false);
    };

    fetchUserData();
  }, [id]);

  return {
    dataUser,
    error,
    loading,
    posteosUser,
    userId: Number(id),
  };
};
