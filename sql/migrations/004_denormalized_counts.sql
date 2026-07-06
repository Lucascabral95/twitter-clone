-- Conteos denormalizados de comentarios/reposteos en `posteos`, mantenidos por la
-- aplicación en cada escritura (ver DAOPosteos.incrementarComentariosCount /
-- incrementarReposteosCount). Evita un COUNT(*) por card en el feed.

alter table posteos add column if not exists comentarios_count integer not null default 0;
alter table posteos add column if not exists reposteos_count integer not null default 0;

update posteos set comentarios_count = (select count(*) from comentarios c where c.id_del_posteo = posteos.id);
update posteos set reposteos_count = (select count(*) from reposteos r where r.posteo_id = posteos.id);

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
       p.reposteos_count
from usuarios u
join posteos p on u.id = p.creador_id;
