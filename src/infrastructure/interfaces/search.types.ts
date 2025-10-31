export type SearchType = 'publicaciones' | 'usuarios';

export interface SearchCriteria {
  tipoDeBusqueda: SearchType;
  busqueda: string;
}
