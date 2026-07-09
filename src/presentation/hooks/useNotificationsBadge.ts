import useSWR from 'swr';
import { notificationService } from '@/infrastructure/services';

const fetcher = async () => {
  const result = await notificationService.getUnreadCount();
  return result.success ? result.data : 0;
};

export const useNotificationsBadge = (habilitado: boolean) => {
  const { data, mutate } = useSWR(habilitado ? '/api/notificaciones/count' : null, fetcher, {
    refreshInterval: 0,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    dedupingInterval: 60_000,
  });

  return { noLeidas: data ?? 0, refrescar: mutate };
};