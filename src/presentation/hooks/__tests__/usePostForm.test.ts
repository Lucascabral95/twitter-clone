import { renderHook, act } from '@testing-library/react'
import useStore from '@/zustand'
import { usePostForm } from '@/presentation/hooks/usePostForm'

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))
import toast from 'react-hot-toast'

jest.mock('@/infrastructure/services', () => ({
  postService: {
    createPost: jest.fn(),
  },
}))
import { postService } from '@/infrastructure/services'

const anyStore = useStore as any

describe('usePostForm', () => {
  beforeEach(() => {
    anyStore.__resetMockState?.()
    jest.clearAllMocks()
  })

  it('llama getCookieLogueo al montar', () => {
    const getCookieLogueo = jest.fn()
    anyStore.__setMockState?.({
      getCookieLogueo,
      datosLogueo: { id: 5 },
      addTweet: jest.fn(),
    })

    renderHook(() => usePostForm())
    expect(getCookieLogueo).toHaveBeenCalledTimes(1)
  })

  it('envía con éxito, llama addTweet y muestra toast.success', async () => {
    const addTweet = jest.fn()
    anyStore.__setMockState?.({
      getCookieLogueo: jest.fn(),
      datosLogueo: { id: 9 },
      addTweet,
    })

    ;(postService.createPost as jest.Mock).mockResolvedValue({
      success: true,
      data: { id: 1 },
    })

    const { result } = renderHook(() => usePostForm())

    const form = document.createElement('form')
    const inputTitulo = document.createElement('input')
    inputTitulo.name = 'titulo'
    inputTitulo.value = 'Hola'
    const inputContenido = document.createElement('input')
    inputContenido.name = 'contenido'
    inputContenido.value = 'Mundo'
    form.appendChild(inputTitulo)
    form.appendChild(inputContenido)
    document.body.appendChild(form)

    await act(async () => {
      const event = new Event('submit', { bubbles: true, cancelable: true }) as unknown as React.FormEvent<HTMLFormElement>
      Object.defineProperty(event, 'currentTarget', { value: form })
      await result.current.handleSubmit(event)
    })

    expect(postService.createPost).toHaveBeenCalledWith({
      titulo: 'Hola',
      contenido: 'Mundo',
      creador_id: 9,
    })

    expect(addTweet).toHaveBeenCalledTimes(1)
    expect(toast.success).toHaveBeenCalledWith('Posteo creado')

    expect(inputTitulo.value).toBe('')
    expect(inputContenido.value).toBe('')

    expect(result.current.titulo).toBe(0)
    expect(result.current.contenido).toBe(0)
    expect(result.current.isLoading).toBe(false)
  })

  it('maneja error: no llama addTweet y muestra toast.error', async () => {
    const addTweet = jest.fn()
    anyStore.__setMockState?.({
      getCookieLogueo: jest.fn(),
      datosLogueo: { id: 3 },
      addTweet,
    })

    ;(postService.createPost as jest.Mock).mockResolvedValue({
      success: false,
      error: 'Falló',
    })

    const { result } = renderHook(() => usePostForm())

    const form = document.createElement('form')
    const inputTitulo = document.createElement('input')
    inputTitulo.name = 'titulo'
    inputTitulo.value = 'T'
    const inputContenido = document.createElement('input')
    inputContenido.name = 'contenido'
    inputContenido.value = 'C'
    form.appendChild(inputTitulo)
    form.appendChild(inputContenido)
    document.body.appendChild(form)

    await act(async () => {
      const event = new Event('submit', { bubbles: true, cancelable: true }) as unknown as React.FormEvent<HTMLFormElement>
      Object.defineProperty(event, 'currentTarget', { value: form })
      await result.current.handleSubmit(event)
    })

    expect(postService.createPost).toHaveBeenCalledWith({
      titulo: 'T',
      contenido: 'C',
      creador_id: 3,
    })
    expect(addTweet).not.toHaveBeenCalled()
    expect(toast.error).toHaveBeenCalledWith('Falló')
    expect(result.current.isLoading).toBe(false)
  })

  it('gestiona isLoading durante la llamada', async () => {
    anyStore.__setMockState?.({
      getCookieLogueo: jest.fn(),
      datosLogueo: { id: 1 },
      addTweet: jest.fn(),
    })

    let resolve!: (v?: unknown) => void
    ;(postService.createPost as jest.Mock).mockImplementation(
      () =>
        new Promise((r) => {
          resolve = r
        })
    )

    const { result } = renderHook(() => usePostForm())

    const form = document.createElement('form')
    const i1 = document.createElement('input')
    i1.name = 'titulo'
    i1.value = 'A'
    const i2 = document.createElement('input')
    i2.name = 'contenido'
    i2.value = 'B'
    form.appendChild(i1)
    form.appendChild(i2)
    document.body.appendChild(form)

    const submit = async () => {
      const event = new Event('submit', { bubbles: true, cancelable: true }) as unknown as React.FormEvent<HTMLFormElement>
      Object.defineProperty(event, 'currentTarget', { value: form })
      await result.current.handleSubmit(event)
    }

    const pending = submit()
    expect(result.current.isLoading).toBe(false)

    act(() => {
      resolve({ success: true, data: {} })
    })
    await pending

    expect(result.current.isLoading).toBe(false)
  })
})
