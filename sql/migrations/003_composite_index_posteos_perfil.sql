-- El paginado keyset del perfil filtra `creador_id = X and id < cursor order by id desc`.
-- El índice existente idx_posteos_creador(creador_id) no cubre el order by, forzando un sort
-- adicional. Este índice compuesto sirve la query completa con un index scan.

create index if not exists idx_posteos_creador_id_desc on posteos(creador_id, id desc);
