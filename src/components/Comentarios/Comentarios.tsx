"use client"
import React, { useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios';
import Avvvatars from "avvvatars-react";
import useStore from '@/zustand';
import { FaHeart } from 'react-icons/fa';
import moment from "moment";
import "moment/locale/es";
moment.locale("es");
import { Toaster } from 'react-hot-toast';
import { comentar, darLike } from '@/utils/functions/Comentarios';

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

const Comentarios: React.FC<{ dataPosteo: IPosteo }> = ({ dataPosteo }) => {
    const { datosLogueo, getCookieLogueo } = useStore();
    const [comentario, setComentario] = useState<number>(0);
    const [contenido, setContenido] = useState<string>("");
    const [arrayComentarios, setArrayComentarios] = useState<IArrayComentarios[]>([]);

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
                            <p style={{ color: comentario === 700 ? "red" : "var(--color-letra-gris)" }}> {comentario}/700 </p>
                        </div>
                        <div className="boton-de-comentar">
                            <button type="submit"> Comentar </button>
                        </div>
                    </div>
                </form>
            </div>

            <Toaster />

            {arrayComentarios && arrayComentarios.length > 0 && (
                <div className="contenedor-comentarios-de-publicacion">
                    {arrayComentarios?.map((item, index: number) => (
                        <div className="comentarios-de-publicacion" key={index}>
                            <div className="imagen-de-comentario">
                                <Avvvatars value={item?.email ?? datosLogueo?.email ?? 'default@example.com'} size={40} style="shape" />
                            </div>
                            <div className="contenido-del-comentario">
                                <div className="nombre-email-fecha">
                                    <div className="nombre">
                                        <p> {item?.nombre ? item?.nombre : datosLogueo?.nombre} </p>
                                    </div>
                                    <div className="email-y-fecha">
                                        <p> {item?.email ? item?.email : datosLogueo?.email} - {moment(item?.comentario_created_at).locale('es').format('LLL')} </p>
                                    </div>
                                    <div className="solo-email">
                                        <p> {item?.email ? item?.email : datosLogueo?.email} </p>
                                    </div>
                                </div>
                                <div className="contenido">
                                    <p> {item?.comentario_contenido ? item?.comentario_contenido : item?.contenido } </p>
                                    {/* <p> {item?.comentario_contenido ?? item?.comentario_contenido} </p> */}
                                </div>
                                <div className="likes-de-comentario">
                                    <div className="icono-cantidad-likes">
                                        <div className="icono" onClick={() => darLike(item?.comentario_id, arrayComentarios, setArrayComentarios)}>
                                            <FaHeart className="icon" />
                                        </div>
                                        <div className="cantidad-likes">
                                            <p> {item?.comentario_likes || 0} </p>
                                        </div>
                                    </div>
                                    <div className="fecha">
                                        <p> {moment(item?.comentario_created_at).locale('es').format('lll')} </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </section>
    )
}

export default Comentarios