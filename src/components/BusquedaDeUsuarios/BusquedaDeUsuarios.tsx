"use client"
import React, { useEffect } from 'react'
import Avvvatars from 'avvvatars-react'
import { FaTwitter } from "react-icons/fa";
import { Toaster } from 'react-hot-toast';

import useStore from '@/zustand';
import "./BusquedaDeUsuarios.scss"

interface BusquedaProps {
    usuarios: {
        id: number,
        email: string,
        nombre: string
    }[]
}

interface Seguidor {
    id_a_seguir: number;
}

const BusquedaDeUsuarios: React.FC<BusquedaProps> = ({ usuarios }) => {
    const { datosLogueo, getCookieLogueo, seguirUsuario, eliminarSeguimiento, change, getMisSeguidos, misSeguidos } = useStore();

    useEffect(() => {
        const getData = async () => {
            getCookieLogueo();
            await getMisSeguidos();
        }

        getData();
    }, [getCookieLogueo, datosLogueo?.id, change]);

    return (
        <div className='busqueda-de-usuarios'>
            <div className='contenedor-busqueda-de-usuarios'>

                {usuarios?.map((item, index: number) => (
                    <div key={index} className="contenedor-de-usuarios">
                        <div className="imagen-nombre-email">
                            <div className="imagen">
                                <Avvvatars value={item?.email} style="shape" size={40} />
                            </div>
                            <div className="nombre-y-email">
                                <div className="nombre">
                                    <p> {item?.nombre} </p>
                                </div>
                                <div className="email">
                                    <p> {item?.email} </p>
                                </div>
                            </div>
                        </div>
                        <div className="follow"
                            onClick={() =>
                                Number(datosLogueo?.id) === Number(item?.id)
                                    ? () => { }
                                    : misSeguidos.some((seguidor: Seguidor) => Number(seguidor.id_a_seguir) === Number(item?.id))
                                        ? eliminarSeguimiento(Number(datosLogueo?.id), Number(item?.id))
                                        : seguirUsuario(Number(datosLogueo?.id), Number(item?.id))} >
                            <div className="boton-para-seguir">
                                <div className="bot">
                                    <p>
                                        {
                                            datosLogueo?.id === item?.id
                                                ? "Mi perfil"
                                                :
                                                misSeguidos.some((seguidor: Seguidor) => seguidor.id_a_seguir === item?.id)
                                                    ?
                                                    "Siguiendo"
                                                    :
                                                    "Seguir"
                                        }
                                    </p>
                                </div>
                                {
                                    datosLogueo?.id !== item?.id &&
                                    <div className="icono">
                                        <FaTwitter className="icon" />
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                ))}

                {usuarios?.length === 0 &&
                    <div className="sin-seguidos-seguidores">
                        <p> Sin seguidores ni seguidos </p>
                    </div>
                }

                <Toaster />

            </div>
        </div>
    )
}

export default BusquedaDeUsuarios