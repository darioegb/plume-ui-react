import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { EmptyState } from '..'

const icon = <svg data-testid="icon" />

describe('EmptyState component', () => {
  it('renders the icon, the title, the description and the action', () => {
    render(
      <EmptyState
        action={<button type="button">Create one</button>}
        description="Nothing was found."
        icon={icon}
        title="No projects"
      />,
    )
    expect(screen.getByText('No projects')).toBeInTheDocument()
    expect(screen.getByText('Nothing was found.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create one' })).toBeInTheDocument()
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('renders only the parts it is given', () => {
    const { container } = render(<EmptyState title="No projects" />)
    expect(container.querySelector('[data-plume-emptystate-icon]')).toBeNull()
    expect(container.querySelector('[data-plume-emptystate-description]')).toBeNull()
    expect(container.querySelector('[data-plume-emptystate-action]')).toBeNull()
  })

  it('hides the icon from assistive technology', () => {
    render(<EmptyState icon={icon} title="No projects" />)
    expect(screen.getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true')
  })

  it('is a plain medium state by default', () => {
    const { container } = render(<EmptyState title="No projects" />)
    expect(container.firstChild).toHaveClass('emptystate', 'md', 'plain')
  })

  it.each(['filled', 'outline', 'plain'] as const)('supports the %s variant', (variant) => {
    const { container } = render(<EmptyState title="No projects" variant={variant} />)
    expect(container.firstChild).toHaveClass('emptystate', variant)
  })

  it.each(['sm', 'md', 'lg'] as const)('supports the %s size', (size) => {
    const { container } = render(<EmptyState size={size} title="No projects" />)
    expect(container.firstChild).toHaveClass(size)
  })

  it('renders the title as a heading when asked', () => {
    render(<EmptyState title="No projects" titleAs="h3" />)
    expect(screen.getByRole('heading', { level: 3, name: 'No projects' })).toBeInTheDocument()
  })

  it('renders the title in a div by default', () => {
    render(<EmptyState title="No projects" />)
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('keeps the custom className and style', () => {
    const { container } = render(
      <EmptyState className="custom" style={{ width: '200px' }} title="No projects" />,
    )
    expect(container.firstChild).toHaveClass('emptystate', 'custom')
    expect(container.firstChild).toHaveStyle({ width: '200px' })
  })

  it('applies the classes of each part', () => {
    const { container } = render(
      <EmptyState
        action="Go"
        classNames={{
          action: 'a-class',
          description: 'd-class',
          icon: 'i-class',
          title: 't-class',
        }}
        description="Text"
        icon={icon}
        title="No projects"
      />,
    )
    expect(container.querySelector('[data-plume-emptystate-action]')).toHaveClass(
      'action',
      'a-class',
    )
    expect(container.querySelector('[data-plume-emptystate-description]')).toHaveClass(
      'description',
      'd-class',
    )
    expect(container.querySelector('[data-plume-emptystate-icon]')).toHaveClass('icon', 'i-class')
    expect(container.querySelector('[data-plume-emptystate-title]')).toHaveClass('title', 't-class')
  })

  it('drops the Plume classes when unstyled', () => {
    const { container } = render(
      <EmptyState
        action="Go"
        className="custom"
        classNames={{ title: 't-class' }}
        description="Text"
        icon={icon}
        title="No projects"
        variant="unstyled"
      />,
    )
    expect(container.firstChild).toHaveAttribute('class', 'custom')
    expect(container.querySelector('[data-plume-emptystate-title]')).toHaveAttribute(
      'class',
      't-class',
    )
    expect(container.querySelector('[data-plume-emptystate-icon]')).not.toHaveAttribute('class')
    expect(container.querySelector('[data-plume-emptystate-description]')).not.toHaveAttribute(
      'class',
    )
    expect(container.querySelector('[data-plume-emptystate-action]')).not.toHaveAttribute('class')
  })

  it('passes the role, the live region and the name to the element', () => {
    render(
      <EmptyState aria-label="Projects" aria-live="polite" role="status" title="No projects" />,
    )
    expect(screen.getByRole('status', { name: 'Projects' })).toHaveAttribute('aria-live', 'polite')
  })

  it('forwards the ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(<EmptyState ref={ref} title="No projects" />)
    expect(ref.current).toHaveAttribute('data-plume-emptystate')
  })
})
