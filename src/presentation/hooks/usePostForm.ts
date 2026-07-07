import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';

import useStore from '@/zustand';
import { postService } from '@/infrastructure/services';
import { useImageUpload } from './useImageUpload';

export const usePostForm = () => {
  const getCookieLogueo = useStore((s) => s.getCookieLogueo);
  const datosLogueo = useStore((s) => s.datosLogueo);
  const addTweet = useStore((s) => s.addTweet);
  const [titulo, setTitulo] = useState(0);
  const [contenido, setContenido] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const {
    preview,
    subiendo,
    progreso,
    error,
    seleccionarImagen,
    subir,
    limpiar,
  } = useImageUpload();

  useEffect(() => {
    getCookieLogueo();
  }, [getCookieLogueo]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      const formData = new FormData(form);

      setIsLoading(true);

      const imagen = preview ? await subir() : null;

      if (preview && !imagen) {
        setIsLoading(false);
        toast.error(error ?? 'No se pudo subir la imagen');
        return;
      }

      const result = await postService.createPost({
        titulo: formData.get('titulo') as string,
        contenido: formData.get('contenido') as string,
        imagen_url: imagen?.imagen_url ?? null,
        imagen_public_id: imagen?.imagen_public_id ?? null,
      });
      setIsLoading(false);

      if (result.success) {
        addTweet(result.data.result);
        form.reset();
        setTitulo(0);
        setContenido(0);
        limpiar();
        toast.success('Posteo creado');
      } else {
        toast.error(result.error ?? 'Error');
      }
    },
    [addTweet, preview, subir, error, limpiar]
  );

  return {
    titulo,
    setTitulo,
    contenido,
    setContenido,
    isLoading,
    datosLogueo,
    handleSubmit,
    imagenPreview: preview,
    imagenSubiendo: subiendo,
    imagenProgreso: progreso,
    imagenError: error,
    seleccionarImagen,
    quitarImagen: limpiar,
  };
};
