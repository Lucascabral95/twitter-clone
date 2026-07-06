import { useState, useEffect, useCallback } from 'react';
import useStore from '@/zustand';
import { SearchCriteria, SearchType } from '@/infrastructure/interfaces';
import { useDebounce } from './useDebounce';

const initialState: SearchCriteria = {
  tipoDeBusqueda: 'publicaciones',
  busqueda: '',
};

export const useSearch = () => {
  const obtenerResultadosDeBusqueda = useStore((s) => s.obtenerResultadosDeBusqueda);
  const arrayDeBusqueda = useStore((s) => s.arrayDeBusqueda);
  const [response, setResponse] = useState<SearchCriteria>(initialState);
  const busquedaDebounced = useDebounce(response.busqueda, 300);

  useEffect(() => {
    obtenerResultadosDeBusqueda({ busqueda: busquedaDebounced, tipoDeBusqueda: response.tipoDeBusqueda });
  }, [busquedaDebounced, response.tipoDeBusqueda, obtenerResultadosDeBusqueda]);

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
