'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { usePathname } from 'next/navigation'
import { HiMagnifyingGlass } from 'react-icons/hi2'
import { IoMdClose } from 'react-icons/io'

import ListaBusqueda from '../ListaBusqueda/ListaBusqueda'
import { useBusquedaUsuarios, useDebounce } from '@/presentation/hooks'
import './BuscadorSuperior.scss'

const BuscadorSuperior: React.FC = () => {
  const pathname = usePathname() ?? ''
  const [mounted, setMounted] = useState(false)
  const [inputBusqueda, setInputBusqueda] = useState<string>('')

  const debouncedInput = useDebounce(inputBusqueda, 300)
  const axiosInstance = useMemo(() => axios.create(), [])
  const { usuarios, buscar, loading } = useBusquedaUsuarios(axiosInstance)
  const buscando = loading || inputBusqueda !== debouncedInput

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    buscar(debouncedInput)
  }, [debouncedInput, buscar])

  const handleLimpiar = useCallback(() => {
    setInputBusqueda('')
  }, [])

  if (!mounted || pathname === '/' || pathname.startsWith('/feed/search')) {
    return null
  }

  const mostrarResultados = inputBusqueda.trim().length > 0

  return (
    <div className="buscador-superior">
      <div className="contenedor-buscador-superior">
        <div className="lupa">
          <HiMagnifyingGlass className="icon" />
        </div>
        <input
          type="text"
          placeholder="Buscar usuario..."
          value={inputBusqueda}
          onChange={(e) => setInputBusqueda(e.target.value)}
          aria-label="Buscar usuarios"
        />
        {mostrarResultados && (
          <button type="button" className="limpiar" onClick={handleLimpiar} aria-label="Limpiar búsqueda">
            <IoMdClose className="icon" />
          </button>
        )}

        {mostrarResultados && (
          <ListaBusqueda datos={usuarios} palabra={inputBusqueda} cerrarBusqueda={handleLimpiar} cargando={buscando} />
        )}
      </div>
    </div>
  )
}

export default BuscadorSuperior
