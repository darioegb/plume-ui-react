import { fireEvent, render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { useState, type ReactNode } from 'react'
import { Portal, useDismiss, useFocusTrap, useLayer, usePosition, useScrollLock } from '..'

function Overlay({ name, children }: Readonly<{ name: string; children?: ReactNode }>): ReactNode {
  const [open, setOpen] = useState(false)
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const [floating, setFloating] = useState<HTMLElement | null>(null)
  const isTopmost = useLayer(open)
  useDismiss({
    enabled: open,
    onDismiss: () => setOpen(false),
    elements: [anchor, floating],
    isTopmost,
  })
  useFocusTrap(floating, { active: open, isTopmost })
  useScrollLock(open)
  const { style } = usePosition({ anchor, floating, enabled: open })

  return (
    <>
      <button onClick={() => setOpen((value) => !value)} ref={setAnchor}>
        {name} trigger
      </button>
      {open ? (
        <Portal>
          <div aria-label={name} ref={setFloating} role="dialog" style={style}>
            <button>{name} action</button>
            {children}
          </div>
        </Portal>
      ) : null}
    </>
  )
}

const press = (key: string, shiftKey = false): void => {
  fireEvent.keyDown(document.activeElement ?? document.body, { key, shiftKey })
}

describe('overlay primitives together', () => {
  it('renders nothing from an overlay on the server', () => {
    const html = renderToString(<Overlay name="one" />).replace(/<!-- -->/g, '')
    expect(html).toBe('<button>one trigger</button>')
  })

  it('opens an overlay with the focus inside, the page locked and the content positioned', () => {
    render(<Overlay name="one" />)
    fireEvent.click(screen.getByText('one trigger'))

    expect(screen.getByRole('dialog', { name: 'one' })).toHaveStyle({ position: 'fixed' })
    expect(screen.getByText('one action')).toHaveFocus()
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('keeps the focus inside while tabbing', () => {
    render(<Overlay name="one" />)
    fireEvent.click(screen.getByText('one trigger'))

    press('Tab')
    expect(screen.getByText('one action')).toHaveFocus()
    press('Tab', true)
    expect(screen.getByText('one action')).toHaveFocus()
  })

  it('closes with Escape, gives the focus back and unlocks the page', () => {
    render(<Overlay name="one" />)
    const trigger = screen.getByText('one trigger')
    trigger.focus()
    fireEvent.click(trigger)

    press('Escape')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
    expect(document.body.style.overflow).toBe('')
  })

  it('closes with a press outside but not with a press on its trigger or inside', () => {
    render(
      <>
        <Overlay name="one" />
        <p>outside</p>
      </>,
    )
    fireEvent.click(screen.getByText('one trigger'))

    fireEvent.pointerDown(screen.getByText('one action'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    fireEvent.pointerDown(screen.getByText('outside'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  describe('nested overlays', () => {
    const renderNested = (): void => {
      render(
        <Overlay name="outer">
          <Overlay name="inner" />
        </Overlay>,
      )
      fireEvent.click(screen.getByText('outer trigger'))
      screen.getByText('inner trigger').focus()
      fireEvent.click(screen.getByText('inner trigger'))
    }

    it('closes one layer at a time with Escape and returns the focus to the layer below', () => {
      renderNested()
      expect(screen.getByRole('dialog', { name: 'inner' })).toBeInTheDocument()
      expect(screen.getByText('inner action')).toHaveFocus()

      press('Escape')
      expect(screen.queryByRole('dialog', { name: 'inner' })).not.toBeInTheDocument()
      expect(screen.getByRole('dialog', { name: 'outer' })).toBeInTheDocument()
      expect(screen.getByText('inner trigger')).toHaveFocus()
      expect(document.body.style.overflow).toBe('hidden')

      press('Escape')
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(document.body.style.overflow).toBe('')
    })

    it('does not close the layer below when pressing inside the one above', () => {
      renderNested()
      fireEvent.pointerDown(screen.getByText('inner action'))
      expect(screen.getByRole('dialog', { name: 'outer' })).toBeInTheDocument()
      expect(screen.getByRole('dialog', { name: 'inner' })).toBeInTheDocument()
    })

    it('does not move the focus out of the layer above when tabbing', () => {
      renderNested()
      press('Tab')
      expect(screen.getByText('inner action')).toHaveFocus()
    })
  })
})
