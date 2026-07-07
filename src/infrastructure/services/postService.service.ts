import axios from 'axios';
import { CreatePostPayload } from '../interfaces';

function getAxiosErrorMessage(error: unknown, fallback: string): string {
  const responseData = (error as { response?: { data?: { error?: string; result?: string } } }).response?.data;
  return responseData?.error || responseData?.result || fallback;
}

export const postService = {
  async createPost(payload: CreatePostPayload) {
    try {
      const response = await axios.post('/api/posteo', payload);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: getAxiosErrorMessage(error, 'Error al crear el posteo') };
    }
  },

  async updatePost(id: number, cambios: { titulo?: string; contenido?: string }) {
    try {
      const response = await axios.patch(`/api/posteo/${id}`, cambios);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: getAxiosErrorMessage(error, 'Error al editar el posteo') };
    }
  },

  async deletePost(id: number) {
    try {
      const response = await axios.delete(`/api/posteo/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: getAxiosErrorMessage(error, 'Error al borrar el posteo') };
    }
  }
};

