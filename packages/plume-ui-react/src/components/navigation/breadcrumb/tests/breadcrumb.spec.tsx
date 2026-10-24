import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef, type Ref } from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '..'
import type { BreadcrumbProps } from '..'

function Demo({
  demoRef,
  ...props
}: Readonly<Partial<BreadcrumbProps> & { demoRef?: Ref<HTMLElement> }>) {
  return (
    <Breadcrumb {...props} ref={demoRef}>
      <BreadcrumbItem>
        <BreadcrumbLink href="/">Home</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink current>Breadcrumb</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  )
}

const separators = (): HTMLElement[] =>
  Array.from(document.querySelectorAll<HTMLElement>('[data-plume-breadcrumb-separator]'))

describe('Breadcrumb component', () => {
  describe('rendering', () => {
    it('renders a labelled navigation with an ordered list', () => {
      render(<Demo />)
      expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument()
      expect(screen.getByRole('list')).toBeInTheDocument()
      expect(screen.getAllByRole('listitem')).toHaveLength(3)
      expect(screen.getByRole('list').tagName).toBe('OL')
    })

    it('lets the label be replaced', () => {
      render(<Demo aria-label="You are here" />)
      expect(screen.getByRole('navigation', { name: 'You are here' })).toBeInTheDocument()
    })

    it('uses the label of the navigation given in labels', () => {
      render(<Demo labels={{ breadcrumb: 'Ruta' }} />)
      expect(screen.getByRole('navigation', { name: 'Ruta' })).toBeInTheDocument()
    })

    it('does not add its label when it is labelled by another element', () => {
      render(
        <>
          <h2 id="title">Where am I</h2>
          <Demo aria-labelledby="title" />
        </>,
      )
      const nav = screen.getByRole('navigation', { name: 'Where am I' })
      expect(nav).not.toHaveAttribute('aria-label')
    })

    it('forwards the ref to the navigation', () => {
      const ref = createRef<HTMLElement>()
      render(<Demo demoRef={ref} />)
      expect(ref.current).toBe(screen.getByRole('navigation'))
    })

    it('forwards the id, title and hidden attributes', () => {
      render(<Demo id="trail" title="Trail" />)
      expect(screen.getByRole('navigation')).toHaveAttribute('id', 'trail')
      expect(screen.getByRole('navigation')).toHaveAttribute('title', 'Trail')
    })
  })

  describe('links', () => {
    it('renders a link for an item with an href', () => {
      render(<Demo />)
      expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '/docs')
    })

    it('marks the current page', () => {
      render(<Demo />)
      expect(screen.getByText('Breadcrumb', { selector: '[aria-current]' })).toHaveAttribute(
        'aria-current',
        'page',
      )
      expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current')
    })

    it('renders the current item as text when it has no href', () => {
      render(<Demo />)
      expect(screen.queryByRole('link', { name: 'Breadcrumb' })).toBeNull()
    })

    it('keeps the link of the current item when it has an href', () => {
      render(
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink current href="/here">
              Here
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>,
      )
      expect(screen.getByRole('link', { name: 'Here' })).toHaveAttribute('aria-current', 'page')
    })

    it('passes the anchor attributes and calls onClick', async () => {
      const onClick = vi.fn((event: React.MouseEvent) => event.preventDefault())
      render(
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/out" onClick={onClick} rel="noreferrer" target="_blank">
              Out
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>,
      )
      const link = screen.getByRole('link', { name: 'Out' })
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noreferrer')
      await userEvent.click(link)
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('forwards the ref of a link and of a text item', () => {
      const linkRef = createRef<HTMLElement>()
      const textRef = createRef<HTMLElement>()
      render(
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" ref={linkRef}>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink current ref={textRef}>
              Now
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>,
      )
      expect(linkRef.current?.tagName).toBe('A')
      expect(textRef.current?.tagName).toBe('SPAN')
    })
  })

  describe('separators', () => {
    it('puts a hidden slash after every item', () => {
      render(<Demo />)
      expect(separators()).toHaveLength(3)
      expect(separators()[0]).toHaveTextContent('/')
      expect(separators()[0]).toHaveAttribute('aria-hidden', 'true')
    })

    it('uses another separator for all the items', () => {
      render(<Demo separator="›" />)
      expect(separators().map((node) => node.textContent)).toEqual(['›', '›', '›'])
    })

    it('lets an item use its own separator, or none', () => {
      render(
        <Breadcrumb>
          <BreadcrumbItem separator="→">
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem separator={null}>
            <BreadcrumbLink current>Now</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>,
      )
      expect(separators()).toHaveLength(1)
      expect(separators()[0]).toHaveTextContent('→')
    })

    it('renders a separator part with its own content', () => {
      render(
        <Breadcrumb>
          <BreadcrumbItem separator={null}>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
            <BreadcrumbSeparator>|</BreadcrumbSeparator>
          </BreadcrumbItem>
        </Breadcrumb>,
      )
      expect(separators()[0]).toHaveTextContent('|')
    })

    it('forwards the ref of a separator', () => {
      const ref = createRef<HTMLSpanElement>()
      render(
        <Breadcrumb>
          <BreadcrumbItem separator={null}>
            <BreadcrumbSeparator ref={ref} />
          </BreadcrumbItem>
        </Breadcrumb>,
      )
      expect(ref.current).toBe(separators()[0])
    })
  })

  describe('appearance', () => {
    it('applies the base, variant and size classes', () => {
      render(<Demo size="lg" variant="filled" />)
      expect(screen.getByRole('navigation')).toHaveClass('breadcrumb', 'filled', 'lg')
    })

    it('defaults to a plain, medium breadcrumb', () => {
      render(<Demo />)
      expect(screen.getByRole('navigation')).toHaveClass('breadcrumb', 'plain', 'md')
    })

    it('exposes the color scheme as CSS variables', () => {
      render(<Demo colorScheme="success" />)
      expect(screen.getByRole('navigation')).toHaveStyle(
        '--breadcrumb-text: var(--plume-color-success-text)',
      )
    })

    it('lets style override a variable', () => {
      render(<Demo style={{ '--breadcrumb-text': 'red' } as React.CSSProperties} />)
      expect(screen.getByRole('navigation')).toHaveStyle('--breadcrumb-text: red')
    })

    it('adds the classes of the user to every part', () => {
      render(
        <Breadcrumb className="root">
          <BreadcrumbList className="list">
            <BreadcrumbItem className="item" separator={null}>
              <BreadcrumbLink className="link" href="/">
                Home
              </BreadcrumbLink>
              <BreadcrumbSeparator className="sep" />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      )
      expect(screen.getByRole('navigation')).toHaveClass('root')
      expect(screen.getByRole('list')).toHaveClass('list')
      expect(screen.getByRole('listitem')).toHaveClass('item')
      expect(screen.getByRole('link')).toHaveClass('link')
      expect(separators()[0]).toHaveClass('sep')
    })

    it('drops the Plume classes when it is unstyled and keeps the structure attributes', () => {
      render(
        <Breadcrumb className="root" variant="unstyled">
          <BreadcrumbList className="list">
            <BreadcrumbItem className="item" separator={null}>
              <BreadcrumbLink className="link" href="/">
                Home
              </BreadcrumbLink>
              <BreadcrumbSeparator className="sep" />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      )
      expect(screen.getByRole('navigation')).toHaveAttribute('class', 'root')
      expect(screen.getByRole('list')).toHaveAttribute('class', 'list')
      expect(screen.getByRole('listitem')).toHaveAttribute('class', 'item')
      expect(screen.getByRole('link')).toHaveAttribute('class', 'link')
      expect(separators()[0]).toHaveAttribute('class', 'sep')
      expect(document.querySelector('[data-plume-breadcrumb]')).not.toBeNull()
    })
  })

  describe('outside a breadcrumb', () => {
    it.each([
      ['BreadcrumbItem', <BreadcrumbItem key="item" />],
      ['BreadcrumbList', <BreadcrumbList key="list" />],
      ['BreadcrumbLink', <BreadcrumbLink key="link" />],
      ['BreadcrumbSeparator', <BreadcrumbSeparator key="separator" />],
    ])('throws when %s has no Breadcrumb', (name, element) => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
      expect(() => render(element)).toThrow(`${name} must be used within a <Breadcrumb>`)
      error.mockRestore()
    })
  })
})
