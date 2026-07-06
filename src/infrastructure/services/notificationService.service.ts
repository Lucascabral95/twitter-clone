import axios, { AxiosError } from 'axios';

export interface NotificacionDTO {
  id: number;
  usuario_id: number;
  tipo: 'like' | 'follow' | 'comment' | 'repost';
  actor_id: number;
  entidad_id: number | null;
  leida: boolean;
  created_at: string;
  actor_nombre: string;
  actor_email: string;
}

export const notificationService = {
  async getUnreadCount() {
    try {
      const response = await axios.get<{ result: { total: number } }>('/api/notificaciones/count');
      return { success: true, data: response.data.result.total };
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      return { success: false, error: axiosError.response?.data?.error || 'Error al obtener notificaciones' };
    }
  },

  async getNotifications(cursor?: number) {
    try {
      const params = cursor ? `?cursor=${cursor}` : '';
      const response = await axios.get(`/api/notificaciones${params}`);
      return { success: true, data: response.data.result as NotificacionDTO[], pagination: response.data.pagination };
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      return { success: false, error: axiosError.response?.data?.error || 'Error al obtener notificaciones' };
    }
  },

  async markAllRead() {
    try {
      await axios.put('/api/notificaciones/marcar-leidas');
      return { success: true };
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      return { success: false, error: axiosError.response?.data?.error || 'Error al marcar como leídas' };
    }
  },
};
