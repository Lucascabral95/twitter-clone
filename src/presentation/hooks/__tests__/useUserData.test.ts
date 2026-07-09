import { renderHook, waitFor } from '@testing-library/react'
import useStore from '@/zustand'
import { useUserData } from '@/presentation/hooks/useUserData'
import { useProfileData } from '@/presentation/hooks/useProfileData'

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}))
import { useParams } from 'next/navigation'

jest.mock('@/presentation/hooks/useProfileData', () => ({
  useProfileData: jest.fn(),
}))

const anyStore = useStore as any
const profile = {
  usuario: { id: 12, nombre: 'Ana', email: 'ana@test.com', fecha_creacion: '2024-01-01', identificador: '' },
  datosPersonales: null,
  stats: { seguidos: 0, seguidores: 0 },
  relacion: { viewerId: 1, esMiPerfil: false, loSigo: false },
}

describe('useUserData', () => {
  beforeEach(() => {
    anyStore.__resetMockState?.()
    jest.clearAllMocks()
    ;(useProfileData as jest.Mock).mockReturnValue({
      profile,
      loading: false,
      error: undefined,
      mutateProfile: jest.fn(),
    })
  })

  it('llama getTweetsByIDUser con el id numerico', async () => {
    ;(useParams as jest.Mock).mockReturnValue({ id: '77' })
    const getTweetsByIDUser = jest.fn()
    anyStore.__setMockState?.({
      getTweetsByIDUser,
      posteosUser: [],
      posteosUserOwnerId: 77,
    })

    const { result } = renderHook(() => useUserData())

    await waitFor(() => {
      expect(getTweetsByIDUser).toHaveBeenCalledWith(77)
    })
    expect(result.current.userId).toBe(77)
  })

  it('no llama acciones si falta id', async () => {
    ;(useParams as jest.Mock).mockReturnValue({ id: undefined })
    const getTweetsByIDUser = jest.fn()
    anyStore.__setMockState?.({
      getTweetsByIDUser,
      posteosUser: [],
    })

    renderHook(() => useUserData())
    await new Promise(r => setTimeout(r, 0))
    expect(getTweetsByIDUser).not.toHaveBeenCalled()
    expect(useProfileData).toHaveBeenCalledWith(null)
  })

  it('devuelve dataUser y posteos cuando ambos pertenecen al usuario actual', () => {
    ;(useParams as jest.Mock).mockReturnValue({ id: '12' })
    anyStore.__setMockState?.({
      getTweetsByIDUser: jest.fn(),
      posteosUser: [{ id: 1 }],
      posteosUserOwnerId: 12,
      loadingTweetsUser: false,
    })

    const { result } = renderHook(() => useUserData())

    expect(result.current.dataUser).toEqual(profile.usuario)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe('')
    expect(result.current.posteosUser).toEqual([{ id: 1 }])
  })

  it('mantiene loading y oculta posteos si el perfil cargado todavia tiene posteos de otro usuario', () => {
    ;(useParams as jest.Mock).mockReturnValue({ id: '12' })
    anyStore.__setMockState?.({
      getTweetsByIDUser: jest.fn(),
      posteosUser: [{ id: 99, creador_id: 99 }],
      posteosUserOwnerId: 99,
      loadingTweetsUser: true,
    })

    const { result } = renderHook(() => useUserData())

    expect(result.current.loading).toBe(true)
    expect(result.current.posteosUser).toEqual([])
    expect(result.current.hasMoreTweetsUser).toBe(false)
  })

  it('expone error del perfil y apaga loading', () => {
    ;(useParams as jest.Mock).mockReturnValue({ id: '12' })
    anyStore.__setMockState?.({
      getTweetsByIDUser: jest.fn(),
      posteosUser: [],
      posteosUserOwnerId: null,
    })
    ;(useProfileData as jest.Mock).mockReturnValue({
      profile: undefined,
      loading: false,
      error: { response: { data: { error: 'No existe' } } },
      mutateProfile: jest.fn(),
    })

    const { result } = renderHook(() => useUserData())

    expect(result.current.error).toBe('No existe')
    expect(result.current.loading).toBe(false)
    expect(result.current.dataUser).toEqual({})
  })

  it('expone error de posteos del usuario y no queda cargando para siempre', () => {
    ;(useParams as jest.Mock).mockReturnValue({ id: '12' })
    anyStore.__setMockState?.({
      getTweetsByIDUser: jest.fn(),
      posteosUser: [],
      posteosUserOwnerId: 12,
      loadingTweetsUser: false,
      posteosUserError: 'Error al cargar posteos',
    })

    const { result } = renderHook(() => useUserData())

    expect(result.current.error).toBe('Error al cargar posteos')
    expect(result.current.loading).toBe(false)
  })
})
