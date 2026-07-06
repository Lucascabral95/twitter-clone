import axios, { AxiosError } from "axios"
import React from "react";

interface PosteoCreado {
    id: number;
    titulo: string;
    contenido: string;
    created_at: string;
    updated_at: string;
    creador_id: number;
    likes: number;
}

export const postearComentario = async (
    event: React.FormEvent<HTMLFormElement>,
    formData: FormData,
    setIsOpenPosteo: React.Dispatch<React.SetStateAction<boolean>>,
    addTweet: (posteo: PosteoCreado) => Promise<void>,
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