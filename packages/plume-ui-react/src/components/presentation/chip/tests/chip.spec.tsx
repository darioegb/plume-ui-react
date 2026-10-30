import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef } from 'react'
import { Chip, ChipIcon, ChipLabel, ChipRemove } from '..'

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

    it('names the button with labels.remove', () => {
      render(
        <Chip labels={{ remove: 'Quitar Diseño' }} onRemove={() => undefined}>
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

  describe('unstyled', () => {
    it('drops the Plume classes of the parts and keeps the className of the root', () => {
      const { container } = render(
        <Chip className="mine" icon={<i />} onRemove={() => undefined} variant="unstyled">
          Design
        </Chip>,
      )
      expect(container.firstChild).toHaveAttribute('class', 'mine')
      expect(screen.getByText('Design')).not.toHaveAttribute('class')
      expect(screen.getByRole('button')).not.toHaveAttribute('class')
      expect(document.querySelector('[data-plume-chip-icon]')).not.toHaveAttribute('class')
    })

    it('has no class attribute when unstyled and there is none', () => {
      const { container } = render(<Chip variant="unstyled">Design</Chip>)
      expect(container.firstChild).not.toHaveAttribute('class')
    })
  })

  describe('parts', () => {
    it('renders the default composition from the parts', () => {
      render(
        <Chip icon={<i />} onRemove={() => undefined}>
          Design
        </Chip>,
      )
      expect(document.querySelector('[data-plume-chip-icon]')).toHaveClass('icon')
      expect(document.querySelector('[data-plume-chip-label]')).toHaveClass('label')
      expect(document.querySelector('[data-plume-chip-remove]')).toHaveClass('remove')
    })

    it('renders the parts given as children in the order they are written', () => {
      render(
        <Chip onRemove={() => undefined}>
          <ChipRemove />
          <ChipLabel>Design</ChipLabel>
          <ChipIcon>
            <i data-testid="icon" />
          </ChipIcon>
        </Chip>,
      )
      const root = document.querySelector('[data-plume-chip]') as HTMLElement
      expect(root.firstElementChild).toHaveAttribute('data-plume-chip-remove')
      expect(root.lastElementChild).toHaveAttribute('data-plume-chip-icon')
      expect(screen.getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true')
    })

    it('can leave a part out', () => {
      render(
        <Chip onRemove={() => undefined}>
          <ChipLabel>Design</ChipLabel>
        </Chip>,
      )
      expect(screen.queryByRole('button')).toBeNull()
    })

    it('does not use the icon and onRemove props as parts when it is composed', () => {
      render(
        <Chip icon={<i data-testid="icon" />}>
          <ChipLabel>Design</ChipLabel>
        </Chip>,
      )
      expect(screen.queryByTestId('icon')).toBeNull()
    })

    it('takes className, style and ref on every part', () => {
      const icon = createRef<HTMLSpanElement>()
      const label = createRef<HTMLSpanElement>()
      const remove = createRef<HTMLButtonElement>()
      render(
        <Chip onRemove={() => undefined}>
          <ChipIcon className="my-icon" ref={icon} style={{ color: 'red' }}>
            <i />
          </ChipIcon>
          <ChipLabel className="my-label" ref={label} style={{ color: 'green' }}>
            Design
          </ChipLabel>
          <ChipRemove className="my-remove" ref={remove} style={{ color: 'blue' }} />
        </Chip>,
      )
      expect(icon.current).toHaveClass('icon', 'my-icon')
      expect(icon.current).toHaveStyle({ color: 'rgb(255, 0, 0)' })
      expect(label.current).toHaveClass('label', 'my-label')
      expect(label.current).toHaveStyle({ color: 'rgb(0, 128, 0)' })
      expect(remove.current).toHaveClass('remove', 'my-remove')
      expect(remove.current).toHaveStyle({ color: 'rgb(0, 0, 255)' })
    })

    it('keeps only the className of the part when the chip is unstyled', () => {
      render(
        <Chip onRemove={() => undefined} variant="unstyled">
          <ChipIcon className="my-icon">
            <i />
          </ChipIcon>
          <ChipLabel className="my-label">Design</ChipLabel>
          <ChipRemove className="my-remove" />
        </Chip>,
      )
      expect(screen.getByText('Design')).toHaveAttribute('class', 'my-label')
      expect(screen.getByRole('button')).toHaveAttribute('class', 'my-remove')
      expect(document.querySelector('[data-plume-chip-icon]')).toHaveAttribute('class', 'my-icon')
    })

    it('names a composed remove button after the label', () => {
      render(
        <Chip onRemove={() => undefined}>
          <ChipLabel>Design</ChipLabel>
          <ChipRemove />
        </Chip>,
      )
      expect(screen.getByRole('button', { name: 'Remove Design' })).toBeInTheDocument()
    })

    it('names a composed remove button with labels.remove or its own label', () => {
      const { rerender } = render(
        <Chip labels={{ remove: 'Quitar' }} onRemove={() => undefined}>
          <ChipLabel>Diseño</ChipLabel>
          <ChipRemove />
        </Chip>,
      )
      expect(screen.getByRole('button', { name: 'Quitar' })).toBeInTheDocument()
      rerender(
        <Chip onRemove={() => undefined}>
          <ChipLabel>Design</ChipLabel>
          <ChipRemove label="Drop it" />
        </Chip>,
      )
      expect(screen.getByRole('button', { name: 'Drop it' })).toBeInTheDocument()
    })

    it('calls onRemove and the onClick of the remove part', async () => {
      const onRemove = vi.fn()
      const onClick = vi.fn()
      render(
        <Chip onRemove={onRemove}>
          <ChipLabel>Design</ChipLabel>
          <ChipRemove onClick={onClick} />
        </Chip>,
      )
      await userEvent.click(screen.getByRole('button'))
      expect(onClick).toHaveBeenCalledTimes(1)
      expect(onRemove).toHaveBeenCalledTimes(1)
    })

    it('replaces the icon of the remove part', () => {
      render(
        <Chip onRemove={() => undefined}>
          <ChipLabel>Design</ChipLabel>
          <ChipRemove>x</ChipRemove>
        </Chip>,
      )
      expect(screen.getByRole('button')).toHaveTextContent('x')
    })

    it('turns an element given to the remove part into the button', async () => {
      const onRemove = vi.fn()
      render(
        <Chip onRemove={onRemove}>
          <ChipLabel>Design</ChipLabel>
          <ChipRemove>
            <button type="button">Drop</button>
          </ChipRemove>
        </Chip>,
      )
      await userEvent.click(screen.getByRole('button', { name: 'Drop Design' }))
      expect(onRemove).toHaveBeenCalledTimes(1)
    })

    it('disables the remove part with the chip, or on its own', () => {
      const { rerender } = render(
        <Chip disabled onRemove={() => undefined}>
          <ChipLabel>Design</ChipLabel>
          <ChipRemove />
        </Chip>,
      )
      expect(screen.getByRole('button')).toBeDisabled()
      expect(screen.getByRole('button')).toHaveAttribute('data-disabled')
      rerender(
        <Chip onRemove={() => undefined}>
          <ChipLabel>Design</ChipLabel>
          <ChipRemove disabled />
        </Chip>,
      )
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('does nothing in the remove part when the chip has no onRemove', async () => {
      render(
        <Chip>
          <ChipLabel>Design</ChipLabel>
          <ChipRemove />
        </Chip>,
      )
      await userEvent.click(screen.getByRole('button'))
      expect(screen.getByRole('button')).toBeEnabled()
    })

    it.each([
      ['ChipIcon', <ChipIcon key="icon" />],
      ['ChipLabel', <ChipLabel key="label" />],
      ['ChipRemove', <ChipRemove key="remove" />],
    ])('%s throws outside a Chip', (name, part) => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
      expect(() => render(part)).toThrow(`<${name}> must be rendered inside a <Chip>`)
      error.mockRestore()
    })
  })
})
