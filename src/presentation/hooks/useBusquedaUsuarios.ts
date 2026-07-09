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
  // Cachea la lista completa de usuarios una sola vez; cada búsqueda subsiguiente
  // filtra en memoria en vez de volver a pegarle al servidor por cada letra tipeada.
  const todosRef = useRef<Usuario[] | null>(null)
  const fetchPromiseRef = useRef<Promise<Usuario[]> | null>(null)

  const obtenerTodos = useCallback(async (): Promise<Usuario[]> => {
    if (todosRef.current) return todosRef.current

    if (!fetchPromiseRef.current) {
      fetchPromiseRef.current = axiosInstance
        .get<{ result: Usuario[] }>('/api/usuario')
        .then(({ data }) => {
          todosRef.current = data.result
          return data.result
        })
        .finally(() => {
          fetchPromiseRef.current = null
        })
    }

    return fetchPromiseRef.current
  }, [axiosInstance])

  const buscar = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setUsuarios([])
        return
      }

      setLoading(true)
      try {
        const todos = await obtenerTodos()
        const q = query.toLowerCase()

        setUsuarios(
          todos.filter(
            (user) =>
              user.email.toLowerCase().includes(q) ||
              user.nombre.toLowerCase().includes(q)
          )
        )
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
    [obtenerTodos]
  )

  return { usuarios, buscar, loading }
}
