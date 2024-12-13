"use client";
import React, { useEffect, useState } from "react";
import "./PostDetail.scss";
import axios, { AxiosError } from 'axios';
import { useParams } from "next/navigation";
import { IoMdHeart } from "react-icons/io";
import { FiArrowLeft } from "react-icons/fi";
import Avvvatars from "avvvatars-react";
import moment from "moment";
import "moment/locale/es";
moment.locale("es");
import Comentarios from "@/components/Comentarios/Comentarios";
import NotFound from "@/components/NotFound/NotFound";
import { Toaster } from 'react-hot-toast';
import useStore from "@/zustand";
import { darkLike } from "@/utils/functions/Posteos";
import { repostearPosteo } from "@/utils/functions/Reposteos";
import Loading from "@/components/Loading/Loading";

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

interface DatosLogueo {
    id: number;
    email: string;
    nombre: string;
    exp: number;
    iat: number;
    fecha_creacion: string;
    identificador: string;
}

const PostDetail: React.FC = () => {
    const { id } = useParams();
    const { getCookieLogueo, datosLogueo } = useStore();
    const [dataPosteo, setDataPosteo] = useState<IPosteo>({} as IPosteo);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<boolean>(false);
    const [detalleError, setDetalleError] = useState<string>("");

    useEffect(() => {
        const obtenerDetallesPosteo = async () => {
            try {
                const results = await axios.get(`/api/post/${id}`);
                if (results.status === 200) {
                    setDataPosteo(results.data.result[0]);
                }
            } catch (error) {
                if (error instanceof AxiosError) {
                    if (error.response && (error.response.status === 400 || error.response.status === 404)) {
                        setError(true);
                        setDetalleError(error.response.data.error);
                    }
                } else {
                    console.error('Error desconocido:', error);
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            obtenerDetallesPosteo();
        }
    }, [id]);

    useEffect(() => {
        const fetchData = async () => {
            await getCookieLogueo();
        };

        fetchData();
    }, [getCookieLogueo]);

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <section className="post-de-detail">
            <div className="contenedor-de-post-detail">
                {error ? (
                    <NotFound error={detalleError} />
                ) : (
                    <div className="detalle-del-posteo">
                        <div className="parte-superior">
                            <div className="back-posteo">
                                <div className="icono">
                                    <FiArrowLeft className="icon" />
                                </div>
                                <div className="texto-posteo">
                                    <p>Posteo</p>
                                </div>
                            </div>
                            <div className="repostear" onClick={() => repostearPosteo(dataPosteo?.posteo_id, datosLogueo as DatosLogueo)}>
                                <button>Repostear</button>
                            </div>
                        </div>
                        <div className="parte-intermedia">
                            <div className="imagen-de-perfil">
                                <Avvvatars value="Lucas@hotmail.com" size={40} style="shape" />
                            </div>
                            <div className="contenido-del-posteo">
                                <div className="nombre-correo">
                                    <div className="nombre">
                                        <p>{dataPosteo?.nombre}</p>
                                    </div>
                                    <div className="correo">
                                        <p>{dataPosteo?.email}</p>
                                    </div>
                                </div>
                                <div className="boton-follow">
                                    <button>Seguir</button>
                                </div>
                            </div>
                        </div>
                        <div className="parte-inferior">
                            <div className="texto-titulo">
                                <h4>{dataPosteo?.titulo}</h4>
                            </div>
                            <div className="texto-contenido">
                                <p>{dataPosteo?.contenido}</p>
                            </div>
                            <div className="fecha-posteo">
                                <div className="fecha">
                                    <p>{moment(dataPosteo?.created_at).locale("es").format("LLL")}</p>
                                </div>
                                <div className="like">
                                    <p>{dataPosteo?.likes}</p>
                                    <IoMdHeart className="icon" onClick={() => darkLike(dataPosteo?.posteo_id)} />
                                </div>
                            </div>
                        </div>
                        <Comentarios dataPosteo={dataPosteo} />
                    </div>
                )}

                <Toaster />

            </div>
        </section>
    );
};

export default PostDetail;
