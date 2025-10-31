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
  }
};
 