import { renderHook, act } from '@testing-library/react'
import { useDebounce } from '@/presentation/hooks/useDebounce'

beforeEach(() => {
  jest.useFakeTimers()
})

afterEach(() => {
  jest.runOnlyPendingTimers()
  jest.useRealTimers()
})

it('retorna el valor inicial y actualiza tras el delay', () => {
  const { result, rerender } = renderHook(
    ({ value }) => useDebounce(value, 300),
    { initialProps: { value: 'a' } }
  )

  expect(result.current).toBe('a')

  rerender({ value: 'ab' })

  act(() => { jest.advanceTimersByTime(299) })
  expect(result.current).toBe('a')

  act(() => { jest.advanceTimersByTime(1) })
  expect(result.current).toBe('ab')
})

it('reinicia el temporizador ante cambios rápidos', () => {
  const { result, rerender } = renderHook(
    ({ value }) => useDebounce(value, 300),
    { initialProps: { value: 'a' } }
  )

  rerender({ value: 'ab' })
  act(() => { jest.advanceTimersByTime(200) })

  rerender({ value: 'abc' })
  act(() => { jest.advanceTimersByTime(299) })
  expect(result.current).toBe('a')

  act(() => { jest.advanceTimersByTime(1) })
  expect(result.current).toBe('abc')
})
