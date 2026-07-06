import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/es';

dayjs.extend(localizedFormat);
dayjs.locale('es');

export const formatearFecha = (fecha?: string | Date, formato: string = 'LL'): string => {
    if (!fecha) return '';
    return dayjs(fecha).format(formato);
};
