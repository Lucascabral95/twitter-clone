import axios, { AxiosError } from 'axios';
import { IIPosteo } from '@/infrastructure/interfaces';

export const postDetailService = {
  async getPostById(id: string | string[]) {
    try {
      const response = await axios.get(`/api/post/${id}`);

      if (response.status === 200 && response.data?.result?.[0]) {
        return { success: true, data: response.data.result[0] as IIPosteo };
      }

      return { success: false, error: 'No se encontró el posteo.' };
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message =
          error.response?.data?.error ||
          (status === 404
            ? 'Post no encontrado'
            : status === 400
            ? 'Solicitud incorrecta'
            : 'Error en la solicitud');

        return { success: false, error: message };
      }

      return { success: false, error: 'Error desconocido' };
    }
  },
};
