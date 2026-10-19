import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { useDismiss, type UseDismissOptions } from '../use-dismiss'

type HarnessProps = Partial<Omit<UseDismissOptions, 'elements'>> & { extra?: boolean }

function Harness({ onDismiss = vi.fn(), enabled = true, extra = false, ...options }: HarnessProps): React.ReactNode {
  const [content, setContent] = useState<HTMLElement | null>(null)
  const [trigger, setTrigger] = useState<HTMLElement | null>(null)
  useDismiss({ enabled, onDismiss, elements: extra ? [content, trigger] : [content], ...options })
  return (
    <>
      <button ref={setTrigger}>trigger</button>
      <div ref={setContent}>
        <span>inside</span>
      </div>
      <p>outside</p>
    </>
  )
}

describe('useDismiss', () => {
  it('dismisses with the escape reason when Escape is pressed', () => {
    const onDismiss = vi.fn()
    render(<Harness onDismiss={onDismiss} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onDismiss).toHaveBeenCalledExactlyOnceWith('escape')
  })

  it('ignores other keys', () => {
    const onDismiss = vi.fn()
    render(<Harness onDismiss={onDismiss} />)
    fireEvent.keyDown(document, { key: 'Enter' })
    expect(onDismiss).not.toHaveBeenCalled()
  })

  it('dismisses with the outside reason on a press outside of the elements', () => {
    const onDismiss = vi.fn()
    render(<Harness onDismiss={onDismiss} />)
    fireEvent.pointerDown(screen.getByText('outside'))
    expect(onDismiss).toHaveBeenCalledExactlyOnceWith('outside')
  })

  it('ignores a press inside of the elements', () => {
    const onDismiss = vi.fn()
    render(<Harness onDismiss={onDismiss} />)
    fireEvent.pointerDown(screen.getByText('inside'))
    expect(onDismiss).not.toHaveBeenCalled()
  })

  it('treats every given element as inside, such as the trigger', () => {
    const onDismiss = vi.fn()
    render(<Harness extra onDismiss={onDismiss} />)
    fireEvent.pointerDown(screen.getByText('trigger'))
    expect(onDismiss).not.toHaveBeenCalled()
    fireEvent.pointerDown(screen.getByText('outside'))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('does nothing while disabled', () => {
    const onDismiss = vi.fn()
    render(<Harness enabled={false} onDismiss={onDismiss} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    fireEvent.pointerDown(screen.getByText('outside'))
    expect(onDismiss).not.toHaveBeenCalled()
  })

  it('can turn each trigger off', () => {
    const onDismiss = vi.fn()
    const { rerender } = render(<Harness escapeKey={false} onDismiss={onDismiss} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onDismiss).not.toHaveBeenCalled()

    rerender(<Harness onDismiss={onDismiss} outsidePress={false} />)
    fireEvent.pointerDown(screen.getByText('outside'))
    expect(onDismiss).not.toHaveBeenCalled()
  })

  it('leaves the dismissal to the topmost layer', () => {
    const onDismiss = vi.fn()
    render(<Harness isTopmost={() => false} onDismiss={onDismiss} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    fireEvent.pointerDown(screen.getByText('outside'))
    expect(onDismiss).not.toHaveBeenCalled()
  })

  it('calls the latest callback without resubscribing', () => {
    const first = vi.fn()
    const second = vi.fn()
    const { rerender } = render(<Harness onDismiss={first} />)
    rerender(<Harness onDismiss={second} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledTimes(1)
  })

  it('stops listening when it unmounts', () => {
    const onDismiss = vi.fn()
    const { unmount } = render(<Harness onDismiss={onDismiss} />)
    unmount()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onDismiss).not.toHaveBeenCalled()
  })
})
