import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { IIPosteo } from '@/infrastructure/interfaces';
import useStore from '@/zustand';
import { postDetailService } from '@/infrastructure/services';

export const usePostDetail = () => {
  const { id } = useParams();
  const { getCookieLogueo, datosLogueo, existeEnMiListaDeAmigos } = useStore();
  const [dataPosteo, setDataPosteo] = useState<IIPosteo>({} as IIPosteo);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [detalleError, setDetalleError] = useState('');

//   useEffect(() => {
//     const fetchPostDetail = async () => {
//       if (!id) return;

//       const result = await postDetailService.getPostById(id);
//       if (result.success) {
//         setDataPosteo(result.data);
//       } else {
//         setError(true);
//         setDetalleError(result.error);
//       }
//       setLoading(false);
//     };

//     fetchPostDetail();
//   }, [id]);
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

  return {
    dataPosteo,
    loading,
    error,
    detalleError,
    datosLogueo,
  };
};
