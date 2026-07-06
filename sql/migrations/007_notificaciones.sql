-- Notificaciones de actividad (like/follow/comment/repost) sobre el propio contenido.
-- Escritas desde los handlers existentes de esas acciones (ver DAONotificaciones.crear,
-- llamado best-effort para no romper la acción principal si la notificación falla).

create table if not exists notificaciones (
  id         serial primary key,
  usuario_id integer not null references usuarios(id) on delete cascade,
  tipo       varchar(20) not null,
  actor_id   integer not null references usuarios(id) on delete cascade,
  entidad_id integer,
  leida      boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_notificaciones_usuario_created on notificaciones(usuario_id, created_at desc);
create index if not exists idx_notificaciones_no_leidas on notificaciones(usuario_id) where leida = false;
