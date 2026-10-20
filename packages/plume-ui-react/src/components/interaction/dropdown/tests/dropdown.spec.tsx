import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef } from 'react'
import {
  Dropdown,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
  DropdownSeparator,
  DropdownTrigger,
  type DropdownProps,
} from '..'

function Example({
  onSelect,
  ...props
}: Readonly<Partial<DropdownProps> & { onSelect?: () => void }>): React.ReactNode {
  return (
    <Dropdown {...props}>
      <DropdownTrigger>
        <button>Actions</button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownLabel>Account</DropdownLabel>
        <DropdownItem onSelect={onSelect}>Profile</DropdownItem>
        <DropdownItem>Settings</DropdownItem>
        <DropdownSeparator />
        <DropdownItem disabled>Billing</DropdownItem>
        <DropdownItem>Sign out</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

const trigger = (): HTMLElement => screen.getByRole('button', { name: 'Actions' })
const menu = (): HTMLElement => screen.getByRole('menu')
const item = (name: string): HTMLElement => screen.getByRole('menuitem', { name })

describe('Dropdown component', () => {
  describe('opening', () => {
    it('is closed at first', () => {
      render(<Example />)
      expect(screen.queryByRole('menu')).toBeNull()
      expect(trigger()).toHaveAttribute('aria-expanded', 'false')
    })

    it('opens with a click and keeps the focus on the menu', async () => {
      render(<Example />)
      await userEvent.click(trigger())
      expect(menu()).toHaveFocus()
      expect(trigger()).toHaveAttribute('aria-expanded', 'true')
      expect(screen.getAllByRole('menuitem')).toHaveLength(4)
    })

    it('closes when the trigger is clicked again', async () => {
      render(<Example />)
      await userEvent.click(trigger())
      await userEvent.click(trigger())
      expect(screen.queryByRole('menu')).toBeNull()
    })

    it.each(['{Enter}', ' '])('opens with %s and focuses the first item', async (key) => {
      render(<Example />)
      await userEvent.tab()
      await userEvent.keyboard(key)
      expect(item('Profile')).toHaveFocus()
    })

    it('opens with ArrowDown on the first item', async () => {
      render(<Example />)
      await userEvent.tab()
      await userEvent.keyboard('{ArrowDown}')
      expect(item('Profile')).toHaveFocus()
    })

    it('opens with ArrowUp on the last item', async () => {
      render(<Example />)
      await userEvent.tab()
      await userEvent.keyboard('{ArrowUp}')
      expect(item('Sign out')).toHaveFocus()
    })

    it('ignores the other keys on the trigger', async () => {
      render(<Example />)
      await userEvent.tab()
      await userEvent.keyboard('a')
      expect(screen.queryByRole('menu')).toBeNull()
    })

    it('can be open at first', () => {
      render(<Example defaultOpen />)
      expect(menu()).toBeInTheDocument()
    })

    it('follows the open prop and reports the changes', async () => {
      const onOpenChange = vi.fn()
      const { rerender } = render(<Example onOpenChange={onOpenChange} open={false} />)
      await userEvent.click(trigger())
      expect(onOpenChange).toHaveBeenCalledWith(true)
      expect(screen.queryByRole('menu')).toBeNull()

      rerender(<Example onOpenChange={onOpenChange} open />)
      expect(menu()).toBeInTheDocument()
    })
  })

  describe('keyboard', () => {
    it('moves between the items with the arrows, in a loop', async () => {
      render(<Example />)
      await userEvent.tab()
      await userEvent.keyboard('{Enter}')
      await userEvent.keyboard('{ArrowDown}')
      expect(item('Settings')).toHaveFocus()
      await userEvent.keyboard('{ArrowDown}{ArrowDown}')
      expect(item('Profile')).toHaveFocus()
      await userEvent.keyboard('{ArrowUp}')
      expect(item('Sign out')).toHaveFocus()
    })

    it('skips the disabled items', async () => {
      render(<Example />)
      await userEvent.tab()
      await userEvent.keyboard('{Enter}{ArrowDown}{ArrowDown}')
      expect(item('Sign out')).toHaveFocus()
    })

    it('goes to the first and last item with Home and End', async () => {
      render(<Example />)
      await userEvent.tab()
      await userEvent.keyboard('{Enter}{End}')
      expect(item('Sign out')).toHaveFocus()
      await userEvent.keyboard('{Home}')
      expect(item('Profile')).toHaveFocus()
    })

    it('starts on the first item with ArrowDown after a click', async () => {
      render(<Example />)
      await userEvent.click(trigger())
      await userEvent.keyboard('{ArrowDown}')
      expect(item('Profile')).toHaveFocus()
    })

    it('starts on the last item with ArrowUp after a click', async () => {
      render(<Example />)
      await userEvent.click(trigger())
      await userEvent.keyboard('{ArrowUp}')
      expect(item('Sign out')).toHaveFocus()
    })

    it('focuses the item that starts with the typed text', async () => {
      render(<Example />)
      await userEvent.tab()
      await userEvent.keyboard('{Enter}')
      await userEvent.keyboard('si')
      expect(item('Sign out')).toHaveFocus()
    })

    it('keeps the focus when nothing matches', async () => {
      render(<Example />)
      await userEvent.tab()
      await userEvent.keyboard('{Enter}')
      await userEvent.keyboard('z')
      expect(item('Profile')).toHaveFocus()
    })

    it('closes with Escape and gives the focus back to the trigger', async () => {
      render(<Example />)
      await userEvent.tab()
      await userEvent.keyboard('{Enter}{Escape}')
      expect(screen.queryByRole('menu')).toBeNull()
      expect(trigger()).toHaveFocus()
    })

    it('closes with Tab and gives the focus back to the trigger', async () => {
      render(<Example />)
      await userEvent.tab()
      await userEvent.keyboard('{Enter}{Tab}')
      expect(screen.queryByRole('menu')).toBeNull()
      expect(trigger()).toHaveFocus()
    })

    it('closes on a press outside', async () => {
      render(
        <>
          <Example />
          <p>Outside</p>
        </>,
      )
      await userEvent.click(trigger())
      await userEvent.click(screen.getByText('Outside'))
      expect(screen.queryByRole('menu')).toBeNull()
    })
  })

  describe('selecting', () => {
    it('calls onSelect and closes the menu', async () => {
      const onSelect = vi.fn()
      render(<Example onSelect={onSelect} />)
      await userEvent.click(trigger())
      await userEvent.click(item('Profile'))
      expect(onSelect).toHaveBeenCalledTimes(1)
      expect(screen.queryByRole('menu')).toBeNull()
      expect(trigger()).toHaveFocus()
    })

    it('selects with Enter and with Space', async () => {
      const onSelect = vi.fn()
      render(<Example onSelect={onSelect} />)
      await userEvent.tab()
      await userEvent.keyboard('{Enter}{Enter}')
      expect(onSelect).toHaveBeenCalledTimes(1)
      await userEvent.keyboard('{Enter} ')
      expect(onSelect).toHaveBeenCalledTimes(2)
    })

    it('stays open with closeOnSelect={false}', async () => {
      render(<Example closeOnSelect={false} />)
      await userEvent.click(trigger())
      await userEvent.click(item('Profile'))
      expect(menu()).toBeInTheDocument()
    })

    it('lets an item override closeOnSelect', async () => {
      render(
        <Dropdown>
          <DropdownTrigger>Open</DropdownTrigger>
          <DropdownMenu>
            <DropdownItem closeOnSelect={false}>Stay</DropdownItem>
          </DropdownMenu>
        </Dropdown>,
      )
      await userEvent.click(screen.getByRole('button', { name: 'Open' }))
      await userEvent.click(item('Stay'))
      expect(menu()).toBeInTheDocument()
    })

    it('stays open when onSelect prevents the default', async () => {
      render(
        <Dropdown>
          <DropdownTrigger>Open</DropdownTrigger>
          <DropdownMenu>
            <DropdownItem onSelect={(event) => event.preventDefault()}>Stay</DropdownItem>
          </DropdownMenu>
        </Dropdown>,
      )
      await userEvent.click(screen.getByRole('button', { name: 'Open' }))
      await userEvent.click(item('Stay'))
      expect(menu()).toBeInTheDocument()
    })

    it('does not select a disabled item', async () => {
      const onSelect = vi.fn()
      render(
        <Dropdown>
          <DropdownTrigger>Open</DropdownTrigger>
          <DropdownMenu>
            <DropdownItem disabled onSelect={onSelect}>
              Off
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>,
      )
      await userEvent.click(screen.getByRole('button', { name: 'Open' }))
      await userEvent.click(item('Off'))
      expect(onSelect).not.toHaveBeenCalled()
      expect(menu()).toBeInTheDocument()
    })

    it('focuses an item when the pointer moves over it', async () => {
      render(<Example />)
      await userEvent.click(trigger())
      await userEvent.hover(item('Settings'))
      expect(item('Settings')).toHaveFocus()
    })

    it('does not focus a disabled item on hover', async () => {
      render(<Example />)
      await userEvent.click(trigger())
      await userEvent.hover(item('Billing'))
      expect(item('Billing')).not.toHaveFocus()
    })
  })

  describe('links', () => {
    function Links({ disabled }: Readonly<{ disabled?: boolean }>): React.ReactNode {
      return (
        <Dropdown>
          <DropdownTrigger>Open</DropdownTrigger>
          <DropdownMenu>
            <DropdownItem disabled={disabled} href="/docs" rel="noreferrer" target="_blank">
              Docs
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      )
    }

    it('renders a link with the menuitem role', async () => {
      render(<Links />)
      await userEvent.click(screen.getByRole('button', { name: 'Open' }))
      expect(item('Docs')).toHaveAttribute('href', '/docs')
      expect(item('Docs')).toHaveAttribute('target', '_blank')
      expect(item('Docs')).toHaveAttribute('rel', 'noreferrer')
      expect(item('Docs').tagName).toBe('A')
    })

    it('activates a link with Space', async () => {
      const onClick = vi.fn((event: React.MouseEvent) => event.preventDefault())
      render(
        <Dropdown>
          <DropdownTrigger>Open</DropdownTrigger>
          <DropdownMenu>
            <DropdownItem href="/docs" onSelect={onClick}>
              Docs
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>,
      )
      await userEvent.tab()
      await userEvent.keyboard('{Enter} ')
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('ignores the other keys on a link', async () => {
      render(<Links />)
      await userEvent.tab()
      await userEvent.keyboard('{Enter}a')
      expect(menu()).toBeInTheDocument()
    })

    it('has no href and is aria-disabled when it is disabled', async () => {
      render(<Links disabled />)
      await userEvent.click(screen.getByRole('button', { name: 'Open' }))
      expect(item('Docs')).not.toHaveAttribute('href')
      expect(item('Docs')).toHaveAttribute('aria-disabled', 'true')
      await userEvent.click(item('Docs'))
      expect(menu()).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('describes the trigger as a menu', () => {
      render(<Example />)
      expect(trigger()).toHaveAttribute('aria-haspopup', 'menu')
    })

    it('names the menu after the trigger', async () => {
      render(<Example />)
      await userEvent.click(trigger())
      expect(menu()).toHaveAccessibleName('Actions')
    })

    it('keeps the id of the trigger', async () => {
      render(
        <Dropdown>
          <DropdownTrigger>
            <button id="mine">Mine</button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem>One</DropdownItem>
          </DropdownMenu>
        </Dropdown>,
      )
      await userEvent.click(screen.getByRole('button', { name: 'Mine' }))
      expect(menu()).toHaveAttribute('aria-labelledby', 'mine')
    })

    it('uses its own aria-label over the trigger', async () => {
      render(
        <Dropdown>
          <DropdownTrigger>Open</DropdownTrigger>
          <DropdownMenu aria-label="Quick actions">
            <DropdownItem>One</DropdownItem>
          </DropdownMenu>
        </Dropdown>,
      )
      await userEvent.click(screen.getByRole('button', { name: 'Open' }))
      expect(menu()).toHaveAccessibleName('Quick actions')
      expect(menu()).not.toHaveAttribute('aria-labelledby')
    })

    it('uses its own aria-labelledby', async () => {
      render(
        <>
          <span id="title">Title</span>
          <Dropdown>
            <DropdownTrigger>Open</DropdownTrigger>
            <DropdownMenu aria-labelledby="title">
              <DropdownItem>One</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </>,
      )
      await userEvent.click(screen.getByRole('button', { name: 'Open' }))
      expect(menu()).toHaveAccessibleName('Title')
    })

    it('has a separator', async () => {
      render(<Example />)
      await userEvent.click(trigger())
      expect(screen.getByRole('separator')).toBeInTheDocument()
    })

    it('hides the icon from screen readers and shows the shortcut', async () => {
      render(
        <Dropdown>
          <DropdownTrigger>Open</DropdownTrigger>
          <DropdownMenu>
            <DropdownItem icon={<svg data-testid="icon" />} shortcut="Ctrl+S">
              Save
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>,
      )
      await userEvent.click(screen.getByRole('button', { name: 'Open' }))
      expect(screen.getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true')
      expect(screen.getByText('Ctrl+S')).toBeInTheDocument()
    })
  })

  describe('rendering', () => {
    it('renders a button when the trigger is text', async () => {
      render(
        <Dropdown>
          <DropdownTrigger className="mine">Open</DropdownTrigger>
          <DropdownMenu>
            <DropdownItem>One</DropdownItem>
          </DropdownMenu>
        </Dropdown>,
      )
      const button = screen.getByRole('button', { name: 'Open' })
      expect(button).toHaveClass('mine')
      expect(button).toHaveAttribute('type', 'button')
      await userEvent.click(button)
      expect(menu()).toBeInTheDocument()
    })

    it('forwards the ref of the trigger, the menu and the item', async () => {
      const triggerRef = createRef<HTMLElement>()
      const menuRef = createRef<HTMLDivElement>()
      const itemRef = createRef<HTMLElement>()
      render(
        <Dropdown>
          <DropdownTrigger ref={triggerRef}>
            <button>Open</button>
          </DropdownTrigger>
          <DropdownMenu ref={menuRef}>
            <DropdownItem ref={itemRef}>One</DropdownItem>
          </DropdownMenu>
        </Dropdown>,
      )
      expect(triggerRef.current).toBe(screen.getByRole('button'))
      await userEvent.click(screen.getByRole('button'))
      expect(menuRef.current).toBe(menu())
      expect(itemRef.current).toBe(item('One'))
    })

    it('places the menu with a fixed position', async () => {
      render(<Example />)
      await userEvent.click(trigger())
      expect(menu()).toHaveStyle({ position: 'fixed' })
      expect(menu()).toHaveAttribute('data-placement')
    })

    it('is an elevated medium menu by default', async () => {
      render(<Example />)
      await userEvent.click(trigger())
      expect(menu()).toHaveClass('menu', 'md', 'elevated')
      expect(item('Profile')).toHaveClass('item')
      expect(screen.getByText('Account')).toHaveClass('groupLabel')
      expect(screen.getByRole('separator')).toHaveClass('separator')
    })

    it.each(['elevated', 'outline'] as const)('supports the %s variant', async (variant) => {
      render(<Example variant={variant} />)
      await userEvent.click(trigger())
      expect(menu()).toHaveClass(variant)
    })

    it.each(['sm', 'md', 'lg'] as const)('supports the %s size', async (size) => {
      render(<Example size={size} />)
      await userEvent.click(trigger())
      expect(menu()).toHaveClass(size)
    })

    it('keeps the className and style of the menu and the item', async () => {
      render(
        <Dropdown>
          <DropdownTrigger>Open</DropdownTrigger>
          <DropdownMenu className="menu-mine" style={{ width: '200px' }}>
            <DropdownItem className="item-mine" style={{ color: 'red' }}>
              One
            </DropdownItem>
            <DropdownSeparator className="sep-mine" />
            <DropdownLabel className="label-mine">Label</DropdownLabel>
          </DropdownMenu>
        </Dropdown>,
      )
      await userEvent.click(screen.getByRole('button', { name: 'Open' }))
      expect(menu()).toHaveClass('menu', 'menu-mine')
      expect(menu()).toHaveStyle({ width: '200px' })
      expect(item('One')).toHaveClass('item', 'item-mine')
      expect(item('One')).toHaveStyle({ color: 'rgb(255, 0, 0)' })
      expect(screen.getByRole('separator')).toHaveClass('sep-mine')
      expect(screen.getByText('Label')).toHaveClass('label-mine')
    })

    it('drops the Plume classes when unstyled', async () => {
      render(
        <Dropdown variant="unstyled">
          <DropdownTrigger>Open</DropdownTrigger>
          <DropdownMenu className="menu-mine">
            <DropdownLabel>Label</DropdownLabel>
            <DropdownItem className="item-mine" icon={<i />} shortcut="K">
              One
            </DropdownItem>
            <DropdownSeparator />
          </DropdownMenu>
        </Dropdown>,
      )
      await userEvent.click(screen.getByRole('button', { name: 'Open' }))
      expect(menu()).toHaveAttribute('class', 'menu-mine')
      expect(screen.getByRole('menuitem')).toHaveAttribute('class', 'item-mine')
      expect(screen.getByText('Label')).not.toHaveAttribute('class')
      expect(screen.getByRole('separator')).not.toHaveAttribute('class')
    })
  })

  describe('usage', () => {
    it.each([
      ['DropdownTrigger', <DropdownTrigger key="a">x</DropdownTrigger>],
      ['DropdownMenu', <DropdownMenu key="b">x</DropdownMenu>],
      ['DropdownItem', <DropdownItem key="c">x</DropdownItem>],
      ['DropdownSeparator', <DropdownSeparator key="d" />],
      ['DropdownLabel', <DropdownLabel key="e">x</DropdownLabel>],
    ])('throws when %s is outside of a Dropdown', (name, part) => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
      expect(() => render(part)).toThrow(`${name} must be used within a <Dropdown>`)
      error.mockRestore()
    })
  })
})
