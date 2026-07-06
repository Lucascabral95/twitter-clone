import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';

import { IIPosteo } from '@/infrastructure/interfaces';
import useStore from '@/zustand';
import { postDetailService, postService } from '@/infrastructure/services';

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

    const yaLikeadoPrevio = dataPosteo.ya_likeado ?? false;

    setDataPosteo((prev) => ({
      ...prev,
      ya_likeado: !yaLikeadoPrevio,
      likes: (prev.likes ?? 0) + (yaLikeadoPrevio ? -1 : 1),
    }));

    try {
      const { data } = await axios.put(`/api/posteo/${dataPosteo.posteo_id}`);
      const { liked, likes } = data?.result ?? {};

      setDataPosteo((prev) => ({
        ...prev,
        ya_likeado: typeof liked === 'boolean' ? liked : prev.ya_likeado,
        likes: typeof likes === 'number' ? likes : prev.likes,
      }));
    } catch (error) {
      setDataPosteo((prev) => ({ ...prev, ya_likeado: yaLikeadoPrevio, likes: dataPosteo.likes }));

      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.error ?? 'Error al dar like', {
          position: 'top-center',
          duration: 2500,
        });
      }
    }
  }, [dataPosteo?.posteo_id, dataPosteo?.ya_likeado, dataPosteo?.likes]);

  const handleUpdate = useCallback(async (titulo: string, contenido: string) => {
    if (!dataPosteo?.posteo_id) return false;

    const result = await postService.updatePost(dataPosteo.posteo_id, { titulo, contenido });

    if (result.success) {
      setDataPosteo((prev) => ({ ...prev, titulo, posteo_contenido: contenido }));
      toast.success('Posteo actualizado');
      return true;
    }

    toast.error(result.error ?? 'Error al editar el posteo');
    return false;
  }, [dataPosteo?.posteo_id]);

  const handleDelete = useCallback(async () => {
    if (!dataPosteo?.posteo_id) return false;

    const result = await postService.deletePost(dataPosteo.posteo_id);

    if (result.success) {
      toast.success('Posteo borrado');
      return true;
    }

    toast.error(result.error ?? 'Error al borrar el posteo');
    return false;
  }, [dataPosteo?.posteo_id]);

  return {
    dataPosteo,
    loading,
    error,
    detalleError,
    datosLogueo,
    handleLike,
    handleUpdate,
    handleDelete,
  };
};
