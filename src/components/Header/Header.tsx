"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { BiSolidBackpack } from "react-icons/bi";
import { FaBirthdayCake, FaRegCalendarAlt, FaTwitter } from "react-icons/fa";
import { RiBearSmileLine } from "react-icons/ri";
import "./Header.scss";
import Avvvatars from 'avvvatars-react'
import { formatearFecha } from '@/utils/formatearFecha';
import { Toaster } from 'react-hot-toast';
import SeguidosSeguidores from "../SeguidosSeguidores/SeguidosSeguidores";
import { useProfileData } from "@/presentation/hooks/useProfileData";

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

type ListaTipo = "seguidos" | "seguidores";

const listasIniciales = {
    seguidos: [] as ISeguidosYSeguidores[],
    seguidores: [] as ISeguidosYSeguidores[],
};

const Header: React.FC<TMisDatos> = ({ dataUser }: TMisDatos) => {
    const userId = dataUser?.id;
    const { profile, loading } = useProfileData(userId);
    const [isOpenSeguidosSeguidores, setIsOpenSeguidosSeguidores] = useState<boolean>(false);
    const [seguidosOSeguidores, setSeguidosOSeguidores] = useState<ListaTipo>("seguidos");
    const [listas, setListas] = useState(listasIniciales);
    const [listasCargadas, setListasCargadas] = useState<Record<ListaTipo, boolean>>({ seguidos: false, seguidores: false });

    useEffect(() => {
        setIsOpenSeguidosSeguidores(false);
        setSeguidosOSeguidores("seguidos");
        setListas(listasIniciales);
        setListasCargadas({ seguidos: false, seguidores: false });
    }, [userId]);

    const cargarLista = useCallback(async (tipo: ListaTipo) => {
        if (!userId || listasCargadas[tipo]) return;

        const endpoint = tipo === "seguidos" ? `/api/seguimientos/${userId}` : `/api/seguimientos/seguidores/${userId}`;
        const { data } = await axios.get<{ result: ISeguidosYSeguidores[] }>(endpoint);

        setListas((prev) => ({ ...prev, [tipo]: data.result }));
        setListasCargadas((prev) => ({ ...prev, [tipo]: true }));
    }, [listasCargadas, userId]);

    const abrirLista = useCallback(async (tipo: ListaTipo) => {
        try {
            setSeguidosOSeguidores(tipo);
            await cargarLista(tipo);
            setIsOpenSeguidosSeguidores(true);
        } catch (error) {
            const message = error instanceof AxiosError
                ? error.response?.data?.error ?? error.message
                : "No se pudo cargar la lista";
            toast.error(message, { position: "top-center", duration: 2500 });
        }
    }, [cargarLista]);

    if (!userId || loading || !profile) {
        return null;
    }

    const { usuario, datosPersonales, stats } = profile;

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
                            <Avvvatars size={137} style="shape" value={usuario.email} />
                        </div>
                        <div className="foto-perfil-mobile">
                            <Avvvatars size={92.3} style="shape" value={usuario.email} />
                        </div>
                        <div className="follow">
                            <button
                                type="button"
                                className="boton-de-follow"
                                aria-label="Mi cuenta"
                                disabled>
                                <div className="texto">
                                    <p> Mi cuenta </p>
                                </div>
                                <div className="icono">
                                    <FaTwitter className="icon" />
                                </div>
                            </button>
                        </div>
                    </div>
                    <div className="nombre-de-usuario">
                        <div className="nombre">
                            <h2> {usuario.nombre} </h2>
                        </div>
                        <div className="icono">
                            <RiBearSmileLine className="icon" />
                        </div>
                    </div>
                    <div className="descripcion">
                        <p> {datosPersonales?.biografia ?? ""} </p>
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
                        {datosPersonales?.cumpleanos && (
                            <div className="car">
                                <div className="icono-de-caracteristica">
                                    <FaBirthdayCake className="icon" />
                                </div>
                                <div className="texto">
                                    <p> {formatearFecha(datosPersonales.cumpleanos, 'l')} </p>
                                </div>
                            </div>
                        )}
                        <div className="car">
                            <div className="icono-de-caracteristica">
                                <FaRegCalendarAlt className="icon" />
                            </div>
                            <div className="texto">
                                <p> Unido el {formatearFecha(usuario.fecha_creacion, 'L')} </p>
                            </div>
                        </div>
                    </div>
                    <div className="seguidos-seguidores">
                        <button type="button" className="seg" onClick={() => void abrirLista("seguidos")}>
                            <p> {stats.seguidos} seguido(s) </p>
                        </button>
                        <button type="button" className="seg seg-seguidores" onClick={() => void abrirLista("seguidores")}>
                            <p> {stats.seguidores} seguidor(es) </p>
                        </button>
                    </div>
                </div>

                {isOpenSeguidosSeguidores &&
                    <SeguidosSeguidores
                        setIsOpenSeguidosSeguidores={setIsOpenSeguidosSeguidores}
                        misSeguidos={seguidosOSeguidores === "seguidos" ? listas.seguidos : listas.seguidores}
                    />
                }

                <Toaster />

            </div>
        </header>
    );
};

export default Header;
