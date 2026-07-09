-- Soporte para lecturas de perfil y listados por usuario sin scans innecesarios.
-- Son indices aditivos e idempotentes.

create index if not exists idx_seguimientos_mio_created on seguimientos(id_mio, created_at desc);
create index if not exists idx_seguimientos_a_seguir_created on seguimientos(id_a_seguir, created_at desc);
create index if not exists idx_notificaciones_usuario_id_desc on notificaciones(usuario_id, id desc);
