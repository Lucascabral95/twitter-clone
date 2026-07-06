// test/hooks/useSearch.test.ts
import { renderHook, act } from '@testing-library/react'
import useStore from '@/zustand'
import { useSearch } from '../useSearch'
import type { SearchCriteria, SearchType } from '@/infrastructure/interfaces'

const anyStore = useStore as any
const initialState: SearchCriteria = {
  tipoDeBusqueda: 'publicaciones',
  busqueda: '',
}

beforeEach(() => {
  jest.useFakeTimers()
})

afterEach(() => {
  jest.runOnlyPendingTimers()
  jest.useRealTimers()
})

describe('useSearch', () => {
  beforeEach(() => {
    anyStore.__resetMockState?.()
    jest.clearAllMocks()
  })

  it('llama a obtenerResultadosDeBusqueda al montar con el estado inicial', () => {
    const spy = jest.fn()
    anyStore.__setMockState?.({
      obtenerResultadosDeBusqueda: spy,
      arrayDeBusqueda: [],
    })

    const { result } = renderHook(() => useSearch())

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(initialState)
    expect(result.current.response).toEqual(initialState)
  })

  it('espera el debounce antes de disparar la búsqueda al escribir', () => {
    const spy = jest.fn()
    anyStore.__setMockState?.({
      obtenerResultadosDeBusqueda: spy,
      arrayDeBusqueda: [],
    })

    const { result } = renderHook(() => useSearch())
    expect(spy).toHaveBeenCalledTimes(1)

    act(() => {
      result.current.handleSearchChange('messi')
    })
    expect(result.current.response.busqueda).toBe('messi')
    // todavía no se disparó la búsqueda: el debounce no llegó a los 300ms
    expect(spy).toHaveBeenCalledTimes(1)

    act(() => { jest.advanceTimersByTime(299) })
    expect(spy).toHaveBeenCalledTimes(1)

    act(() => { jest.advanceTimersByTime(1) })
    expect(spy).toHaveBeenCalledTimes(2)
    expect(spy).toHaveBeenLastCalledWith({
      tipoDeBusqueda: 'publicaciones',
      busqueda: 'messi',
    })
  })

  it('no dispara una búsqueda por cada tecla, solo tras el último cambio', () => {
    const spy = jest.fn()
    anyStore.__setMockState?.({
      obtenerResultadosDeBusqueda: spy,
      arrayDeBusqueda: [],
    })

    const { result } = renderHook(() => useSearch())
    expect(spy).toHaveBeenCalledTimes(1)

    act(() => { result.current.handleSearchChange('m') })
    act(() => { jest.advanceTimersByTime(100) })
    act(() => { result.current.handleSearchChange('me') })
    act(() => { jest.advanceTimersByTime(100) })
    act(() => { result.current.handleSearchChange('mes') })

    // ningún cambio individual llegó a acumular 300ms de quietud
    act(() => { jest.advanceTimersByTime(299) })
    expect(spy).toHaveBeenCalledTimes(1)

    act(() => { jest.advanceTimersByTime(1) })
    expect(spy).toHaveBeenCalledTimes(2)
    expect(spy).toHaveBeenLastCalledWith({
      tipoDeBusqueda: 'publicaciones',
      busqueda: 'mes',
    })
  })

  it('dispara búsqueda inmediatamente al cambiar tipoDeBusqueda (sin debounce)', () => {
    const spy = jest.fn()
    anyStore.__setMockState?.({
      obtenerResultadosDeBusqueda: spy,
      arrayDeBusqueda: [],
    })

    const { result } = renderHook(() => useSearch())
    expect(spy).toHaveBeenCalledTimes(1)

    act(() => {
      result.current.handleTypeChange('usuarios' as SearchType)
    })

    expect(spy).toHaveBeenCalledTimes(2)
    expect(spy).toHaveBeenLastCalledWith({
      tipoDeBusqueda: 'usuarios',
      busqueda: '',
    })
    expect(result.current.response.tipoDeBusqueda).toBe('usuarios')
  })

  it('clearSearch resetea y dispara búsqueda con initialState de inmediato', () => {
    const spy = jest.fn()
    anyStore.__setMockState?.({
      obtenerResultadosDeBusqueda: spy,
      arrayDeBusqueda: [],
    })

    const { result } = renderHook(() => useSearch())
    expect(spy).toHaveBeenCalledTimes(1)

    act(() => {
      result.current.handleSearchChange('hola')
    })
    act(() => { jest.advanceTimersByTime(300) })
    expect(spy).toHaveBeenCalledTimes(2)

    act(() => {
      result.current.clearSearch()
    })
    act(() => { jest.advanceTimersByTime(300) })

    expect(spy).toHaveBeenLastCalledWith(initialState)
    expect(result.current.response).toEqual(initialState)
  })

  it('expone arrayDeBusqueda del store', () => {
    const items = [{ id: 1, text: 'tweet' }]
    anyStore.__setMockState?.({
      obtenerResultadosDeBusqueda: jest.fn(),
      arrayDeBusqueda: items,
    })

    const { result } = renderHook(() => useSearch())
    expect(result.current.arrayDeBusqueda).toBe(items)
  })
})
