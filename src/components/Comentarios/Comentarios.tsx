"use client"
import React, { useEffect, useMemo, useState } from 'react'
import axios, { AxiosError } from 'axios';
import Avvvatars from "avvvatars-react";
import useStore from '@/zustand';
import { FaHeart } from 'react-icons/fa';
import { formatearFecha } from "@/utils/formatearFecha";
import { Toaster } from 'react-hot-toast';
import { comentar, darLike } from '@/utils/functions/Comentarios';
import Link from 'next/link';

interface IPosteo {
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
    comentario_created_at: string;
}

interface IArrayComentarios {
    comentario_contenido: string;
    comentario_created_at: string;
    comentario_id: number;
    comentario_likes: number;
    comentario_updated_at: string;
    creador_id: number;
    email: string;
    emisor_id: number;
    fecha_creacion: string;
    id_del_posteo: number;
    identificador: string;
    nombre: string;
    posteo_contenido: string;
    posteo_created_at: string;
    posteo_id: number;
    posteo_likes: number;
    posteo_updated_at: string;
    titulo: string;
    usuario_id: number;
    parent_id: number | null;
    contenido?: string;
}

interface DatosLogueo {
    id: number;
    email: string;
    nombre: string;
    exp: number;
    iat: number;
    fecha_creacion: string;
    identificador: string;
}

const ComentarioItem: React.FC<{
    item: IArrayComentarios;
    datosLogueo: DatosLogueo;
    arrayComentarios: IArrayComentarios[];
    setArrayComentarios: React.Dispatch<React.SetStateAction<IArrayComentarios[]>>;
}> = ({ item, datosLogueo, arrayComentarios, setArrayComentarios }) => (
    <div className="comentarios-de-publicacion">
        <Link href={`/home/user/${item?.creador_id}`} className="imagen-de-comentario">
            <Avvvatars value={item?.email ?? datosLogueo?.email ?? 'default@example.com'} size={40} style="shape" />
        </Link>
        <div className="contenido-del-comentario">
            <div className="nombre-email-fecha">
                <Link href={`/home/user/${item?.creador_id}`} className="nombre">
                    <p> {item?.nombre ? item?.nombre : datosLogueo?.nombre} </p>
                </Link>
                <Link href={`/home/user/${item?.creador_id}`} className="email-y-fecha">
                    <p> {item?.email ? item?.email : datosLogueo?.email} - {formatearFecha(item?.comentario_created_at, 'LLL')} </p>
                </Link>
                <div className="solo-email">
                    <p> {item?.email ? item?.email : datosLogueo?.email} </p>
                </div>
            </div>
            <div className="contenido">
                <p> {item?.comentario_contenido ? item?.comentario_contenido : item?.contenido} </p>
            </div>
            <div className="likes-de-comentario">
                <div className="icono-cantidad-likes">
                    <button
                        type="button"
                        className="icono"
                        aria-label="Dar like a este comentario"
                        onClick={() => darLike(item?.comentario_id, arrayComentarios, setArrayComentarios)}
                    >
                        <FaHeart className="icon" />
                    </button>
                    <div className="cantidad-likes">
                        <p> {item?.comentario_likes || 0} </p>
                    </div>
                </div>
                <div className="fecha">
                    <p> {formatearFecha(item?.comentario_created_at, 'lll')} </p>
                </div>
            </div>
        </div>
    </div>
);

