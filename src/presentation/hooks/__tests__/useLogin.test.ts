import { renderHook, act } from '@testing-library/react'
import { useLogin } from '@/presentation/hooks/useLogin'
import { authService } from '@/infrastructure/services/authService.service'
import { useRouter } from 'next/navigation'

jest.mock('next/navigation', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}))

jest.mock('@/infrastructure/services/authService.service', () => ({
  __esModule: true,
  authService: { login: jest.fn() },
}))

describe('useLogin', () => {
  let mockPush: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    mockPush = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
  })

  const fillAndSubmit = async (
    result: { current: ReturnType<typeof useLogin> },
    email: string,
    password: string
  ) => {
    // Reading `errors` once subscribes react-hook-form's lazy formState proxy,
    // so later validation failures actually trigger a re-render we can observe.
    void result.current.formState.errors

    act(() => {
      result.current.register('email')
      result.current.register('password')
      result.current.setValue('email', email)
      result.current.setValue('password', password)
    })

    await act(async () => {
      await result.current.onSubmit()
    })
  }

  it('initializes with no submission in progress', () => {
    const { result } = renderHook(() => useLogin())

    expect(result.current.formState.isSubmitting).toBe(false)
  })

  it('does not call the service when the email is invalid', async () => {
    (authService.login as jest.Mock).mockResolvedValue({ success: true })
    const { result } = renderHook(() => useLogin())

    await fillAndSubmit(result, 'not-an-email', 'secret')

    expect(authService.login).not.toHaveBeenCalled()
    expect(result.current.formState.errors.email).toBeDefined()
  })

  it('logs in and navigates to /home on success', async () => {
    (authService.login as jest.Mock).mockResolvedValue({ success: true })
    const { result } = renderHook(() => useLogin())

    await fillAndSubmit(result, 'user@test.com', 'secret')

    expect(authService.login).toHaveBeenCalledWith({ email: 'user@test.com', password: 'secret' })
    expect(mockPush).toHaveBeenCalledWith('/home')
  })

  it('sets a root error and does not navigate when login fails', async () => {
    (authService.login as jest.Mock).mockResolvedValue({
      success: false,
      error: 'Contraseña incorrecta',
    })
    const { result } = renderHook(() => useLogin())

    await fillAndSubmit(result, 'user@test.com', 'wrong')

    expect(mockPush).not.toHaveBeenCalled()
    expect(result.current.formState.errors.root?.message).toBe('Contraseña incorrecta')
  })
})
