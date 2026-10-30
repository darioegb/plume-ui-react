import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef } from 'react'
import {
  Dropdown,
  DropdownItem,
  DropdownItemIcon,
  DropdownItemLabel,
  DropdownItemShortcut,
  DropdownMenu,
  DropdownTrigger,
  type DropdownProps,
} from '..'

function Example({
  children,
  ...props
}: Readonly<Partial<DropdownProps> & { children: React.ReactNode }>): React.ReactNode {
  return (
    <Dropdown {...props}>
      <DropdownTrigger>
        <button>Actions</button>
      </DropdownTrigger>
      <DropdownMenu>{children}</DropdownMenu>
    </Dropdown>
  )
}

const open = async (): Promise<void> => {
  await userEvent.click(screen.getByRole('button', { name: 'Actions' }))
}

describe('DropdownItem parts', () => {
  it('builds the default item from the parts', async () => {
    render(
      <Example>
        <DropdownItem icon={<i data-testid="icon" />} shortcut="⌘P">
          Profile
        </DropdownItem>
      </Example>,
    )
    await open()
    const item = screen.getByRole('menuitem')
    expect(item.querySelector('[data-plume-dropdown-item-icon]')).toContainElement(
      screen.getByTestId('icon'),
    )
    expect(item.querySelector('[data-plume-dropdown-item-label]')).toHaveTextContent('Profile')
    expect(item.querySelector('[data-plume-dropdown-item-shortcut]')).toHaveTextContent('⌘P')
  })

  it('renders the parts the way they are written', async () => {
    render(
      <Example>
        <DropdownItem icon={<i data-testid="ignored" />} shortcut="ignored">
          <DropdownItemShortcut className="s">⌘P</DropdownItemShortcut>
          <DropdownItemLabel className="l">Profile</DropdownItemLabel>
          <DropdownItemIcon className="i">★</DropdownItemIcon>
        </DropdownItem>
      </Example>,
    )
    await open()
    const item = screen.getByRole('menuitem')
    expect(Array.from(item.children).map((child) => child.textContent)).toEqual([
      '⌘P',
      'Profile',
      '★',
    ])
    expect(screen.getByText('⌘P')).toHaveClass('shortcut', 's')
    expect(screen.getByText('Profile')).toHaveClass('label', 'l')
    expect(screen.getByText('★')).toHaveClass('icon', 'i')
    expect(screen.queryByTestId('ignored')).toBeNull()
    expect(screen.getByText('★')).toHaveAttribute('aria-hidden', 'true')
  })

  it('lets a part be omitted', async () => {
    render(
      <Example>
        <DropdownItem>
          <DropdownItemLabel>Only text</DropdownItemLabel>
        </DropdownItem>
      </Example>,
    )
    await open()
    const item = screen.getByRole('menuitem')
    expect(item.querySelector('[data-plume-dropdown-item-icon]')).toBeNull()
    expect(item.querySelector('[data-plume-dropdown-item-shortcut]')).toBeNull()
  })

  it('renders nothing for an icon or a shortcut without children', async () => {
    render(
      <Example>
        <DropdownItem>
          <DropdownItemIcon />
          <DropdownItemLabel>Profile</DropdownItemLabel>
          <DropdownItemShortcut />
        </DropdownItem>
      </Example>,
    )
    await open()
    const item = screen.getByRole('menuitem')
    expect(item.querySelector('[data-plume-dropdown-item-icon]')).toBeNull()
    expect(item.querySelector('[data-plume-dropdown-item-shortcut]')).toBeNull()
  })

  it('forwards the ref and the style of every part', async () => {
    const icon = createRef<HTMLSpanElement>()
    const label = createRef<HTMLSpanElement>()
    const shortcut = createRef<HTMLSpanElement>()
    render(
      <Example>
        <DropdownItem>
          <DropdownItemIcon ref={icon} style={{ margin: 1 }}>
            ★
          </DropdownItemIcon>
          <DropdownItemLabel ref={label} style={{ margin: 2 }}>
            Profile
          </DropdownItemLabel>
          <DropdownItemShortcut ref={shortcut} style={{ margin: 3 }}>
            ⌘P
          </DropdownItemShortcut>
        </DropdownItem>
      </Example>,
    )
    await open()
    expect(icon.current).toBe(screen.getByText('★'))
    expect(label.current).toBe(screen.getByText('Profile'))
    expect(shortcut.current).toBe(screen.getByText('⌘P'))
    expect(screen.getByText('Profile')).toHaveStyle({ margin: '2px' })
  })

  it('drops the Plume classes of the parts when the menu is unstyled', async () => {
    render(
      <Example variant="unstyled">
        <DropdownItem>
          <DropdownItemIcon className="i">★</DropdownItemIcon>
          <DropdownItemLabel className="l">Profile</DropdownItemLabel>
          <DropdownItemShortcut>⌘P</DropdownItemShortcut>
        </DropdownItem>
      </Example>,
    )
    await open()
    expect(screen.getByText('★')).toHaveAttribute('class', 'i')
    expect(screen.getByText('Profile')).toHaveAttribute('class', 'l')
    expect(screen.getByText('⌘P')).not.toHaveAttribute('class')
  })

  it('keeps the typeahead and the selection working with the parts', async () => {
    const onSelect = vi.fn()
    render(
      <Example>
        <DropdownItem onSelect={onSelect}>
          <DropdownItemIcon>★</DropdownItemIcon>
          <DropdownItemLabel>Profile</DropdownItemLabel>
        </DropdownItem>
        <DropdownItem>
          <DropdownItemLabel>Settings</DropdownItemLabel>
        </DropdownItem>
      </Example>,
    )
    await open()
    await userEvent.keyboard('s')
    expect(screen.getByRole('menuitem', { name: 'Settings' })).toHaveFocus()
    await userEvent.click(screen.getByRole('menuitem', { name: 'Profile' }))
    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it.each([
    ['DropdownItemIcon', <DropdownItemIcon key="i">x</DropdownItemIcon>],
    ['DropdownItemLabel', <DropdownItemLabel key="l">x</DropdownItemLabel>],
    ['DropdownItemShortcut', <DropdownItemShortcut key="s">x</DropdownItemShortcut>],
  ])('throws when %s is rendered outside a Dropdown', (_name, element) => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => render(element)).toThrow(/must be used within a <Dropdown>/)
    error.mockRestore()
  })
})
