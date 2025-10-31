import { useCallback, useRef, useState } from 'react'
import { AxiosError, AxiosInstance } from 'axios'
import { Usuario } from '@/infrastructure/interfaces'

interface BusquedaResult {
  usuarios: Usuario[]
  buscar: (query: string) => Promise<void>
  loading: boolean
}

/**
 * Hook personalizado para búsqueda de usuarios con caché
 * @param axiosInstance - Instancia de axios configurada
 * @returns { usuarios, buscar, loading }
 */
export const useBusquedaUsuarios = (
  axiosInstance: AxiosInstance
): BusquedaResult => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(false)
  const cacheRef = useRef<Map<string, Usuario[]>>(new Map())

  const buscar = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setUsuarios([])
        return
      }

      if (cacheRef.current.has(query)) {
        setUsuarios(cacheRef.current.get(query) || [])
        return
      }

      setLoading(true)
      try {
        const { data } = await axiosInstance.get<{ result: Usuario[] }>(
          '/api/usuario'
        )

        const filtrados = data.result.filter(
          (user) =>
            user.email.toLowerCase().includes(query.toLowerCase()) ||
            user.nombre.toLowerCase().includes(query.toLowerCase())
        )

        cacheRef.current.set(query, filtrados)
        setUsuarios(filtrados)
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error(
            error.response?.data?.error || 'Error en búsqueda',
            error
          )
        }
        setUsuarios([])
      } finally {
        setLoading(false)
      }
    },
    [axiosInstance]
  )

  return { usuarios, buscar, loading }
}
