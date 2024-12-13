import axios, { AxiosError } from "axios"
import React from "react";
import toast from 'react-hot-toast';

interface Posteos {
    id: number;
    nombre: string;
    email: string;
    fecha_creacion: string;
    identificador: string;
    posteo_id: number;
    titulo: string;
    contenido: string;
    created_at: string;
    updated_at: string;
    creador_id: number;
    likes: number;
    password?: string;
}

export const darkLike = async (id: number) => {
    try {
        const result = await axios.put(`/api/posteo/${id}`)

        if (result.status === 200) {
            toast.success(`Posteo likeado`, {
                position: "top-center",
                duration: 2500
            })
            console.log(result.data.result)
        }

    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response) {
                console.log(error.response.data.error)
            } else {
                console.log(error)
            }
        }
    }
}

export const postearComentario = async (
    event: React.FormEvent<HTMLFormElement>,
    formData: FormData,
    setIsOpenPosteo: React.Dispatch<React.SetStateAction<boolean>>,
    addTweet: (posteo: Posteos) => Promise<void>,
    creador_id: number
) => {
    event.preventDefault();
    const titulo: string = formData.get('titulo') as string;
    const contenido: string = formData.get('contenido') as string;

    try {
        const results = await axios.post('/api/posteo', {
            titulo: titulo,
            contenido: contenido,
            creador_id: creador_id
        });

        if (results.status === 200) {
            setIsOpenPosteo(false);
            addTweet(results.data.result);
        }

    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response) {
                console.log(error.response.data.error)
            } else {
                console.log(error)
            }
        }
    }
}