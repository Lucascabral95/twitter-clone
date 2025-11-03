import { renderHook, act } from '@testing-library/react'
import { useAuthModals } from '@/presentation/hooks/useAuthModals'

describe('useAuthModals', () => {
  it('debe inicializar con los modales cerrados', () => {
    const { result } = renderHook(() => useAuthModals())

    expect(result.current.isOpenRegister).toBe(false)
    expect(result.current.isOpenLogin).toBe(false)
  })

  it('debe abrir el modal de registro cuando se llama openRegister', () => {
    const { result } = renderHook(() => useAuthModals())

    act(() => {
      result.current.openRegister()
    })

    expect(result.current.isOpenRegister).toBe(true)
  })

  it('debe cerrar el modal de registro cuando se llama closeRegister', () => {
    const { result } = renderHook(() => useAuthModals())

    act(() => {
      result.current.openRegister()
    })

    expect(result.current.isOpenRegister).toBe(true)

    act(() => {
      result.current.closeRegister()
    })

    expect(result.current.isOpenRegister).toBe(false)
  })

  it('debe abrir el modal de login cuando se llama openLogin', () => {
    const { result } = renderHook(() => useAuthModals())

    act(() => {
      result.current.openLogin()
    })

    expect(result.current.isOpenLogin).toBe(true)
  })

  it('debe cerrar el modal de login cuando se llama closeLogin', () => {
    const { result } = renderHook(() => useAuthModals())

    act(() => {
      result.current.openLogin()
    })

    expect(result.current.isOpenLogin).toBe(true)

    act(() => {
      result.current.closeLogin()
    })

    expect(result.current.isOpenLogin).toBe(false)
  })

  it('debe permitir abrir ambos modales independientemente', () => {
    const { result } = renderHook(() => useAuthModals())

    act(() => {
      result.current.openRegister()
      result.current.openLogin()
    })

    expect(result.current.isOpenRegister).toBe(true)
    expect(result.current.isOpenLogin).toBe(true)
  })

  it('debe permitir cerrar un modal sin afectar el otro', () => {
    const { result } = renderHook(() => useAuthModals())

    act(() => {
      result.current.openRegister()
      result.current.openLogin()
    })

    act(() => {
      result.current.closeRegister()
    })

    expect(result.current.isOpenRegister).toBe(false)
    expect(result.current.isOpenLogin).toBe(true)
  })

  it('debe retornar funciones con comportamiento consistente', () => {
    const { result } = renderHook(() => useAuthModals())

    // Verificar que las funciones sean del tipo correcto
    expect(typeof result.current.openRegister).toBe('function')
    expect(typeof result.current.closeRegister).toBe('function')
    expect(typeof result.current.openLogin).toBe('function')
    expect(typeof result.current.closeLogin).toBe('function')
  })
})
