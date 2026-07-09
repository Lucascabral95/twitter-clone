export interface ProfileUser {
  id: number;
  nombre: string;
  email: string;
  identificador: string;
  fecha_creacion: string;
}

export interface ProfileStats {
  seguidos: number;
  seguidores: number;
}

export interface ProfileRelation {
  viewerId: number | null;
  esMiPerfil: boolean;
  loSigo: boolean;
}

export interface ProfilePersonalData {
  id: number;
  biografia: string;
  localizacion: string;
  sitio_web: string;
  cumpleanos: string;
  usuario_id: number;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  usuario: ProfileUser;
  datosPersonales: ProfilePersonalData | null;
  stats: ProfileStats;
  relacion: ProfileRelation;
}
