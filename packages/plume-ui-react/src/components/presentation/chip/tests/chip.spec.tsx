import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef } from 'react'
import { Chip } from '..'

describe('Chip component', () => {
  describe('rendering', () => {
    it('renders its text', () => {
      render(<Chip>Design</Chip>)
      expect(screen.getByText('Design')).toBeInTheDocument()
    })

    it('is a subtle, medium, pill chip by default', () => {
      const { container } = render(<Chip>Design</Chip>)
      expect(container.firstChild).toHaveClass('chip', 'subtle', 'md', 'pill')
    })

    it.each(['solid', 'outline', 'subtle'] as const)('supports the %s variant', (variant) => {
      const { container } = render(<Chip variant={variant}>Design</Chip>)
      expect(container.firstChild).toHaveClass(variant)
    })

    it.each(['sm', 'md', 'lg'] as const)('supports the %s size', (size) => {
      const { container } = render(<Chip size={size}>Design</Chip>)
      expect(container.firstChild).toHaveClass(size)
    })

    it('supports the rounded shape', () => {
      const { container } = render(<Chip shape="rounded">Design</Chip>)
      expect(container.firstChild).toHaveClass('rounded')
      expect(container.firstChild).not.toHaveClass('pill')
    })

    it('takes its color from the color scheme', () => {
      const { container } = render(<Chip colorScheme="success">Design</Chip>)
      expect(container.firstChild).toHaveStyle({
        '--chip-solid': 'var(--plume-color-success-solid)',
        '--chip-tint-text': 'var(--plume-color-success-tint-text)',
      })
    })

    it('keeps the className and style', () => {
      const { container } = render(
        <Chip className="mine" style={{ width: '120px' }}>
          Design
        </Chip>,
      )
      expect(container.firstChild).toHaveClass('chip', 'mine')
      expect(container.firstChild).toHaveStyle({ width: '120px' })
    })

    it('forwards the ref and the root attributes', () => {
      const ref = createRef<HTMLSpanElement>()
      render(
        <Chip id="tag" ref={ref} title="A tag">
          Design
        </Chip>,
      )
      expect(ref.current).toHaveAttribute('id', 'tag')
      expect(ref.current).toHaveAttribute('title', 'A tag')
    })

    it('hides an icon from screen readers', () => {
      render(<Chip icon={<img alt="" data-testid="icon" src="a.png" />}>Design</Chip>)
      expect(screen.getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true')
      expect(screen.getByTestId('icon').parentElement).toHaveClass('icon')
    })

    it('has no icon and no remove button by default', () => {
      render(<Chip>Design</Chip>)
      expect(screen.queryByRole('button')).toBeNull()
    })
  })

  describe('removing', () => {
    it('renders a remove button named after the chip', () => {
      render(<Chip onRemove={() => undefined}>Design</Chip>)
      expect(screen.getByRole('button', { name: 'Remove Design' })).toBeInTheDocument()
    })

    it('calls onRemove when the button is clicked', async () => {
      const onRemove = vi.fn()
      render(<Chip onRemove={onRemove}>Design</Chip>)
      await userEvent.click(screen.getByRole('button'))
      expect(onRemove).toHaveBeenCalledTimes(1)
    })

    it('can be removed with the keyboard', async () => {
      const onRemove = vi.fn()
      render(<Chip onRemove={onRemove}>Design</Chip>)
      await userEvent.tab()
      await userEvent.keyboard('{Enter}')
      expect(onRemove).toHaveBeenCalledTimes(1)
    })

    it('names the button with removeLabel', () => {
      render(
        <Chip onRemove={() => undefined} removeLabel="Quitar Diseño">
          Diseño
        </Chip>,
      )
      expect(screen.getByRole('button', { name: 'Quitar Diseño' })).toBeInTheDocument()
    })

    it('disables the button when it is disabled', async () => {
      const onRemove = vi.fn()
      const { container } = render(
        <Chip disabled onRemove={onRemove}>
          Design
        </Chip>,
      )
      expect(screen.getByRole('button')).toBeDisabled()
      expect(container.firstChild).toHaveClass('disabled')
      await userEvent.click(screen.getByRole('button'))
      expect(onRemove).not.toHaveBeenCalled()
    })
  })

  describe('classNames', () => {
    const classNames = { icon: 'my-icon', label: 'my-label', remove: 'my-remove' }

    it('adds a class to each part next to the Plume ones', () => {
      render(
        <Chip classNames={classNames} icon={<i />} onRemove={() => undefined}>
          Design
        </Chip>,
      )
      expect(screen.getByText('Design')).toHaveClass('label', 'my-label')
      expect(screen.getByRole('button')).toHaveClass('remove', 'my-remove')
      expect(document.querySelector('.icon')).toHaveClass('my-icon')
    })

    it('are the only classes of the parts when unstyled', () => {
      const { container } = render(
        <Chip
          className="mine"
          classNames={classNames}
          icon={<i />}
          onRemove={() => undefined}
          variant="unstyled"
        >
          Design
        </Chip>,
      )
      expect(container.firstChild).toHaveAttribute('class', 'mine')
      expect(screen.getByText('Design')).toHaveAttribute('class', 'my-label')
      expect(screen.getByRole('button')).toHaveAttribute('class', 'my-remove')
    })

    it('has no class attribute when unstyled and there is none', () => {
      const { container } = render(
        <Chip icon={<i />} onRemove={() => undefined} variant="unstyled">
          Design
        </Chip>,
      )
      expect(container.firstChild).not.toHaveAttribute('class')
      expect(screen.getByText('Design')).not.toHaveAttribute('class')
      expect(screen.getByRole('button')).not.toHaveAttribute('class')
    })
  })
})
