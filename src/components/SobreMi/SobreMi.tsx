import React, { useCallback, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import useSWR from 'swr';

import { guardarDatos } from '@/utils/functions/DatosPersonales';
import Loading from '../Loading/Loading';
import { Datos, IID, IPosteo } from '@/infrastructure/interfaces';
import './SobreMi.scss';

const fetcher = (url: string) => axios.get(url).then(res => res.data.result[0]);

const SobreMi: React.FC<IID> = ({ id }) => {
    const [datos, setDatos] = useState<IPosteo>({
        biografia: '',
        localizacion: '',
        sitio_web: '',
        cumpleanos: ''
    });
    
    const pathname = usePathname();
    const isEditable = useMemo(() => pathname === "/home", [pathname]);
    
    const { error, isLoading } = useSWR(
        `/api/datospersonales/${Number(id)}`,
        fetcher,
        {
            revalidateOnFocus: false,
            onSuccess: (data) => {
                if (data) setDatos(data);
            }
        }
    );

    const sinDatos = useMemo(() => !!error, [error]);

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setDatos(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        guardarDatos(event, datos as Datos, id, sinDatos);
    }, [datos, id, sinDatos]);
    const fechaFormateada = useMemo(() => {
        return datos?.cumpleanos
            ? new Date(datos.cumpleanos).toISOString().split("T")[0]
            : "";
    }, [datos?.cumpleanos]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="sobre-mi">
            <div className="contenedor-sobre-mi">
                <form onSubmit={handleSubmit} className="formulario-datos-personales">
                    <div className="contenedor-input">
                        <label htmlFor="biografia">Biografía</label>
                        <input
                            type="text"
                            id="biografia"
                            name="biografia"
                            value={datos?.biografia}
                            placeholder="Biografía"
                            onChange={handleChange}
                            readOnly={!isEditable}
                        />
                    </div>
                    <div className="contenedor-input">
                        <label htmlFor="localizacion">Localización</label>
                        <input
                            type="text"
                            id="localizacion"
                            name="localizacion"
                            value={datos?.localizacion}
                            placeholder="Localización"
                            onChange={handleChange}
                            readOnly={!isEditable}
                        />
                    </div>
                    <div className="contenedor-input">
                        <label htmlFor="sitio_web">Sitio web</label>
                        <input
                            type="text"
                            id="sitio_web"
                            name="sitio_web"
                            value={datos?.sitio_web}
                            placeholder="Sitio Web"
                            onChange={handleChange}
                            readOnly={!isEditable}
                        />
                    </div>
                    <div className="contenedor-input">
                        <label htmlFor="fechaCumpleaños">Cumpleaños</label>
                        <input
                            type="date"
                            id="fechaCumpleaños"
                            name="cumpleanos"
                            readOnly={!isEditable}
                            value={fechaFormateada}
                            min="1950-01-01"
                            max="2050-12-31"
                            onChange={handleChange}
                        />
                    </div>
                    {isEditable && (
                        <div className="contenedor-input-boton">
                            <button type="submit">
                                {!sinDatos ? "Actualizar" : "Guardar"}
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
