import { act, render, screen } from '@testing-library/react'
import { useState } from 'react'
import type { Placement } from '../position'
import { usePosition } from '../use-position'

interface TestRect {
  left: number
  top: number
  width: number
  height: number
}

const rects: { anchor: TestRect; floating: TestRect } = {
  anchor: { left: 400, top: 300, width: 100, height: 40 },
  floating: { left: 0, top: 0, width: 200, height: 100 },
}

const withRect =
  (get: () => TestRect, set: (element: HTMLElement | null) => void) =>
  (element: HTMLElement | null): void => {
    if (element) element.getBoundingClientRect = () => get() as DOMRect
    set(element)
  }

interface HarnessProps {
  enabled?: boolean
  placement?: Placement
}

function Harness({ enabled = true, placement }: HarnessProps): React.ReactNode {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const [floating, setFloating] = useState<HTMLElement | null>(null)
  const position = usePosition({ anchor, floating, enabled, placement })
  return (
    <>
      <button ref={withRect(() => rects.anchor, setAnchor)}>anchor</button>
      <div
        data-placement={position.placement}
        data-positioned={String(position.isPositioned)}
        data-testid="floating"
        ref={withRect(() => rects.floating, setFloating)}
        style={position.style}
      >
        floating
      </div>
    </>
  )
}

const floatingElement = (): HTMLElement => screen.getByTestId('floating')

describe('usePosition', () => {
  beforeEach(() => {
    rects.anchor = { left: 400, top: 300, width: 100, height: 40 }
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1000)
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(800)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('fixes the floating element next to the anchor', () => {
    render(<Harness />)
    expect(floatingElement()).toHaveStyle({ position: 'fixed', top: '348px', left: '350px' })
    expect(floatingElement()).toHaveAttribute('data-positioned', 'true')
    expect(floatingElement()).toHaveAttribute('data-placement', 'bottom')
  })

  it('respects the placement and reports the one it ended up with', () => {
    rects.anchor = { left: 400, top: 700, width: 100, height: 40 }
    render(<Harness placement="bottom-start" />)
    expect(floatingElement()).toHaveAttribute('data-placement', 'top-start')
    expect(floatingElement()).toHaveStyle({ top: '592px', left: '400px' })
  })

  it('is not positioned while disabled', () => {
    render(<Harness enabled={false} />)
    expect(floatingElement()).toHaveAttribute('data-positioned', 'false')
    expect(floatingElement()).toHaveStyle({ position: 'fixed', top: '0px', left: '0px' })
  })

  it('never hides the element, so it can receive the focus before it is positioned', () => {
    render(<Harness />)
    expect(floatingElement().style.visibility).toBe('')
  })

  it('positions when it gets enabled and resets when it gets disabled', () => {
    const { rerender } = render(<Harness enabled={false} />)
    rerender(<Harness enabled />)
    expect(floatingElement()).toHaveAttribute('data-positioned', 'true')

    rerender(<Harness enabled={false} />)
    expect(floatingElement()).toHaveAttribute('data-positioned', 'false')
  })

  it('follows the anchor when the window scrolls or resizes', () => {
    render(<Harness />)
    rects.anchor = { left: 400, top: 200, width: 100, height: 40 }
    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })
    expect(floatingElement()).toHaveStyle({ top: '248px' })

    rects.anchor = { left: 300, top: 200, width: 100, height: 40 }
    act(() => {
      window.dispatchEvent(new Event('resize'))
    })
    expect(floatingElement()).toHaveStyle({ left: '250px' })
  })

  it('does not re-render when the position has not changed', () => {
    render(<Harness />)
    const before = floatingElement().getAttribute('style')
    act(() => {
      window.dispatchEvent(new Event('resize'))
    })
    expect(floatingElement().getAttribute('style')).toBe(before)
  })

  it('updates when the anchor or the floating element change size', () => {
    const observed: Element[] = []
    let notify: () => void = () => undefined
    class FakeResizeObserver {
      constructor(callback: () => void) {
        notify = callback
      }
      observe(element: Element): void {
        observed.push(element)
      }
      disconnect = vi.fn()
      unobserve = vi.fn()
    }
    vi.stubGlobal('ResizeObserver', FakeResizeObserver)

    const { unmount } = render(<Harness />)
    expect(observed).toEqual([screen.getByText('anchor'), floatingElement()])

    rects.floating = { left: 0, top: 0, width: 200, height: 300 }
    act(() => {
      notify()
    })
    expect(floatingElement()).toHaveStyle({ top: '348px' })
    unmount()
  })

  it('stops listening when it unmounts', () => {
    const remove = vi.spyOn(window, 'removeEventListener')
    const { unmount } = render(<Harness />)
    unmount()
    expect(remove).toHaveBeenCalledWith('resize', expect.any(Function))
    expect(remove).toHaveBeenCalledWith('scroll', expect.any(Function), true)
  })

  it('waits for both elements before positioning', () => {
    function Waiting(): React.ReactNode {
      const [anchor, setAnchor] = useState<HTMLElement | null>(null)
      const position = usePosition({ anchor, floating: null, enabled: true })
      return (
        <>
          <button ref={setAnchor}>anchor</button>
          <span data-positioned={String(position.isPositioned)} data-testid="status" />
        </>
      )
    }
    render(<Waiting />)
    expect(screen.getByTestId('status')).toHaveAttribute('data-positioned', 'false')
  })
})
