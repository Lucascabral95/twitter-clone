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
    // y el hook expone el response inicial
    expect(result.current.response).toEqual(initialState)
  })

  it('dispara búsqueda al cambiar busqueda', () => {
    const spy = jest.fn()
    anyStore.__setMockState?.({
      obtenerResultadosDeBusqueda: spy,
      arrayDeBusqueda: [],
    })

    const { result } = renderHook(() => useSearch())
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenLastCalledWith(initialState)

    act(() => {
      result.current.handleSearchChange('messi')
    })

    expect(spy).toHaveBeenCalledTimes(2)
    expect(spy).toHaveBeenLastCalledWith({
      tipoDeBusqueda: 'publicaciones',
      busqueda: 'messi',
    })
    expect(result.current.response.busqueda).toBe('messi')
  })

  it('dispara búsqueda al cambiar tipoDeBusqueda', () => {
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

  it('clearSearch resetea y dispara búsqueda con initialState', () => {
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
    expect(spy).toHaveBeenCalledTimes(2)

    act(() => {
      result.current.clearSearch()
    })

    expect(spy).toHaveBeenCalledTimes(3)
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
