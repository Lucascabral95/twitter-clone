-- Likes idempotentes por usuario: reemplaza el "likes = likes + 1" sin control por un
-- toggle real (like/unlike) respaldado por esta tabla. `posteos.likes` se mantiene como
-- conteo denormalizado (igual que comentarios_count/reposteos_count), actualizado por
-- DAOPosteos.toggleLike.

create table if not exists posteos_likes (
  usuario_id integer not null references usuarios(id) on delete cascade,
  posteo_id  integer not null references posteos(id) on delete cascade,
  created_at timestamp default CURRENT_TIMESTAMP,
  primary key (usuario_id, posteo_id)
);
