import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef } from 'react'
import {
  List,
  ListDivider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '..'

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

  it('is a plain medium list by default', () => {
    render(
      <List>
        <ListItem>One</ListItem>
      </List>,
    )
    const list = screen.getByRole('list')
    expect(list).toHaveClass('list', 'plain', 'md', 'none')
    expect(list).not.toHaveClass('divided')
  })

  it('keeps the list role when it has no markers', () => {
    render(
      <List>
        <ListItem>One</ListItem>
      </List>,
    )
    expect(screen.getByRole('list')).toHaveAttribute('role', 'list')
  })

  it.each(['plain', 'bordered', 'filled'] as const)('supports the %s variant', (variant) => {
    render(
      <List variant={variant}>
        <ListItem>One</ListItem>
      </List>,
    )
    expect(screen.getByRole('list')).toHaveClass(variant)
  })

  it.each(['sm', 'md', 'lg'] as const)('supports the %s size', (size) => {
    render(
      <List size={size}>
        <ListItem>One</ListItem>
      </List>,
    )
    expect(screen.getByRole('list')).toHaveClass(size)
  })

  describe('dividers', () => {
    it('are on for the bordered variant', () => {
      render(
        <List variant="bordered">
          <ListItem>One</ListItem>
        </List>,
      )
      expect(screen.getByRole('list')).toHaveClass('divided')
    })

    it('can be turned on for the other variants', () => {
      render(
        <List divided>
          <ListItem>One</ListItem>
        </List>,
      )
      expect(screen.getByRole('list')).toHaveClass('divided')
    })

    it('can be turned off for the bordered variant', () => {
      render(
        <List divided={false} variant="bordered">
          <ListItem>One</ListItem>
        </List>,
      )
      expect(screen.getByRole('list')).not.toHaveClass('divided')
    })
  })

  describe('markers', () => {
    it('shows bullets in a ul, without forcing the list role', () => {
      render(
        <List marker="bullet">
          <ListItem>One</ListItem>
        </List>,
      )
      const list = screen.getByRole('list')
      expect(list.tagName).toBe('UL')
      expect(list).toHaveClass('bullet')
      expect(list).not.toHaveAttribute('role')
    })

    it('shows numbers in an ol', () => {
      render(
        <List marker="number">
          <ListItem>One</ListItem>
        </List>,
      )
      const list = screen.getByRole('list')
      expect(list.tagName).toBe('OL')
      expect(list).toHaveClass('number')
    })

    it('lets the element be chosen', () => {
      render(
        <List as="ol" variant="unstyled">
          <ListItem>One</ListItem>
        </List>,
      )
      expect(screen.getByRole('list').tagName).toBe('OL')
    })
  })

  it('lets the role be set', () => {
    render(
      <List role="menu">
        <ListItem>One</ListItem>
      </List>,
    )
    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('exposes the color scheme as CSS variables', () => {
    render(
      <List colorScheme="success">
        <ListItem>One</ListItem>
      </List>,
    )
    const list = screen.getByRole('list')
    expect(list).toHaveStyle('--list-text: var(--plume-color-success-text)')
    expect(list).toHaveStyle('--list-tint: var(--plume-color-success-tint)')
    expect(list).toHaveStyle('--list-tint-strong: var(--plume-color-success-tint-strong)')
    expect(list).toHaveStyle('--list-tint-text: var(--plume-color-success-tint-text)')
  })

  it('lets the style prop override the color variables', () => {
    render(
      <List style={{ '--list-tint': 'red' } as React.CSSProperties}>
        <ListItem>One</ListItem>
      </List>,
    )
    expect(screen.getByRole('list')).toHaveStyle('--list-tint: red')
  })

  it('keeps the custom className', () => {
    render(
      <List className="custom">
        <ListItem>One</ListItem>
      </List>,
    )
    expect(screen.getByRole('list')).toHaveClass('list', 'custom')
  })

  it('drops the Plume classes when unstyled', () => {
    render(
      <List className="custom" divided variant="unstyled">
        <ListItem>One</ListItem>
      </List>,
    )
    const list = screen.getByRole('list')
    expect(list).toHaveClass('custom')
    expect(list).not.toHaveClass('list')
    expect(list).not.toHaveClass('divided')
  })

  it('takes an accessible name', () => {
    render(
      <List aria-label="Files">
        <ListItem>One</ListItem>
      </List>,
    )
    expect(screen.getByRole('list', { name: 'Files' })).toBeInTheDocument()
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
})

describe('ListItem', () => {
  it('renders a list item with className, style, value and a ref', () => {
    const ref = createRef<HTMLLIElement>()
    render(
      <List marker="number">
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

describe('ListItemButton', () => {
  it('renders a button inside the item', () => {
    render(
      <List>
        <ListItem>
          <ListItemButton>Inbox</ListItemButton>
        </ListItem>
      </List>,
    )
    const button = screen.getByRole('button', { name: 'Inbox' })
    expect(button).toHaveClass('button')
    expect(button).toHaveAttribute('type', 'button')
  })

  it('calls onClick', async () => {
    const onClick = vi.fn()
    render(
      <List>
        <ListItem>
          <ListItemButton onClick={onClick}>Inbox</ListItemButton>
        </ListItem>
      </List>,
    )
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders a link when it has an href', () => {
    render(
      <List>
        <ListItem>
          <ListItemButton href="/inbox" rel="noreferrer" target="_blank">
            Inbox
          </ListItemButton>
        </ListItem>
      </List>,
    )
    const link = screen.getByRole('link', { name: 'Inbox' })
    expect(link).toHaveAttribute('href', '/inbox')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noreferrer')
  })

  it('is highlighted and marked as current when selected', () => {
    render(
      <List>
        <ListItem>
          <ListItemButton selected>Inbox</ListItemButton>
        </ListItem>
      </List>,
    )
    const button = screen.getByRole('button')
    expect(button).toHaveClass('selected')
    expect(button).toHaveAttribute('aria-current', 'true')
  })

  it('is not marked as current when it is not selected', () => {
    render(
      <List>
        <ListItem>
          <ListItemButton>Inbox</ListItemButton>
        </ListItem>
      </List>,
    )
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-current')
  })

  it('lets aria-current be set for navigation', () => {
    render(
      <List>
        <ListItem>
          <ListItemButton aria-current="page" href="/inbox" selected>
            Inbox
          </ListItemButton>
        </ListItem>
      </List>,
    )
    expect(screen.getByRole('link')).toHaveAttribute('aria-current', 'page')
  })

  it('disables a button', async () => {
    const onClick = vi.fn()
    render(
      <List>
        <ListItem>
          <ListItemButton disabled onClick={onClick}>
            Inbox
          </ListItemButton>
        </ListItem>
      </List>,
    )
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    await userEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('disables a link by dropping its href', () => {
    render(
      <List>
        <ListItem>
          <ListItemButton disabled href="/inbox">
            Inbox
          </ListItemButton>
        </ListItem>
      </List>,
    )
    const link = screen.getByText('Inbox')
    expect(link.tagName).toBe('A')
    expect(link).not.toHaveAttribute('href')
    expect(link).toHaveAttribute('aria-disabled', 'true')
    expect(link).toHaveAttribute('role', 'link')
  })

  it('takes className, style and a ref', () => {
    const ref = createRef<HTMLElement>()
    render(
      <List>
        <ListItem>
          <ListItemButton className="custom" ref={ref} style={{ width: '80px' }}>
            Inbox
          </ListItemButton>
        </ListItem>
      </List>,
    )
    const button = screen.getByRole('button')
    expect(button).toHaveClass('button', 'custom')
    expect(button).toHaveStyle({ width: '80px' })
    expect(ref.current).toBe(button)
  })

  it('forwards the ref of a link', () => {
    const ref = createRef<HTMLElement>()
    render(
      <List>
        <ListItem>
          <ListItemButton href="/inbox" ref={ref}>
            Inbox
          </ListItemButton>
        </ListItem>
      </List>,
    )
    expect(ref.current).toBe(screen.getByRole('link'))
  })
})

describe('ListItemIcon', () => {
  it('hides the icon from assistive technology', () => {
    render(
      <List>
        <ListItem>
          <ListItemIcon data-testid="icon">
            <svg />
          </ListItemIcon>
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
      <List>
        <ListItem>
          <ListItemIcon className="custom" ref={ref} style={{ width: '32px' }}>
            <svg />
          </ListItemIcon>
        </ListItem>
      </List>,
    )
    const icon = ref.current as HTMLSpanElement
    expect(icon).toHaveClass('icon', 'custom')
    expect(icon).toHaveStyle({ width: '32px' })
  })
})

describe('ListItemText', () => {
  it('renders the primary and the secondary text', () => {
    render(
      <List>
        <ListItem>
          <ListItemText primary="Inbox" secondary="12 unread" />
        </ListItem>
      </List>,
    )
    expect(screen.getByText('Inbox')).toHaveClass('primary')
    expect(screen.getByText('12 unread')).toHaveClass('secondary')
  })

  it('takes its children as the primary text', () => {
    render(
      <List>
        <ListItem>
          <ListItemText>Inbox</ListItemText>
        </ListItem>
      </List>,
    )
    expect(screen.getByText('Inbox')).toHaveClass('primary')
  })

  it('renders no secondary line without it', () => {
    const { container } = render(
      <List>
        <ListItem>
          <ListItemText primary="Inbox" />
        </ListItem>
      </List>,
    )
    expect(container.querySelector('.secondary')).toBeNull()
  })

  it('renders only the secondary line without a primary', () => {
    const { container } = render(
      <List>
        <ListItem>
          <ListItemText secondary="12 unread" />
        </ListItem>
      </List>,
    )
    expect(container.querySelector('.primary')).toBeNull()
    expect(screen.getByText('12 unread')).toBeInTheDocument()
  })

  it('takes className, style and a ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <List>
        <ListItem>
          <ListItemText className="custom" primary="Inbox" ref={ref} style={{ width: '80px' }} />
        </ListItem>
      </List>,
    )
    const text = ref.current as HTMLDivElement
    expect(text).toHaveClass('text', 'custom')
    expect(text).toHaveStyle({ width: '80px' })
  })
})

describe('ListSubheader', () => {
  it('renders a titled row', () => {
    const ref = createRef<HTMLLIElement>()
    render(
      <List>
        <ListSubheader className="custom" ref={ref} style={{ width: '80px' }}>
          Folders
        </ListSubheader>
      </List>,
    )
    const subheader = screen.getByText('Folders')
    expect(subheader.tagName).toBe('LI')
    expect(subheader).toHaveClass('subheader', 'custom')
    expect(subheader).toHaveStyle({ width: '80px' })
    expect(ref.current).toBe(subheader)
  })
})

describe('ListDivider', () => {
  it('renders a line that is not an item of the list', () => {
    const ref = createRef<HTMLLIElement>()
    render(
      <List>
        <ListItem>One</ListItem>
        <ListDivider className="custom" ref={ref} style={{ width: '80px' }} />
        <ListItem>Two</ListItem>
      </List>,
    )
    const divider = ref.current as HTMLLIElement
    expect(divider).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(divider).toHaveClass('divider', 'custom')
    expect(divider).toHaveStyle({ width: '80px' })
  })
})
