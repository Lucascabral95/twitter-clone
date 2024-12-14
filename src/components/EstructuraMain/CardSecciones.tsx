"use client"
import React, { useEffect, useState } from 'react'
import CardTweet from './CardTweet'
import "@/components/EstructuraMain/EstructuraMain.scss"
import useStore from '@/zustand'
import axios, { AxiosError } from 'axios'
import SobreMi from '../SobreMi/SobreMi'
import BusquedaDeUsuarios from '../BusquedaDeUsuarios/BusquedaDeUsuarios'

interface IPosteos {
    contenido: string;
    creador_id: number;
    created_at: string;
    email: string;
    fecha_creacion: string;
    id: number;
    identificador: string;
    likes: number;
    nombre: string;
    posteo_id: number;
    titulo: string;
    updated_at: string;
    password?: string
}

interface CardSeccionesProps {
    id: number;
    publicaciones: IPosteos[];
}

const CardSecciones: React.FC<CardSeccionesProps> = ({ id, publicaciones }) => {
    const { loading, limit, getTweetsByID, misSeguidos, getMisSeguidos } = useStore();
    const [seccionActual, setSeccionActual] = useState<string>("Inicio");
    const [arrayDeReposteos, setArrayDeReposteos] = useState([]);

    useEffect(() => {
        getTweetsByID();
        getMisSeguidos();

    }, [getTweetsByID, limit]);

    useEffect(() => {
        const obtenerReposteos = async () => {
            try {
                const result = await axios.get(`/api/reposteos/${id}`);

                if (result.status === 200) {
                    setArrayDeReposteos(result.data.result);
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

        if (seccionActual === "Reposteos") {
            obtenerReposteos();
        }
    }, [seccionActual])

    return (
        <div className="main-interior">
            <div className="main-secciones">
                <div className="seccion"
                    style={{ borderBottom: seccionActual === "Inicio" ? "3px solid var(--color-llamativo)" : "3px solid transparent" }}
                    onClick={() => setSeccionActual("Inicio")}>
                    <div className="seccion-texto">
                        <p style={{ color: seccionActual === "Inicio" ? "white" : "var(--color-letra-gris)" }}>
                            Inicio
                        </p>
                    </div>
                </div>
                <div className="seccion"
                    style={{ borderBottom: seccionActual === "AcercaDe" ? "3px solid var(--color-llamativo)" : "3px solid transparent" }}
                    onClick={() => setSeccionActual("AcercaDe")}>
                    <div className="seccion-texto">
                        <p style={{ color: seccionActual === "AcercaDe" ? "white" : "var(--color-letra-gris)" }}> Sobre mí </p>
                    </div>
                </div>
                <div className="seccion"
                    style={{ borderBottom: seccionActual === "Reposteos" ? "3px solid var(--color-llamativo)" : "3px solid transparent" }}
                    onClick={() => setSeccionActual("Reposteos")}>
                    <div className="seccion-texto">
                        <p style={{ color: seccionActual === "Reposteos" ? "white" : "var(--color-letra-gris)" }}> Reposteos </p>
                    </div>
                </div>
            </div>

            {loading && <p style={{ color: "white" }}> Cargando... </p>}

            {seccionActual === "Inicio" ? (
                <CardTweet posteos={publicaciones} />
            ) : seccionActual === "Seguidores" ? (
                <BusquedaDeUsuarios usuarios={misSeguidos} />
            ) : seccionActual === "AcercaDe" ? (
                <SobreMi id={id} />
            ) : seccionActual === "Reposteos" ? (
                <CardTweet posteos={arrayDeReposteos} />
            ) : null}

        </div>
    )
}

export default CardSecciones