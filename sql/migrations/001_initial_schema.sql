-- Baseline schema snapshot, introspected from the live Neon database.
-- Applied by scripts/migrate.mjs; every statement is idempotent so this
-- is safe to run against a database that already has some/all of it.

create table if not exists usuarios (
  id             serial primary key,
  nombre         varchar(100) not null,
  email          varchar(100) not null unique,
  password       varchar(100) not null,
  fecha_creacion timestamp default CURRENT_TIMESTAMP,
  identificador  varchar(80)
);

create table if not exists posteos (
  id         serial primary key,
  titulo     varchar(255) not null,
  contenido  varchar(300) not null,
  created_at timestamp default CURRENT_TIMESTAMP,
  updated_at timestamp default CURRENT_TIMESTAMP,
  creador_id integer not null references usuarios(id),
  likes      integer default 0
);

create table if not exists datos_personales (
  id            serial primary key,
  biografia     varchar(255),
  localizacion  varchar(100),
  sitio_web     varchar(100),
  cumpleanos    date,
  usuario_id    integer not null unique references usuarios(id),
  created_at    timestamp default CURRENT_TIMESTAMP,
  updated_at    timestamp default CURRENT_TIMESTAMP
);

create table if not exists comentarios (
  id            serial primary key,
  emisor_id     integer not null references usuarios(id),
  id_del_posteo integer not null references posteos(id),
  likes         integer default 0,
  contenido     varchar(700) not null,
  created_at    timestamp default CURRENT_TIMESTAMP,
  updated_at    timestamp default CURRENT_TIMESTAMP
);

create table if not exists reposteos (
  id             serial primary key,
  posteo_id      integer not null references posteos(id),
  reposteador_id integer not null references usuarios(id),
  created_at     timestamp default CURRENT_TIMESTAMP
);

create table if not exists seguimientos (
  id           serial primary key,
  id_mio       integer not null references usuarios(id),
  id_a_seguir  integer not null references usuarios(id),
  created_at   timestamp default CURRENT_TIMESTAMP,
  updated_at   timestamp default CURRENT_TIMESTAMP
);

create table if not exists seguidores (
  seguidor_id integer not null references usuarios(id) on delete cascade,
  seguido_id  integer not null references usuarios(id) on delete cascade,
  created_at  timestamp default CURRENT_TIMESTAMP,
  primary key (seguidor_id, seguido_id)
);

create table if not exists refresh_tokens (
  id          uuid primary key default gen_random_uuid(),
  user_id     integer not null references usuarios(id) on delete cascade,
  token_hash  text not null unique,
  expira      timestamptz not null,
  revocado    boolean not null default false,
  creado      timestamptz not null default now()
);

create index if not exists idx_refresh_tokens_user on refresh_tokens(user_id);

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
       p.likes
from usuarios u
join posteos p on u.id = p.creador_id;

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
       u.identificador
from comentarios c
join posteos p on c.id_del_posteo = p.id
join usuarios u on c.emisor_id = u.id;

create or replace view seguimientos_usuarios as
select s.id as id_seguimiento,
       s.id_mio,
       s.id_a_seguir,
       u.id,
       u.nombre,
       u.email,
       u.identificador,
       u.fecha_creacion
from seguimientos s
join usuarios u on s.id_a_seguir = u.id;

create or replace view reposteos_usuarios as
select p.contenido,
       p.creador_id,
       p.created_at,
       p.likes,
       p.id as posteo_id,
       p.titulo,
       p.updated_at,
       r.id as reposteo_id,
       u.id,
       u.nombre,
       u.email,
       u.identificador
from usuarios u
join reposteos r on r.reposteador_id = u.id
join posteos p on r.posteo_id = p.id;
