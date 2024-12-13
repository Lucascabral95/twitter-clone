"use client"
import "./Header.scss"
import React, { useEffect, useState } from 'react'
import useStore from "@/zustand"
import moment from 'moment';
moment.locale('es');
import Image from "next/image"
import Avvvatars from "avvvatars-react"
import { usePathname } from "next/navigation"
import { BiSolidBackpack } from "react-icons/bi";
import { FaBirthdayCake, FaRegCalendarAlt, FaTwitter } from "react-icons/fa";
import { RiBearSmileLine } from "react-icons/ri";
import SeguidosSeguidores from "../SeguidosSeguidores/SeguidosSeguidores";
import { Toaster } from "react-hot-toast";
import axios, { AxiosError } from "axios";

interface DataUser {
    id: number;
    nombre: string;
    email: string;
    fecha_creacion: string;
    identificador: string;
    created_at: string;
    updated_at: string
}

interface MisDatosPersonales {
    id: number;
    biografia: string;
    localizacion: string;
    sitio_web: string;
    cumpleanos: string;
    usuario_id: number;
    created_at: string;
    updated_at: string
}

interface SeguidosYSeguidores {
    id_seguimiento: number;
    id_mio: number;
    id_a_seguir: number;
    id: number;
    nombre: string;
    email: string;
    identificador: string;
    fecha_creacion: string
}

interface HeaderDinamicoProps {
    id: number
}

const HeaderDinamico: React.FC<HeaderDinamicoProps> = ({ id }) => {
    const pathname = usePathname();
    const { existeEnMiListaDeAmigos, esMiAmigo, datosLogueo, getCookieLogueo, eliminarSeguimiento, seguirUsuario } = useStore();
    const [isOpenSeguidosSeguidores, setIsOpenSeguidosSeguidores] = useState<boolean>(false);
    const [dataUser, setDataUser] = useState<DataUser>({} as DataUser);
    const [misDatosPersonales, setMisDatosPersonales] = useState<MisDatosPersonales>({} as MisDatosPersonales);
    const [seguidosOSeguidores, setSeguidosOSeguidores] = useState<string>("seguidos");
    const [misSeguidos, setMisSeguidos] = useState<SeguidosYSeguidores[]>([]);
    const [seguidores, setSeguidores] = useState<SeguidosYSeguidores[]>([]);

    useEffect(() => {
        if (id) {
            getCookieLogueo();
            existeEnMiListaDeAmigos(datosLogueo.id, id);
        }
    }, [getCookieLogueo])

    useEffect(() => {
        existeEnMiListaDeAmigos(datosLogueo.id, id);
    }, [datosLogueo?.id])

    useEffect(() => {
        const obtenerDatosDelUsuario = async () => {
            try {
                const result = await axios.get(`/api/usuario/${id}`);

                if (result.status === 200) {
                    setDataUser(result.data.result);
                    console.log(result.data.results)
                }

            } catch (error) {
                if (error instanceof AxiosError) {
                    if (error.response) {
                        console.log(error.response.data.error);
                    } else {
                        console.log(error);
                    }
                }
            }
        }

        obtenerDatosDelUsuario();
    }, [id]);

    useEffect(() => {
        const obtenerSeguimientosDelUsuario = async () => {
            try {
                const results = await axios.get(`/api/seguimientos/seguidores/${id}`)

                if (results.status === 200) {
                    setSeguidores(results.data.result);
                }

            } catch (error) {
                if (error instanceof AxiosError) {
                    if (error.response) {
                        console.log(error.response.data.error);
                    } else {
                        console.log(error);
                    }
                }
            }
        }

        obtenerSeguimientosDelUsuario();
    }, [seguidosOSeguidores])

    useEffect(() => {
        const obtenerSeguimientosDelUsuario = async () => {
            try {
                const results = await axios.get(`/api/seguimientos/${id}`)

                if (results.status === 200) {
                    setMisSeguidos(results.data.result);
                }

            } catch (error) {
                if (error instanceof AxiosError) {
                    if (error.response) {
                        console.log(error.response.data.error);
                    } else {
                        console.log(error);
                    }
                }
            }
        }

        obtenerSeguimientosDelUsuario();
    }, [seguidosOSeguidores])

    useEffect(() => {
        const obtenerDatosPersonales = async () => {
            try {
                const result = await axios.get(`/api/datospersonales/${id}`);

                if (result.status === 200) {
                    setMisDatosPersonales(result.data.result[0]);
                }

            } catch (error) {
                if (error instanceof AxiosError) {
                    if (error.response) {
                        console.log(error.response.data.error);
                    } else {
                        console.log(error);
                    }
                }
            }
        }

        obtenerDatosPersonales();
    }, [])

    return (
        <header className="header-header">
            <div className="contenedor-header-header">
                <div className="imagen-de-portada">
                    <Image
                        className="foto-de-portada"
                        src="/img/kirby-cute.webp"
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
                                <p> {moment(misDatosPersonales?.cumpleanos).locale('es').format('l')} </p>
                            </div>
                        </div>
                        <div className="car">
                            <div className="icono-de-caracteristica">
                                <FaRegCalendarAlt className="icon" />
                            </div>
                            <div className="texto">
                                <p> Unido el {moment(dataUser?.fecha_creacion).format("l")} </p>
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
                        misSeguidos={seguidosOSeguidores === "seguidos" ? misSeguidos : seguidores}
                    />
                }

                <Toaster />

            </div>
        </header>
    )
}

export default HeaderDinamico