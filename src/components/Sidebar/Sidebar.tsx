'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios'
import { usePathname } from 'next/navigation'
import { AnimatePresence } from 'motion/react'
import { FiHome, FiUser, FiEdit3, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { HiMagnifyingGlass } from 'react-icons/hi2'
import { IoMdNotificationsOutline } from 'react-icons/io'
import { RiLogoutBoxLine } from 'react-icons/ri'
import Avvvatars from 'avvvatars-react'

import Posteo from '../Navbar/Posteo'
import useStore from '@/zustand'
import { useNotificationsBadge } from '@/presentation/hooks'
import './Sidebar.scss'

const SIDEBAR_COLLAPSED_KEY = 'pulso-sidebar-collapsed'

const Sidebar: React.FC = () => {
  const pathname = usePathname() ?? ''
  const obtenerDatosDeCookie = useStore((s) => s.obtenerDatosDeCookie)
  const datosLogueo = useStore((s) => s.datosLogueo)

  const [mounted, setMounted] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [isOpenPosteo, setIsOpenPosteo] = useState<boolean>(false)

  const { noLeidas } = useNotificationsBadge(mounted && Boolean(datosLogueo?.email))

  useEffect(() => {
    const initUser = async () => {
      await obtenerDatosDeCookie()
      setMounted(true)
    }

    initUser()
  }, [obtenerDatosDeCookie])

  useEffect(() => {
    setCollapsed(localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true')
  }, [])

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next))
      return next
    })
  }, [])

  const cerrarSession = async () => {
    try {
      const logout = await axios.get('/api/auth/logout')

      if (logout.status === 200) {
        window.location.href = '/'
      }
    } catch {
      console.log('Error al cerrar session')
    }
  }

  if (!mounted || pathname === '/') {
    return null
  }

  const enInicio = pathname === '/feed'
  const enBusqueda = pathname.startsWith('/feed/search')
  const enNotificaciones = pathname.startsWith('/feed/notificaciones')
  const enPerfil = pathname.startsWith('/home') && !pathname.startsWith('/home/post')

  return (
    <aside className={collapsed ? 'sidebar collapsed' : 'sidebar'}>
      <div className="top">
        <Link href="/feed" className="mark">
          <Image src="/img/twitter.svg" alt="Logo" width={20} height={20} />
        </Link>
        <button type="button" className="collapsebtn" onClick={toggleCollapsed} aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}>
          {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>

      <nav>
        <Link href="/feed" className={enInicio ? 'link active' : 'link'}>
          <FiHome />
          <span className="txt">Inicio</span>
        </Link>

        <Link href="/feed/search" className={enBusqueda ? 'link active' : 'link'}>
          <HiMagnifyingGlass />
          <span className="txt">Buscar</span>
        </Link>

        <Link href="/feed/notificaciones" className={enNotificaciones ? 'link active' : 'link'}>
          <span className="icon-with-badge">
            <IoMdNotificationsOutline />
            {noLeidas > 0 && <span className="badge-no-leidas">{noLeidas > 9 ? '9+' : noLeidas}</span>}
          </span>
          <span className="txt">Notificaciones</span>
        </Link>

        <Link href="/home" className={enPerfil ? 'link active' : 'link'}>
          <FiUser />
          <span className="txt">Perfil</span>
        </Link>
      </nav>

      <button type="button" className="postbtn" onClick={() => setIsOpenPosteo(true)}>
        <FiEdit3 />
        <span className="txt">Postear</span>
      </button>

      <div className="account">
        <Link href="/home" className="account-avatar" aria-label="Ir a mi perfil">
          {datosLogueo?.email && <Avvvatars value={datosLogueo.email} size={30} style="shape" />}
        </Link>
        <div className="txt">
          <div className="n">{datosLogueo?.nombre}</div>
          <div className="e">{datosLogueo?.email}</div>
        </div>
        <button type="button" className="logout" onClick={cerrarSession} aria-label="Cerrar sesión">
          <RiLogoutBoxLine />
        </button>
      </div>

      <AnimatePresence>
        {isOpenPosteo && <Posteo email={String(datosLogueo?.email)} setIsOpenPosteo={setIsOpenPosteo} />}
      </AnimatePresence>
    </aside>
  )
}

export default Sidebar
