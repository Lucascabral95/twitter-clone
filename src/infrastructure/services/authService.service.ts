import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';

import { LoginCredentials, RegisterCredentials } from '../interfaces';

export const authService = {
  async login(credentials: LoginCredentials) {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      if (response.status === 200) {
        toast.success('Login exitoso');
        return { success: true, data: response.data };
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.error || 'Error en el login';
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
      toast.error('Error inesperado');
      return { success: false, error: 'Error inesperado' };
    }
  },

  async register(credentials: RegisterCredentials) {
    try {
      const response = await axios.post('/api/auth/register', credentials);
      if (response.status === 200 || response.status === 201) {
        toast.success('Cuenta creada exitosamente');
        return { success: true, data: response.data };
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.error || 'Error en el registro';
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
      toast.error('Error inesperado');
      return { success: false, error: 'Error inesperado' };
    }
  }
};
