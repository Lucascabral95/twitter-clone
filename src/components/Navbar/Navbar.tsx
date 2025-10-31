'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios'
import { usePathname } from 'next/navigation'
import { HiMagnifyingGlass } from 'react-icons/hi2'
import { IoMdClose } from 'react-icons/io'
import Avvvatars from 'avvvatars-react'

import ListaBusqueda from '../ListaBusqueda/ListaBusqueda'
import useStore from '@/zustand'
import './Navbar.scss'
import { useBusquedaUsuarios, useDebounce } from '@/presentation/hooks'

const Header: React.FC = () => {
  const pathname = usePathname()
  const { obtenerDatosDeCookie } = useStore()

  const [inputBusqueda, setInputBusqueda] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [mounted, setMounted] = useState(false)

  const debouncedInput = useDebounce(inputBusqueda, 300)

  const axiosInstance = useMemo(() => axios.create(), [])

  const { usuarios, buscar } = useBusquedaUsuarios(axiosInstance)

  useEffect(() => {
    const initUser = async () => {
      const response = await obtenerDatosDeCookie()
      setEmail(response?.email || '')
      setMounted(true)
    }

    initUser()
  }, [obtenerDatosDeCookie])

  useEffect(() => {
    buscar(debouncedInput)
  }, [debouncedInput, buscar])

  const handleLimpiar = useCallback(() => {
    setInputBusqueda('')
  }, [])

  if (!mounted || pathname === '/') {
    return null
  }

  const mostrarBusqueda = inputBusqueda.trim().length > 0

  return (
    <nav className='header'>
      <div className='contenedor-header'>
        <Link href='/feed' className='imagen-logo'>
          <Image
            className='imagen'
            src='/img/twitter.svg'
            alt='Logo'
            width={32}
            height={32}
            priority
          />
        </Link>

        <div className='contenedor-de-busquedas'>
          <div className='contenedor-de-busqueda'>
            <div className='lupa'>
              <HiMagnifyingGlass className='icon' />
            </div>
            <div className='input'>
              <input
                type='text'
                placeholder='Buscar usuario...'
                value={inputBusqueda}
                onChange={(e) => setInputBusqueda(e.target.value)}
                aria-label='Buscar usuarios'
              />
            </div>
            {mostrarBusqueda && (
              <button
                className='lupa icono-de-close'
                onClick={handleLimpiar}
                aria-label='Limpiar búsqueda'
                type='button'
              >
                <IoMdClose className='icon' />
              </button>
            )}
          </div>

          <Link href='/feed/search' className='boton-de-busqueda-navbar'>
            <HiMagnifyingGlass className='icon' />
          </Link>

          {mostrarBusqueda && (
            <ListaBusqueda
              datos={usuarios}
              palabra={inputBusqueda}
              cerrarBusqueda={handleLimpiar}
            />
          )}
        </div>

        <Link href='/home' className='nombre'>
          {email && <Avvvatars value={email} size={32} style='shape' />}
        </Link>
      </div>
    </nav>
  )
}

export default Header
