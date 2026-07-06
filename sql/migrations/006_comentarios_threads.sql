-- Respuestas anidadas (un solo nivel): `parent_id` apunta al comentario de nivel
-- superior al que se responde. La UI solo permite responder a comentarios raíz
-- (parent_id is null), así que la profundidad queda acotada a 1 sin necesitar
-- CTEs recursivas ni paginado de hijos por ahora.

alter table comentarios add column if not exists parent_id integer references comentarios(id) on delete cascade;

create index if not exists idx_comentarios_parent on comentarios(parent_id);

-- `create or replace view` solo permite agregar columnas al final (no insertar en el
-- medio sin romper con "cannot change name of view column"), por eso `parent_id` va
-- al final de la lista en vez de junto a `id_del_posteo`.
create or replace view comentarios_de_posteos_new as
select c.id as comentario_id,
       c.emisor_id,
       c.id_del_posteo,
       c.likes as comentario_likes,
       c.contenido as comentario_contenido,
       c.created_at as comentario_created_at,
       c.updated_at as comentario_updated_at,
       p.id as posteo_id,
       p.titulo,
       p.contenido as posteo_contenido,
       p.created_at as posteo_created_at,
       p.updated_at as posteo_updated_at,
       p.creador_id,
       p.likes as posteo_likes,
       u.id as usuario_id,
       u.nombre,
       u.email,
       u.identificador,
       c.parent_id
from comentarios c
join posteos p on c.id_del_posteo = p.id
join usuarios u on c.emisor_id = u.id;
