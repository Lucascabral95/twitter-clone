// test/hooks/useHomeData.test.ts
import { renderHook, act, waitFor } from '@testing-library/react'
import useStore from '@/zustand'
import { useHomeData } from '../useHomeData'

const anyStore = useStore as any

describe('useHomeData', () => {
  beforeEach(() => {
    anyStore.__resetMockState?.()
    jest.clearAllMocks()
  })

  it('ejecuta la carga inicial en el mount y cuando cambia limit', async () => {
    const getCookieLogueo = jest.fn().mockResolvedValue(undefined)
    const getTweetsByID = jest.fn().mockResolvedValue(undefined)
    const obtenerSeguidores = jest.fn().mockResolvedValue(undefined)
    const getMisSeguidos = jest.fn().mockResolvedValue(undefined)

    anyStore.__setMockState?.({
      getCookieLogueo,
      getTweetsByID,
      obtenerSeguidores,
      getMisSeguidos,
      limit: 20,
      getDatosPersonalesByID: jest.fn(),
      getTweetsOfHome: jest.fn(),
    })

    const { rerender } = renderHook(() => useHomeData())

    await waitFor(() => {
      expect(getCookieLogueo).toHaveBeenCalledTimes(1)
      expect(getTweetsByID).toHaveBeenCalledTimes(1)
      expect(obtenerSeguidores).toHaveBeenCalledTimes(1)
      expect(getMisSeguidos).toHaveBeenCalledTimes(1)
    })

    act(() => {
      anyStore.setState?.((s: any) => ({ ...s, limit: 50 }))
    })
    rerender()

    await waitFor(() => {
      expect(getCookieLogueo).toHaveBeenCalledTimes(2)
      expect(getTweetsByID).toHaveBeenCalledTimes(2)
      expect(obtenerSeguidores).toHaveBeenCalledTimes(2)
      expect(getMisSeguidos).toHaveBeenCalledTimes(2)
    })
  })

  it('pide datos personales cuando hay datosLogueo.id y reacciona a cambios de id', async () => {
    const getDatosPersonalesByID = jest.fn().mockResolvedValue(undefined)

    anyStore.__setMockState?.({
      getCookieLogueo: jest.fn().mockResolvedValue(undefined),
      getTweetsByID: jest.fn().mockResolvedValue(undefined),
      obtenerSeguidores: jest.fn().mockResolvedValue(undefined),
      getMisSeguidos: jest.fn().mockResolvedValue(undefined),
      getDatosPersonalesByID,
      datosLogueo: { id: 1 },
      getTweetsOfHome: jest.fn(),
    })

    const { rerender } = renderHook(() => useHomeData())

    await waitFor(() => {
      expect(getDatosPersonalesByID).toHaveBeenCalledWith(1)
    })

    act(() => {
      anyStore.setState?.((s: any) => ({ ...s, datosLogueo: { id: 2 } }))
    })
    rerender()

    await waitFor(() => {
      expect(getDatosPersonalesByID).toHaveBeenCalledWith(2)
    })
  })

  it('llama getTweetsOfHome en el mount y cuando cambia change', async () => {
    const getTweetsOfHome = jest.fn().mockResolvedValue(undefined)

    anyStore.__setMockState?.({
      getCookieLogueo: jest.fn().mockResolvedValue(undefined),
      getTweetsByID: jest.fn().mockResolvedValue(undefined),
      obtenerSeguidores: jest.fn().mockResolvedValue(undefined),
      getMisSeguidos: jest.fn().mockResolvedValue(undefined),
      getDatosPersonalesByID: jest.fn().mockResolvedValue(undefined),
      getTweetsOfHome,
      change: false,
    })

    const { rerender } = renderHook(() => useHomeData())

    await waitFor(() => {
      expect(getTweetsOfHome).toHaveBeenCalledTimes(1)
    })

    act(() => {
      anyStore.setState?.((s: any) => ({ ...s, change: true }))
    })
    rerender()

    await waitFor(() => {
      expect(getTweetsOfHome).toHaveBeenCalledTimes(2)
    })
  })

  it('expone selectores del store (datosLogueo, datosPersonales, misSeguidos, seguidores, posteosHome)', async () => {
    const snapshot = {
      datosLogueo: { id: 7, email: 'x@y.com' },
      datosPersonales: { nombre: 'User' },
      misSeguidos: [{ id: 10 }],
      seguidores: [{ id: 20 }],
      posteosHome: [{ id: 30 }],
    }

    anyStore.__setMockState?.({
      ...snapshot,
      getCookieLogueo: jest.fn().mockResolvedValue(undefined),
      getTweetsByID: jest.fn().mockResolvedValue(undefined),
      obtenerSeguidores: jest.fn().mockResolvedValue(undefined),
      getMisSeguidos: jest.fn().mockResolvedValue(undefined),
      getDatosPersonalesByID: jest.fn().mockResolvedValue(undefined),
      getTweetsOfHome: jest.fn().mockResolvedValue(undefined),
    })

    const { result } = renderHook(() => useHomeData())

    expect(result.current.datosLogueo).toEqual(snapshot.datosLogueo)
    expect(result.current.datosPersonales).toEqual(snapshot.datosPersonales)
    expect(result.current.misSeguidos).toEqual(snapshot.misSeguidos)
    expect(result.current.seguidores).toEqual(snapshot.seguidores)
    expect(result.current.posteosHome).toEqual(snapshot.posteosHome)
  })
})
