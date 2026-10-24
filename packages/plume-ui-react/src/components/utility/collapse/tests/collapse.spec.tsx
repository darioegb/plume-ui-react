import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Collapse } from '..'

describe('Collapse component', () => {
  it('renders its content', () => {
    render(<Collapse>Hidden text</Collapse>)
    expect(screen.getByText('Hidden text')).toBeInTheDocument()
  })

  it('is closed by default', () => {
    const { container } = render(<Collapse>Text</Collapse>)
    expect(container.firstChild).not.toHaveAttribute('data-open')
  })

  it('is open with open', () => {
    const { container } = render(<Collapse open>Text</Collapse>)
    expect(container.firstChild).toHaveAttribute('data-open')
  })

  it('follows the open prop', () => {
    const { container, rerender } = render(<Collapse>Text</Collapse>)
    rerender(<Collapse open>Text</Collapse>)
    expect(container.firstChild).toHaveAttribute('data-open')
    rerender(<Collapse open={false}>Text</Collapse>)
    expect(container.firstChild).not.toHaveAttribute('data-open')
  })

  it('forwards the ref to the root', () => {
    const ref = createRef<HTMLDivElement>()
    const { container } = render(<Collapse ref={ref}>Text</Collapse>)
    expect(ref.current).toBe(container.firstChild)
  })

  it('puts the class of the user on the root, after the Plume ones', () => {
    const { container } = render(<Collapse className="mine">Text</Collapse>)
    expect(container.firstChild).toHaveClass('collapse', 'mine')
  })

  it('renders a section when it is asked to', () => {
    const { container } = render(
      <Collapse aria-label="Details" as="section">
        Text
      </Collapse>,
    )
    expect(container.firstChild?.nodeName).toBe('SECTION')
  })

  it('renders a div by default', () => {
    const { container } = render(<Collapse>Text</Collapse>)
    expect(container.firstChild?.nodeName).toBe('DIV')
  })

  it('is filled and medium by default', () => {
    const { container } = render(<Collapse>Text</Collapse>)
    expect(container.firstChild).toHaveClass('collapse', 'filled', 'md')
  })

  it.each(['accent', 'filled', 'outline'] as const)('applies the %s variant', (variant) => {
    const { container } = render(<Collapse variant={variant}>Text</Collapse>)
    expect(container.firstChild).toHaveClass(variant)
  })

  it.each(['sm', 'md', 'lg'] as const)('applies the %s size', (size) => {
    const { container } = render(<Collapse size={size}>Text</Collapse>)
    expect(container.firstChild).toHaveClass(size)
  })

  it('drops the Plume classes of the root when it is unstyled', () => {
    const { container } = render(
      <Collapse className="mine" variant="unstyled">
        Text
      </Collapse>,
    )
    expect(container.firstChild).toHaveAttribute('class', 'mine')
  })

  it('has no class when it is unstyled and has none', () => {
    const { container } = render(<Collapse variant="unstyled">Text</Collapse>)
    expect(container.firstChild).not.toHaveAttribute('class')
  })

  it('sets the color variables from colorScheme and lets the style override them', () => {
    const { container } = render(
      <Collapse colorScheme="success" style={{ '--collapse-tint': 'red' } as React.CSSProperties}>
        Text
      </Collapse>,
    )
    const root = container.firstChild as HTMLElement
    expect(root.style.getPropertyValue('--collapse-solid')).toBe('var(--plume-color-success-solid)')
    expect(root.style.getPropertyValue('--collapse-tint-text')).toBe(
      'var(--plume-color-success-tint-text)',
    )
    expect(root.style.getPropertyValue('--collapse-tint')).toBe('red')
  })

  it('sets no color variables without a colorScheme', () => {
    const { container } = render(<Collapse>Text</Collapse>)
    expect((container.firstChild as HTMLElement).style.getPropertyValue('--collapse-solid')).toBe(
      '',
    )
  })

  it('forwards the style, the id, the role and the accessible name', () => {
    render(
      <Collapse aria-label="Details" id="more" role="region" style={{ color: 'red' }}>
        Text
      </Collapse>,
    )
    const region = screen.getByRole('region', { name: 'Details' })
    expect(region).toHaveAttribute('id', 'more')
    expect(region).toHaveStyle({ color: 'rgb(255, 0, 0)' })
  })

  it('can be labelled by another element', () => {
    render(
      <>
        <h2 id="title">Title</h2>
        <Collapse aria-labelledby="title" role="region">
          Text
        </Collapse>
      </>,
    )
    expect(screen.getByRole('region', { name: 'Title' })).toBeInTheDocument()
  })
})
