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
    parent_id: number | null;
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
    datosLogueo: IDatosLogueo,
    parentId: number | null = null
) => {
    event.preventDefault();

    try {
        const results = await axios.post(`/api/comentario/${dataPosteo?.id}`, {
            emisor_id: datosLogueo?.id,
            id_del_posteo: dataPosteo?.posteo_id,
            contenido: contenido,
            parent_id: parentId
        });

        if (results.status === 200) {
            // La respuesta trae la fila cruda de `comentarios` (sin el join con `usuarios`
            // que sí tiene la vista `comentarios_de_posteos_new`); se enriquece con
            // `datosLogueo`/`dataPosteo` para que calce con la forma de IArrayComentarios.
            const nuevo = results.data.result;
            const comentarioEnriquecido: IArrayComentarios = {
                comentario_id: nuevo.id,
                comentario_contenido: nuevo.contenido,
                comentario_created_at: nuevo.created_at,
                comentario_updated_at: nuevo.updated_at,
                comentario_likes: nuevo.likes,
                parent_id: nuevo.parent_id ?? null,
                emisor_id: nuevo.emisor_id,
                id_del_posteo: nuevo.id_del_posteo,
                usuario_id: datosLogueo?.id,
                nombre: datosLogueo?.nombre,
                email: datosLogueo?.email,
                identificador: datosLogueo?.identificador,
                fecha_creacion: datosLogueo?.fecha_creacion,
                creador_id: dataPosteo?.creador_id,
                titulo: dataPosteo?.titulo,
                posteo_contenido: dataPosteo?.contenido,
                posteo_created_at: dataPosteo?.created_at,
                posteo_updated_at: dataPosteo?.updated_at,
                posteo_id: dataPosteo?.posteo_id,
                posteo_likes: dataPosteo?.likes,
            };

            setContenido("");
            setArrayComentarios([comentarioEnriquecido, ...arrayComentarios]);
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
    const arrayOptimista = arrayComentarios.map((item: IArrayComentarios) => {
        if (item?.comentario_id === id) {
            return {
                ...item,
                comentario_likes: item?.comentario_likes + 1
            }
        }
        return item;
    });
    setArrayComentarios(arrayOptimista);

    try {
        await axios.put(`/api/comentario/${id}`);
    } catch (error) {
        setArrayComentarios(arrayComentarios);

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