import { renderHook, act } from '@testing-library/react'
import { useRegister } from '@/presentation/hooks/useRegister'
import { authService } from '@/infrastructure/services/authService.service'
import { useRouter } from 'next/navigation'

jest.mock('next/navigation', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}))

jest.mock('@/infrastructure/services/authService.service', () => ({
  __esModule: true,
  authService: { register: jest.fn() },
}))

describe('useRegister', () => {
  let mockPush: jest.Mock
  const mockOnSuccess = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockPush = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
  })

  const fillAndSubmit = async (
    result: { current: ReturnType<typeof useRegister> },
    nombre: string,
    email: string,
    password: string
  ) => {
    // Reading `errors` once subscribes react-hook-form's lazy formState proxy,
    // so later validation failures actually trigger a re-render we can observe.
    void result.current.formState.errors

    act(() => {
      result.current.register('nombre')
      result.current.register('email')
      result.current.register('password')
      result.current.setValue('nombre', nombre)
      result.current.setValue('email', email)
      result.current.setValue('password', password)
    })

    await act(async () => {
      await result.current.onSubmit()
    })
  }

  it('initializes with no submission in progress', () => {
    const { result } = renderHook(() => useRegister(mockOnSuccess))

    expect(result.current.formState.isSubmitting).toBe(false)
  })

  it('does not call the service when the password does not meet the requirements', async () => {
    (authService.register as jest.Mock).mockResolvedValue({ success: true })
    const { result } = renderHook(() => useRegister(mockOnSuccess))

    await fillAndSubmit(result, 'Juan Perez', 'juan@example.com', 'weak')

    expect(authService.register).not.toHaveBeenCalled()
    expect(result.current.formState.errors.password).toBeDefined()
    expect(mockOnSuccess).not.toHaveBeenCalled()
  })

  it('registers, auto-logs in and navigates to /home on success', async () => {
    (authService.register as jest.Mock).mockResolvedValue({ success: true })
    const { result } = renderHook(() => useRegister(mockOnSuccess))

    await fillAndSubmit(result, 'Juan Perez', 'juan@example.com', 'Password1')

    expect(authService.register).toHaveBeenCalledWith({
      nombre: 'Juan Perez',
      email: 'juan@example.com',
      password: 'Password1',
    })
    expect(mockOnSuccess).toHaveBeenCalled()
    expect(mockPush).toHaveBeenCalledWith('/home')
  })

  it('sets a root error and does not navigate when registration fails', async () => {
    (authService.register as jest.Mock).mockResolvedValue({
      success: false,
      error: 'El usuario ya se encuentra registrado',
    })
    const { result } = renderHook(() => useRegister(mockOnSuccess))

    await fillAndSubmit(result, 'Juan Perez', 'juan@example.com', 'Password1')

    expect(mockOnSuccess).not.toHaveBeenCalled()
    expect(mockPush).not.toHaveBeenCalled()
    expect(result.current.formState.errors.root?.message).toBe('El usuario ya se encuentra registrado')
  })
})
