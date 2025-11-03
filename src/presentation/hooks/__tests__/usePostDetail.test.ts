import { renderHook, waitFor } from '@testing-library/react'
import useStore from '@/zustand'
import { usePostDetail } from '@/presentation/hooks/usePostDetail'

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}))
import { useParams } from 'next/navigation'

jest.mock('@/infrastructure/services', () => ({
  postDetailService: {
    getPostById: jest.fn(),
  },
}))
import { postDetailService } from '@/infrastructure/services'

const anyStore = useStore as any

describe('usePostDetail', () => {
  beforeEach(() => {
    anyStore.__resetMockState?.()
    jest.clearAllMocks()
  })

  it('no busca si no hay id', () => {
    ;(useParams as jest.Mock).mockReturnValue({ id: undefined })
    const getById = postDetailService.getPostById as jest.Mock
    anyStore.__setMockState?.({
      getCookieLogueo: jest.fn(),
      existeEnMiListaDeAmigos: jest.fn(),
      datosLogueo: {},
    })

    renderHook(() => usePostDetail())
    expect(getById).not.toHaveBeenCalled()
  })

  it('carga el post con éxito y setea estados', async () => {
    ;(useParams as jest.Mock).mockReturnValue({ id: '42' })
    const getById = postDetailService.getPostById as jest.Mock
    getById.mockResolvedValue({ success: true, data: { id: 42, creador_id: 7 } })

    anyStore.__setMockState?.({
      getCookieLogueo: jest.fn().mockResolvedValue(undefined),
      existeEnMiListaDeAmigos: jest.fn(),
      datosLogueo: {},
    })

    const { result } = renderHook(() => usePostDetail())

    // loading true al inicio
    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(getById).toHaveBeenCalledWith('42')
      expect(result.current.dataPosteo).toEqual({ id: 42, creador_id: 7 })
      expect(result.current.error).toBe(false)
      expect(result.current.detalleError).toBe('')
      expect(result.current.loading).toBe(false)
    })
  })

  it('maneja error de servicio y setea detalleError', async () => {
    ;(useParams as jest.Mock).mockReturnValue({ id: '9' })
    const getById = postDetailService.getPostById as jest.Mock
    getById.mockResolvedValue({ success: false, error: 'Not found' })

    anyStore.__setMockState?.({
      getCookieLogueo: jest.fn().mockResolvedValue(undefined),
      existeEnMiListaDeAmigos: jest.fn(),
      datosLogueo: {},
    })

    const { result } = renderHook(() => usePostDetail())

    await waitFor(() => {
      expect(getById).toHaveBeenCalledWith('9')
      expect(result.current.error).toBe(true)
      expect(result.current.detalleError).toBe('Not found')
      expect(result.current.loading).toBe(false)
    })
  })

  it('verifica existeEnMiListaDeAmigos cuando hay datosLogueo.id y creador_id', async () => {
    ;(useParams as jest.Mock).mockReturnValue({ id: '100' })
    const getById = postDetailService.getPostById as jest.Mock
    getById.mockResolvedValue({ success: true, data: { id: 100, creador_id: 55 } })

    const existeSpy = jest.fn().mockResolvedValue(undefined)
    anyStore.__setMockState?.({
      getCookieLogueo: jest.fn().mockResolvedValue(undefined),
      existeEnMiListaDeAmigos: existeSpy,
      datosLogueo: { id: 77 },
    })

    renderHook(() => usePostDetail())

    await waitFor(() => {
      expect(getById).toHaveBeenCalledWith('100')
    })

    await waitFor(() => {
      expect(existeSpy).toHaveBeenCalledWith(77, 55)
    })
  })

  it('no llama existeEnMiListaDeAmigos si falta alguno de los ids', async () => {
    ;(useParams as jest.Mock).mockReturnValue({ id: '5' })
    const getById = postDetailService.getPostById as jest.Mock
    getById.mockResolvedValue({ success: true, data: { id: 5, creador_id: 12 } })

    const existeSpy = jest.fn()
    anyStore.__setMockState?.({
      getCookieLogueo: jest.fn().mockResolvedValue(undefined),
      existeEnMiListaDeAmigos: existeSpy,
      datosLogueo: {},
    })

    renderHook(() => usePostDetail())

    await waitFor(() => {
      expect(getById).toHaveBeenCalledWith('5')
    })

    await new Promise(r => setTimeout(r, 0))
    expect(existeSpy).not.toHaveBeenCalled()
  })
})
