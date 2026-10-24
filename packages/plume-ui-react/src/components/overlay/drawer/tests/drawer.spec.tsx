import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef } from 'react'
import {
  Drawer,
  DrawerBackdrop,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
  type DrawerProps,
} from '..'

function Example(props: Readonly<Omit<DrawerProps, 'children'>>): React.ReactNode {
  return (
    <Drawer {...props}>
      <DrawerTrigger>
        <button>Open</button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>Filters</DrawerHeader>
        <DrawerBody>
          <input aria-label="Name" />
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose>
            <button>Cancel</button>
          </DrawerClose>
        </DrawerFooter>
        <DrawerClose />
      </DrawerContent>
    </Drawer>
  )
}

const dialog = (): HTMLElement => screen.getByRole('dialog')

describe('Drawer component', () => {
  it('is closed at first and opens from the trigger', async () => {
    render(<Example />)
    expect(screen.queryByRole('dialog')).toBeNull()
    await userEvent.click(screen.getByText('Open'))
    expect(dialog()).toBeInTheDocument()
  })

  it('is a modal dialog named by its header', () => {
    render(<Example defaultOpen />)
    expect(dialog()).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByRole('dialog', { name: 'Filters' })).toBeInTheDocument()
  })

  it('closes with the X, a close button, Escape and the backdrop', async () => {
    render(<Example defaultOpen />)
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('dialog')).toBeNull()

    const { unmount } = render(<Example defaultOpen />)
    await userEvent.click(screen.getByText('Cancel'))
    expect(screen.queryByRole('dialog')).toBeNull()
    unmount()

    render(<Example defaultOpen />)
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('closes with a click on the backdrop unless it is persistent', async () => {
    const { unmount } = render(<Example defaultOpen />)
    await userEvent.click(dialog().parentElement as HTMLElement)
    expect(screen.queryByRole('dialog')).toBeNull()
    unmount()

    render(<Example closeOnOutside={false} defaultOpen />)
    await userEvent.click(dialog().parentElement as HTMLElement)
    expect(dialog()).toBeInTheDocument()
  })

  it('keeps the state in sync when it is controlled', async () => {
    const onOpenChange = vi.fn()
    render(<Example onOpenChange={onOpenChange} open />)
    await userEvent.keyboard('{Escape}')
    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(dialog()).toBeInTheDocument()
  })

  it('comes from the right by default', () => {
    render(<Example defaultOpen />)
    expect(dialog()).toHaveAttribute('data-side', 'right')
    expect(dialog()).toHaveClass('drawer', 'right', 'md')
    expect(dialog().parentElement).toHaveClass('backdrop', 'rightBackdrop')
  })

  it.each(['left', 'right', 'top', 'bottom'] as const)('comes from the %s', (side) => {
    render(<Example defaultOpen side={side} />)
    expect(dialog()).toHaveAttribute('data-side', side)
    expect(dialog()).toHaveClass(side)
    expect(dialog().parentElement).toHaveClass(`${side}Backdrop`)
  })

  it.each(['sm', 'md', 'lg'] as const)('supports the %s size', (size) => {
    render(<Example defaultOpen size={size} />)
    expect(dialog()).toHaveClass(size)
  })

  it('has rounded corners by default and can be square', () => {
    const { unmount } = render(<Example defaultOpen />)
    expect(dialog()).not.toHaveClass('square')
    unmount()

    render(<Example defaultOpen shape="square" />)
    expect(dialog()).toHaveClass('square')
  })

  it('drops the Plume classes when unstyled but keeps the side', () => {
    render(<Example defaultOpen side="left" variant="unstyled" />)
    expect(dialog()).not.toHaveClass('drawer')
    expect(dialog()).toHaveAttribute('data-side', 'left')
    expect(dialog().parentElement).not.toHaveClass('backdrop')
  })

  it('takes the classes of the dialog and of a composed backdrop', () => {
    render(
      <Drawer defaultOpen>
        <DrawerBackdrop className="my-backdrop">
          <DrawerContent className="my-drawer">
            <DrawerHeader>Title</DrawerHeader>
          </DrawerContent>
        </DrawerBackdrop>
      </Drawer>,
    )
    expect(dialog()).toHaveClass('drawer', 'my-drawer')
    expect(dialog().parentElement).toHaveClass('backdrop', 'rightBackdrop', 'my-backdrop')
    expect(dialog().parentElement).toHaveAttribute('data-side', 'right')
    expect(document.querySelectorAll('[data-plume-modal-backdrop]')).toHaveLength(1)
  })

  it('renders the backdrop of the side by default and none of the Plume classes when unstyled', () => {
    const { unmount } = render(<Example defaultOpen side="top" />)
    expect(dialog().parentElement).toHaveClass('backdrop', 'topBackdrop')
    expect(dialog().parentElement).toHaveAttribute('data-side', 'top')
    unmount()
    render(
      <Drawer defaultOpen variant="unstyled">
        <DrawerBackdrop className="mine">
          <DrawerContent aria-label="Panel">Body</DrawerContent>
        </DrawerBackdrop>
      </Drawer>,
    )
    expect(dialog().parentElement).toHaveAttribute('class', 'mine')
  })

  it('forwards the ref of the backdrop', () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <Drawer defaultOpen>
        <DrawerBackdrop ref={ref}>
          <DrawerContent aria-label="Panel">Body</DrawerContent>
        </DrawerBackdrop>
      </Drawer>,
    )
    expect(ref.current).toBe(dialog().parentElement)
  })

  it('throws when the backdrop is outside a Drawer', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => render(<DrawerBackdrop>x</DrawerBackdrop>)).toThrow(
      'DrawerBackdrop must be used within a <Drawer>',
    )
    error.mockRestore()
  })

  it('forwards the refs of its parts', () => {
    const content = createRef<HTMLDialogElement>()
    const header = createRef<HTMLHeadingElement>()
    const body = createRef<HTMLElement>()
    const footer = createRef<HTMLDivElement>()
    const trigger = createRef<HTMLElement>()
    render(
      <Drawer defaultOpen>
        <DrawerTrigger ref={trigger}>Open</DrawerTrigger>
        <DrawerContent ref={content}>
          <DrawerHeader ref={header}>Title</DrawerHeader>
          <DrawerBody ref={body}>Body</DrawerBody>
          <DrawerFooter ref={footer}>Footer</DrawerFooter>
        </DrawerContent>
      </Drawer>,
    )
    expect(content.current).toBe(dialog())
    expect(header.current).toHaveTextContent('Title')
    expect(body.current).toHaveTextContent('Body')
    expect(footer.current).toHaveTextContent('Footer')
    expect(trigger.current).toHaveTextContent('Open')
  })

  it('needs a Drawer around its content', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() =>
      render(
        <DrawerContent>
          <p>Content</p>
        </DrawerContent>,
      ),
    ).toThrow('DrawerContent must be used within a <Drawer>')
    error.mockRestore()
  })
})
