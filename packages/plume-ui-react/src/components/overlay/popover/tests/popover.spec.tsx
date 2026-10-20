import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { Popover, PopoverClose, PopoverContent, PopoverTrigger, type PopoverProps } from '..'

function Example(props: Readonly<Omit<PopoverProps, 'children'>>): React.ReactNode {
  return (
    <Popover {...props}>
      <PopoverTrigger>
        <button>Open</button>
      </PopoverTrigger>
      <PopoverContent aria-label="Details">
        <input aria-label="Name" />
        <PopoverClose>
          <button>Done</button>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  )
}

const panel = (): HTMLElement => screen.getByRole('dialog')

describe('Popover component', () => {
  describe('opening and closing', () => {
    it('is closed at first and the trigger toggles it', async () => {
      render(<Example />)
      expect(screen.queryByRole('dialog')).toBeNull()

      await userEvent.click(screen.getByText('Open'))
      expect(panel()).toBeInTheDocument()

      await userEvent.click(screen.getByText('Open'))
      expect(screen.queryByRole('dialog')).toBeNull()
    })

    it('can be open at first', () => {
      render(<Example defaultOpen />)
      expect(panel()).toBeInTheDocument()
    })

    it('closes with Escape', async () => {
      render(<Example defaultOpen />)
      await userEvent.keyboard('{Escape}')
      expect(screen.queryByRole('dialog')).toBeNull()
    })

    it('closes with a click outside but not inside', async () => {
      render(
        <>
          <p>Page</p>
          <Example defaultOpen />
        </>,
      )
      await userEvent.click(screen.getByLabelText('Name'))
      expect(panel()).toBeInTheDocument()

      await userEvent.click(screen.getByText('Page'))
      expect(screen.queryByRole('dialog')).toBeNull()
    })

    it('closes with a PopoverClose that wraps an element', async () => {
      render(<Example defaultOpen />)
      await userEvent.click(screen.getByText('Done'))
      expect(screen.queryByRole('dialog')).toBeNull()
    })

    it('closes with the button of a PopoverClose that has no children', async () => {
      render(
        <Popover defaultOpen>
          <PopoverContent aria-label="Own button">
            <PopoverClose />
          </PopoverContent>
        </Popover>,
      )
      await userEvent.click(screen.getByRole('button', { name: 'Close' }))
      expect(screen.queryByRole('dialog')).toBeNull()
    })
  })

  describe('controlled', () => {
    function Controlled({
      onOpenChange,
    }: Readonly<{ onOpenChange?: (open: boolean) => void }>): React.ReactNode {
      const [open, setOpen] = useState(false)
      return (
        <>
          <button onClick={() => setOpen(true)}>Outside</button>
          <Popover
            onOpenChange={(next) => {
              onOpenChange?.(next)
              setOpen(next)
            }}
            open={open}
          >
            <PopoverTrigger>
              <button>Open</button>
            </PopoverTrigger>
            <PopoverContent aria-label="Controlled" />
          </Popover>
        </>
      )
    }

    it('follows the open prop and reports the changes', async () => {
      const onOpenChange = vi.fn()
      render(<Controlled onOpenChange={onOpenChange} />)

      await userEvent.click(screen.getByText('Outside'))
      expect(screen.getByRole('dialog', { name: 'Controlled' })).toBeInTheDocument()

      await userEvent.keyboard('{Escape}')
      expect(screen.queryByRole('dialog')).toBeNull()
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })

    it('stays open when the parent keeps it open', async () => {
      const onOpenChange = vi.fn()
      render(
        <Popover onOpenChange={onOpenChange} open>
          <PopoverContent aria-label="Pinned" />
        </Popover>,
      )
      await userEvent.keyboard('{Escape}')
      expect(onOpenChange).toHaveBeenCalledWith(false)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('reports the opening from the trigger of an uncontrolled popover', async () => {
      const onOpenChange = vi.fn()
      render(<Example onOpenChange={onOpenChange} />)
      await userEvent.click(screen.getByText('Open'))
      expect(onOpenChange).toHaveBeenCalledWith(true)
    })
  })

  describe('accessibility', () => {
    it('is a dialog that is not modal, named by aria-label', () => {
      render(<Example defaultOpen />)
      const element = screen.getByRole('dialog', { name: 'Details' })
      expect(element).not.toHaveAttribute('aria-modal')
    })

    it('takes aria-labelledby and aria-describedby', () => {
      render(
        <>
          <span id="title">A title</span>
          <Popover defaultOpen>
            <PopoverContent aria-describedby="title" aria-labelledby="title" />
          </Popover>
        </>,
      )
      expect(screen.getByRole('dialog', { name: 'A title' })).toHaveAccessibleDescription('A title')
    })

    it('tells the trigger what it opens', async () => {
      render(<Example />)
      const trigger = screen.getByText('Open')
      expect(trigger).toHaveAttribute('aria-haspopup', 'dialog')
      expect(trigger).toHaveAttribute('aria-expanded', 'false')

      await userEvent.click(trigger)
      expect(trigger).toHaveAttribute('aria-expanded', 'true')
    })

    it('renders a button for a trigger that is text', async () => {
      render(
        <Popover>
          <PopoverTrigger className="mine">Open it</PopoverTrigger>
          <PopoverContent aria-label="Text trigger" />
        </Popover>,
      )
      const trigger = screen.getByRole('button', { name: 'Open it' })
      expect(trigger).toHaveClass('mine')
      expect(trigger).toHaveAttribute('type', 'button')

      await userEvent.click(trigger)
      expect(panel()).toBeInTheDocument()
    })

    it('names the close button, and lets the name be set', () => {
      const { rerender } = render(
        <Popover defaultOpen>
          <PopoverContent aria-label="Close test">
            <PopoverClose />
          </PopoverContent>
        </Popover>,
      )
      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()

      rerender(
        <Popover defaultOpen>
          <PopoverContent aria-label="Close test">
            <PopoverClose label="Dismiss" />
          </PopoverContent>
        </Popover>,
      )
      expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument()
    })

    it('uses the text of a PopoverClose as its name', () => {
      render(
        <Popover defaultOpen>
          <PopoverContent aria-label="Close text">
            <PopoverClose>Got it</PopoverClose>
          </PopoverContent>
        </Popover>,
      )
      expect(screen.getByRole('button', { name: 'Got it' })).not.toHaveAttribute('aria-label')
    })
  })

  describe('focus', () => {
    it('moves the focus into the panel and gives it back to the trigger', async () => {
      render(<Example />)
      const trigger = screen.getByText('Open')
      await userEvent.click(trigger)
      expect(screen.getByLabelText('Name')).toHaveFocus()

      await userEvent.keyboard('{Escape}')
      expect(trigger).toHaveFocus()
    })

    it('keeps the focus inside while tabbing', async () => {
      render(<Example defaultOpen />)
      expect(screen.getByLabelText('Name')).toHaveFocus()
      await userEvent.tab()
      expect(screen.getByText('Done')).toHaveFocus()
      await userEvent.tab()
      expect(screen.getByLabelText('Name')).toHaveFocus()
    })
  })

  describe('positioning', () => {
    it('places the panel with a fixed position, at the placement that fits', () => {
      render(<Example defaultOpen />)
      expect(panel()).toHaveStyle({ position: 'fixed' })
      expect(panel()).toHaveAttribute('data-placement')
    })

    it('does not lock the scroll of the page', () => {
      render(<Example defaultOpen />)
      expect(document.body.style.overflow).toBe('')
    })
  })

  describe('nesting', () => {
    it('closes only the one on top', async () => {
      render(
        <Popover defaultOpen>
          <PopoverContent aria-label="First">
            <Popover>
              <PopoverTrigger>
                <button>Open second</button>
              </PopoverTrigger>
              <PopoverContent aria-label="Second" />
            </Popover>
          </PopoverContent>
        </Popover>,
      )
      await userEvent.click(screen.getByText('Open second'))
      expect(screen.getAllByRole('dialog')).toHaveLength(2)

      await userEvent.keyboard('{Escape}')
      expect(screen.getAllByRole('dialog')).toHaveLength(1)
      expect(screen.getByRole('dialog', { name: 'First' })).toBeInTheDocument()
    })
  })

  describe('styling', () => {
    it('is an elevated medium panel by default', () => {
      render(<Example defaultOpen />)
      expect(panel()).toHaveClass('content', 'md', 'elevated')
    })

    it.each(['elevated', 'outline'] as const)('supports the %s variant', (variant) => {
      render(<Example defaultOpen variant={variant} />)
      expect(panel()).toHaveClass(variant)
    })

    it.each(['sm', 'md', 'lg'] as const)('supports the %s size', (size) => {
      render(<Example defaultOpen size={size} />)
      expect(panel()).toHaveClass(size)
    })

    it('keeps the className and style, and forwards the ref', () => {
      const ref = createRef<HTMLDivElement>()
      render(
        <Popover defaultOpen>
          <PopoverContent
            aria-label="Styled"
            className="mine"
            ref={ref}
            style={{ width: '120px' }}
          />
        </Popover>,
      )
      expect(panel()).toHaveClass('content', 'mine')
      expect(panel()).toHaveStyle({ width: '120px' })
      expect(ref.current).toBe(panel())
    })

    it('drops the Plume classes when unstyled', () => {
      render(
        <Popover defaultOpen variant="unstyled">
          <PopoverContent aria-label="Unstyled" className="mine">
            <PopoverClose className="x" />
          </PopoverContent>
        </Popover>,
      )
      expect(panel()).toHaveClass('mine')
      expect(panel()).not.toHaveClass('content')
      expect(screen.getByRole('button', { name: 'Close' })).not.toHaveClass('close')
    })

    it('styles the close button and keeps its className, style and ref', () => {
      const ref = createRef<HTMLElement>()
      render(
        <Popover defaultOpen>
          <PopoverContent aria-label="Close">
            <PopoverClose className="x" ref={ref} style={{ width: '40px' }} />
          </PopoverContent>
        </Popover>,
      )
      const button = screen.getByRole('button', { name: 'Close' })
      expect(button).toHaveClass('close', 'x')
      expect(button).toHaveStyle({ width: '40px' })
      expect(ref.current).toBe(button)
    })
  })

  it('throws when a part is used outside of a Popover', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => render(<PopoverContent />)).toThrow(
      'PopoverContent must be used within a <Popover>',
    )
    expect(() => render(<PopoverTrigger>Open</PopoverTrigger>)).toThrow(
      'PopoverTrigger must be used within a <Popover>',
    )
    expect(() => render(<PopoverClose />)).toThrow('PopoverClose must be used within a <Popover>')
  })
})
