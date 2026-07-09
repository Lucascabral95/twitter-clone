"use client"
import "./Header.scss"
import React, { useCallback, useEffect, useState } from 'react'
import { formatearFecha } from '@/utils/formatearFecha';
import Image from "next/image"
import Avvvatars from "avvvatars-react"
import { BiSolidBackpack } from "react-icons/bi";
import { FaBirthdayCake, FaRegCalendarAlt, FaTwitter } from "react-icons/fa";
import { RiBearSmileLine } from "react-icons/ri";
import SeguidosSeguidores from "../SeguidosSeguidores/SeguidosSeguidores";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { useProfileData } from "@/presentation/hooks/useProfileData";

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

type ListaTipo = "seguidos" | "seguidores";

const listasIniciales = {
    seguidos: [] as SeguidosYSeguidores[],
    seguidores: [] as SeguidosYSeguidores[],
};

const HeaderDinamico: React.FC<HeaderDinamicoProps> = ({ id }) => {
    const { profile, loading, mutateProfile } = useProfileData(id);
    const [isOpenSeguidosSeguidores, setIsOpenSeguidosSeguidores] = useState<boolean>(false);
    const [seguidosOSeguidores, setSeguidosOSeguidores] = useState<ListaTipo>("seguidos");
    const [listas, setListas] = useState(listasIniciales);
    const [listasCargadas, setListasCargadas] = useState<Record<ListaTipo, boolean>>({ seguidos: false, seguidores: false });
    const [followBusy, setFollowBusy] = useState(false);

    useEffect(() => {
        setIsOpenSeguidosSeguidores(false);
        setSeguidosOSeguidores("seguidos");
        setListas(listasIniciales);
        setListasCargadas({ seguidos: false, seguidores: false });
        setFollowBusy(false);
    }, [id]);

    const cargarLista = useCallback(async (tipo: ListaTipo) => {
        if (listasCargadas[tipo]) return;

        const endpoint = tipo === "seguidos" ? `/api/seguimientos/${id}` : `/api/seguimientos/seguidores/${id}`;
        const { data } = await axios.get<{ result: SeguidosYSeguidores[] }>(endpoint);

        setListas((prev) => ({ ...prev, [tipo]: data.result }));
        setListasCargadas((prev) => ({ ...prev, [tipo]: true }));
    }, [id, listasCargadas]);

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

    const toggleFollow = useCallback(async () => {
        if (!profile || profile.relacion.esMiPerfil || !profile.relacion.viewerId || followBusy) return;

        const previous = profile;
        const nextLoSigo = !profile.relacion.loSigo;
        const nextProfile = {
            ...profile,
            stats: {
                ...profile.stats,
                seguidores: Math.max(profile.stats.seguidores + (nextLoSigo ? 1 : -1), 0),
            },
            relacion: {
                ...profile.relacion,
                loSigo: nextLoSigo,
            },
        };

        setFollowBusy(true);
        await mutateProfile(nextProfile, false);

        try {
            if (nextLoSigo) {
                await axios.post(`/api/seguimientos/${profile.relacion.viewerId}`, { id_a_seguir: profile.usuario.id });
            } else {
                await axios.delete(`/api/seguimientos/${profile.relacion.viewerId}`, { data: { id_a_seguir: profile.usuario.id } });
            }

            setListasCargadas((prev) => ({ ...prev, seguidores: false }));
            await mutateProfile();
        } catch (error) {
            await mutateProfile(previous, false);
            const message = error instanceof AxiosError
                ? error.response?.data?.error ?? error.message
                : "No se pudo actualizar el seguimiento";
            toast.error(message, { position: "top-center", duration: 2500 });
        } finally {
            setFollowBusy(false);
        }
    }, [followBusy, mutateProfile, profile]);

    if (loading || !profile) {
        return null;
    }

    const { usuario, datosPersonales, stats, relacion } = profile;
    const followText = relacion.esMiPerfil ? "Mi cuenta" : relacion.loSigo ? "Dejar de seguir" : "Seguir";
    const followDisabled = relacion.esMiPerfil || !relacion.viewerId || followBusy;

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
                                aria-label={followText}
                                disabled={followDisabled}
                                onClick={toggleFollow}>
                                <div className="texto">
                                    <p> {followText} </p>
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
                                <p> Unido el {formatearFecha(usuario.fecha_creacion, 'l')} </p>
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
    )
}

export default HeaderDinamico
