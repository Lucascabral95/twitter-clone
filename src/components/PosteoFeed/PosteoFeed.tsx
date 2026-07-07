'use client';

import React, { useRef } from 'react';
import Avvvatars from 'avvvatars-react';
import Image from 'next/image';
import { IoMdClose, IoMdImage } from 'react-icons/io';
import { usePostForm } from '@/presentation/hooks/usePostForm';
import { cloudinaryLoader } from '@/lib/cloudinaryLoader';
import './PosteoFeed.scss';

const TITULO_MAX = 100;
const CONTENIDO_MAX = 250;

const PosteoFeed: React.FC = () => {
  const {
    titulo,
    setTitulo,
    contenido,
    setContenido,
    isLoading,
    datosLogueo,
    handleSubmit,
    imagenPreview,
    imagenSubiendo,
    imagenProgreso,
    imagenError,
    seleccionarImagen,
    quitarImagen,
  } = usePostForm();
  const inputImagenRef = useRef<HTMLInputElement>(null);

  return (
    <div className="posteo-feed">
    <div className="contenedor-posteo-feed-feed">
      <div className="imagen-de-posteo-feed">
        {datosLogueo && <Avvvatars size={40} style="shape" value={datosLogueo?.email} />}
      </div>
      <form onSubmit={handleSubmit} className="div-postear-escribir">
        <div className="input-titulo">
          <input
            onChange={(e) => setTitulo(e.target.value.length)}
            maxLength={TITULO_MAX}
            type="text"
            name="titulo"
            placeholder="¿Qué estás pensando?"
            disabled={isLoading}
            required
          />
        </div>

        <div className="reglainput">
          <p style={{ color: titulo === TITULO_MAX ? 'red' : 'var(--color-letra-gris)' }}>
            {titulo}/{TITULO_MAX}
          </p>
        </div>

        <div className="input-titulo">
          <textarea
            onChange={(e) => setContenido(e.target.value.length)}
            maxLength={CONTENIDO_MAX}
            className="textarea-post-feed"
            name="contenido"
            placeholder="¿Qué estás pensando?"
            disabled={isLoading}
            required
          />
        </div>

        <div className="reglainput">
          <p style={{ color: contenido === CONTENIDO_MAX ? 'red' : 'var(--color-letra-gris)' }}>
            {contenido}/{CONTENIDO_MAX}
          </p>
        </div>

        {imagenPreview && (
          <div className="preview-imagen-posteo">
            <Image loader={cloudinaryLoader} src={imagenPreview} alt="" width={500} height={300} unoptimized={!imagenPreview.startsWith('http')} />
            <button
              type="button"
              className="quitar-imagen"
              aria-label="Quitar imagen"
              onClick={quitarImagen}
              disabled={imagenSubiendo}
            >
              <IoMdClose className="icon" />
            </button>
            {imagenSubiendo && (
              <div className="barra-progreso-imagen">
                <div className="barra-progreso-imagen-relleno" style={{ width: `${imagenProgreso}%` }} />
              </div>
            )}
          </div>
        )}

        {imagenError && <p className="error-imagen-posteo">{imagenError}</p>}

        <div className="boton-de-posteo-feed">
          <input
            ref={inputImagenRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            hidden
            disabled={isLoading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) seleccionarImagen(file);
              e.target.value = '';
            }}
          />
          <button
            type="button"
            className="boton-adjuntar-imagen"
            aria-label="Adjuntar imagen"
            onClick={() => inputImagenRef.current?.click()}
            disabled={isLoading}
          >
            <IoMdImage className="icon" />
          </button>
          <button type="submit" disabled={isLoading || imagenSubiendo}>
            {isLoading ? 'Posteando...' : 'Postear'}
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default PosteoFeed;