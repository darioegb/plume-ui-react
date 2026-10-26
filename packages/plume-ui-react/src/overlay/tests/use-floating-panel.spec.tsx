import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { useLayer } from '../layer'
import { useFloatingPanel } from '../use-floating-panel'

interface PanelProps {
  empty?: boolean
  onDismiss: (reason: string) => void
  tabOut?: boolean
}

function Panel({ empty = false, onDismiss, tabOut }: Readonly<PanelProps>): React.ReactNode {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const { setPanel } = useFloatingPanel({ anchor, enabled: true, onDismiss, tabOut })
  return (
    <>
      <button ref={setAnchor}>anchor</button>
      <div data-testid="panel" ref={setPanel} tabIndex={-1}>
        {empty ? (
          'nothing to focus'
        ) : (
          <>
            <button>first</button>
            <button>middle</button>
            <button>last</button>
          </>
        )}
      </div>
    </>
  )
}

function press(shiftKey = false): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    key: 'Tab',
    shiftKey,
  })
  document.activeElement?.dispatchEvent(event)
  return event
}

describe('useFloatingPanel', () => {
  describe('tabbing out of the panel', () => {
    it('leaves the Tab key alone by default', () => {
      const onDismiss = vi.fn()
      render(<Panel onDismiss={onDismiss} />)
      screen.getByText('last').focus()
      expect(press().defaultPrevented).toBe(false)
      expect(onDismiss).not.toHaveBeenCalled()
    })

    it('dismisses with the tab reason when Tab leaves from the last element', () => {
      const onDismiss = vi.fn()
      render(<Panel onDismiss={onDismiss} tabOut />)
      screen.getByText('last').focus()
      expect(press().defaultPrevented).toBe(true)
      expect(onDismiss).toHaveBeenCalledWith('tab')
    })

    it('dismisses when Shift+Tab leaves from the first element', () => {
      const onDismiss = vi.fn()
      render(<Panel onDismiss={onDismiss} tabOut />)
      screen.getByText('first').focus()
      expect(press(true).defaultPrevented).toBe(true)
      expect(onDismiss).toHaveBeenCalledWith('tab')
    })

    it('lets the focus move between the elements inside', () => {
      const onDismiss = vi.fn()
      render(<Panel onDismiss={onDismiss} tabOut />)
      screen.getByText('middle').focus()
      expect(press().defaultPrevented).toBe(false)
      expect(press(true).defaultPrevented).toBe(false)
      screen.getByText('first').focus()
      expect(press().defaultPrevented).toBe(false)
      screen.getByText('last').focus()
      expect(press(true).defaultPrevented).toBe(false)
      expect(onDismiss).not.toHaveBeenCalled()
    })

    it('goes into the panel with Tab and out of it with Shift+Tab from the panel itself', () => {
      const onDismiss = vi.fn()
      render(<Panel onDismiss={onDismiss} tabOut />)
      screen.getByTestId('panel').focus()
      expect(press().defaultPrevented).toBe(false)
      expect(onDismiss).not.toHaveBeenCalled()

      expect(press(true).defaultPrevented).toBe(true)
      expect(onDismiss).toHaveBeenCalledWith('tab')
    })

    it('dismisses with Tab when there is nothing to focus inside', () => {
      const onDismiss = vi.fn()
      render(<Panel empty onDismiss={onDismiss} tabOut />)
      screen.getByTestId('panel').focus()
      press()
      expect(onDismiss).toHaveBeenCalledWith('tab')
    })

    it('ignores the focus outside the panel and other keys', () => {
      const onDismiss = vi.fn()
      render(<Panel onDismiss={onDismiss} tabOut />)
      screen.getByText('anchor').focus()
      press()
      screen.getByText('last').focus()
      fireEvent.keyDown(document.activeElement ?? document.body, { key: 'ArrowDown' })
      expect(onDismiss).not.toHaveBeenCalled()
    })

    it('leaves it to the layer on top', () => {
      function Above(): null {
        useLayer(true)
        return null
      }
      const onDismiss = vi.fn()
      render(
        <>
          <Panel onDismiss={onDismiss} tabOut />
          <Above />
        </>,
      )
      screen.getByText('last').focus()
      press()
      expect(onDismiss).not.toHaveBeenCalled()
    })
  })
})
