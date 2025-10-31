import axios, { AxiosError } from 'axios';
import { DataUser } from '../interfaces';

export const userService = {
  async getUserById(id: number) {
    try {
      const response = await axios.get(`/api/usuario/${id}`);
      if (response.status === 200) {
        return { success: true, data: response.data.result[0] as DataUser };
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400 || error.response?.status === 404) {
          return { success: false, error: error.response.data.error };
        }
      }
      return { success: false, error: 'Error desconocido' };
    }
  }
};
