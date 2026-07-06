-- Ejecutar manualmente en el SQL editor de Neon (o psql "$DATABASE_URL").
-- El proyecto no usa un framework de migraciones; las queries son SQL crudo via neon().

create table if not exists refresh_tokens (
  id          uuid primary key default gen_random_uuid(),
  user_id     integer not null references usuarios(id) on delete cascade,
  token_hash  text not null unique,
  expira      timestamptz not null,
  revocado    boolean not null default false,
  creado      timestamptz not null default now()
);

create index if not exists idx_refresh_tokens_user on refresh_tokens(user_id);
