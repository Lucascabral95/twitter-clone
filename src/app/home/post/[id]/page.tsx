'use client';
import React from 'react';
import Link from 'next/link';
import { formatearFecha } from '@/utils/formatearFecha';
import { Toaster } from 'react-hot-toast';
import { IoMdHeart } from 'react-icons/io';
import { FiArrowLeft } from 'react-icons/fi';
import Avvvatars from 'avvvatars-react';

import Comentarios from '@/components/Comentarios/Comentarios';
import NotFound from '@/components/NotFound/NotFound';
import SkeletonTweet from '@/components/Skeleton/SkeletonTweet';
import useStore from '@/zustand';
import { repostearPosteo } from '@/utils/functions/Reposteos';
import { DatosLogueo } from '@/infrastructure/interfaces';
import { usePostDetail } from '@/presentation/hooks/usePostDetail';
import './PostDetail.scss';

const PostDetail: React.FC = () => {
  const { dataPosteo, loading, error, detalleError, datosLogueo, handleLike } = usePostDetail();
  const eliminarSeguimiento = useStore((s) => s.eliminarSeguimiento);
  const seguirUsuario = useStore((s) => s.seguirUsuario);
  const esMiAmigo = useStore((s) => s.esMiAmigo);

  if (loading) {
    return <SkeletonTweet count={1} />;
  }

  return (
    <section className="post-de-detail">
      <div className="contenedor-de-post-detail">
        {error ? (
          <NotFound error={detalleError} />
        ) : (
          <div className="detalle-del-posteo">
            <div className="parte-superior">
              <div className="back-posteo">
                <button type="button" className="icono" aria-label="Volver" onClick={() => window.history.back()}>
                  <FiArrowLeft className="icon" />
                </button>
                <div className="texto-posteo">
                  <p>Posteo</p>
                </div>
              </div>
              <div className="repostear">
                <button type="button" onClick={() => repostearPosteo(dataPosteo?.posteo_id, datosLogueo as DatosLogueo)}>Repostear</button>
              </div>
            </div>

            <div className="parte-intermedia">
              <Link href={`/home/user/${dataPosteo?.creador_id}`} className="imagen-de-perfil">
                <Avvvatars value={dataPosteo?.email} size={40} style="shape" />
              </Link>
              <div className="contenido-del-posteo">
                <div className="nombre-correo">
                  <Link href={`/home/user/${dataPosteo?.creador_id}`} className="nombre">
                    <p>{dataPosteo?.nombre}</p>
                  </Link>
                  <Link href={`/home/user/${dataPosteo?.creador_id}`} className="correo">
                    <p>{dataPosteo?.email}</p>
                  </Link>
                </div>
                <div className="boton-follow">
                  <button
                    type="button"
                    onClick={
                      esMiAmigo
                        ? () => eliminarSeguimiento(dataPosteo?.creador_id as number, datosLogueo?.id as number)
                        : () => seguirUsuario(dataPosteo?.creador_id, datosLogueo?.id as number)
                    }
                  >
                    {esMiAmigo ? 'Dejar de seguir' : 'Seguir'}
                  </button>
                </div>
              </div>
            </div>

            <div className="parte-inferior">
              <div className="texto-titulo">
                <h4>{dataPosteo?.titulo}</h4>
              </div>
              <div className="texto-contenido">
                <p>{dataPosteo?.posteo_contenido}</p>
              </div>
              <div className="fecha-posteo">
                <div className="fecha">
                  <p>{formatearFecha(dataPosteo?.created_at, 'LLL')}</p>
                </div>
                <div className="stats-posteo">
                  <span>{dataPosteo?.comentarios_count ?? 0} respuestas</span>
                  <span>{dataPosteo?.reposteos_count ?? 0} reposteos</span>
                </div>
                <button type="button" className="like" aria-label="Dar like a este posteo" onClick={handleLike}>
                  <span>{dataPosteo?.likes}</span>
                  <IoMdHeart className="icon" />
                </button>
              </div>
            </div>

            <Comentarios dataPosteo={dataPosteo} />
          </div>
        )}

        <Toaster />
      </div>
    </section>
  );
};

export default PostDetail;
