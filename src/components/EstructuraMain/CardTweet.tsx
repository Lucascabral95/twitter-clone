import React from 'react'
import { FaHeart } from "react-icons/fa";
import Avvvatars from "avvvatars-react";
import { formatearFecha } from "@/utils/formatearFecha";
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
    hasMore?: boolean;
    onLoadMore?: () => void;
}

const CardTweetItem: React.FC<{ item: IPosteos }> = ({ item }) => {
    return (
        <Link href={`/home/post/${item?.posteo_id}`} className='contenedor-card-tweet' prefetch={false}>
            <Link href={`/home/user/${item?.id}`} className="foto-card" prefetch={false}>
                <Avvvatars value={item?.email} size={40} style="shape" />
            </Link>
            <div className="contenido-card">
                <div className="nombre-fecha">
                    <Link href={`/home/user/${item?.id}`} className="nombre" prefetch={false}>
                        <p> {item?.nombre} </p>
                    </Link>
                    <div className="fecha">
                        <p>{formatearFecha(item?.created_at, 'LL')}</p>
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
    )
}

const MemoizedCardTweetItem = React.memo(CardTweetItem);

const CardTweet: React.FC<CardTweetProps> = ({ posteos, hasMore = false, onLoadMore }) => {
    return (
        <div className='card-tweet'>
            {posteos?.map((item: IPosteos) => (
                <MemoizedCardTweetItem key={item.posteo_id} item={item} />
            ))}

            {posteos.length === 0
                ?
                null
                :
                <div className="contenedor-boton-ver-mas">
                    {hasMore && onLoadMore && (
                        <button className='boton-ver-mas' onClick={onLoadMore}> Ver más </button>
                    )}
                </div>
            }

            <Toaster />

        </div>
    )
}

export default CardTweet