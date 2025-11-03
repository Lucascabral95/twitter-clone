import { renderHook, waitFor } from '@testing-library/react'
import useStore from '@/zustand'
import { useUserData } from '@/presentation/hooks/useUserData'

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}))
import { useParams } from 'next/navigation'

jest.mock('@/infrastructure/services', () => ({
  userService: {
    getUserById: jest.fn(),
  },
}))
import { userService } from '@/infrastructure/services'

const anyStore = useStore as any

describe('useUserData', () => {
  beforeEach(() => {
    anyStore.__resetMockState?.()
    jest.clearAllMocks()
  })

  it('llama getTweetsByIDUser con el id numérico', async () => {
    ;(useParams as jest.Mock).mockReturnValue({ id: '77' })
    const getTweetsByIDUser = jest.fn()
    anyStore.__setMockState?.({
      getTweetsByIDUser,
      posteosUser: [],
    })
    ;(userService.getUserById as jest.Mock).mockResolvedValue({
      success: true,
      data: { id: 77, nombre: 'User' },
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
    ;(userService.getUserById as jest.Mock).mockResolvedValue({ success: true, data: {} })

    renderHook(() => useUserData())
    await new Promise(r => setTimeout(r, 0))
    expect(getTweetsByIDUser).not.toHaveBeenCalled()
  })

  it('setea dataUser en éxito y apaga loading', async () => {
    ;(useParams as jest.Mock).mockReturnValue({ id: '12' })
    anyStore.__setMockState?.({
      getTweetsByIDUser: jest.fn(),
      posteosUser: [{ id: 1 }],
    })
    ;(userService.getUserById as jest.Mock).mockResolvedValue({
      success: true,
      data: { id: 12, nombre: 'Ana' },
    })

    const { result } = renderHook(() => useUserData())

    await waitFor(() => {
      expect(result.current.dataUser).toEqual({ id: 12, nombre: 'Ana' })
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe('')
    })
    expect(result.current.posteosUser).toEqual([{ id: 1 }])
  })

  it('maneja error del servicio y apaga loading', async () => {
    ;(useParams as jest.Mock).mockReturnValue({ id: '12' })
    anyStore.__setMockState?.({
      getTweetsByIDUser: jest.fn(),
      posteosUser: [],
    })
    ;(userService.getUserById as jest.Mock).mockResolvedValue({
      success: false,
      error: 'No existe',
    })

    const { result } = renderHook(() => useUserData())

    await waitFor(() => {
      expect(result.current.error).toBe('No existe')
      expect(result.current.loading).toBe(false)
      expect(result.current.dataUser).toEqual({})
    })
  })
})
