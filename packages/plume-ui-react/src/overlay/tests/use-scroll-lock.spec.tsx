import { renderHook } from '@testing-library/react'
import { useScrollLock } from '../use-scroll-lock'

function mockScrollbar(width: number): void {
  vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1024)
  vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(1024 - width)
}

describe('useScrollLock', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    document.body.removeAttribute('style')
  })

  it('hides the body overflow while locked and restores it afterwards', () => {
    document.body.style.overflow = 'auto'
    const { unmount } = renderHook(() => useScrollLock(true))
    expect(document.body.style.overflow).toBe('hidden')

    unmount()
    expect(document.body.style.overflow).toBe('auto')
  })

  it('does nothing while unlocked and reacts to the flag', () => {
    const { rerender } = renderHook(({ locked }) => useScrollLock(locked), {
      initialProps: { locked: false },
    })
    expect(document.body.style.overflow).toBe('')

    rerender({ locked: true })
    expect(document.body.style.overflow).toBe('hidden')

    rerender({ locked: false })
    expect(document.body.style.overflow).toBe('')
  })

  it('keeps the lock until the last overlay releases it', () => {
    const first = renderHook(() => useScrollLock(true))
    const second = renderHook(() => useScrollLock(true))

    first.unmount()
    expect(document.body.style.overflow).toBe('hidden')

    second.unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('compensates the scrollbar width so the layout does not jump', () => {
    mockScrollbar(15)
    document.body.style.paddingRight = '4px'
    const { unmount } = renderHook(() => useScrollLock(true))
    expect(document.body.style.paddingRight).toBe('19px')

    unmount()
    expect(document.body.style.paddingRight).toBe('4px')
  })

  it('does not add padding when there is no scrollbar', () => {
    mockScrollbar(0)
    renderHook(() => useScrollLock(true))
    expect(document.body.style.paddingRight).toBe('')
  })
})
