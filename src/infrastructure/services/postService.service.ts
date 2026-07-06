import axios, { AxiosError } from 'axios';
import { CreatePostPayload } from '../interfaces';

export const postService = {
  async createPost(payload: CreatePostPayload) {
    try {
      const response = await axios.post('/api/posteo', payload);
      return { success: true, data: response.data };
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      const errorMessage = axiosError.response?.data?.error || 'Error al crear el posteo';
      return { success: false, error: errorMessage };
    }
  },

  async updatePost(id: number, cambios: { titulo?: string; contenido?: string }) {
    try {
      const response = await axios.patch(`/api/posteo/${id}`, cambios);
      return { success: true, data: response.data };
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      const errorMessage = axiosError.response?.data?.error || 'Error al editar el posteo';
      return { success: false, error: errorMessage };
    }
  },

  async deletePost(id: number) {
    try {
      const response = await axios.delete(`/api/posteo/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      const errorMessage = axiosError.response?.data?.error || 'Error al borrar el posteo';
      return { success: false, error: errorMessage };
    }
  }
};
 