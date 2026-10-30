import { render, screen } from '@testing-library/react'
import { Spinner } from '..'

describe('Spinner component', () => {
  it('renders default spinner', () => {
    const { container } = render(<Spinner />)
    const spinnerElement = container.querySelector('.solid')
    expect(spinnerElement).toBeInTheDocument()
  })

  it('renders spinner with custom size', () => {
    const { container } = render(<Spinner size="lg" />)
    const spinnerElement = container.querySelector('.solid')
    expect(spinnerElement).toHaveClass('lg solid')
  })

  it('is named Loading by default and takes another name', () => {
    const { rerender } = render(<Spinner />)
    expect(screen.getByLabelText('Loading')).toBeInTheDocument()
    rerender(<Spinner label="Cargando" />)
    expect(screen.getByLabelText('Cargando')).toBeInTheDocument()
  })

  it('keeps the size out of the DOM attributes', () => {
    const { container } = render(<Spinner size="lg" />)
    expect(container.firstChild).not.toHaveAttribute('size')
  })

  it('marks the element and joins the classes of the user', () => {
    const { container } = render(<Spinner className="mine" />)
    expect(container.firstChild).toHaveAttribute('data-plume-spinner', '')
    expect(container.firstChild).toHaveClass('solid', 'mine')
  })

  it('drops its classes when unstyled', () => {
    const { container } = render(<Spinner className="mine" variant="unstyled" />)
    expect(container.firstChild).toHaveAttribute('class', 'mine')
  })

  it('renders spinner with custom thickness', () => {
    const { container } = render(<Spinner thickness={5} />)
    const spinnerElement = container.querySelector('.solid')
    expect(spinnerElement).toHaveStyle('--spinner-border-width: 5px')
  })

  it('renders spinner with custom color', () => {
    const { container } = render(<Spinner colorScheme="primary" />)
    const spinnerElement = container.querySelector('.solid')
    expect(spinnerElement).toHaveStyle('--spinner-scheme: var(--plume-color-primary-500)')
  })

  it('renders spinner with a specific color shade', () => {
    const { container } = render(<Spinner colorScheme="primary.700" />)
    const spinnerElement = container.querySelector('.solid')
    expect(spinnerElement).toHaveStyle('--spinner-scheme: var(--plume-color-primary-700)')
  })

  it('defaults to the foreground color of the theme', () => {
    const { container } = render(<Spinner />)
    const spinnerElement = container.querySelector('.solid')
    expect(spinnerElement).toHaveStyle('--spinner-scheme: var(--plume-foreground)')
  })

  it('renders spinner with custom speed', () => {
    const { container } = render(<Spinner speed="0.5s" />)
    const spinnerElement = container.querySelector('.solid')
    expect(spinnerElement).toHaveStyle('--spinner-animation-duration: 0.5s;')
  })

  it('renders spinner with custom styles', () => {
    const { container } = render(
      <Spinner
        style={{ backgroundColor: 'lightgray', color: 'black' }}
      />,
    )
    const spinnerElement = container.querySelector<HTMLElement>('.solid')
    expect(spinnerElement?.style.backgroundColor).toBe('lightgray')
    expect(spinnerElement?.style.color).toBe('black')
  })

  it('renders spinner with different variant', () => {
    const { container } = render(<Spinner variant="dashed" />)
    const spinnerElement = container.querySelector('.dashed')
    expect(spinnerElement).toHaveClass('dashed')
  })
})
