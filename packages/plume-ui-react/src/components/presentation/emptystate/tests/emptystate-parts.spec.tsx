import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import {
  EmptyState,
  EmptyStateAction,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
} from '..'

describe('EmptyState parts', () => {
  it('composes the parts in any order and leaves out the ones that are not used', () => {
    const { container } = render(
      <EmptyState>
        <EmptyStateAction>Go</EmptyStateAction>
        <EmptyStateTitle>No projects</EmptyStateTitle>
      </EmptyState>,
    )
    const order = Array.from(container.firstElementChild?.children ?? []).map((part) =>
      part.hasAttribute('data-plume-emptystate-action') ? 'action' : 'title',
    )
    expect(order).toEqual(['action', 'title'])
    expect(container.querySelector('[data-plume-emptystate-icon]')).toBeNull()
  })

  it('replaces a part with an element of your own', () => {
    render(
      <EmptyState>
        <EmptyStateTitle>No projects</EmptyStateTitle>
        <footer>Own footer</footer>
      </EmptyState>,
    )
    expect(screen.getByText('Own footer')).toBeInTheDocument()
  })

  it('puts the class and the style of each part and carries its attribute', () => {
    const style = { margin: '3px' }
    const { container } = render(
      <EmptyState>
        <EmptyStateIcon className="mine" style={style}>
          i
        </EmptyStateIcon>
        <EmptyStateTitle className="mine" style={style}>
          t
        </EmptyStateTitle>
        <EmptyStateDescription className="mine" style={style}>
          d
        </EmptyStateDescription>
        <EmptyStateAction className="mine" style={style}>
          a
        </EmptyStateAction>
      </EmptyState>,
    )
    for (const name of ['icon', 'title', 'description', 'action']) {
      const element = container.querySelector(`[data-plume-emptystate-${name}]`)
      expect(element).toHaveClass(name, 'mine')
      expect(element).toHaveStyle({ margin: '3px' })
    }
  })

  it('forwards the ref of each part', () => {
    const icon = createRef<HTMLSpanElement>()
    const title = createRef<HTMLElement>()
    const description = createRef<HTMLParagraphElement>()
    const action = createRef<HTMLDivElement>()
    render(
      <EmptyState>
        <EmptyStateIcon ref={icon}>i</EmptyStateIcon>
        <EmptyStateTitle ref={title}>t</EmptyStateTitle>
        <EmptyStateDescription ref={description}>d</EmptyStateDescription>
        <EmptyStateAction ref={action}>a</EmptyStateAction>
      </EmptyState>,
    )
    expect(icon.current).toHaveAttribute('data-plume-emptystate-icon')
    expect(title.current).toHaveAttribute('data-plume-emptystate-title')
    expect(description.current?.tagName).toBe('P')
    expect(action.current).toHaveAttribute('data-plume-emptystate-action')
  })

  it('renders the title in the tag it is given', () => {
    render(
      <EmptyState>
        <EmptyStateTitle as="h3">No projects</EmptyStateTitle>
      </EmptyState>,
    )
    expect(screen.getByRole('heading', { level: 3, name: 'No projects' })).toBeInTheDocument()
  })

  it('hides the icon from assistive technology', () => {
    const { container } = render(
      <EmptyState>
        <EmptyStateIcon>
          <svg />
        </EmptyStateIcon>
      </EmptyState>,
    )
    expect(container.querySelector('[data-plume-emptystate-icon]')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
  })

  it('leaves the root bare when it is unstyled', () => {
    const { container } = render(
      <EmptyState className="root" variant="unstyled">
        <EmptyStateTitle className="mine">No projects</EmptyStateTitle>
      </EmptyState>,
    )
    expect(container.firstChild).toHaveAttribute('class', 'root')
    expect(container.querySelector('[data-plume-emptystate-title]')).toHaveClass('mine')
  })
})
