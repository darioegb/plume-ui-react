import { render, fireEvent } from '@testing-library/react'
import type { FormEvent } from 'react'
import { Button } from '..'

describe('Button component', () => {
  const handleClick = vi.fn()
  it('renders button correctly', () => {
    const { getByText } = render(<Button onClick={handleClick}>Click Me</Button>)
    const button = getByText('Click Me')
    expect(button).toBeInTheDocument()
  })

  it('renders button type submit', () => {
    const { getByText } = render(
      <Button onClick={handleClick} type="submit">
        Click Me
      </Button>,
    )
    const button = getByText('Click Me')
    expect(button).toBeInTheDocument()
  })

  it('handles click event', () => {
    const { getByText } = render(<Button onClick={handleClick}>Click Me</Button>)
    const button = getByText('Click Me')

    fireEvent.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('disables the button when disabled prop is true', () => {
    const { getByText } = render(
      <Button disabled onClick={handleClick}>
        Click Me
      </Button>,
    )
    const button = getByText('Click Me') as HTMLButtonElement
    expect(button.disabled).toBe(true)
  })

  it('applies custom styles', () => {
    const { getByText } = render(
      <Button onClick={handleClick} style={{ backgroundColor: 'blue' }}>
        Click Me
      </Button>,
    )
    const button = getByText('Click Me') as HTMLButtonElement
    expect(button.style.backgroundColor).toBe('blue')
  })

  it('applies className', () => {
    const { getByText } = render(
      <Button className="custom-button" onClick={handleClick}>
        Click Me
      </Button>,
    )
    const button = getByText('Click Me')
    expect(button.classList.contains('custom-button')).toBe(true)
  })

  it('renders children', () => {
    const { container } = render(
      <Button onClick={handleClick}>
        <span>Click Me</span>
      </Button>,
    )
    const button = container.querySelector('button')
    const span = button?.querySelector('span')
    expect(span).toBeInTheDocument()
  })

  it('renders button with label', () => {
    const { getByText } = render(<Button label="Label Button" />)
    const buttonElement = getByText('Label Button')
    expect(buttonElement).toBeInTheDocument()
  })

  it('renders button with icons', () => {
    const { getByText } = render(<Button iconLeft={<span>👈</span>} iconRight={<span>👉</span>} />)
    const iconLeft = getByText('👈')
    const iconRight = getByText('👉')
    expect(iconLeft).toBeInTheDocument()
    expect(iconRight).toBeInTheDocument()
  })

  it('shows the busy text only while busy', () => {
    const { getByRole, rerender } = render(<Button busyText="Saving" label="Save" />)
    expect(getByRole('button')).toHaveTextContent('Save')
    expect(getByRole('button')).not.toHaveTextContent('Saving')

    rerender(<Button busyText="Saving" isBusy label="Save" />)
    expect(getByRole('button')).toHaveTextContent('Saving')
  })

  it('renders busy button', () => {
    const { getByText, getByLabelText } = render(
      <Button busyText="Loading" isBusy>
        Busy Button
      </Button>,
    )
    const buttonElement = getByText('Busy Button')
    const busyIcon = getByLabelText('Loading')
    expect(buttonElement).toBeInTheDocument()
    expect(busyIcon).toBeInTheDocument()
  })

  it('names the spinner with labels.busy', () => {
    const { getByLabelText } = render(<Button isBusy labels={{ busy: 'Cargando' }} label="Save" />)
    expect(getByLabelText('Cargando')).toBeInTheDocument()
  })

  it('renders busy button without busy text', () => {
    const { getByText } = render(<Button colorScheme="primary" isBusy label="Busy Button" />)
    const buttonElement = getByText('Busy Button')
    expect(buttonElement).toBeInTheDocument()
    expect(buttonElement).toHaveClass('hidden')
  })

  it('passes the contrast color to the busy spinner', () => {
    const { getByText } = render(
      <Button colorScheme="primary" isBusy>
        Busy Button
      </Button>,
    )
    const buttonElement = getByText('Busy Button')
    expect(buttonElement).toBeInTheDocument()
    expect(buttonElement.querySelector('output')).toHaveStyle(
      '--spinner-scheme: var(--button-contrast-color)',
    )
  })

  it('stays focusable and announced as busy while busy', () => {
    const { getByRole } = render(<Button isBusy label="Save" />)
    const button = getByRole('button', { name: /Save/ })
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(button).toHaveAttribute('aria-disabled', 'true')
    expect(button).not.toBeDisabled()
    button.focus()
    expect(button).toHaveFocus()
  })

  it('keeps the label in its accessible name while busy without busy text', () => {
    const { getByRole } = render(<Button isBusy label="Save" />)
    expect(getByRole('button')).toHaveAccessibleName(/Save/)
  })

  it('ignores the clicks while busy and does not submit the form', () => {
    const onClick = vi.fn()
    const onSubmit = vi.fn((event: FormEvent) => event.preventDefault())
    const parentClick = vi.fn()
    const { container, getByRole } = render(
      <form onSubmit={onSubmit}>
        <Button isBusy label="Save" onClick={onClick} type="submit" />
      </form>,
    )
    container.addEventListener('click', parentClick)
    fireEvent.click(getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
    expect(onSubmit).not.toHaveBeenCalled()
    expect(parentClick).not.toHaveBeenCalled()
  })

  it('does not set aria-busy or aria-disabled when it is not busy', () => {
    const { getByRole } = render(<Button label="Save" />)
    expect(getByRole('button')).not.toHaveAttribute('aria-busy')
    expect(getByRole('button')).not.toHaveAttribute('aria-disabled')
  })

  it('stays natively disabled when it is disabled and busy', () => {
    const { getByRole } = render(<Button disabled isBusy label="Save" />)
    expect(getByRole('button')).toBeDisabled()
    expect(getByRole('button')).not.toHaveAttribute('aria-disabled')
  })

  it('renders solid button', () => {
    const { getByText } = render(<Button variant="solid">Solid Button</Button>)
    const buttonElement = getByText('Solid Button')
    expect(buttonElement).toHaveClass('solid')
  })

  it('renders outline button', () => {
    const { getByText } = render(<Button variant="outline">Outline Button</Button>)
    const buttonElement = getByText('Outline Button')
    expect(buttonElement).toHaveClass('outline')
  })

  it('renders unstyled button', () => {
    const { getByText } = render(<Button label="Click me" variant="unstyled" />)
    const button = getByText('Click me')

    expect(button).toBeInTheDocument()
    expect(button).not.toHaveClass('rounded')
    expect(button).not.toHaveClass('solid')
    expect(button).not.toHaveClass('disabled')
  })

  it('renders link button', () => {
    const { getByText } = render(<Button variant="link">Link Button</Button>)
    const buttonElement = getByText('Link Button')
    expect(buttonElement).toHaveClass('link')
  })

  it('renders icon button', () => {
    const { getByText } = render(<Button variant="icon">🚀</Button>)
    const buttonElement = getByText('🚀')
    expect(buttonElement).toHaveClass('icon')
  })

  it('renders small button', () => {
    const { getByText } = render(<Button size="sm">Small Button</Button>)
    const buttonElement = getByText('Small Button')
    expect(buttonElement).toHaveClass('sm solid')
  })

  it('renders medium button', () => {
    const { getByText } = render(<Button size="md">Medium Button</Button>)
    const buttonElement = getByText('Medium Button')
    expect(buttonElement).toHaveClass('solid')
  })

  it('renders large button', () => {
    const { getByText } = render(<Button size="lg">Large Button</Button>)
    const buttonElement = getByText('Large Button')
    expect(buttonElement).toHaveClass('lg solid')
  })

  it('renders pill button', () => {
    const { getByText } = render(<Button shape="pill">Pill Button</Button>)
    const buttonElement = getByText('Pill Button')
    expect(buttonElement).toHaveClass('pill solid')
  })

  it('maps the color scheme to palette CSS variables', () => {
    const { getByText } = render(<Button colorScheme="success">Success</Button>)
    const { style } = getByText('Success')
    expect(style.getPropertyValue('--button-color')).toBe('var(--plume-color-success-text)')
    expect(style.getPropertyValue('--button-solid-bg')).toBe('var(--plume-color-success-solid)')
    expect(style.getPropertyValue('--button-contrast-color')).toBe(
      'var(--plume-color-success-solid-contrast)',
    )
  })
})
