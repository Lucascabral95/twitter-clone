-- Índices faltantes sobre columnas de FK/WHERE/ORDER BY (identificados por
-- auditoría de las queries en src/models/DAO/*.tsx), búsqueda por trigramas
-- para las consultas ILIKE '%..%', y un índice único que evita seguimientos
-- duplicados. Todas las sentencias son idempotentes, seguras de re-ejecutar.

create extension if not exists pg_trgm;

create index if not exists idx_posteos_creador on posteos(creador_id);

create index if not exists idx_comentarios_post_created on comentarios(id_del_posteo, created_at desc);
create index if not exists idx_comentarios_emisor on comentarios(emisor_id);

create index if not exists idx_reposteos_reposteador on reposteos(reposteador_id);
create index if not exists idx_reposteos_posteo on reposteos(posteo_id);
create index if not exists idx_reposteos_created on reposteos(created_at desc);

create index if not exists idx_seguimientos_a_seguir on seguimientos(id_a_seguir);

delete from seguimientos a using seguimientos b
where a.id > b.id
  and a.id_mio = b.id_mio
  and a.id_a_seguir = b.id_a_seguir;

create unique index if not exists uq_seguimientos_par on seguimientos(id_mio, id_a_seguir);

create index if not exists idx_posteos_titulo_trgm on posteos using gin (titulo gin_trgm_ops);
create index if not exists idx_posteos_contenido_trgm on posteos using gin (contenido gin_trgm_ops);
create index if not exists idx_usuarios_nombre_trgm on usuarios using gin (nombre gin_trgm_ops);
create index if not exists idx_usuarios_email_trgm on usuarios using gin (email gin_trgm_ops);
