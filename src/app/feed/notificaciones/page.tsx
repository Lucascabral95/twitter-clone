'use client';

import React from 'react';
import Link from 'next/link';
import Avvvatars from 'avvvatars-react';
import { IoMdHeart, IoMdPerson } from 'react-icons/io';
import { FaRegComment, FaRetweet } from 'react-icons/fa';

import { formatearFecha } from '@/utils/formatearFecha';
import { useNotifications } from '@/presentation/hooks';
import { NotificacionDTO } from '@/infrastructure/services';
import './Notificaciones.scss';

const iconoPorTipo: Record<NotificacionDTO['tipo'], React.ReactNode> = {
  like: <IoMdHeart className="icon icono-like" />,
  comment: <FaRegComment className="icon icono-comentario" />,
  repost: <FaRetweet className="icon icono-reposteo" />,
  follow: <IoMdPerson className="icon icono-follow" />,
};

const mensajePorTipo: Record<NotificacionDTO['tipo'], string> = {
  like: 'le dio like a tu posteo',
  comment: 'comentó tu posteo',
  repost: 'reposteó tu posteo',
  follow: 'empezó a seguirte',
};

const hrefPorNotificacion = (n: NotificacionDTO): string =>
  n.tipo === 'follow' ? `/home/user/${n.actor_id}` : `/home/post/${n.entidad_id}`;

const Notificaciones: React.FC = () => {
  const { notificaciones, loading } = useNotifications();

  return (
    <div className="notificaciones">
      <div className="contenedor-notificaciones">
        <h2 className="titulo-notificaciones">Notificaciones</h2>

        {loading ? (
          <p className="estado-notificaciones">Cargando...</p>
        ) : notificaciones.length === 0 ? (
          <p className="estado-notificaciones">Todavía no tenés notificaciones.</p>
        ) : (
          <ul className="lista-notificaciones">
            {notificaciones.map((n) => (
              <li key={n.id} className={`item-notificacion${n.leida ? '' : ' no-leida'}`}>
                <Link href={hrefPorNotificacion(n)} className="contenido-notificacion">
                  <div className="icono-tipo">{iconoPorTipo[n.tipo]}</div>
                  <div className="imagen-actor">
                    <Avvvatars value={n.actor_email} size={36} style="shape" />
                  </div>
                  <div className="texto-notificacion">
                    <p>
                      <strong>{n.actor_nombre}</strong> {mensajePorTipo[n.tipo]}
                    </p>
                    <span className="fecha-notificacion">{formatearFecha(n.created_at, 'lll')}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notificaciones;
