import React, { useEffect, useState } from 'react';
import './SobreMi.scss';
import axios, { AxiosError } from 'axios';
import { Toaster } from 'react-hot-toast';
import { guardarDatos } from '@/utils/functions/DatosPersonales';
import { usePathname } from 'next/navigation';
import Loading from '../Loading/Loading';

interface IPosteo {
    biografia: string;
    localizacion: string;
    sitio_web: string;
    cumpleanos: string;
}

interface IID {
    id: number
}

interface Datos {
    biografia: string;
    created_at: string;
    cumpleanos: string;
    id: number;
    localizacion: string;
    sitio_web: string;
    updated_at: string;
    usuario_id: number;
}


const SobreMi: React.FC<IID> = ({ id }) => {
    const [datos, setDatos] = useState<IPosteo>({
        biografia: '',
        localizacion: '',
        sitio_web: '',
        cumpleanos: ''
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [sinDatos, setSinDatos] = useState<boolean>(false);
    const pathname = usePathname();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setDatos({ ...datos, [name]: value });
    };

    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                const response = await axios.get(`/api/datospersonales/${Number(id)}`);

                if (response.status === 200) {
                    setDatos(response.data.result[0]);
                }
            } catch (error) {
                if (error instanceof AxiosError) {
                    if (error.response) {
                        console.log("Sin datos");
                        setSinDatos(true);
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        obtenerDatos();
    }, [id]);

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <div className="sobre-mi">
            <div className="contenedor-sobre-mi">
                <form onSubmit={(event) => guardarDatos(event, datos as Datos, id, sinDatos)} className="formulario-datos-personales">
                    <div className="contenedor-input">
                        <label htmlFor="fechaCumpleaños">Biografía</label>
                        <input type="text" name="biografia" value={datos?.biografia} placeholder="Biografía" onChange={handleChange} readOnly={pathname !== "/home"} />
                    </div>
                    <div className="contenedor-input">
                        <label htmlFor="fechaCumpleaños">Localización</label>
                        <input type="text" name="localizacion" value={datos?.localizacion} placeholder="Localización" onChange={handleChange} readOnly={pathname !== "/home"} />
                    </div>
                    <div className="contenedor-input">
                        <label htmlFor="fechaCumpleaños">Sitio web</label>
                        <input type="text" name="sitio_web" value={datos?.sitio_web} placeholder="Sitio Web" onChange={handleChange} readOnly={pathname !== "/home"} />
                    </div>
                    <div className="contenedor-input">
                        <label htmlFor="fechaCumpleaños">Cumpleaños</label>
                        <input type="date" name="cumpleanos" id="fechaCumpleaños" readOnly={pathname !== "/home"}
                            value={
                                datos?.cumpleanos
                                    ? new Date(datos.cumpleanos).toISOString().split("T")[0]
                                    : ""
                            }
                            min="1950-01-01" max="2050-12-31" onChange={handleChange} />
                    </div>
                    {pathname === "/home" &&
                        <div className="contenedor-input-boton">
                            <button type="submit">
                                {!sinDatos ? "Actualizar" : "Guardar"}
                            </button>
                        </div>
                    }
                </form>

                <Toaster />

            </div>
        </div>
    );
};

export default SobreMi;
