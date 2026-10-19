import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { __Name__ } from '..'

describe('__Name__ component', () => {
  it('renders its children', () => {
    render(<__Name__>Content</__Name__>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('applies the base, size and variant classes', () => {
    render(<__Name__ size="lg">Content</__Name__>)
    expect(screen.getByText('Content')).toHaveClass('__slug__', 'lg', 'solid')
  })

  it('exposes the color scheme as CSS variables', () => {
    render(<__Name__ colorScheme="success">Content</__Name__>)
    expect(screen.getByText('Content')).toHaveStyle(
      '--__slug__-solid: var(--plume-color-success-solid)',
    )
  })

  it('lets the style prop override the color variables', () => {
    render(<__Name__ style={{ '--__slug__-solid': 'red' } as React.CSSProperties}>Content</__Name__>)
    expect(screen.getByText('Content')).toHaveStyle('--__slug__-solid: red')
  })

  it('keeps the custom className', () => {
    render(<__Name__ className="custom">Content</__Name__>)
    expect(screen.getByText('Content')).toHaveClass('__slug__', 'custom')
  })

  it('drops the Plume classes when unstyled', () => {
    render(
      <__Name__ className="custom" variant="unstyled">
        Content
      </__Name__>,
    )
    const element = screen.getByText('Content')
    expect(element).toHaveClass('custom')
    expect(element).not.toHaveClass('__slug__')
  })

  it('forwards the ref to the root element', () => {
    const ref = createRef<HTMLDivElement>()
    render(<__Name__ ref={ref}>Content</__Name__>)
    expect(ref.current).toBe(screen.getByText('Content'))
  })
})
