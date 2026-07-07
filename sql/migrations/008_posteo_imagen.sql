-- Imagen adjunta a un posteo (subida directa del cliente a Cloudinary, ver
-- src/services/cloudinary.ts y /api/media/firma). `imagen_public_id` se guarda para
-- poder borrar el asset en Cloudinary cuando se borra el posteo.

alter table posteos add column if not exists imagen_url text;
alter table posteos add column if not exists imagen_public_id text;
alter table posteos drop constraint if exists posteos_imagen_completa_check;
alter table posteos add constraint posteos_imagen_completa_check
check (
  (imagen_url is null and imagen_public_id is null)
  or (imagen_url is not null and imagen_public_id is not null)
);

create or replace view usuarios_posteos as
select u.id,
       u.nombre,
       u.email,
       u.fecha_creacion,
       u.identificador,
       p.id as posteo_id,
       p.titulo,
       p.contenido,
       p.created_at,
       p.updated_at,
       p.creador_id,
       p.likes,
       p.comentarios_count,
       p.reposteos_count,
       p.imagen_url,
       p.imagen_public_id
from usuarios u
join posteos p on u.id = p.creador_id;

