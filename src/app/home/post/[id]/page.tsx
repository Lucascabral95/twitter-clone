'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { formatearFecha } from '@/utils/formatearFecha';
import { Toaster } from 'react-hot-toast';
import { IoMdClose, IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';
import { FiArrowLeft } from 'react-icons/fi';
import Avvvatars from 'avvvatars-react';
import { cloudinaryLoader } from '@/lib/cloudinaryLoader';

import Comentarios from '@/components/Comentarios/Comentarios';
import NotFound from '@/components/NotFound/NotFound';
import SkeletonTweet from '@/components/Skeleton/SkeletonTweet';
import useStore from '@/zustand';
import { repostearPosteo } from '@/utils/functions/Reposteos';
import { DatosLogueo } from '@/infrastructure/interfaces';
import { usePostDetail } from '@/presentation/hooks/usePostDetail';
import './PostDetail.scss';

const PostDetail: React.FC = () => {
  const { dataPosteo, loading, error, detalleError, datosLogueo, handleLike, handleUpdate, handleDelete } = usePostDetail();
  const eliminarSeguimiento = useStore((s) => s.eliminarSeguimiento);
  const seguirUsuario = useStore((s) => s.seguirUsuario);
  const esMiAmigo = useStore((s) => s.esMiAmigo);
  const router = useRouter();

  const [editando, setEditando] = useState(false);
  const [tituloEdit, setTituloEdit] = useState('');
  const [contenidoEdit, setContenidoEdit] = useState('');
  const [imagenAbierta, setImagenAbierta] = useState(false);

  useEffect(() => {
    if (!imagenAbierta) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setImagenAbierta(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [imagenAbierta]);

  if (loading) {
    return <SkeletonTweet count={1} />;
  }

  const esPropio = Boolean(datosLogueo?.id) && datosLogueo?.id === dataPosteo?.creador_id;

  const iniciarEdicion = () => {
    setTituloEdit(dataPosteo?.titulo ?? '');
    setContenidoEdit(dataPosteo?.posteo_contenido ?? '');
    setEditando(true);
  };

  const guardarEdicion = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const ok = await handleUpdate(tituloEdit, contenidoEdit);
    if (ok) setEditando(false);
  };

  const borrarPosteo = async () => {
    if (!window.confirm('¿Borrar este posteo? Esta acción no se puede deshacer.')) return;
    const ok = await handleDelete();
    if (ok) router.push('/feed');
  };

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
                {esPropio && (
                  <>
                    <button type="button" onClick={iniciarEdicion}>Editar</button>
                    <button type="button" onClick={borrarPosteo}>Borrar</button>
                  </>
                )}
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
              {editando ? (
                <form className="form-editar-posteo" onSubmit={guardarEdicion}>
                  <input
                    type="text"
                    value={tituloEdit}
                    onChange={(e) => setTituloEdit(e.target.value)}
                    maxLength={100}
                    required
                  />
                  <textarea
                    value={contenidoEdit}
                    onChange={(e) => setContenidoEdit(e.target.value)}
                    maxLength={300}
                    required
                  />
                  <div className="acciones-editar">
                    <button type="button" onClick={() => setEditando(false)}>Cancelar</button>
                    <button type="submit">Guardar</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="texto-titulo">
                    <h4>{dataPosteo?.titulo}</h4>
                  </div>
                  <div className="texto-contenido">
                    <p>{dataPosteo?.posteo_contenido}</p>
                  </div>
                  {dataPosteo?.imagen_url && (
                    <button
                      type="button"
                      className="imagen-posteo-detalle"
                      aria-label="Abrir imagen del posteo"
                      onClick={() => setImagenAbierta(true)}
                    >
                      <Image
                        loader={cloudinaryLoader}
                        src={dataPosteo.imagen_url}
                        alt=""
                        width={900}
                        height={600}
                        sizes="(max-width: 700px) 100vw, 700px"
                      />
                    </button>
                  )}
                </>
              )}
              <div className="fecha-posteo">
                <div className="fecha">
                  <p>{formatearFecha(dataPosteo?.created_at, 'LLL')}</p>
                </div>
                <div className="stats-posteo">
                  <span>{dataPosteo?.comentarios_count ?? 0} respuestas</span>
                  <span>{dataPosteo?.reposteos_count ?? 0} reposteos</span>
                </div>
                <button
                  type="button"
                  className={`like${dataPosteo?.ya_likeado ? ' likeado' : ''}`}
                  aria-label={dataPosteo?.ya_likeado ? 'Quitar like' : 'Dar like a este posteo'}
                  onClick={handleLike}
                >
                  <span>{dataPosteo?.likes}</span>
                  {dataPosteo?.ya_likeado ? <IoMdHeart className="icon" /> : <IoMdHeartEmpty className="icon" />}
                </button>
              </div>
            </div>

            <Comentarios dataPosteo={dataPosteo} />
          </div>
        )}

        <Toaster />
      </div>

      {imagenAbierta && dataPosteo?.imagen_url && (
        <div className="visor-imagen-posteo" role="dialog" aria-modal="true" aria-label="Imagen del posteo">
          <button
            type="button"
            className="cerrar-visor-imagen"
            aria-label="Cerrar imagen"
            onClick={() => setImagenAbierta(false)}
          >
            <IoMdClose className="icon" />
          </button>
          <button
            type="button"
            className="visor-imagen-backdrop"
            aria-label="Cerrar imagen ampliada"
            onClick={() => setImagenAbierta(false)}
          />
          <div className="visor-imagen-contenido">
            <Image
              loader={cloudinaryLoader}
              src={dataPosteo.imagen_url}
              alt=""
              width={1400}
              height={1000}
              sizes="100vw"
              priority
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default PostDetail;
