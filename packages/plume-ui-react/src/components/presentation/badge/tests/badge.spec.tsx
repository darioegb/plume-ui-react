import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Badge } from '..'

describe('Badge component', () => {
  it('renders its children in a span', () => {
    render(<Badge>New</Badge>)
    expect(screen.getByText('New').tagName).toBe('SPAN')
  })

  it('applies the base, size, shape and variant classes', () => {
    render(
      <Badge shape="pill" size="lg" variant="subtle">
        New
      </Badge>,
    )
    expect(screen.getByText('New')).toHaveClass('badge', 'lg', 'pill', 'subtle')
  })

  it('is a solid rounded medium badge by default', () => {
    render(<Badge>New</Badge>)
    expect(screen.getByText('New')).toHaveClass('badge', 'md', 'rounded', 'solid')
  })

  it.each(['solid', 'outline', 'subtle'] as const)('supports the %s variant', (variant) => {
    render(<Badge variant={variant}>New</Badge>)
    expect(screen.getByText('New')).toHaveClass(variant)
  })

  it('exposes the color scheme as CSS variables', () => {
    render(<Badge colorScheme="success">New</Badge>)
    const badge = screen.getByText('New')
    expect(badge).toHaveStyle('--badge-solid: var(--plume-color-success-solid)')
    expect(badge).toHaveStyle('--badge-contrast: var(--plume-color-success-solid-contrast)')
    expect(badge).toHaveStyle('--badge-text: var(--plume-color-success-text)')
    expect(badge).toHaveStyle('--badge-tint: var(--plume-color-success-tint)')
  })

  it('lets the style prop override the color variables', () => {
    render(<Badge style={{ '--badge-solid': 'red' } as React.CSSProperties}>New</Badge>)
    expect(screen.getByText('New')).toHaveStyle('--badge-solid: red')
  })

  it('keeps the custom className', () => {
    render(<Badge className="custom">New</Badge>)
    expect(screen.getByText('New')).toHaveClass('badge', 'custom')
  })

  it('drops the Plume classes when unstyled', () => {
    render(
      <Badge className="custom" variant="unstyled">
        New
      </Badge>,
    )
    const badge = screen.getByText('New')
    expect(badge).toHaveClass('custom')
    expect(badge).not.toHaveClass('badge')
  })

  describe('dot', () => {
    it('shows a decorative dot before the content', () => {
      const { container } = render(<Badge dot>Online</Badge>)
      const dot = container.querySelector('.dot')
      expect(dot).toHaveAttribute('aria-hidden', 'true')
      expect(screen.getByText('Online')).toContainElement(dot as HTMLElement)
    })

    it('has no dot by default', () => {
      const { container } = render(<Badge>Online</Badge>)
      expect(container.querySelector('.dot')).toBeNull()
    })

    it('is ignored when unstyled', () => {
      const { container } = render(
        <Badge dot variant="unstyled">
          Online
        </Badge>,
      )
      expect(container.querySelector('.dot')).toBeNull()
    })

    it('becomes an image named by aria-label when it is only a dot', () => {
      render(<Badge aria-label="Online" dot />)
      expect(screen.getByRole('img', { name: 'Online' })).toBeInTheDocument()
    })

    it('is only the dot, without the box of the variant', () => {
      render(<Badge aria-label="Online" dot />)
      expect(screen.getByRole('img', { name: 'Online' })).toHaveClass('badge', 'dotOnly')
    })

    it('keeps the box when it has text', () => {
      render(<Badge dot>Online</Badge>)
      expect(screen.getByText('Online')).not.toHaveClass('dotOnly')
    })

    it('does not get the image role when it has text', () => {
      render(<Badge dot>Online</Badge>)
      expect(screen.queryByRole('img')).toBeNull()
    })

    it('does not get the image role without a name', () => {
      const { container } = render(<Badge dot />)
      expect(container.firstElementChild).not.toHaveAttribute('role')
    })
  })

  it('lets the role be set', () => {
    render(<Badge role="status">3 new</Badge>)
    expect(screen.getByRole('status')).toHaveTextContent('3 new')
  })

  it('forwards the ref to the span', () => {
    const ref = createRef<HTMLSpanElement>()
    render(<Badge ref={ref}>New</Badge>)
    expect(ref.current).toBe(screen.getByText('New'))
  })
})
