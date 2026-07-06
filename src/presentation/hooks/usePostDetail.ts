import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';

import { IIPosteo } from '@/infrastructure/interfaces';
import useStore from '@/zustand';
import { postDetailService } from '@/infrastructure/services';

export const usePostDetail = () => {
  const { id } = useParams();
  const getCookieLogueo = useStore((s) => s.getCookieLogueo);
  const datosLogueo = useStore((s) => s.datosLogueo);
  const existeEnMiListaDeAmigos = useStore((s) => s.existeEnMiListaDeAmigos);
  const [dataPosteo, setDataPosteo] = useState<IIPosteo>({} as IIPosteo);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [detalleError, setDetalleError] = useState('');

useEffect(() => {
  const fetchPostDetail = async () => {
    if (!id) return;

    setLoading(true);
    const result = await postDetailService.getPostById(id);

    if (result.success && result.data) {
      setDataPosteo(result.data);
    } else {
      setError(true);
      setDetalleError(result.error ?? 'Error al obtener el post');
    }

    setLoading(false);
  };

  fetchPostDetail();
}, [id]);


  useEffect(() => {
    const fetchUserData = async () => {
      await getCookieLogueo();
      if (datosLogueo?.id && dataPosteo?.creador_id) {
        await existeEnMiListaDeAmigos(datosLogueo.id, dataPosteo.creador_id);
      }
    };

    fetchUserData();
  }, [getCookieLogueo, datosLogueo?.id, dataPosteo?.creador_id, existeEnMiListaDeAmigos]);

  const handleLike = useCallback(async () => {
    if (!dataPosteo?.posteo_id) return;

    setDataPosteo((prev) => ({ ...prev, likes: (prev.likes ?? 0) + 1 }));

    try {
      const { data } = await axios.put(`/api/posteo/${dataPosteo.posteo_id}`);
      const likesReales = data?.result?.likes;

      if (typeof likesReales === 'number') {
        setDataPosteo((prev) => ({ ...prev, likes: likesReales }));
      }
    } catch (error) {
      setDataPosteo((prev) => ({ ...prev, likes: Math.max((prev.likes ?? 1) - 1, 0) }));

      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.error ?? 'Error al dar like', {
          position: 'top-center',
          duration: 2500,
        });
      }
    }
  }, [dataPosteo?.posteo_id]);

  return {
    dataPosteo,
    loading,
    error,
    detalleError,
    datosLogueo,
    handleLike,
  };
};
