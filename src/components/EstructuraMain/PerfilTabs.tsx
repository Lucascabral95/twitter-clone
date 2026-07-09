'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface PerfilTabsProps {
  base: string
}

const PerfilTabs: React.FC<PerfilTabsProps> = ({ base }) => {
  const pathname = usePathname() ?? ''

  const enInicio = pathname === base
  const enSobreMi = pathname === `${base}/sobre-mi`
  const enReposteos = pathname === `${base}/reposteos`

  return (
    <div className="main-secciones" role="tablist">
      <Link href={base} className={enInicio ? 'seccion active' : 'seccion'} role="tab" aria-selected={enInicio}>
        <div className="seccion-texto">
          <p>Inicio</p>
        </div>
      </Link>
      <Link href={`${base}/sobre-mi`} className={enSobreMi ? 'seccion active' : 'seccion'} role="tab" aria-selected={enSobreMi}>
        <div className="seccion-texto">
          <p>Sobre mí</p>
        </div>
      </Link>
      <Link href={`${base}/reposteos`} className={enReposteos ? 'seccion active' : 'seccion'} role="tab" aria-selected={enReposteos}>
        <div className="seccion-texto">
          <p>Reposteos</p>
        </div>
      </Link>
    </div>
  )
}

export default PerfilTabs
