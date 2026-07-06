import useSWR from 'swr';
import { notificationService } from '@/infrastructure/services';

const fetcher = async () => {
  const result = await notificationService.getUnreadCount();
  return result.success ? result.data : 0;
};

// Polling moderado (no un feed completo, solo un count liviano) para reflejar
// notificaciones nuevas sin necesitar WebSockets/SSE.
export const useNotificationsBadge = (habilitado: boolean) => {
  const { data, mutate } = useSWR(habilitado ? '/api/notificaciones/count' : null, fetcher, {
    refreshInterval: 30_000,
    revalidateOnFocus: true,
    dedupingInterval: 5_000,
  });

  return { noLeidas: data ?? 0, refrescar: mutate };
};
