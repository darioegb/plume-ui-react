import { act, fireEvent, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef } from 'react'
import { Tooltip, type TooltipProps } from '..'

function Example(props: Readonly<Partial<TooltipProps>>): React.ReactNode {
  return (
    <Tooltip content="Save the changes" {...props}>
      <button>Save</button>
    </Tooltip>
  )
}

const tooltip = (): HTMLElement => screen.getByRole('tooltip')
const advance = (ms: number): void => {
  act(() => {
    vi.advanceTimersByTime(ms)
  })
}

describe('Tooltip component', () => {
  describe('with the pointer', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('is closed at first and opens after the delay', () => {
      render(<Example />)
      expect(screen.queryByRole('tooltip')).toBeNull()

      fireEvent.pointerEnter(screen.getByText('Save'))
      advance(299)
      expect(screen.queryByRole('tooltip')).toBeNull()

      advance(1)
      expect(tooltip()).toHaveTextContent('Save the changes')
    })

    it('does not open when the pointer leaves before the delay', () => {
      render(<Example />)
      fireEvent.pointerEnter(screen.getByText('Save'))
      advance(100)
      fireEvent.pointerLeave(screen.getByText('Save'))
      advance(500)
      expect(screen.queryByRole('tooltip')).toBeNull()
    })

    it('opens at once without an open delay', () => {
      render(<Example openDelay={0} />)
      fireEvent.pointerEnter(screen.getByText('Save'))
      expect(tooltip()).toBeInTheDocument()
    })

    it('closes after the close delay when the pointer leaves', () => {
      render(<Example openDelay={0} />)
      fireEvent.pointerEnter(screen.getByText('Save'))
      fireEvent.pointerLeave(screen.getByText('Save'))
      advance(99)
      expect(tooltip()).toBeInTheDocument()

      advance(1)
      expect(screen.queryByRole('tooltip')).toBeNull()
    })

    it('closes at once without a close delay', () => {
      render(<Example closeDelay={0} openDelay={0} />)
      fireEvent.pointerEnter(screen.getByText('Save'))
      fireEvent.pointerLeave(screen.getByText('Save'))
      expect(screen.queryByRole('tooltip')).toBeNull()
    })

    it('stays open while the pointer is on the tooltip', () => {
      render(<Example openDelay={0} />)
      fireEvent.pointerEnter(screen.getByText('Save'))
      fireEvent.pointerLeave(screen.getByText('Save'))
      fireEvent.pointerEnter(tooltip())
      advance(500)
      expect(tooltip()).toBeInTheDocument()

      fireEvent.pointerLeave(tooltip())
      advance(100)
      expect(screen.queryByRole('tooltip')).toBeNull()
    })

    it('ignores a touch', () => {
      render(<Example openDelay={0} />)
      fireEvent.pointerEnter(screen.getByText('Save'), { pointerType: 'touch' })
      expect(screen.queryByRole('tooltip')).toBeNull()
    })

    it('does not fire a pending open after it unmounts', () => {
      const { unmount } = render(<Example />)
      fireEvent.pointerEnter(screen.getByText('Save'))
      unmount()
      advance(500)
      expect(screen.queryByRole('tooltip')).toBeNull()
    })
  })

  describe('with the keyboard', () => {
    it('opens when the element takes the focus, at once', async () => {
      render(<Example />)
      await userEvent.tab()
      expect(screen.getByText('Save')).toHaveFocus()
      expect(tooltip()).toBeInTheDocument()
    })

    it('closes on blur', async () => {
      render(<Example />)
      await userEvent.tab()
      await userEvent.tab()
      expect(screen.queryByRole('tooltip')).toBeNull()
    })

    it('closes with Escape and leaves the focus where it is', async () => {
      render(<Example />)
      await userEvent.tab()
      await userEvent.keyboard('{Escape}')
      expect(screen.queryByRole('tooltip')).toBeNull()
      expect(screen.getByText('Save')).toHaveFocus()
    })

    it('does not take the focus', async () => {
      render(<Example />)
      await userEvent.tab()
      expect(tooltip()).not.toHaveFocus()
      expect(screen.getByText('Save')).toHaveFocus()
    })
  })

  describe('accessibility', () => {
    it('is a tooltip that describes the element while it is open', async () => {
      render(<Example />)
      const button = screen.getByText('Save')
      expect(button).not.toHaveAttribute('aria-describedby')

      await userEvent.tab()
      expect(button).toHaveAttribute('aria-describedby', tooltip().id)
      expect(button).toHaveAccessibleDescription('Save the changes')
    })

    it('keeps the aria-describedby the element already has', async () => {
      render(
        <>
          <span id="hint">A hint</span>
          <Tooltip content="Save the changes">
            <button aria-describedby="hint">Save</button>
          </Tooltip>
        </>,
      )
      expect(screen.getByText('Save')).toHaveAttribute('aria-describedby', 'hint')

      await userEvent.tab()
      expect(screen.getByText('Save')).toHaveAccessibleDescription('A hint Save the changes')
    })
  })

  describe('open state', () => {
    it('can be open at first', () => {
      render(<Example defaultOpen />)
      expect(tooltip()).toBeInTheDocument()
    })

    it('follows the open prop and reports the changes', async () => {
      const onOpenChange = vi.fn()
      const { rerender } = render(<Example onOpenChange={onOpenChange} open={false} />)
      expect(screen.queryByRole('tooltip')).toBeNull()

      await userEvent.tab()
      expect(onOpenChange).toHaveBeenCalledWith(true)
      expect(screen.queryByRole('tooltip')).toBeNull()

      rerender(<Example onOpenChange={onOpenChange} open />)
      expect(tooltip()).toBeInTheDocument()
    })

    it('stays closed when it is disabled', async () => {
      render(<Example defaultOpen disabled />)
      await userEvent.tab()
      expect(screen.queryByRole('tooltip')).toBeNull()
    })
  })

  describe('rendering', () => {
    it('places the tooltip with a fixed position', () => {
      render(<Example defaultOpen />)
      expect(tooltip()).toHaveStyle({ position: 'fixed' })
      expect(tooltip()).toHaveAttribute('data-placement')
    })

    it('keeps the handlers the element already has', async () => {
      const onFocus = vi.fn()
      render(
        <Tooltip content="Save the changes">
          <button onFocus={onFocus}>Save</button>
        </Tooltip>,
      )
      await userEvent.tab()
      expect(onFocus).toHaveBeenCalledTimes(1)
      expect(tooltip()).toBeInTheDocument()
    })

    it('is a solid medium tooltip by default', () => {
      render(<Example defaultOpen />)
      expect(tooltip()).toHaveClass('tooltip', 'md', 'solid')
    })

    it.each(['solid', 'outline'] as const)('supports the %s variant', (variant) => {
      render(<Example defaultOpen variant={variant} />)
      expect(tooltip()).toHaveClass(variant)
    })

    it.each(['sm', 'md', 'lg'] as const)('supports the %s size', (size) => {
      render(<Example defaultOpen size={size} />)
      expect(tooltip()).toHaveClass(size)
    })

    it('keeps the className and style', () => {
      render(<Example className="mine" defaultOpen style={{ width: '120px' }} />)
      expect(tooltip()).toHaveClass('tooltip', 'mine')
      expect(tooltip()).toHaveStyle({ width: '120px' })
    })

    it('drops the Plume classes when unstyled', () => {
      render(<Example className="mine" defaultOpen variant="unstyled" />)
      expect(tooltip()).toHaveClass('mine')
      expect(tooltip()).not.toHaveClass('tooltip')
    })

    it('forwards the ref to the bubble and takes native attributes', () => {
      const ref = createRef<HTMLDivElement>()
      render(
        <Tooltip content="Save the changes" defaultOpen dir="rtl" id="hint" lang="es" ref={ref}>
          <button>Save</button>
        </Tooltip>,
      )
      expect(ref.current).toBe(tooltip())
      expect(tooltip()).toHaveAttribute('id', 'hint')
      expect(tooltip()).toHaveAttribute('dir', 'rtl')
      expect(tooltip()).toHaveAttribute('lang', 'es')
      expect(screen.getByText('Save')).toHaveAttribute('aria-describedby', 'hint')
    })

    it('marks the bubble and the trigger, and exposes the open state', async () => {
      render(<Example />)
      const button = screen.getByText('Save')
      expect(button).toHaveAttribute('data-plume-tooltip-trigger', '')
      expect(button).not.toHaveAttribute('data-open')
      await userEvent.tab()
      expect(button).toHaveAttribute('data-open', '')
      expect(tooltip()).toHaveAttribute('data-plume-tooltip', '')
      expect(tooltip()).toHaveAttribute('data-open', '')
    })
  })
})
