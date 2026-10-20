import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { List, ListIcon, ListItem } from '..'

describe('List component', () => {
  it('renders a list with its items', () => {
    render(
      <List>
        <ListItem>One</ListItem>
        <ListItem>Two</ListItem>
      </List>,
    )
    expect(screen.getByRole('list').tagName).toBe('UL')
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('is an unordered medium list by default', () => {
    render(
      <List>
        <ListItem>One</ListItem>
      </List>,
    )
    expect(screen.getByRole('list')).toHaveClass('list', 'unordered', 'md', 'spacing-md')
  })

  it('renders an ol for the ordered variant', () => {
    render(
      <List variant="ordered">
        <ListItem>One</ListItem>
      </List>,
    )
    const list = screen.getByRole('list')
    expect(list.tagName).toBe('OL')
    expect(list).toHaveClass('ordered')
  })

  it('renders a ul for the plain variant and keeps the list role', () => {
    render(
      <List variant="plain">
        <ListItem>One</ListItem>
      </List>,
    )
    const list = screen.getByRole('list')
    expect(list.tagName).toBe('UL')
    expect(list).toHaveAttribute('role', 'list')
    expect(list).toHaveClass('plain')
  })

  it('does not add a role to the other variants', () => {
    render(
      <List>
        <ListItem>One</ListItem>
      </List>,
    )
    expect(screen.getByRole('list')).not.toHaveAttribute('role')
  })

  it('lets the role be set', () => {
    render(
      <List role="menu" variant="plain">
        <ListItem>One</ListItem>
      </List>,
    )
    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('lets the element be chosen', () => {
    render(
      <List as="ol" variant="unstyled">
        <ListItem>One</ListItem>
      </List>,
    )
    expect(screen.getByRole('list').tagName).toBe('OL')
  })

  it('applies the size and the spacing', () => {
    render(
      <List size="lg" spacing="sm">
        <ListItem>One</ListItem>
      </List>,
    )
    expect(screen.getByRole('list')).toHaveClass('lg', 'spacing-sm')
  })

  it('keeps the custom className and style', () => {
    render(
      <List className="custom" style={{ width: '160px' }}>
        <ListItem>One</ListItem>
      </List>,
    )
    const list = screen.getByRole('list')
    expect(list).toHaveClass('list', 'custom')
    expect(list).toHaveStyle({ width: '160px' })
  })

  it('drops the Plume classes when unstyled', () => {
    render(
      <List className="custom" variant="unstyled">
        <ListItem>One</ListItem>
      </List>,
    )
    const list = screen.getByRole('list')
    expect(list).toHaveClass('custom')
    expect(list).not.toHaveClass('list')
    expect(list).not.toHaveClass('unordered')
  })

  it('takes an accessible name', () => {
    render(
      <List aria-label="Features">
        <ListItem>One</ListItem>
      </List>,
    )
    expect(screen.getByRole('list', { name: 'Features' })).toBeInTheDocument()
  })

  it('forwards the ref to the list element', () => {
    const ref = createRef<HTMLUListElement>()
    render(
      <List ref={ref}>
        <ListItem>One</ListItem>
      </List>,
    )
    expect(ref.current).toBe(screen.getByRole('list'))
  })

  describe('ListItem', () => {
    it('renders a list item with className, style and a ref', () => {
      const ref = createRef<HTMLLIElement>()
      render(
        <List>
          <ListItem className="custom" ref={ref} style={{ width: '80px' }} value={4}>
            One
          </ListItem>
        </List>,
      )
      const item = screen.getByRole('listitem')
      expect(item).toHaveClass('item', 'custom')
      expect(item).toHaveStyle({ width: '80px' })
      expect(item).toHaveAttribute('value', '4')
      expect(ref.current).toBe(item)
    })
  })

  describe('ListIcon', () => {
    it('hides the icon from assistive technology', () => {
      render(
        <List variant="plain">
          <ListItem>
            <ListIcon data-testid="icon">
              <svg />
            </ListIcon>
            One
          </ListItem>
        </List>,
      )
      expect(screen.getByTestId('icon')).toHaveAttribute('aria-hidden', 'true')
      expect(screen.getByTestId('icon')).toHaveClass('icon')
    })

    it('takes className, style and a ref', () => {
      const ref = createRef<HTMLSpanElement>()
      render(
        <List variant="plain">
          <ListItem>
            <ListIcon className="custom" ref={ref} style={{ width: '32px' }}>
              <svg />
            </ListIcon>
            One
          </ListItem>
        </List>,
      )
      const icon = ref.current as HTMLSpanElement
      expect(icon).toHaveClass('icon', 'custom')
      expect(icon).toHaveStyle({ width: '32px' })
    })
  })
})
