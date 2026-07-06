"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { BiSolidBackpack } from "react-icons/bi";
import { FaBirthdayCake, FaRegCalendarAlt, FaTwitter } from "react-icons/fa";
import { RiBearSmileLine } from "react-icons/ri";
import "./Header.scss";
import Avvvatars from 'avvvatars-react'
import { formatearFecha } from '@/utils/formatearFecha';
import { usePathname } from "next/navigation";
import useStore from "@/zustand";
import { Toaster } from 'react-hot-toast';
import SeguidosSeguidores from "../SeguidosSeguidores/SeguidosSeguidores";

interface IMisDatosPersonales {
    biografia: string;
    created_at: string;
    cumpleanos: string;
    id: number;
    localizacion: string;
    sitio_web: string;
    updated_at: string;
    usuario_id: number;
}

interface IDataUser {
    email: string; 
    exp: number;
    fecha_creacion: string;
    iat: number;
    id: number;
    identificador: string;
    nombre: string;
}

interface ISeguidosYSeguidores {
    email: string;
    fecha_creacion: string;
    id: number;
    id_a_seguir: number;
    id_mio: number;
    id_seguimiento: number;
    identificador: string;
    nombre: string;
}

type TMisDatos = {
    misDatosPersonales: IMisDatosPersonales;
    dataUser: IDataUser;
    seguidos: ISeguidosYSeguidores[];
    seguidores: ISeguidosYSeguidores[];
};

const Header: React.FC<TMisDatos> = ({ dataUser, misDatosPersonales, seguidores }: TMisDatos) => {
    const pathname = usePathname();
    const [isOpenSeguidosSeguidores, setIsOpenSeguidosSeguidores] = useState<boolean>(false);
    const getCookieLogueo = useStore((s) => s.getCookieLogueo);
    const datosLogueo = useStore((s) => s.datosLogueo);
    const existeEnMiListaDeAmigos = useStore((s) => s.existeEnMiListaDeAmigos);
    const esMiAmigo = useStore((s) => s.esMiAmigo);
    const seguirUsuario = useStore((s) => s.seguirUsuario);
    const eliminarSeguimiento = useStore((s) => s.eliminarSeguimiento);
    const misSeguidos = useStore((s) => s.misSeguidos);
    const obtenerSeguidores = useStore((s) => s.obtenerSeguidores);
    const [seguidosOSeguidores, setSeguidosOSeguidores] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            await getCookieLogueo();
            obtenerSeguidores();
            
            if (datosLogueo?.id) {
                existeEnMiListaDeAmigos(datosLogueo.id, dataUser.id);
            }
        };

        fetchData();
    }, [getCookieLogueo, datosLogueo?.id, esMiAmigo]);

    return (
        <header className="header-header">
            <div className="contenedor-header-header">
                <div className="imagen-de-portada">
                    <Image
                        className="foto-de-portada"
                        src="/img/fondo-twitter-clone.gif"
                        alt="Portada"
                        width={730}
                        height={241}
                    />
                </div>
                <div className="contenido-header">
                    <div className="foto-follow">
                        <div className="foto-perfil">
                            <Avvvatars size={137} style="shape" value={dataUser?.email} />
                        </div>
                        <div className="foto-perfil-mobile">
                            <Avvvatars size={92.3} style="shape" value={dataUser?.email} />
                        </div>
                        <div className="follow">
                            <div className="boton-de-follow"
                                onClick={pathname === "/home" ? () => { } :
                                    esMiAmigo ? () => eliminarSeguimiento(datosLogueo?.id as number, dataUser?.id) : () => seguirUsuario(datosLogueo?.id as number, dataUser?.id)}>
                                <div className="texto">
                                    {
                                        pathname === "/home"
                                            ?
                                            <p> Mi cuenta </p>
                                            :
                                            esMiAmigo
                                                ?
                                                <p> Dejar de seguir </p>
                                                :
                                                <p> Seguir </p>
                                    }
                                </div>
                                <div className="icono">
                                    <FaTwitter className="icon" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="nombre-de-usuario">
                        <div className="nombre">
                            <h2> {dataUser?.nombre} </h2>
                        </div>
                        <div className="icono">
                            <RiBearSmileLine className="icon" />
                        </div>
                    </div>
                    <div className="descripcion">
                        <p> {misDatosPersonales?.biografia} </p>
                    </div>
                    <div className="caracteristicas">
                        <div className="car">
                            <div className="icono-de-caracteristica">
                                <BiSolidBackpack className="icon" />
                            </div>
                            <div className="texto">
                                <p> Disponible </p>
                            </div>
                        </div>
                        <div className="car">
                            <div className="icono-de-caracteristica">
                                <FaBirthdayCake className="icon" />
                            </div>
                            <div className="texto">
                                <p> {formatearFecha(misDatosPersonales?.cumpleanos, 'l')} </p>
                            </div>
                        </div>
                        <div className="car">
                            <div className="icono-de-caracteristica">
                                <FaRegCalendarAlt className="icon" />
                            </div>
                            <div className="texto">
                                <p> Unido el {formatearFecha(dataUser?.fecha_creacion, 'L')} </p>
                            </div>
                        </div>
                    </div>
                    <div className="seguidos-seguidores">
                        <div className="seg" onClick={() => { setIsOpenSeguidosSeguidores(true); setSeguidosOSeguidores("seguidos") }}>
                            <p> {misSeguidos.length || 0} seguido(s) </p>
                        </div>
                        <div className="seg seg-seguidores" onClick={() => { setIsOpenSeguidosSeguidores(true); setSeguidosOSeguidores("seguidores") }}>
                            <p> {seguidores?.length || 0} seguidor(es) </p>
                        </div>
                    </div>
                </div>

                {isOpenSeguidosSeguidores &&
                    <SeguidosSeguidores
                        setIsOpenSeguidosSeguidores={setIsOpenSeguidosSeguidores}
                        misSeguidos={seguidosOSeguidores === "seguidos" ? misSeguidos: seguidores}
                    />
                }

                <Toaster />

            </div>
        </header>
    );
};

export default Header;
