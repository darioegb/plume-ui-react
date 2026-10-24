import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Divider, DividerLabel } from '..'

describe('Divider component', () => {
  it('is a horizontal separator by default', () => {
    render(<Divider />)
    const divider = screen.getByRole('separator')
    expect(divider.tagName).toBe('HR')
    expect(divider).toHaveClass('divider', 'horizontal', 'solid', 'sm')
    expect(divider).not.toHaveAttribute('aria-orientation')
  })

  it('can be vertical and says so', () => {
    render(<Divider orientation="vertical" />)
    const divider = screen.getByRole('separator')
    expect(divider).toHaveClass('vertical')
    expect(divider).toHaveAttribute('aria-orientation', 'vertical')
  })

  it.each(['solid', 'dashed', 'dotted'] as const)('supports the %s variant', (variant) => {
    render(<Divider variant={variant} />)
    expect(screen.getByRole('separator')).toHaveClass(variant)
  })

  it.each(['sm', 'md', 'lg'] as const)('supports the %s thickness', (size) => {
    render(<Divider size={size} />)
    expect(screen.getByRole('separator')).toHaveClass(size)
  })

  it.each([
    ['sm', 'spacingSm'],
    ['md', 'spacingMd'],
    ['lg', 'spacingLg'],
  ] as const)('supports the %s spacing', (spacing, className) => {
    render(<Divider spacing={spacing} />)
    expect(screen.getByRole('separator')).toHaveClass(className)
  })

  it('has no spacing class unless it is asked for', () => {
    render(<Divider />)
    expect(screen.getByRole('separator').className).not.toMatch(/spacing/)
  })

  it('is hidden from the accessibility tree when it is decorative', () => {
    const { container } = render(<Divider decorative />)
    expect(screen.queryByRole('separator')).toBeNull()
    expect(container.firstChild).toHaveAttribute('role', 'none')
  })

  it('shows a label between two lines', () => {
    const { container } = render(<Divider>or</Divider>)
    expect(screen.getByText('or')).toBeInTheDocument()
    expect(container.firstChild?.nodeName).toBe('DIV')
    expect(container.firstChild).toHaveClass('divider', 'labeled')
    expect(container.firstChild).toHaveAttribute('data-align', 'center')
  })

  it.each(['start', 'center', 'end'] as const)('aligns the label to the %s', (align) => {
    const { container } = render(<Divider align={align}>or</Divider>)
    expect(container.firstChild).toHaveAttribute('data-align', align)
  })

  it('ignores the label of a vertical divider', () => {
    render(<Divider orientation="vertical">or</Divider>)
    expect(screen.queryByText('or')).toBeNull()
    expect(screen.getByRole('separator')).toBeInTheDocument()
  })

  it('does not treat an empty child as a label', () => {
    render(<Divider>{null}</Divider>)
    expect(screen.getByRole('separator').tagName).toBe('HR')
  })

  it('renders the label part as written', () => {
    render(
      <Divider>
        <DividerLabel className="mine">or</DividerLabel>
      </Divider>,
    )
    expect(screen.getByText('or')).toHaveClass('label', 'mine')
    expect(screen.getByText('or').parentElement).toHaveClass('divider', 'labeled')
  })

  it('keeps the custom className, style and attributes', () => {
    render(<Divider className="custom" id="line" style={{ width: '50%' }} title="Line" />)
    const divider = screen.getByRole('separator')
    expect(divider).toHaveClass('divider', 'custom')
    expect(divider).toHaveStyle({ width: '50%' })
    expect(divider).toHaveAttribute('id', 'line')
    expect(divider).toHaveAttribute('title', 'Line')
  })

  it('drops the Plume classes when unstyled', () => {
    const { container, rerender } = render(<Divider className="custom" variant="unstyled" />)
    expect(container.firstChild).toHaveAttribute('class', 'custom')
    rerender(
      <Divider className="custom" variant="unstyled">
        or
      </Divider>,
    )
    expect(container.firstChild).toHaveAttribute('class', 'custom')
  })

  it('forwards the ref', () => {
    const ref = createRef<HTMLElement>()
    const { rerender } = render(<Divider ref={ref} />)
    expect(ref.current?.tagName).toBe('HR')
    rerender(<Divider ref={ref}>or</Divider>)
    expect(ref.current?.tagName).toBe('DIV')
  })
})
