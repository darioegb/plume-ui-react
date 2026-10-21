import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef, type Ref, useState } from 'react'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarToggle } from '..'
import type { NavbarProps } from '..'

function Demo({
  demoRef,
  ...props
}: Readonly<Partial<NavbarProps> & { demoRef?: Ref<HTMLElement> }>) {
  return (
    <>
      <Navbar aria-label="Main" {...props} ref={demoRef}>
        <NavbarBrand href="/">Plume</NavbarBrand>
        <NavbarToggle />
        <NavbarContent>
          <NavbarItem active href="/">
            Home
          </NavbarItem>
          <NavbarItem href="/docs" onClick={(event) => event.preventDefault()}>
            Docs
          </NavbarItem>
          <NavbarItem disabled href="/soon">
            Soon
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <button type="button">outside</button>
    </>
  )
}

const toggle = (): HTMLElement => screen.getByRole('button', { name: 'Toggle navigation' })
const content = (): HTMLElement =>
  document.querySelector('[data-plume-navbar-content]') as HTMLElement

describe('Navbar component', () => {
  describe('rendering', () => {
    it('renders a navigation landmark', () => {
      render(<Demo />)
      expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument()
    })

    it('forwards the ref and the attributes to the navigation', () => {
      const ref = createRef<HTMLElement>()
      render(<Demo demoRef={ref} id="top" title="Top bar" />)
      expect(ref.current).toBe(screen.getByRole('navigation'))
      expect(ref.current).toHaveAttribute('id', 'top')
      expect(ref.current).toHaveAttribute('title', 'Top bar')
    })

    it('generates an id when none is given', () => {
      render(<Demo />)
      expect(screen.getByRole('navigation').id).not.toBe('')
    })

    it('exposes the breakpoint and the sticky state', () => {
      const { rerender } = render(<Demo />)
      expect(screen.getByRole('navigation')).toHaveAttribute('data-breakpoint', 'md')
      expect(screen.getByRole('navigation')).not.toHaveAttribute('data-sticky')
      rerender(<Demo breakpoint="lg" sticky />)
      expect(screen.getByRole('navigation')).toHaveAttribute('data-breakpoint', 'lg')
      expect(screen.getByRole('navigation')).toHaveAttribute('data-sticky')
    })
  })

  describe('parts', () => {
    it('renders the brand as a link, or as text without an href', () => {
      render(
        <Navbar>
          <NavbarBrand href="/home">Linked</NavbarBrand>
          <NavbarBrand>Plain</NavbarBrand>
        </Navbar>,
      )
      expect(screen.getByRole('link', { name: 'Linked' })).toHaveAttribute('href', '/home')
      expect(screen.queryByRole('link', { name: 'Plain' })).toBeNull()
    })

    it('calls onClick of the brand and passes target and rel', async () => {
      const onClick = vi.fn((event: React.MouseEvent) => event.preventDefault())
      render(
        <Navbar>
          <NavbarBrand href="/x" onClick={onClick} rel="noreferrer" target="_blank">
            Brand
          </NavbarBrand>
        </Navbar>,
      )
      const link = screen.getByRole('link', { name: 'Brand' })
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noreferrer')
      await userEvent.click(link)
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('renders an item with an href as a link and one without as a button', async () => {
      const onClick = vi.fn()
      render(
        <Navbar>
          <NavbarContent>
            <NavbarItem href="/docs">Docs</NavbarItem>
            <NavbarItem onClick={onClick}>Action</NavbarItem>
          </NavbarContent>
        </Navbar>,
      )
      expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '/docs')
      await userEvent.click(screen.getByRole('button', { name: 'Action' }))
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('marks the active item as the current page', () => {
      render(<Demo />)
      expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page')
      expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('data-active')
      expect(screen.getByRole('link', { name: 'Docs' })).not.toHaveAttribute('aria-current')
    })

    it('disables a link item: no href, not focusable and aria-disabled', () => {
      render(<Demo />)
      const soon = screen.getByText('Soon')
      expect(soon).toHaveAttribute('aria-disabled', 'true')
      expect(soon).not.toHaveAttribute('href')
      expect(soon).toHaveAttribute('tabindex', '-1')
    })

    it('disables a button item', () => {
      render(
        <Navbar>
          <NavbarItem disabled>Off</NavbarItem>
        </Navbar>,
      )
      expect(screen.getByRole('button', { name: 'Off' })).toBeDisabled()
    })

    it('aligns the content', () => {
      const { rerender } = render(
        <Navbar>
          <NavbarContent>x</NavbarContent>
        </Navbar>,
      )
      expect(content()).toHaveAttribute('data-align', 'start')
      rerender(
        <Navbar>
          <NavbarContent align="end">x</NavbarContent>
        </Navbar>,
      )
      expect(content()).toHaveAttribute('data-align', 'end')
    })

    it('forwards the refs of the parts', () => {
      const brand = createRef<HTMLElement>()
      const item = createRef<HTMLElement>()
      const button = createRef<HTMLElement>()
      const toggleRef = createRef<HTMLButtonElement>()
      const contentRef = createRef<HTMLDivElement>()
      render(
        <Navbar>
          <NavbarBrand href="/" ref={brand}>
            B
          </NavbarBrand>
          <NavbarToggle ref={toggleRef} />
          <NavbarContent ref={contentRef}>
            <NavbarItem href="/" ref={item}>
              I
            </NavbarItem>
            <NavbarItem ref={button}>A</NavbarItem>
          </NavbarContent>
        </Navbar>,
      )
      expect(brand.current?.tagName).toBe('A')
      expect(item.current?.tagName).toBe('A')
      expect(button.current?.tagName).toBe('BUTTON')
      expect(toggleRef.current).toBe(toggle())
      expect(contentRef.current).toBe(content())
    })
  })

  describe('toggle', () => {
    it('starts closed and controls the content', () => {
      render(<Demo />)
      expect(toggle()).toHaveAttribute('aria-expanded', 'false')
      expect(toggle()).toHaveAttribute('aria-controls', content().id)
      expect(content()).not.toHaveAttribute('data-open')
    })

    it('opens and closes the content', async () => {
      render(<Demo />)
      await userEvent.click(toggle())
      expect(toggle()).toHaveAttribute('aria-expanded', 'true')
      expect(content()).toHaveAttribute('data-open')
      await userEvent.click(toggle())
      expect(toggle()).toHaveAttribute('aria-expanded', 'false')
    })

    it('starts open with defaultOpen', () => {
      render(<Demo defaultOpen />)
      expect(toggle()).toHaveAttribute('aria-expanded', 'true')
    })

    it('calls onOpenChange', async () => {
      const onOpenChange = vi.fn()
      render(<Demo onOpenChange={onOpenChange} />)
      await userEvent.click(toggle())
      expect(onOpenChange).toHaveBeenCalledWith(true)
    })

    it('can be controlled', async () => {
      function Controlled() {
        const [open, setOpen] = useState(false)
        return <Demo onOpenChange={setOpen} open={open} />
      }
      render(<Controlled />)
      await userEvent.click(toggle())
      expect(content()).toHaveAttribute('data-open')
    })

    it('stays closed when it is controlled and nobody updates it', async () => {
      render(<Demo open={false} />)
      await userEvent.click(toggle())
      expect(toggle()).toHaveAttribute('aria-expanded', 'false')
    })

    it('lets the click be prevented', async () => {
      render(
        <Navbar>
          <NavbarToggle onClick={(event) => event.preventDefault()} />
          <NavbarContent>x</NavbarContent>
        </Navbar>,
      )
      await userEvent.click(toggle())
      expect(toggle()).toHaveAttribute('aria-expanded', 'false')
    })

    it('uses another label, icon or content', () => {
      render(
        <Navbar>
          <NavbarToggle label="Menu" />
          <NavbarToggle icon={<i>icon</i>} label="Icon" />
          <NavbarToggle label="Custom">custom</NavbarToggle>
        </Navbar>,
      )
      expect(screen.getByRole('button', { name: 'Menu' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Icon' })).toHaveTextContent('icon')
      expect(screen.getByRole('button', { name: 'Custom' })).toHaveTextContent('custom')
    })

    it('shows a menu icon when closed and a close icon when open', async () => {
      render(<Demo />)
      const before = toggle().innerHTML
      await userEvent.click(toggle())
      expect(toggle().innerHTML).not.toBe(before)
    })
  })

  describe('closing', () => {
    it('closes with Escape and gives the focus back to the toggle', async () => {
      render(<Demo defaultOpen />)
      await userEvent.click(screen.getByRole('link', { name: 'Docs' }))
      await userEvent.keyboard('{Escape}')
      expect(toggle()).toHaveAttribute('aria-expanded', 'false')
      expect(toggle()).toHaveFocus()
    })

    it('closes when pressing outside, without moving the focus', async () => {
      render(<Demo defaultOpen />)
      await userEvent.click(screen.getByRole('button', { name: 'outside' }))
      expect(toggle()).toHaveAttribute('aria-expanded', 'false')
      expect(screen.getByRole('button', { name: 'outside' })).toHaveFocus()
    })

    it('stays open when pressing inside', async () => {
      render(<Demo defaultOpen />)
      await userEvent.click(screen.getByRole('link', { name: 'Docs' }))
      expect(toggle()).toHaveAttribute('aria-expanded', 'true')
    })
  })

  describe('appearance', () => {
    it('applies the base, variant and size classes', () => {
      render(<Demo size="lg" variant="solid" />)
      expect(screen.getByRole('navigation')).toHaveClass('navbar', 'solid', 'lg')
    })

    it.each(['outline', 'filled'] as const)('applies the %s variant', (variant) => {
      render(<Demo variant={variant} />)
      expect(screen.getByRole('navigation')).toHaveClass('navbar', variant)
    })

    it('defaults to a plain, medium navbar', () => {
      render(<Demo />)
      expect(screen.getByRole('navigation')).toHaveClass('navbar', 'plain', 'md')
    })

    it('exposes the color scheme as CSS variables', () => {
      render(<Demo colorScheme="success" />)
      expect(screen.getByRole('navigation')).toHaveStyle(
        '--navbar-solid: var(--plume-color-success-solid)',
      )
    })

    it('lets style override a variable', () => {
      render(<Demo style={{ '--navbar-solid': 'red' } as React.CSSProperties} />)
      expect(screen.getByRole('navigation')).toHaveStyle('--navbar-solid: red')
    })

    it('drops the Plume classes when it is unstyled and keeps the user classes', () => {
      render(
        <Navbar className="root" variant="unstyled">
          <NavbarBrand className="brand">B</NavbarBrand>
          <NavbarToggle className="toggle" />
          <NavbarContent className="content">
            <NavbarItem className="item" href="/">
              I
            </NavbarItem>
          </NavbarContent>
        </Navbar>,
      )
      expect(screen.getByRole('navigation')).toHaveAttribute('class', 'root')
      expect(screen.getByText('B')).toHaveAttribute('class', 'brand')
      expect(toggle()).toHaveAttribute('class', 'toggle')
      expect(content()).toHaveAttribute('class', 'content')
      expect(screen.getByRole('link')).toHaveAttribute('class', 'item')
    })
  })

  describe('outside a navbar', () => {
    it.each([
      ['NavbarBrand', <NavbarBrand key="brand" />],
      ['NavbarContent', <NavbarContent key="content" />],
      ['NavbarItem', <NavbarItem key="item" />],
      ['NavbarToggle', <NavbarToggle key="toggle" />],
    ])('throws when %s has no Navbar', (name, element) => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
      expect(() => render(element)).toThrow(`${name} must be used within a <Navbar>`)
      error.mockRestore()
    })
  })
})
