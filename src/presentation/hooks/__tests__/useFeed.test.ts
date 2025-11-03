// test/hooks/useFeed.test.ts
import { renderHook, act } from '@testing-library/react'
import useStore from '@/zustand'
import { useFeed } from '../useFeed'

// Acceso a helpers del mock (expuestos en tu mock)
const anyStore = useStore as any

describe('useFeed', () => {
  beforeEach(() => {
    // resetear al estado base del mock antes de cada test
    if (anyStore.__resetMockState) anyStore.__resetMockState()
    jest.clearAllMocks()
  })

  it('llama a getAllTweets en el mount', () => {
    const spy = jest.fn()
    // inyectar implementación de getAllTweets en el store mockeado
    anyStore.__setMockState?.({
      getAllTweets: spy,
    })

    renderHook(() => useFeed())

    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('expone los posteos del store', () => {
    const initialPosts = [{ id: 1, text: 'hola' }]
    anyStore.__setMockState?.({
      posteos: initialPosts,
      getAllTweets: jest.fn(),
    })

    const { result } = renderHook(() => useFeed())
    expect(result.current.posteos).toEqual(initialPosts)
  })

  it('vuelve a llamar getAllTweets cuando cambia limit', () => {
    const spy = jest.fn()
    anyStore.__setMockState?.({
      getAllTweets: spy,
      limit: 20,
    })

    const { rerender } = renderHook(() => useFeed())
    expect(spy).toHaveBeenCalledTimes(1)

    // cambiar limit en el store mockeado
    act(() => {
      anyStore.setState?.((s: any) => ({ ...s, limit: 50 }))
    })

    // forzar re-render del hook para que capte el cambio del selector
    rerender()

    expect(spy).toHaveBeenCalledTimes(2)
  })
})
