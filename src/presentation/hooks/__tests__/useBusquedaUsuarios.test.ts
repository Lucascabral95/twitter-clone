import { renderHook, act } from '@testing-library/react'
import type { AxiosInstance } from 'axios'
import { useBusquedaUsuarios } from '@/presentation/hooks/useBusquedaUsuarios'
import type { Usuario } from '@/infrastructure/interfaces'

type MinimalUser = Pick<Usuario, 'id' | 'email' | 'nombre'>

const usuariosMock: MinimalUser[] = [
  { id: 1, email: 'uno@test.com', nombre: 'Juan' },
  { id: 2, email: 'dos@test.com', nombre: 'Pedro' },
  { id: 3, email: 'tres@foo.com', nombre: 'Maria' },
]

function createAxiosMock(initialData: MinimalUser[]) {
  const get = jest.fn().mockResolvedValue({ data: { result: initialData } })
  return { get } as unknown as AxiosInstance
}

describe('useBusquedaUsuarios', () => {
  it('devuelve [] y no llama a la API si query está vacío/espaciado', async () => {
    const axiosMock = createAxiosMock(usuariosMock)
    const { result } = renderHook(() => useBusquedaUsuarios(axiosMock))

    await act(async () => {
      await result.current.buscar('   ')
    })

    expect(result.current.usuarios).toEqual([])
    expect(result.current.loading).toBe(false)
    const get = (axiosMock as unknown as { get: jest.Mock }).get
    expect(get).not.toHaveBeenCalled()
  })

  it('filtra por email o nombre (case-insensitive) y activa caché por query exacto', async () => {
    const axiosMock = createAxiosMock(usuariosMock)
    const { result } = renderHook(() => useBusquedaUsuarios(axiosMock))

    await act(async () => {
      await result.current.buscar('pedro')
    })

    expect(result.current.usuarios.map((u) => u.id)).toEqual([2])
    expect(result.current.loading).toBe(false)

    const get = (axiosMock as unknown as { get: jest.Mock }).get
    get.mockClear()

    await act(async () => {
      await result.current.buscar('pedro')
    })

    expect(get).not.toHaveBeenCalled()
    expect(result.current.usuarios.map((u) => u.id)).toEqual([2])
  })

  it('hace nueva petición para la misma palabra con distinta capitalización (clave de caché exacta)', async () => {
    const axiosMock = createAxiosMock(usuariosMock)
    const { result } = renderHook(() => useBusquedaUsuarios(axiosMock))

    await act(async () => {
      await result.current.buscar('PEDRO')
    })

    const get = (axiosMock as unknown as { get: jest.Mock }).get
    get.mockClear()

    await act(async () => {
      await result.current.buscar('pedro')
    })

    expect(get).toHaveBeenCalledTimes(1)
    expect(result.current.usuarios.map((u) => u.id)).toEqual([2])
  })

  it('llama a /api/usuario y respeta el contrato de datos', async () => {
    const axiosMock = createAxiosMock(usuariosMock)
    const { result } = renderHook(() => useBusquedaUsuarios(axiosMock))

    await act(async () => {
      await result.current.buscar('maria')
    })

    const get = (axiosMock as unknown as { get: jest.Mock }).get
    expect(get).toHaveBeenCalledWith('/api/usuario')
    expect(result.current.usuarios.map((u) => u.id)).toEqual([3])
  })

  it('maneja errores dejando usuarios en [] y loading en false', async () => {
    const axiosMock = {
      get: jest.fn().mockRejectedValue(new Error('network fail')),
    } as unknown as AxiosInstance

    const { result } = renderHook(() => useBusquedaUsuarios(axiosMock))

    await act(async () => {
      await result.current.buscar('juan')
    })

    expect(result.current.usuarios).toEqual([])
    expect(result.current.loading).toBe(false)
  })

  it('usa caché sin activar loading cuando ya tiene la query almacenada', async () => {
    const axiosMock = createAxiosMock(usuariosMock)
    const { result } = renderHook(() => useBusquedaUsuarios(axiosMock))

    await act(async () => {
      await result.current.buscar('foo')
    })
    expect(result.current.loading).toBe(false)

    await act(async () => {
      await result.current.buscar('foo')
    })
    expect(result.current.loading).toBe(false)
  })

  it('filtra múltiples coincidencias correctamente', async () => {
    const axiosMock = createAxiosMock(usuariosMock)
    const { result } = renderHook(() => useBusquedaUsuarios(axiosMock))

    await act(async () => {
      await result.current.buscar('test.com')
    })

    expect(result.current.usuarios.map((u) => u.id)).toEqual([1, 2])
  })

  it('retorna array vacío cuando no hay coincidencias', async () => {
    const axiosMock = createAxiosMock(usuariosMock)
    const { result } = renderHook(() => useBusquedaUsuarios(axiosMock))

    await act(async () => {
      await result.current.buscar('noexiste')
    })

    expect(result.current.usuarios).toEqual([])
    expect(result.current.loading).toBe(false)
  })
})
