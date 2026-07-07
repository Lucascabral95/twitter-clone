import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';

const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const TAMANIO_MAX_BYTES = 5 * 1024 * 1024;
const LADO_MAX_PX = 1600;

export interface ImagenSubida {
  imagen_url: string;
  imagen_public_id: string;
}

interface FirmaResponse {
  timestamp: number;
  signature: string;
  folder: string;
  apiKey: string;
  cloudName: string;
}

interface ArchivoPreparado {
  blob: Blob;
  fileName: string;
}

async function comprimir(file: File): Promise<Blob> {
  if (file.type === 'image/gif') return file;

  const bitmap = await createImageBitmap(file);
  const escala = Math.min(1, LADO_MAX_PX / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * escala);
  const height = Math.round(bitmap.height * escala);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    bitmap.close?.();
    return file;
  }

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob(resolve, 'image/webp', 0.85)
  );

  if (!blob || blob.size >= file.size) return file;
  return blob;
}

export const useImageUpload = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const archivoRef = useRef<ArchivoPreparado | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const uploadPromiseRef = useRef<Promise<ImagenSubida | null> | null>(null);

  const limpiarArchivo = useCallback(() => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = null;
    archivoRef.current = null;
    setPreview(null);
    setProgreso(0);
  }, []);

  const limpiar = useCallback(() => {
    limpiarArchivo();
    setError(null);
  }, [limpiarArchivo]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  const seleccionarImagen = useCallback(async (file: File) => {
    setError(null);

    if (!TIPOS_PERMITIDOS.includes(file.type)) {
      limpiarArchivo();
      setError('Formato no soportado. Usa JPG, PNG, WEBP o GIF.');
      return;
    }

    if (file.size > TAMANIO_MAX_BYTES) {
      limpiarArchivo();
      setError('La imagen no puede pesar mas de 5 MB.');
      return;
    }

    try {
      const comprimida = await comprimir(file);
      archivoRef.current = { blob: comprimida, fileName: file.name };

      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      const url = URL.createObjectURL(comprimida);
      previewUrlRef.current = url;
      setPreview(url);
      setProgreso(0);
    } catch {
      limpiarArchivo();
      setError('No se pudo procesar la imagen.');
    }
  }, [limpiarArchivo]);

  const subir = useCallback(async (): Promise<ImagenSubida | null> => {
    if (!archivoRef.current) return null;
    if (uploadPromiseRef.current) return uploadPromiseRef.current;

    const uploadPromise = (async () => {
      setSubiendo(true);
      setProgreso(0);
      setError(null);

      try {
        const { data } = await axios.get<{ result: FirmaResponse }>('/api/media/firma');
        const { timestamp, signature, folder, apiKey, cloudName } = data.result;

        const formData = new FormData();
        formData.append('file', archivoRef.current!.blob, archivoRef.current!.fileName);
        formData.append('api_key', apiKey);
        formData.append('timestamp', String(timestamp));
        formData.append('signature', signature);
        formData.append('folder', folder);

        const uploadRes = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formData,
          {
            onUploadProgress: (evento) => {
              if (evento.total) setProgreso(Math.round((evento.loaded / evento.total) * 100));
            },
          }
        );

        return { imagen_url: uploadRes.data.secure_url, imagen_public_id: uploadRes.data.public_id };
      } catch {
        setError('No se pudo subir la imagen.');
        return null;
      } finally {
        setSubiendo(false);
        uploadPromiseRef.current = null;
      }
    })();

    uploadPromiseRef.current = uploadPromise;
    return uploadPromise;
  }, []);

  return {
    preview,
    subiendo,
    progreso,
    error,
    seleccionarImagen,
    subir,
    limpiar,
  };
};

