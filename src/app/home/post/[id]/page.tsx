'use client';
import React from 'react';
import Link from 'next/link';
import moment from 'moment';
moment.locale('es');
import 'moment/locale/es';
import { Toaster } from 'react-hot-toast';
import { IoMdHeart } from 'react-icons/io';
import { FiArrowLeft } from 'react-icons/fi';
import Avvvatars from 'avvvatars-react';

import Comentarios from '@/components/Comentarios/Comentarios';
import NotFound from '@/components/NotFound/NotFound';
import Loading from '@/components/Loading/Loading';
import useStore from '@/zustand';
import { darkLike } from '@/utils/functions/Posteos';
import { repostearPosteo } from '@/utils/functions/Reposteos';
import { DatosLogueo } from '@/infrastructure/interfaces';
import { usePostDetail } from '@/presentation/hooks/usePostDetail';
import './PostDetail.scss';

const PostDetail: React.FC = () => {
  const { dataPosteo, loading, error, detalleError, datosLogueo } = usePostDetail();
  const { eliminarSeguimiento, seguirUsuario, esMiAmigo } = useStore();

  if (loading) {
    return <Loading />;
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
                <div className="icono" onClick={() => window.history.back()}>
                  <FiArrowLeft className="icon" />
                </div>
                <div className="texto-posteo">
                  <p>Posteo</p>
                </div>
              </div>
              <div className="repostear" onClick={() => repostearPosteo(dataPosteo?.posteo_id, datosLogueo as DatosLogueo)}>
                <button>Repostear</button>
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
                <div
                  className="boton-follow"
                  onClick={
                    esMiAmigo
                      ? () => eliminarSeguimiento(dataPosteo?.creador_id as number, datosLogueo?.id as number)
                      : () => seguirUsuario(dataPosteo?.creador_id, datosLogueo?.id as number)
                  }
                >
                  <button>{esMiAmigo ? 'Dejar de seguir' : 'Seguir'}</button>
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
                  <p>{moment(dataPosteo?.created_at).locale('es').format('LLL')}</p>
                </div>
                <div className="like">
                  <p>{dataPosteo?.likes}</p>
                  <IoMdHeart className="icon" onClick={() => darkLike(dataPosteo?.posteo_id)} />
                </div>
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
