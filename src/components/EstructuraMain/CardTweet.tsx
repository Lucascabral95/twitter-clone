import React from 'react'
import { FaHeart, FaRegComment, FaRetweet } from "react-icons/fa";
import Avvvatars from "avvvatars-react";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { formatearFecha } from "@/utils/formatearFecha";
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';
import { motion } from 'motion/react';
import { useInfiniteScroll } from '@/presentation/hooks/useInfiniteScroll';
import { cloudinaryLoader } from '@/lib/cloudinaryLoader';

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
    comentarios_count?: number;
    reposteos_count?: number;
    imagen_url?: string | null;
}

interface CardTweetProps {
    posteos: IPosteos[];
    hasMore?: boolean;
    onLoadMore?: () => void;
    mensajeVacio?: string;
}

function vieneDeElementoInteractivo(target: EventTarget | null): boolean {
    return target instanceof Element && Boolean(target.closest('a, button'));
}

const CardTweetItem: React.FC<{ item: IPosteos }> = ({ item }) => {
    const router = useRouter();
    const postHref = `/home/post/${item.posteo_id}`;

    const navegarAlPost = () => {
        router.push(postHref);
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        if (vieneDeElementoInteractivo(event.target)) return;
        navegarAlPost();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        if (vieneDeElementoInteractivo(event.target)) return;
        event.preventDefault();
        navegarAlPost();
    };

    return (
        <motion.article
            className='contenedor-card-tweet'
            role="link"
            tabIndex={0}
            aria-label={`Abrir posteo ${item.titulo}`}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
        >
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
                <Link href={postHref} className="cuerpo-post-link" prefetch={false}>
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
                    {item?.imagen_url && (
                        <div className="imagen-posteo-card">
                            <Image
                                loader={cloudinaryLoader}
                                src={item.imagen_url}
                                alt=""
                                width={600}
                                height={400}
                                sizes="(max-width: 600px) 100vw, 600px"
                            />
                        </div>
                    )}
                </Link>
                <div className="contenedor-like">
                    <div className="metrica metrica-comentarios">
                        <p> {item?.comentarios_count ?? 0} </p>
                        <div className="icono">
                            <FaRegComment className='icon' />
                        </div>
                    </div>
                    <div className="metrica metrica-reposteos">
                        <p> {item?.reposteos_count ?? 0} </p>
                        <div className="icono">
                            <FaRetweet className='icon' />
                        </div>
                    </div>
                    <div className="metrica metrica-likes">
                        <p> {item?.likes} </p>
                        <div className="icono">
                            <FaHeart className='icon' />
                        </div>
                    </div>
                </div>
            </div>
        </motion.article>
    )
}

const MemoizedCardTweetItem = React.memo(CardTweetItem);

const CardTweet: React.FC<CardTweetProps> = ({ posteos, hasMore = false, onLoadMore, mensajeVacio }) => {
    const sentinelRef = useInfiniteScroll({
        hasMore,
        onLoadMore: onLoadMore ?? (() => {}),
    });

    return (
        <div className='card-tweet'>
            {posteos?.map((item: IPosteos) => (
                <MemoizedCardTweetItem key={item.posteo_id} item={item} />
            ))}

            {posteos.length === 0
                ?
                (mensajeVacio && (
                    <div className="sin-posteos">
                        <div className="texto">
                            <p>{mensajeVacio}</p>
                        </div>
                    </div>
                ))
                :
                <div className="contenedor-boton-ver-mas">
                    {hasMore && onLoadMore && (
                        <>
                            <div ref={sentinelRef} aria-hidden="true" />
                            <button className='boton-ver-mas' onClick={onLoadMore}> Ver más </button>
                        </>
                    )}
                </div>
            }

            <Toaster />

        </div>
    )
}

export default CardTweet
