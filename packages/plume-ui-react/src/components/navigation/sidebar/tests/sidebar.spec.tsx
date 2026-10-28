import { act, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { ThemeProvider } from '../../../../theme'
import {
  Sidebar,
  SidebarBackdrop,
  SidebarContent,
  SidebarItem,
  SidebarItemIcon,
  SidebarItemLabel,
  SidebarProvider,
  SidebarToggle,
} from '..'
import type { SidebarProps, SidebarProviderProps } from '..'

let mobile = false
const listeners = new Set<() => void>()

beforeEach(() => {
  mobile = false
  listeners.clear()
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    addEventListener: (_: string, listener: () => void) => listeners.add(listener),
    matches: query === 'not all' ? false : mobile,
    media: query,
    removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
  }))
})

afterEach(() => {
  document.body.style.overflow = ''
})

function Demo({
  sidebar,
  ...props
}: Readonly<SidebarProviderProps & { sidebar?: Partial<SidebarProps> }>) {
  return (
    <SidebarProvider {...props}>
      <SidebarToggle />
      <Sidebar aria-label="Menu" {...sidebar}>
        <SidebarContent aria-label="Pages">
          <SidebarItem active href="/" icon={<i>H</i>}>
            Home
          </SidebarItem>
          <SidebarItem href="/docs">Docs</SidebarItem>
          <SidebarItem disabled href="/soon">
            Soon
          </SidebarItem>
          <SidebarItem>Action</SidebarItem>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}

const toggle = (): HTMLElement => screen.getByRole('button', { name: 'Toggle sidebar' })
const panel = (): HTMLElement => document.querySelector('[data-plume-sidebar]') as HTMLElement
const backdrop = (): HTMLElement =>
  document.querySelector('[data-plume-sidebar-backdrop]') as HTMLElement

describe('Sidebar component', () => {
  describe('rendering', () => {
    it('renders the items inside a navigation', () => {
      render(<Demo />)
      expect(screen.getByRole('navigation', { name: 'Pages' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '/docs')
    })

    it('is not a dialog on a wide screen', () => {
      render(<Demo />)
      expect(panel()).not.toHaveAttribute('role')
      expect(screen.queryByRole('dialog')).toBeNull()
    })

    it('forwards the refs', () => {
      const sidebar = createRef<HTMLDivElement>()
      const content = createRef<HTMLElement>()
      const item = createRef<HTMLElement>()
      const action = createRef<HTMLElement>()
      const button = createRef<HTMLButtonElement>()
      render(
        <SidebarProvider>
          <SidebarToggle ref={button} />
          <Sidebar ref={sidebar}>
            <SidebarContent ref={content}>
              <SidebarItem href="/" ref={item}>
                A
              </SidebarItem>
              <SidebarItem ref={action}>B</SidebarItem>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>,
      )
      expect(sidebar.current).toBe(panel())
      expect(content.current).toBe(screen.getByRole('navigation'))
      expect(item.current?.tagName).toBe('A')
      expect(action.current?.tagName).toBe('BUTTON')
      expect(button.current).toBe(toggle())
    })

    it('exposes the side, breakpoint and state', () => {
      render(<Demo breakpoint="lg" sidebar={{ side: 'right' }} />)
      expect(panel()).toHaveAttribute('data-side', 'right')
      expect(panel()).toHaveAttribute('data-breakpoint', 'lg')
      expect(backdrop()).toHaveAttribute('data-breakpoint', 'lg')
    })

    it('uses the id of the provider for the panel', () => {
      render(<Demo id="nav-panel" />)
      expect(panel()).toHaveAttribute('id', 'nav-panel')
      expect(toggle()).toHaveAttribute('aria-controls', 'nav-panel')
    })

    it('generates an id for the panel', () => {
      render(<Demo />)
      expect(panel().id).not.toBe('')
      expect(toggle()).toHaveAttribute('aria-controls', panel().id)
    })
  })

  describe('items', () => {
    it('marks the active one as the current page', () => {
      render(<Demo />)
      expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page')
      expect(screen.getByRole('link', { name: 'Docs' })).not.toHaveAttribute('aria-current')
    })

    it('shows the icon, hidden from assistive technology, and the label', () => {
      render(<Demo />)
      expect(screen.getByText('H').closest('[data-plume-sidebar-item-icon]')).toHaveAttribute(
        'aria-hidden',
        'true',
      )
      expect(screen.getByRole('link', { name: 'Home' })).toHaveTextContent('Home')
    })

    it('disables a link and a button item', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarContent>
              <SidebarItem disabled href="/soon">
                Link
              </SidebarItem>
              <SidebarItem disabled>Button</SidebarItem>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>,
      )
      expect(screen.getByText('Link').closest('a')).toHaveAttribute('aria-disabled', 'true')
      expect(screen.getByText('Link').closest('a')).not.toHaveAttribute('href')
      expect(screen.getByRole('button', { name: 'Button' })).toBeDisabled()
    })

    it('calls onClick and passes target and rel', async () => {
      const onClick = vi.fn((event: React.MouseEvent) => event.preventDefault())
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarContent>
              <SidebarItem href="/x" onClick={onClick} rel="noreferrer" target="_blank">
                Out
              </SidebarItem>
              <SidebarItem onClick={onClick}>Act</SidebarItem>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>,
      )
      expect(screen.getByRole('link', { name: 'Out' })).toHaveAttribute('target', '_blank')
      expect(screen.getByRole('link', { name: 'Out' })).toHaveAttribute('rel', 'noreferrer')
      await userEvent.click(screen.getByRole('link', { name: 'Out' }))
      await userEvent.click(screen.getByRole('button', { name: 'Act' }))
      expect(onClick).toHaveBeenCalledTimes(2)
    })

    it('adds the classes of the user to the icon and the label parts', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarContent>
              <SidebarItem>
                <SidebarItemIcon className="my-icon">
                  <i>i</i>
                </SidebarItemIcon>
                <SidebarItemLabel className="my-label">Name</SidebarItemLabel>
              </SidebarItem>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>,
      )
      expect(document.querySelector('[data-plume-sidebar-item-icon]')).toHaveClass(
        'icon',
        'my-icon',
      )
      expect(screen.getByText('Name')).toHaveClass('label', 'my-label')
    })
  })

  describe('collapsing on a wide screen', () => {
    it('starts expanded and collapses with the toggle', async () => {
      render(<Demo />)
      expect(toggle()).toHaveAttribute('aria-expanded', 'true')
      expect(panel()).not.toHaveAttribute('data-collapsed')
      await userEvent.click(toggle())
      expect(toggle()).toHaveAttribute('aria-expanded', 'false')
      expect(panel()).toHaveAttribute('data-collapsed')
    })

    it('starts collapsed with defaultCollapsed', () => {
      render(<Demo defaultCollapsed />)
      expect(panel()).toHaveAttribute('data-collapsed')
    })

    it('calls onCollapsedChange', async () => {
      const onCollapsedChange = vi.fn()
      render(<Demo onCollapsedChange={onCollapsedChange} />)
      await userEvent.click(toggle())
      expect(onCollapsedChange).toHaveBeenCalledWith(true)
    })

    it('can be controlled', async () => {
      function Controlled() {
        const [collapsed, setCollapsed] = useState(false)
        return <Demo collapsed={collapsed} onCollapsedChange={setCollapsed} />
      }
      render(<Controlled />)
      await userEvent.click(toggle())
      expect(panel()).toHaveAttribute('data-collapsed')
    })

    it('does not open anything', async () => {
      render(<Demo />)
      await userEvent.click(toggle())
      expect(panel()).not.toHaveAttribute('data-open')
    })

    it('lets the click be prevented', async () => {
      render(
        <SidebarProvider>
          <SidebarToggle onClick={(event) => event.preventDefault()} />
          <Sidebar />
        </SidebarProvider>,
      )
      await userEvent.click(toggle())
      expect(panel()).not.toHaveAttribute('data-collapsed')
    })
  })

  describe('off-canvas on a small screen', () => {
    beforeEach(() => {
      mobile = true
    })

    it('starts closed', () => {
      render(<Demo />)
      expect(toggle()).toHaveAttribute('aria-expanded', 'false')
      expect(panel()).not.toHaveAttribute('data-open')
      expect(screen.queryByRole('dialog')).toBeNull()
    })

    it('opens as a modal dialog and takes the focus', async () => {
      render(<Demo />)
      await userEvent.click(toggle())
      expect(toggle()).toHaveAttribute('aria-expanded', 'true')
      const dialog = screen.getByRole('dialog', { name: 'Menu' })
      expect(dialog).toHaveAttribute('aria-modal', 'true')
      expect(dialog).toHaveAttribute('data-open')
      expect(backdrop()).toHaveAttribute('data-open')
      expect(screen.getByRole('link', { name: 'Home' })).toHaveFocus()
    })

    it('locks the scroll of the page while it is open', async () => {
      render(<Demo />)
      await userEvent.click(toggle())
      expect(document.body.style.overflow).toBe('hidden')
      await userEvent.keyboard('{Escape}')
      expect(document.body.style.overflow).toBe('')
    })

    it('closes with Escape and gives the focus back to the toggle', async () => {
      render(<Demo />)
      await userEvent.click(toggle())
      await userEvent.keyboard('{Escape}')
      expect(toggle()).toHaveAttribute('aria-expanded', 'false')
      expect(screen.queryByRole('dialog')).toBeNull()
      expect(toggle()).toHaveFocus()
    })

    it('closes when the backdrop is pressed', async () => {
      render(<Demo />)
      await userEvent.click(toggle())
      await userEvent.click(backdrop())
      expect(toggle()).toHaveAttribute('aria-expanded', 'false')
    })

    it('keeps the focus inside while it is open', async () => {
      render(<Demo />)
      await userEvent.click(toggle())
      await userEvent.tab()
      await userEvent.tab()
      await userEvent.tab()
      expect(panel().contains(document.activeElement)).toBe(true)
    })

    it('calls onOpenChange and can be controlled', async () => {
      const onOpenChange = vi.fn()
      function Controlled() {
        const [open, setOpen] = useState(false)
        return (
          <Demo
            onOpenChange={(next) => {
              onOpenChange(next)
              setOpen(next)
            }}
            open={open}
          />
        )
      }
      render(<Controlled />)
      await userEvent.click(toggle())
      expect(onOpenChange).toHaveBeenCalledWith(true)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('does not collapse', async () => {
      render(<Demo />)
      await userEvent.click(toggle())
      expect(panel()).not.toHaveAttribute('data-collapsed')
    })

    it('follows the screen when it changes size', () => {
      mobile = false
      render(<Demo defaultOpen />)
      expect(screen.queryByRole('dialog')).toBeNull()
      mobile = true
      act(() => listeners.forEach((listener) => listener()))
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })

  describe('docked at every width', () => {
    it('never becomes an off-canvas dialog', async () => {
      mobile = true
      render(<Demo breakpoint="never" />)
      expect(panel()).toHaveAttribute('data-breakpoint', 'never')
      await userEvent.click(toggle())
      expect(panel()).toHaveAttribute('data-collapsed')
      expect(screen.queryByRole('dialog')).toBeNull()
    })
  })

  describe('breakpoint', () => {
    const queries = (): string[] =>
      vi.mocked(window.matchMedia).mock.calls.map(([query]) => query)

    it('uses the default breakpoint without a ThemeProvider', () => {
      render(<Demo />)
      expect(queries()).toContain('(width < 48rem)')
    })

    it('follows the breakpoints of the theme', () => {
      render(
        <ThemeProvider theme={{ breakpoints: { md: '60rem' } }}>
          <Demo />
        </ThemeProvider>,
      )
      expect(queries()).toContain('(width < 60rem)')
    })
  })

  describe('without matchMedia', () => {
    it('behaves as a wide screen', async () => {
      Reflect.deleteProperty(window, 'matchMedia')
      render(<Demo />)
      await userEvent.click(toggle())
      expect(panel()).toHaveAttribute('data-collapsed')
    })
  })

  describe('appearance', () => {
    it('applies the base, variant and size classes', () => {
      render(<Demo sidebar={{ size: 'lg', variant: 'filled' }} />)
      expect(panel()).toHaveClass('sidebar', 'filled', 'lg')
      expect(backdrop()).toHaveClass('backdrop')
    })

    it('defaults to a plain, medium sidebar', () => {
      render(<Demo />)
      expect(panel()).toHaveClass('sidebar', 'plain', 'md')
    })

    it.each(['filled', 'solid'] as const)('applies the %s variant', (variant) => {
      render(<Demo sidebar={{ variant }} />)
      expect(panel()).toHaveClass('sidebar', variant)
    })

    it('exposes the color scheme as CSS variables', () => {
      render(<Demo sidebar={{ colorScheme: 'success' }} />)
      expect(panel()).toHaveStyle('--sidebar-tint: var(--plume-color-success-tint)')
      expect(panel()).toHaveStyle('--sidebar-solid: var(--plume-color-success-solid)')
    })

    it('lets style override a variable', () => {
      render(
        <Demo
          sidebar={{
            style: { '--sidebar-tint': 'red' } as React.CSSProperties,
          }}
        />,
      )
      expect(panel()).toHaveStyle('--sidebar-tint: red')
    })

    it('drops the Plume classes when it is unstyled and keeps the user classes', () => {
      render(
        <SidebarProvider>
          <SidebarToggle className="toggle" variant="unstyled" />
          <Sidebar className="root" variant="unstyled">
            <SidebarBackdrop className="back" />
            <SidebarContent className="content">
              <SidebarItem className="item" icon={<i>i</i>}>
                Name
              </SidebarItem>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>,
      )
      expect(panel()).toHaveAttribute('class', 'root')
      expect(backdrop()).toHaveAttribute('class', 'back')
      expect(screen.getByRole('navigation')).toHaveAttribute('class', 'content')
      expect(toggle()).toHaveAttribute('class', 'toggle')
      expect(screen.getByRole('button', { name: 'Name' })).toHaveAttribute('class', 'item')
    })

    it('uses another label, icon or content for the toggle', () => {
      render(
        <SidebarProvider>
          <SidebarToggle label="Menu" />
          <SidebarToggle icon={<i>icon</i>} label="Icon" />
          <SidebarToggle label="Custom">custom</SidebarToggle>
        </SidebarProvider>,
      )
      expect(screen.getByRole('button', { name: 'Menu' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Icon' })).toHaveTextContent('icon')
      expect(screen.getByRole('button', { name: 'Custom' })).toHaveTextContent('custom')
    })
  })

  describe('outside a provider', () => {
    it.each([
      ['Sidebar', <Sidebar key="sidebar" />],
      ['SidebarToggle', <SidebarToggle key="toggle" />],
    ])('throws when %s has no SidebarProvider', (name, element) => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
      expect(() => render(element)).toThrow(`${name} must be used within a <SidebarProvider>`)
      error.mockRestore()
    })
  })
})
