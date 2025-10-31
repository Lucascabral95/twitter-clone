import { useState, useEffect, useCallback } from 'react';
import useStore from '@/zustand';
import { SearchCriteria, SearchType } from '@/infrastructure/interfaces';

const initialState: SearchCriteria = {
  tipoDeBusqueda: 'publicaciones',
  busqueda: '',
};

export const useSearch = () => {
  const { obtenerResultadosDeBusqueda, arrayDeBusqueda } = useStore();
  const [response, setResponse] = useState<SearchCriteria>(initialState);

  useEffect(() => {
    obtenerResultadosDeBusqueda(response);
  }, [response, obtenerResultadosDeBusqueda]);

  const handleSearchChange = useCallback((value: string) => {
    setResponse(prev => ({ ...prev, busqueda: value }));
  }, []);

  const handleTypeChange = useCallback((type: SearchType) => {
    setResponse(prev => ({ ...prev, tipoDeBusqueda: type }));
  }, []);

  const clearSearch = useCallback(() => {
    setResponse(initialState);
  }, []);

  return {
    response,
    arrayDeBusqueda,
    handleSearchChange,
    handleTypeChange,
    clearSearch,
  };
};
