import { renderHook, waitFor } from '@testing-library/react'
import { useLogin } from '@/presentation/hooks/useLogin'
import { authService } from '@/infrastructure/services/authService.service'
import { useRouter } from 'next/navigation'
import type { LoginCredentials } from '@/infrastructure/interfaces'

// Mock de next/navigation
jest.mock('next/navigation', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}))

// Mock del servicio de autenticación
jest.mock('@/infrastructure/services/authService.service', () => ({
  __esModule: true,
  authService: { login: jest.fn() },
}))

function createDeferred<T>() {
  let resolve!: (v: T) => void
  let reject!: (e?: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

describe('useLogin', () => {
  let mockPush: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    mockPush = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
  })

  it('envía credenciales y navega en éxito', async () => {
    const deferred = createDeferred<{ success: boolean } | undefined>()
    ;(authService.login as jest.Mock).mockReturnValue(deferred.promise)

    const { result } = renderHook(() => useLogin())

    const fd = new FormData()
    fd.set('email', 'user@test.com')
    fd.set('password', 'secret')

    const pending = result.current.handleLogin(fd)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true)
    })

    deferred.resolve({ success: true })
    await pending

    expect(authService.login).toHaveBeenCalledWith({
      email: 'user@test.com',
      password: 'secret',
    })
    expect(mockPush).toHaveBeenCalledWith('/adentro')
    expect(result.current.isLoading).toBe(true)
  })

  it('no navega si success es false/undefined', async () => {
    ;(authService.login as jest.Mock).mockResolvedValueOnce({
      success: false,
    })

    const { result } = renderHook(() => useLogin())

    const fd = new FormData()
    fd.set('email', 'a@a.com')
    fd.set('password', 'p1')

    await result.current.handleLogin(fd)

    expect(mockPush).not.toHaveBeenCalled()
    expect(result.current.isLoading).toBe(false)
  })

  it('limpia isLoading cuando result es undefined', async () => {
    ;(authService.login as jest.Mock).mockResolvedValueOnce(undefined)

    const { result } = renderHook(() => useLogin())

    const fd = new FormData()
    fd.set('email', 'b@b.com')
    fd.set('password', 'p2')

    await result.current.handleLogin(fd)

    expect(mockPush).not.toHaveBeenCalled()
    expect(result.current.isLoading).toBe(false)
  })

  it('mantiene isLoading true mientras la promesa está pendiente', async () => {
    const deferred = createDeferred<{ success: boolean }>()
    ;(authService.login as jest.Mock).mockReturnValue(deferred.promise)

    const { result } = renderHook(() => useLogin())

    const fd = new FormData()
    fd.set('email', 'slow@test.com')
    fd.set('password', 'zzz')

    const pending = result.current.handleLogin(fd)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true)
    })

    deferred.resolve({ success: true })
    await pending

    expect(result.current.isLoading).toBe(true)
    expect(mockPush).toHaveBeenCalledWith('/adentro')
  })

  it('debe extraer correctamente email y password del FormData', async () => {
    ;(authService.login as jest.Mock).mockResolvedValueOnce({
      success: true,
    })

    const { result } = renderHook(() => useLogin())

    const fd = new FormData()
    fd.set('email', 'test@example.com')
    fd.set('password', 'myPassword123')

    await result.current.handleLogin(fd)

    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'myPassword123',
    })
  })

  it('debe inicializar isLoading en false', () => {
    ;(authService.login as jest.Mock).mockResolvedValueOnce({
      success: true,
    })

    const { result } = renderHook(() => useLogin())

    expect(result.current.isLoading).toBe(false)
  })
})
