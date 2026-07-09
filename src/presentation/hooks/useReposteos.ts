import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';

interface Reposteo {
  contenido: string;
  creador_id: number;
  created_at: string;
  email: string;
  fecha_creacion: string;
  id: number;
  identificador: string;
  likes: number;
  nombre: string;
  posteo_id: number;
  titulo: string;
  updated_at: string;
}

export const useReposteos = (id?: number) => {
  const [reposteos, setReposteos] = useState<Reposteo[]>([]);

  useEffect(() => {
    if (!id) return;

    const obtenerReposteos = async () => {
      try {
        const result = await axios.get(`/api/reposteos/${id}`);

        if (result.status === 200) {
          setReposteos(result.data.result);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          console.log(error.response?.data?.error ?? error);
        }
      }
    };

    obtenerReposteos();
  }, [id]);

  return reposteos;
};
