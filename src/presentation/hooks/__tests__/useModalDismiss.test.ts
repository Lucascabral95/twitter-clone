import { renderHook } from '@testing-library/react'
import { fireEvent } from '@testing-library/react'
import { useModalDismiss } from '@/presentation/hooks/useModalDismiss'

describe('useModalDismiss', () => {
  const setup = () => {
    const onClose = jest.fn()
    const box = document.createElement('div')
    const outside = document.createElement('div')
    document.body.appendChild(box)
    document.body.appendChild(outside)

    const { result, unmount } = renderHook(() => useModalDismiss<HTMLDivElement>(onClose))
    result.current.current = box

    return { onClose, box, outside, unmount }
  }

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('closes when clicking outside the referenced element', () => {
    const { onClose, outside } = setup()

    fireEvent.mouseDown(outside)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not close when clicking inside the referenced element', () => {
    const { onClose, box } = setup()

    fireEvent.mouseDown(box)

    expect(onClose).not.toHaveBeenCalled()
  })

  it('closes when pressing Escape', () => {
    const { onClose } = setup()

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('locks and restores body scroll on mount/unmount', () => {
    const { unmount } = setup()

    expect(document.body.style.overflow).toBe('hidden')

    unmount()

    expect(document.body.style.overflow).toBe('')
  })
})
