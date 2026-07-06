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
    const datosLogueo = useStore((s) => s.datosLogueo);
    const getCookieLogueo = useStore((s) => s.getCookieLogueo);
    const seguirUsuario = useStore((s) => s.seguirUsuario);
    const eliminarSeguimiento = useStore((s) => s.eliminarSeguimiento);
    const change = useStore((s) => s.change);
    const getMisSeguidos = useStore((s) => s.getMisSeguidos);
    const misSeguidos = useStore((s) => s.misSeguidos);

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

                {usuarios?.map((item, index: number) => {
                    const esMiPropioPerfil = Number(datosLogueo?.id) === Number(item?.id);
                    const yaLoSigo = misSeguidos.some((seguidor: Seguidor) => Number(seguidor.id_a_seguir) === Number(item?.id));

                    return (
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
                            <button
                                type="button"
                                className="follow"
                                disabled={esMiPropioPerfil}
                                aria-label={esMiPropioPerfil ? "Mi perfil" : yaLoSigo ? "Dejar de seguir" : "Seguir"}
                                onClick={() => {
                                    if (esMiPropioPerfil) return;
                                    if (yaLoSigo) {
                                        eliminarSeguimiento(Number(datosLogueo?.id), Number(item?.id));
                                    } else {
                                        seguirUsuario(Number(datosLogueo?.id), Number(item?.id));
                                    }
                                }}
                            >
                                <div className="boton-para-seguir">
                                    <div className="bot">
                                        <p>{esMiPropioPerfil ? "Mi perfil" : yaLoSigo ? "Siguiendo" : "Seguir"}</p>
                                    </div>
                                    {!esMiPropioPerfil && (
                                        <div className="icono">
                                            <FaTwitter className="icon" />
                                        </div>
                                    )}
                                </div>
                            </button>
                        </div>
                    );
                })}

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