const Comentarios: React.FC<{ dataPosteo: IPosteo }> = ({ dataPosteo }) => {
    const datosLogueo = useStore((s) => s.datosLogueo);
    const getCookieLogueo = useStore((s) => s.getCookieLogueo);
    const [comentario, setComentario] = useState<number>(0);
    const [contenido, setContenido] = useState<string>("");
    const [arrayComentarios, setArrayComentarios] = useState<IArrayComentarios[]>([]);
    const [respondiendoA, setRespondiendoA] = useState<number | null>(null);
    const [contenidoRespuesta, setContenidoRespuesta] = useState<string>("");

    useEffect(() => {
        getCookieLogueo();
    }, [getCookieLogueo])

    useEffect(() => {
        const obtenerComentarios = async () => {
            try {
                const results = await axios.get(`/api/comentario/${dataPosteo?.posteo_id}`);

                if (results.status === 200) {
                    setArrayComentarios(results.data.result);
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

        if (dataPosteo?.posteo_id) {
            obtenerComentarios();
        }
    }, [dataPosteo?.posteo_id])

    const comentariosRaiz = useMemo(
        () => arrayComentarios.filter((c) => !c.parent_id),
        [arrayComentarios]
    );

    const respuestasPorPadre = useMemo(() => {
        const mapa = new Map<number, IArrayComentarios[]>();
        arrayComentarios.forEach((c) => {
            if (!c.parent_id) return;
            const existentes = mapa.get(c.parent_id) ?? [];
            mapa.set(c.parent_id, [...existentes, c]);
        });
        return mapa;
    }, [arrayComentarios]);

    const enviarRespuesta = (event: React.FormEvent<HTMLFormElement>, parentId: number) => {
        comentar(
            event,
            dataPosteo,
            arrayComentarios,
            setArrayComentarios,
            contenidoRespuesta,
            setContenidoRespuesta,
            datosLogueo as DatosLogueo,
            parentId
        );
        setRespondiendoA(null);
    };

    return (
        <section>
            <div className="parte-comentarios">
                <form onSubmit={(event: React.FormEvent<HTMLFormElement>) => comentar(event, dataPosteo, arrayComentarios, setArrayComentarios, contenido, setContenido, datosLogueo as DatosLogueo)} className="interior-parte-comentarios">
                    <div className="imagen-de-comentario">
                        <Avvvatars value={datosLogueo?.email as string} size={40} style="shape" />
                    </div>
                    <div className="textarea-de-comentario">
                        <textarea onChange={(e) => { setComentario(e.target.value.length); setContenido(e.target.value) }} value={contenido}
                            maxLength={700} className="textarea-de-comentarioo" placeholder="Publicá tu respuesta..." required />
                        <div className="texto-de-aclaracion">
                            <p style={{ color: comentario === 700 ? "var(--color-error)" : "var(--texto-terciario)" }}> {comentario}/700 </p>
                        </div>
                        <div className="boton-de-comentar">
                            <button type="submit"> Comentar </button>
                        </div>
                    </div>
                </form>
            </div>

            <Toaster />

            {comentariosRaiz.length > 0 && (
                <div className="contenedor-comentarios-de-publicacion">
                    {comentariosRaiz.map((item) => (
                        <div key={item.comentario_id} className="hilo-comentario">
                            <ComentarioItem
                                item={item}
                                datosLogueo={datosLogueo as DatosLogueo}
                                arrayComentarios={arrayComentarios}
                                setArrayComentarios={setArrayComentarios}
                            />

                            <div className="acciones-hilo">
                                <button
                                    type="button"
                                    className="boton-responder"
                                    onClick={() => setRespondiendoA(respondiendoA === item.comentario_id ? null : item.comentario_id)}
                                >
                                    {respondiendoA === item.comentario_id ? 'Cancelar' : 'Responder'}
                                </button>
                            </div>

                            {respondiendoA === item.comentario_id && (
                                <form
                                    className="form-respuesta"
                                    onSubmit={(event) => enviarRespuesta(event, item.comentario_id)}
                                >
                                    <textarea
                                        value={contenidoRespuesta}
                                        onChange={(e) => setContenidoRespuesta(e.target.value)}
                                        maxLength={700}
                                        placeholder="Escribí tu respuesta..."
                                        required
                                    />
                                    <button type="submit">Responder</button>
                                </form>
                            )}

                            {(respuestasPorPadre.get(item.comentario_id) ?? []).length > 0 && (
                                <div className="respuestas-de-comentario">
                                    {(respuestasPorPadre.get(item.comentario_id) ?? []).map((respuesta) => (
                                        <ComentarioItem
                                            key={respuesta.comentario_id}
                                            item={respuesta}
                                            datosLogueo={datosLogueo as DatosLogueo}
                                            arrayComentarios={arrayComentarios}
                                            setArrayComentarios={setArrayComentarios}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

        </section>
    )
}

export default Comentarios
