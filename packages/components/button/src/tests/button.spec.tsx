import { render, fireEvent } from '@testing-library/react'
import { Button } from '..'

describe('Button component', () => {
  const handleClick = jest.fn();
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
    const { getByText } = render(
      <Button onClick={handleClick}>Click Me</Button>,
    )
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
    const { getByText } = render(
      <Button iconLeft={<span>👈</span>} iconRight={<span>👉</span>} />,
    )
    const iconLeft = getByText('👈')
    const iconRight = getByText('👉')
    expect(iconLeft).toBeInTheDocument()
    expect(iconRight).toBeInTheDocument()
  })

  it('renders busy button', () => {
    const { getByText, getByLabelText } = render(
      <Button busyText="Loading" isBusy>
        Busy Button
      </Button>,
    )
    const buttonElement = getByText('Busy Button')
    const busyIcon = getByLabelText('loading')
    expect(buttonElement).toBeInTheDocument()
    expect(busyIcon).toBeInTheDocument()
  })

  it('renders solid button', () => {
    const { getByText } = render(<Button variant="solid">Solid Button</Button>)
    const buttonElement = getByText('Solid Button')
    expect(buttonElement).toHaveClass('solid')
  })

  it('renders outline button', () => {
    const { getByText } = render(
      <Button variant="outline">Outline Button</Button>,
    )
    const buttonElement = getByText('Outline Button')
    expect(buttonElement).toHaveClass('outline')
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

  it('renders button with color scheme', () => {
    const { getByText } = render(
      <Button colorScheme="dark">Dark Color Scheme</Button>,
    )
    const buttonElement = getByText('Dark Color Scheme')
    expect(buttonElement).toBeInTheDocument()
    expect(buttonElement).toHaveStyle('--button-scheme: rgb(31, 41, 55)')
  })
})
