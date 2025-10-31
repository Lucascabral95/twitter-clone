'use client';

import React from 'react';
import Avvvatars from 'avvvatars-react';
import { usePostForm } from '@/presentation/hooks/usePostForm';
import './PosteoFeed.scss';

const TITULO_MAX = 100;
const CONTENIDO_MAX = 250;

const PosteoFeed: React.FC = () => {
  const { titulo, setTitulo, contenido, setContenido, isLoading, datosLogueo, handleSubmit } = usePostForm();

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

        <div className="boton-de-posteo-feed">
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Posteando...' : 'Postear'}
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default PosteoFeed;