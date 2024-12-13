import axios, { AxiosError } from "axios";
import React from "react";
import toast from 'react-hot-toast';

interface IDataPosteo {
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
}

interface IDatosLogueo {
    email: string;
    exp: number;
    fecha_creacion: string;
    iat: number;
    id: number;
    identificador: string;
    nombre: string;
}

export const comentar = async (
    event: React.FormEvent<HTMLFormElement>,
    dataPosteo: IDataPosteo,
    arrayComentarios: IArrayComentarios[],
    setArrayComentarios: React.Dispatch<React.SetStateAction<IArrayComentarios[]>>,
    contenido: string,
    setContenido: React.Dispatch<React.SetStateAction<string>>,
    datosLogueo: IDatosLogueo
) => {
    event.preventDefault();

    try {
        const results = await axios.post(`/api/comentario/${dataPosteo?.id}`, {
            emisor_id: datosLogueo?.id,
            id_del_posteo: dataPosteo?.posteo_id,
            contenido: contenido
        });


        if (results.status === 200) {
            console.log(results.data.result);
            setContenido("");
            setArrayComentarios([results.data.result, ...arrayComentarios]);
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

export const darLike = async (
    id: number,
    arrayComentarios: IArrayComentarios[],
    setArrayComentarios: React.Dispatch<React.SetStateAction<IArrayComentarios[]>>
) => {
    try {
        const result = await axios.put(`/api/comentario/${id}`);

        if (result.status === 200) {
            toast.success(`Like dado con éxito`, {
                position: "top-center",
                duration: 2500
            });

            setArrayComentarios(arrayComentarios.map((item: IArrayComentarios) => {
                if (item?.comentario_id === id) {
                    return {
                        ...item,
                        comentario_likes: item?.comentario_likes + 1
                    }
                }
                return item;
            }))
        }
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response) {
                toast.error(error.response.data.error, {
                    position: "top-center",
                    duration: 2500
                })
            } else {
                toast.error(error.message, {
                    position: "top-center",
                    duration: 2500
                })
            }
        }
    }
}