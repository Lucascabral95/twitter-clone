'use client';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { IoMdClose } from 'react-icons/io';

import CardTweet from '@/components/EstructuraMain/CardTweet';
import BusquedaDeUsuarios from '@/components/BusquedaDeUsuarios/BusquedaDeUsuarios';
import { useSearch } from '@/presentation/hooks';
import './Search.scss';

const Search: React.FC = () => {
  const { response, arrayDeBusqueda, handleSearchChange, handleTypeChange, clearSearch } = useSearch();

  return (
    <div className="search">
      <div className="contenedor-search">
        <div className="formulario-de-busqueda-mobile">
          <div className="input-busqueda">
            <input
              type="text"
              placeholder="Buscar..."
              value={response.busqueda}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            <div className="icono" onClick={clearSearch}>
              <IoMdClose className="icon" />
            </div>
          </div>

          <div className="buscar-por">
            <div className="por">
              <p>Buscar por:</p>
            </div>
            <select
              className="publicacion-o-usuario"
              value={response.tipoDeBusqueda}
              onChange={(e) => handleTypeChange(e.target.value as 'publicaciones' | 'usuarios')}
            >
              <option value="publicaciones">Publicaciones</option>
              <option value="usuarios">Usuarios</option>
            </select>
          </div>
        </div>

        {response.tipoDeBusqueda === 'publicaciones' ? (
          <CardTweet posteos={arrayDeBusqueda} />
        ) : (
          <BusquedaDeUsuarios usuarios={arrayDeBusqueda} />
        )}

        <Toaster />
      </div>
    </div>
  );
};

export default Search;
