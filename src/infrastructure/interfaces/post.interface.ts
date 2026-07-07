export interface CreatePostPayload {
  titulo: string;
  contenido: string;
  imagen_url?: string | null;
  imagen_public_id?: string | null;
}
