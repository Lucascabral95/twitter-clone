import React, { useEffect, useState } from 'react'
import { FaHeart } from "react-icons/fa";
import Avvvatars from "avvvatars-react";
import moment from "moment";
import "moment/locale/es";
moment.locale("es");
import useStore from '@/zustand';
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';

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
}

interface CardTweetProps {
    posteos: IPosteos[];
}

const CardTweet: React.FC<CardTweetProps> = ({ posteos }) => {
    const { limit, posteosTotales } = useStore();
    const [posteosAMostrar, setPosteosAMostrar] = useState<number>(20);
    const [cantidadPaginas, setCantidadPaginas] = useState<number>(0);
    const [paginaActual, setPaginaActual] = useState<number>(1);

    useEffect(() => {
        setCantidadPaginas(Math.ceil(posteosTotales / limit));
    }, [posteos, paginaActual]);

    return (
        <div className='card-tweet'>
            {posteos?.slice(0, posteosAMostrar).map((item: IPosteos, index: number) => (
                <Link href={`/home/post/${item?.posteo_id}`} className='contenedor-card-tweet' key={index}>
                    <Link href={`/home/user/${item?.id}`} className="foto-card">
                        <Avvvatars value={item?.email} size={40} style="shape" />
                    </Link>
                    <div className="contenido-card">
                        <div className="nombre-fecha">
                            <Link href={`/home/user/${item?.id}`} className="nombre">
                                <p> {item?.nombre} </p>
                            </Link>
                            <div className="fecha">
                                <p>{moment(item?.created_at).locale('es').format('LL')}</p>
                            </div>
                        </div>
                        <div className="titulo">
                            <div className="titulo-titulo">
                                <p> {item?.titulo} </p>
                            </div>
                        </div>
                        <div className="contenido">
                            <div className="contenido-contenido">
                                <p> {item?.contenido} </p>
                            </div>
                        </div>
                        <div className="contenedor-like">
                            <p> {item?.likes} </p>
                            <div className="icono">
                                <FaHeart className='icon' />
                            </div>
                        </div>
                    </div>
                </Link>
            ))}

            {posteos.length === 0
                ?
                null
                :
                <div className="contenedor-boton-ver-mas">
                    {posteosTotales > 0 && cantidadPaginas > paginaActual && (
                        <button className='boton-ver-mas' onClick={() => { setPaginaActual(paginaActual + 1); setPosteosAMostrar(posteosAMostrar + limit) }}> Ver más </button>
                    )}
                </div>
            }

            <Toaster />

        </div>
    )
}

export default CardTweet