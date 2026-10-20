import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Icon } from '..'

const svg = <svg data-testid="svg" viewBox="0 0 24 24" />

describe('Icon component', () => {
  it('renders the svg it is given', () => {
    render(<Icon>{svg}</Icon>)
    expect(screen.getByTestId('svg')).toBeInTheDocument()
  })

  it('applies the base and size classes', () => {
    const { container } = render(<Icon size="lg">{svg}</Icon>)
    expect(container.firstElementChild).toHaveClass('icon', 'lg')
  })

  it('is medium by default', () => {
    const { container } = render(<Icon>{svg}</Icon>)
    expect(container.firstElementChild).toHaveClass('md')
  })

  it('is hidden from assistive technology without a label', () => {
    const { container } = render(<Icon>{svg}</Icon>)
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelector('.label')).toBeNull()
  })

  it('reads the label as text, with the svg hidden', () => {
    const { container } = render(<Icon label="Notifications">{svg}</Icon>)
    expect(container.firstElementChild).not.toHaveAttribute('aria-hidden')
    expect(screen.getByText('Notifications')).toHaveClass('label')
    expect(screen.getByTestId('svg').closest('[aria-hidden="true"]')).toHaveClass('glyph')
    expect(screen.queryByRole('img')).toBeNull()
  })

  it('exposes the color scheme as a CSS variable', () => {
    const { container } = render(<Icon colorScheme="success">{svg}</Icon>)
    expect(container.firstElementChild).toHaveStyle('--icon-color: var(--plume-color-success-text)')
  })

  it('takes the current text color without a color scheme', () => {
    const { container } = render(<Icon>{svg}</Icon>)
    expect(
      (container.firstElementChild as HTMLElement).style.getPropertyValue('--icon-color'),
    ).toBe('')
  })

  it('lets the style prop override the color variable', () => {
    const { container } = render(
      <Icon colorScheme="success" style={{ '--icon-color': 'red' } as React.CSSProperties}>
        {svg}
      </Icon>,
    )
    expect(container.firstElementChild).toHaveStyle('--icon-color: red')
  })

  it('keeps the custom className', () => {
    const { container } = render(<Icon className="custom">{svg}</Icon>)
    expect(container.firstElementChild).toHaveClass('icon', 'custom')
  })

  it('forwards the ref to the span', () => {
    const ref = createRef<HTMLSpanElement>()
    const { container } = render(<Icon ref={ref}>{svg}</Icon>)
    expect(ref.current).toBe(container.firstElementChild)
  })
})
