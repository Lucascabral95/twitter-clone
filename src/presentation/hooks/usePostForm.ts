import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';

import useStore from '@/zustand';
import { postService } from '@/infrastructure/services';

export const usePostForm = () => {
  const getCookieLogueo = useStore((s) => s.getCookieLogueo);
  const datosLogueo = useStore((s) => s.datosLogueo);
  const addTweet = useStore((s) => s.addTweet);
  const [titulo, setTitulo] = useState(0);
  const [contenido, setContenido] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getCookieLogueo();
  }, [getCookieLogueo]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      const formData = new FormData(form);

      setIsLoading(true);
      const result = await postService.createPost({
        titulo: formData.get('titulo') as string,
        contenido: formData.get('contenido') as string,
        creador_id: Number(datosLogueo?.id),
      });
      setIsLoading(false);

      if (result.success) {
        addTweet(result.data.result);
        form.reset();
        setTitulo(0);
        setContenido(0);
        toast.success('Posteo creado');
      } else {
        toast.error(result.error ?? "Error") ;
      }
    },
    [datosLogueo?.id, addTweet]
  );

  return {
    titulo,
    setTitulo,
    contenido,
    setContenido,
    isLoading,
    datosLogueo,
    handleSubmit,
  };
};
