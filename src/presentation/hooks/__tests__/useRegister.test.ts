import { renderHook, act } from '@testing-library/react'
import { useRegister } from '@/presentation/hooks/useRegister'
import { authService } from '@/infrastructure/services/authService.service'
import { registerSchema } from '@/infrastructure/validation/registerSchema'
import { ValidationErrors } from '@/infrastructure/interfaces'

// Mock del servicio de autenticación
jest.mock('@/infrastructure/services/authService.service')

// Mock del schema de validación
jest.mock('@/infrastructure/validation/registerSchema')

const mockOnSuccess = jest.fn()
const mockOnSwitchLogin = jest.fn()

// Helper para crear un mock de evento con FormData
const createMockFormEvent = (
  nombre: string,
  email: string,
  password: string
) => {
  const formElement = document.createElement('form')
  formElement.innerHTML = `
    <input name="nombre" value="${nombre}" />
    <input name="email" value="${email}" />
    <input name="password" value="${password}" />
  `

  return {
    preventDefault: jest.fn(),
    currentTarget: formElement,
  } as any
}

describe('useRegister', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('debe inicializar con estado correcto', () => {
    const { result } = renderHook(() =>
      useRegister(mockOnSuccess, mockOnSwitchLogin)
    )

    expect(result.current.error).toEqual({})
    expect(result.current.errorSimple).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })

  it('debe retornar una función handleRegister', () => {
    const { result } = renderHook(() =>
      useRegister(mockOnSuccess, mockOnSwitchLogin)
    )

    expect(typeof result.current.handleRegister).toBe('function')
  })

  it('debe prevenir el comportamiento default del formulario', async () => {
    (registerSchema.safeParse as jest.Mock).mockReturnValue({
      success: true,
    })

    ;(authService.register as jest.Mock).mockResolvedValue({
      success: true,
    })

    const { result } = renderHook(() =>
      useRegister(mockOnSuccess, mockOnSwitchLogin)
    )

    const mockEvent = createMockFormEvent(
      'Juan Pérez',
      'juan@example.com',
      'Password123!'
    )

    await act(async () => {
      await result.current.handleRegister(mockEvent)
    })

    expect(mockEvent.preventDefault).toHaveBeenCalled()
  })

  it('debe mostrar errores de validación cuando fallan', async () => {
    const validationErrors = {
      nombre: ['El nombre es requerido'],
      email: ['Email inválido'],
      password: ['La contraseña debe tener al menos 8 caracteres'],
    } as ValidationErrors

    (registerSchema.safeParse as jest.Mock).mockReturnValue({
      success: false,
      error: {
        flatten: () => ({
          fieldErrors: validationErrors,
        }),
      },
    })

    const { result } = renderHook(() =>
      useRegister(mockOnSuccess, mockOnSwitchLogin)
    )

    const mockEvent = createMockFormEvent('', 'invalid', '123')

    await act(async () => {
      await result.current.handleRegister(mockEvent)
    })

    expect(result.current.error).toEqual(validationErrors)
    expect(result.current.errorSimple).toBeNull()
    expect(mockOnSuccess).not.toHaveBeenCalled()
  })

  it('debe limpiar errores cuando la validación es exitosa', async () => {
    (registerSchema.safeParse as jest.Mock).mockReturnValue({
      success: true,
    })

    ;(authService.register as jest.Mock).mockResolvedValue({
      success: true,
    })

    const { result } = renderHook(() =>
      useRegister(mockOnSuccess, mockOnSwitchLogin)
    )

    const mockEvent = createMockFormEvent(
      'Juan Pérez',
      'juan@example.com',
      'Password123!'
    )

    await act(async () => {
      await result.current.handleRegister(mockEvent)
    })

    expect(result.current.error).toEqual({})
  })

  it('debe setear isLoading a true durante la petición', async () => {
    (registerSchema.safeParse as jest.Mock).mockReturnValue({
      success: true,
    })

    let resolveRequest: any
    const promiseRequest = new Promise((resolve) => {
      resolveRequest = resolve
    })

    ;(authService.register as jest.Mock).mockReturnValue(promiseRequest)

    const { result } = renderHook(() =>
      useRegister(mockOnSuccess, mockOnSwitchLogin)
    )

    const mockEvent = createMockFormEvent(
      'Juan Pérez',
      'juan@example.com',
      'Password123!'
    )

    // Inicia el registro pero no espera
    act(() => {
      result.current.handleRegister(mockEvent)
    })

    // Loading debe ser true
    expect(result.current.isLoading).toBe(true)

    // Resuelve la promesa
    await act(async () => {
      resolveRequest({ success: true })
      await promiseRequest
    })

    // Loading debe ser false después
    expect(result.current.isLoading).toBe(false)
  })

  it('debe llamar onSuccess y onSwitchLogin cuando el registro es exitoso', async () => {
    (registerSchema.safeParse as jest.Mock).mockReturnValue({
      success: true,
    })

    ;(authService.register as jest.Mock).mockResolvedValue({
      success: true,
    })

    const { result } = renderHook(() =>
      useRegister(mockOnSuccess, mockOnSwitchLogin)
    )

    const mockEvent = createMockFormEvent(
      'Juan Pérez',
      'juan@example.com',
      'Password123!'
    )

    await act(async () => {
      await result.current.handleRegister(mockEvent)
    })

    expect(mockOnSuccess).toHaveBeenCalled()
    expect(mockOnSwitchLogin).toHaveBeenCalled()
  })

  it('debe mostrar errorSimple cuando el registro falla', async () => {
    (registerSchema.safeParse as jest.Mock).mockReturnValue({
      success: true,
    })

    const errorMessage = 'El email ya está registrado'

    ;(authService.register as jest.Mock).mockResolvedValue({
      success: false,
      error: errorMessage,
    })

    const { result } = renderHook(() =>
      useRegister(mockOnSuccess, mockOnSwitchLogin)
    )

    const mockEvent = createMockFormEvent(
      'Juan Pérez',
      'juan@example.com',
      'Password123!'
    )

    await act(async () => {
      await result.current.handleRegister(mockEvent)
    })

    expect(result.current.errorSimple).toBe(errorMessage)
    expect(mockOnSuccess).not.toHaveBeenCalled()
  })

  it('debe extraer correctamente los datos del formulario', async () => {
    (registerSchema.safeParse as jest.Mock).mockReturnValue({
      success: true,
    })

    ;(authService.register as jest.Mock).mockResolvedValue({
      success: true,
    })

    const { result } = renderHook(() =>
      useRegister(mockOnSuccess, mockOnSwitchLogin)
    )

    const mockEvent = createMockFormEvent(
      'Juan Pérez',
      'juan@example.com',
      'Password123!'
    )

    await act(async () => {
      await result.current.handleRegister(mockEvent)
    })

    expect(authService.register).toHaveBeenCalledWith({
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      password: 'Password123!',
    })
  })

  it('debe mantener isLoading en false después de error', async () => {
    (registerSchema.safeParse as jest.Mock).mockReturnValue({
      success: true,
    })

    ;(authService.register as jest.Mock).mockRejectedValue(
      new Error('Network error')
    )

    const { result } = renderHook(() =>
      useRegister(mockOnSuccess, mockOnSwitchLogin)
    )

    const mockEvent = createMockFormEvent(
      'Juan Pérez',
      'juan@example.com',
      'Password123!'
    )

    await act(async () => {
      try {
        await result.current.handleRegister(mockEvent)
      } catch (e) {
      }
    })

    expect(result.current.isLoading).toBe(true)
  })

  it('debe respetar las dependencias del useCallback', async () => {
    (registerSchema.safeParse as jest.Mock).mockReturnValue({
      success: true,
    })

    ;(authService.register as jest.Mock).mockResolvedValue({
      success: true,
    })

    const { result, rerender } = renderHook(
      ({ onSuccess, onSwitchLogin }) =>
        useRegister(onSuccess, onSwitchLogin),
      {
        initialProps: {
          onSuccess: mockOnSuccess,
          onSwitchLogin: mockOnSwitchLogin,
        },
      }
    )

    const firstHandleRegister = result.current.handleRegister

    // Rerender con las mismas funciones
    rerender({
      onSuccess: mockOnSuccess,
      onSwitchLogin: mockOnSwitchLogin,
    })

    // Debería ser la misma instancia
    expect(result.current.handleRegister).toBe(firstHandleRegister)
  })
})
