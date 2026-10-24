import { render } from '@testing-library/react'
import { createRef } from 'react'
import { Skeleton } from '..'

describe('Skeleton component', () => {
  it('is a pulsing text line by default', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toHaveClass('skeleton', 'pulse', 'text')
  })

  it('is hidden from assistive technology', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })

  it.each(['pulse', 'wave'] as const)('supports the %s variant', (variant) => {
    const { container } = render(<Skeleton variant={variant} />)
    expect(container.firstChild).toHaveClass(variant)
  })

  it.each(['text', 'rect', 'circle'] as const)('supports the %s shape', (shape) => {
    const { container } = render(<Skeleton shape={shape} />)
    expect(container.firstChild).toHaveClass(shape)
    expect(container.firstChild).toHaveAttribute('data-shape', shape)
  })

  it('takes a width and a height in pixels or in any unit', () => {
    const { container, rerender } = render(<Skeleton height={20} width={120} />)
    expect(container.firstChild).toHaveStyle({
      '--skeleton-height': '20px',
      '--skeleton-width': '120px',
    })
    rerender(<Skeleton height="2rem" width="50%" />)
    expect(container.firstChild).toHaveStyle({
      '--skeleton-height': '2rem',
      '--skeleton-width': '50%',
    })
  })

  it('renders several lines with a shorter last one', () => {
    const { container } = render(<Skeleton lines={3} />)
    const lines = container.querySelectorAll('[data-plume-skeleton]')
    expect(lines).toHaveLength(3)
    expect(lines[0]).toHaveClass('line')
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
    expect(container.firstChild).toHaveClass('lines')
  })

  it('renders a single element for a single line, and ignores lines in other shapes', () => {
    const { container, rerender } = render(<Skeleton lines={1} />)
    expect(container.querySelectorAll('[data-plume-skeleton]')).toHaveLength(1)
    rerender(<Skeleton lines={4} shape="rect" />)
    expect(container.querySelectorAll('[data-plume-skeleton]')).toHaveLength(1)
  })

  it('renders at least one line', () => {
    const { container } = render(<Skeleton lines={0} />)
    expect(container.querySelectorAll('[data-plume-skeleton]')).toHaveLength(1)
  })

  it('keeps the className and style', () => {
    const { container } = render(<Skeleton className="mine" style={{ margin: '4px' }} />)
    expect(container.firstChild).toHaveClass('skeleton', 'mine')
    expect(container.firstChild).toHaveStyle({ margin: '4px' })
  })

  it('forwards the ref and the allowed attributes', () => {
    const ref = createRef<HTMLDivElement>()
    const { container } = render(<Skeleton id="loading" ref={ref} />)
    expect(ref.current).toBe(container.firstChild)
    expect(container.firstChild).toHaveAttribute('id', 'loading')
  })

  describe('unstyled', () => {
    it('drops every Plume class and keeps the user one', () => {
      const { container } = render(<Skeleton className="mine" variant="unstyled" />)
      expect(container.firstChild).toHaveAttribute('class', 'mine')
    })

    it('has no class without any, and keeps the structure', () => {
      const { container } = render(<Skeleton variant="unstyled" />)
      expect(container.firstChild).not.toHaveAttribute('class')
      expect(container.firstChild).toHaveAttribute('data-plume-skeleton')
    })

    it('keeps the lines container bare', () => {
      const { container } = render(<Skeleton lines={2} variant="unstyled" />)
      expect(container.firstChild).not.toHaveAttribute('class')
    })
  })
})
