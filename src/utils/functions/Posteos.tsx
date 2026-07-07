import React from "react";
import toast from "react-hot-toast";
import { postService } from "@/infrastructure/services";

interface PosteoCreado {
    id: number;
    titulo: string;
    contenido: string;
    created_at: string;
    updated_at: string;
    creador_id: number;
    likes: number;
    comentarios_count: number;
    reposteos_count: number;
    imagen_url: string | null;
    imagen_public_id: string | null;
}

export const postearComentario = async (
    event: React.FormEvent<HTMLFormElement>,
    formData: FormData,
    setIsOpenPosteo: React.Dispatch<React.SetStateAction<boolean>>,
    addTweet: (posteo: PosteoCreado) => Promise<void>,
    imagen?: { imagen_url: string; imagen_public_id: string } | null
): Promise<boolean> => {
    event.preventDefault();

    const result = await postService.createPost({
        titulo: formData.get('titulo') as string,
        contenido: formData.get('contenido') as string,
        imagen_url: imagen?.imagen_url ?? null,
        imagen_public_id: imagen?.imagen_public_id ?? null,
    });

    if (!result.success) {
        toast.error(result.error ?? 'Error al crear el posteo');
        return false;
    }

    setIsOpenPosteo(false);
    await addTweet(result.data.result);
    toast.success('Posteo creado');
    return true;
}
