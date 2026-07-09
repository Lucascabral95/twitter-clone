import React, { useCallback, useMemo } from 'react';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import useSWR from 'swr';

import { guardarDatos } from '@/utils/functions/DatosPersonales';
import Loading from '../Loading/Loading';
import { Datos, IID, IPosteo } from '@/infrastructure/interfaces';
import './SobreMi.scss';

const fetcher = (url: string) => axios.get(url).then(res => res.data.result[0]);

interface SobreMiProps extends IID {
    editable?: boolean;
}

const datosVacios: IPosteo = {
    biografia: '',
    localizacion: '',
    sitio_web: '',
    cumpleanos: '',
};

const normalizarFecha = (fecha?: string) => {
    if (!fecha) return '';

    return new Date(fecha).toISOString().split('T')[0];
};

const SobreMi: React.FC<SobreMiProps> = ({ id, editable = false }) => {
    const userId = Number(id);
    const puedePedirDatos = Number.isFinite(userId) && userId > 0;

    const { data, isLoading } = useSWR(
        puedePedirDatos ? `/api/datospersonales/${userId}` : null,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            revalidateIfStale: false,
            refreshInterval: 0,
        }
    );

    const datosIniciales = useMemo<IPosteo>(() => data ?? datosVacios, [data]);
    const sinDatos = useMemo(() => !data, [data]);
    const fechaFormateada = useMemo(() => normalizarFecha(datosIniciales.cumpleanos), [datosIniciales.cumpleanos]);

    const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        const formData = new FormData(event.currentTarget);
        const datosFormulario: Datos = {
            ...(datosIniciales as Datos),
            biografia: String(formData.get('biografia') ?? ''),
            localizacion: String(formData.get('localizacion') ?? ''),
            sitio_web: String(formData.get('sitio_web') ?? ''),
            cumpleanos: String(formData.get('cumpleanos') ?? ''),
        };

        guardarDatos(event, datosFormulario, userId, sinDatos);
    }, [datosIniciales, userId, sinDatos]);

    if (!puedePedirDatos || isLoading) {
        return <Loading />;
    }

    return (
        <div className="sobre-mi">
            <div className="contenedor-sobre-mi">
                <form onSubmit={handleSubmit} className="formulario-datos-personales">
                    <div className="contenedor-input">
                        <label htmlFor="biografia">Biograf&iacute;a</label>
                        <input
                            type="text"
                            id="biografia"
                            name="biografia"
                            defaultValue={datosIniciales.biografia}
                            placeholder="Biograf&iacute;a"
                            readOnly={!editable}
                        />
                    </div>
                    <div className="contenedor-input">
                        <label htmlFor="localizacion">Localizaci&oacute;n</label>
                        <input
                            type="text"
                            id="localizacion"
                            name="localizacion"
                            defaultValue={datosIniciales.localizacion}
                            placeholder="Localizaci&oacute;n"
                            readOnly={!editable}
                        />
                    </div>
                    <div className="contenedor-input">
                        <label htmlFor="sitio_web">Sitio web</label>
                        <input
                            type="text"
                            id="sitio_web"
                            name="sitio_web"
                            defaultValue={datosIniciales.sitio_web}
                            placeholder="Sitio Web"
                            readOnly={!editable}
                        />
                    </div>
                    <div className="contenedor-input">
                        <label htmlFor="fechaCumpleanos">Cumplea&ntilde;os</label>
                        <input
                            type="date"
                            id="fechaCumpleanos"
                            name="cumpleanos"
                            readOnly={!editable}
                            defaultValue={fechaFormateada}
                            min="1950-01-01"
                            max="2050-12-31"
                        />
                    </div>
                    {editable && (
                        <div className="contenedor-input-boton">
                            <button type="submit">
                                {!sinDatos ? 'Actualizar' : 'Guardar'}
                            </button>
                        </div>
                    )}
                </form>
                <Toaster />
            </div>
        </div>
    );
};

export default React.memo(SobreMi);