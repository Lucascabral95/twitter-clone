import { useEffect, useState } from 'react';
import { mutate } from 'swr';
import { notificationService, NotificacionDTO } from '@/infrastructure/services';

export const useNotifications = () => {
  const [notificaciones, setNotificaciones] = useState<NotificacionDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      const result = await notificationService.getNotifications();

      if (result.success && result.data) {
        setNotificaciones(result.data);
      }

      setLoading(false);

      // Se marcan como leídas al abrir la página; refresca el badge del navbar
      // (misma key de SWR que usa useNotificationsBadge) sin necesitar recargar.
      await notificationService.markAllRead();
      mutate('/api/notificaciones/count');
    };

    cargar();
  }, []);

  return { notificaciones, loading };
};
