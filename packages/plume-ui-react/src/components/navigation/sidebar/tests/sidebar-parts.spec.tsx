import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef } from 'react'
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

beforeEach(() => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    addEventListener: () => undefined,
    matches: query !== 'not all',
    media: query,
    removeEventListener: () => undefined,
  }))
})

const backdrops = (): HTMLElement[] =>
  Array.from(document.querySelectorAll<HTMLElement>('[data-plume-sidebar-backdrop]'))

describe('SidebarBackdrop', () => {
  it('is rendered by the sidebar when it is not composed', () => {
    render(
      <SidebarProvider>
        <Sidebar aria-label="Menu">content</Sidebar>
      </SidebarProvider>,
    )
    expect(backdrops()).toHaveLength(1)
    expect(backdrops()[0]).toHaveClass('backdrop')
    expect(backdrops()[0]).toHaveAttribute('aria-hidden', 'true')
  })

  it('replaces the default one and goes before the panel, not inside it', () => {
    render(
      <SidebarProvider>
        <Sidebar aria-label="Menu">
          <SidebarBackdrop className="mine" style={{ opacity: 0.5 }} />
          <SidebarContent>links</SidebarContent>
        </Sidebar>
      </SidebarProvider>,
    )
    expect(backdrops()).toHaveLength(1)
    expect(backdrops()[0]).toHaveClass('backdrop', 'mine')
    expect(backdrops()[0]).toHaveStyle({ opacity: '0.5' })
    expect(backdrops()[0].nextElementSibling).toHaveAttribute('data-plume-sidebar')
    expect(document.querySelector('[data-plume-sidebar] [data-plume-sidebar-backdrop]')).toBeNull()
  })

  it('closes the sidebar when it is pressed, and tells the click handler first', async () => {
    const onClick = vi.fn()
    render(
      <SidebarProvider defaultOpen>
        <SidebarToggle />
        <Sidebar aria-label="Menu">
          <SidebarBackdrop onClick={onClick} />
          <SidebarContent>links</SidebarContent>
        </Sidebar>
      </SidebarProvider>,
    )
    expect(backdrops()[0]).toHaveAttribute('data-open')
    await userEvent.click(backdrops()[0])
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(backdrops()[0]).not.toHaveAttribute('data-open')
  })

  it('stays open when the click handler prevents the default', async () => {
    render(
      <SidebarProvider defaultOpen>
        <Sidebar aria-label="Menu">
          <SidebarBackdrop onClick={(event) => event.preventDefault()} />
        </Sidebar>
      </SidebarProvider>,
    )
    await userEvent.click(backdrops()[0])
    expect(backdrops()[0]).toHaveAttribute('data-open')
  })

  it('can be hidden, keeps the breakpoint and forwards the ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <SidebarProvider breakpoint="lg">
        <Sidebar aria-label="Menu">
          <SidebarBackdrop hidden ref={ref} />
        </Sidebar>
      </SidebarProvider>,
    )
    expect(ref.current).toBe(backdrops()[0])
    expect(ref.current).toHaveAttribute('hidden')
    expect(ref.current).toHaveAttribute('data-breakpoint', 'lg')
  })

  it('drops its Plume class with an unstyled sidebar', () => {
    render(
      <SidebarProvider>
        <Sidebar aria-label="Menu" variant="unstyled">
          <SidebarBackdrop className="mine" />
        </Sidebar>
      </SidebarProvider>,
    )
    expect(backdrops()[0]).toHaveAttribute('class', 'mine')
  })

  it('throws outside a SidebarProvider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => render(<SidebarBackdrop />)).toThrow(
      'SidebarBackdrop must be used within a <SidebarProvider>',
    )
    vi.restoreAllMocks()
  })
})

describe('SidebarItem parts', () => {
  const renderItem = (item: React.ReactNode): void => {
    render(
      <SidebarProvider>
        <Sidebar aria-label="Menu">
          <SidebarContent>{item}</SidebarContent>
        </Sidebar>
      </SidebarProvider>,
    )
  }

  it('keeps the default composition: the icon before the label', () => {
    renderItem(<SidebarItem icon={<i>i</i>}>Home</SidebarItem>)
    const item = screen.getByRole('button', { name: 'Home' })
    expect(item.children).toHaveLength(2)
    expect(item.children[0]).toHaveAttribute('data-plume-sidebar-item-icon')
    expect(item.children[1]).toHaveAttribute('data-plume-sidebar-item-label')
  })

  it('renders the parts as written, so they can be reordered', () => {
    renderItem(
      <SidebarItem>
        <SidebarItemLabel>Home</SidebarItemLabel>
        <SidebarItemIcon>
          <i>i</i>
        </SidebarItemIcon>
      </SidebarItem>,
    )
    const item = screen.getByRole('button', { name: 'Home' })
    expect(item.children[0]).toHaveAttribute('data-plume-sidebar-item-label')
    expect(item.children[1]).toHaveAttribute('data-plume-sidebar-item-icon')
  })

  it('omits the icon when there is no icon part, and ignores the icon prop', () => {
    renderItem(
      <SidebarItem icon={<i>ignored</i>}>
        <SidebarItemLabel>Home</SidebarItemLabel>
      </SidebarItem>,
    )
    expect(screen.queryByText('ignored')).toBeNull()
    expect(document.querySelector('[data-plume-sidebar-item-icon]')).toBeNull()
  })

  it('takes className, style and ref on each part', () => {
    const icon = createRef<HTMLSpanElement>()
    const label = createRef<HTMLSpanElement>()
    renderItem(
      <SidebarItem>
        <SidebarItemIcon className="a" ref={icon} style={{ color: 'red' }}>
          <i>i</i>
        </SidebarItemIcon>
        <SidebarItemLabel className="b" ref={label} style={{ color: 'blue' }}>
          Home
        </SidebarItemLabel>
      </SidebarItem>,
    )
    expect(icon.current).toHaveClass('icon', 'a')
    expect(icon.current).toHaveStyle({ color: 'rgb(255, 0, 0)' })
    expect(icon.current).toHaveAttribute('aria-hidden', 'true')
    expect(label.current).toHaveClass('label', 'b')
    expect(label.current).toHaveStyle({ color: 'rgb(0, 0, 255)' })
  })

  it('drops the Plume classes of the parts with an unstyled sidebar', () => {
    render(
      <SidebarProvider>
        <Sidebar aria-label="Menu" variant="unstyled">
          <SidebarContent>
            <SidebarItem>
              <SidebarItemIcon className="a">
                <i>i</i>
              </SidebarItemIcon>
              <SidebarItemLabel className="b">Home</SidebarItemLabel>
            </SidebarItem>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>,
    )
    expect(document.querySelector('[data-plume-sidebar-item-icon]')).toHaveAttribute('class', 'a')
    expect(document.querySelector('[data-plume-sidebar-item-label]')).toHaveAttribute('class', 'b')
  })
})
