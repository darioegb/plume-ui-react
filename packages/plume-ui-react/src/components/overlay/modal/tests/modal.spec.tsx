import { fireEvent, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { ThemeProvider } from '../../../../theme'
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTrigger,
  type ModalProps,
} from '..'

function Example(props: Readonly<Omit<ModalProps, 'children'>>): React.ReactNode {
  return (
    <Modal {...props}>
      <ModalTrigger>
        <button>Open</button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>Title</ModalHeader>
        <ModalBody>
          <input aria-label="Name" />
        </ModalBody>
        <ModalFooter>
          <ModalClose>
            <button>Cancel</button>
          </ModalClose>
        </ModalFooter>
        <ModalClose />
      </ModalContent>
    </Modal>
  )
}

const dialog = (): HTMLElement => screen.getByRole('dialog')

describe('Modal component', () => {
  describe('opening and closing', () => {
    it('is closed at first and opens from the trigger', async () => {
      render(<Example />)
      expect(screen.queryByRole('dialog')).toBeNull()

      await userEvent.click(screen.getByText('Open'))
      expect(dialog()).toBeInTheDocument()
    })

    it('can be open at first', () => {
      render(<Example defaultOpen />)
      expect(dialog()).toBeInTheDocument()
    })

    it('closes with the X button', async () => {
      render(<Example defaultOpen />)
      await userEvent.click(screen.getByRole('button', { name: 'Close' }))
      expect(screen.queryByRole('dialog')).toBeNull()
    })

    it('closes with an element of the footer wrapped in a ModalClose', async () => {
      render(<Example defaultOpen />)
      await userEvent.click(screen.getByText('Cancel'))
      expect(screen.queryByRole('dialog')).toBeNull()
    })

    it('closes with Escape', async () => {
      render(<Example defaultOpen />)
      await userEvent.keyboard('{Escape}')
      expect(screen.queryByRole('dialog')).toBeNull()
    })

    it('closes with a click on the backdrop but not inside the dialog', async () => {
      render(<Example defaultOpen />)
      await userEvent.click(screen.getByText('Title'))
      expect(dialog()).toBeInTheDocument()

      await userEvent.click(dialog().parentElement as HTMLElement)
      expect(screen.queryByRole('dialog')).toBeNull()
    })

    it('stays open on Escape when closeOnEscape is off', async () => {
      render(<Example closeOnEscape={false} defaultOpen />)
      await userEvent.keyboard('{Escape}')
      expect(dialog()).toBeInTheDocument()
    })

    it('stays open on a click on the backdrop when closeOnOutside is off', async () => {
      render(<Example closeOnOutside={false} defaultOpen />)
      await userEvent.click(dialog().parentElement as HTMLElement)
      expect(dialog()).toBeInTheDocument()
    })
  })

  describe('controlled', () => {
    function Controlled({
      onOpenChange,
    }: Readonly<{ onOpenChange?: (open: boolean) => void }>): React.ReactNode {
      const [open, setOpen] = useState(false)
      return (
        <>
          <button onClick={() => setOpen(true)}>Outside</button>
          <Modal
            onOpenChange={(next) => {
              onOpenChange?.(next)
              setOpen(next)
            }}
            open={open}
          >
            <ModalContent aria-label="Controlled">
              <ModalClose />
            </ModalContent>
          </Modal>
        </>
      )
    }

    it('follows the open prop and reports the changes', async () => {
      const onOpenChange = vi.fn()
      render(<Controlled onOpenChange={onOpenChange} />)

      await userEvent.click(screen.getByText('Outside'))
      expect(screen.getByRole('dialog', { name: 'Controlled' })).toBeInTheDocument()

      await userEvent.click(screen.getByRole('button', { name: 'Close' }))
      expect(screen.queryByRole('dialog')).toBeNull()
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })

    it('does not close by itself when the parent keeps it open', async () => {
      const onOpenChange = vi.fn()
      render(
        <Modal onOpenChange={onOpenChange} open>
          <ModalContent aria-label="Pinned">
            <ModalClose />
          </ModalContent>
        </Modal>,
      )
      await userEvent.click(screen.getByRole('button', { name: 'Close' }))
      expect(onOpenChange).toHaveBeenCalledWith(false)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('reports the opening from the trigger of an uncontrolled Modal', async () => {
      const onOpenChange = vi.fn()
      render(<Example onOpenChange={onOpenChange} />)
      await userEvent.click(screen.getByText('Open'))
      expect(onOpenChange).toHaveBeenCalledWith(true)
    })
  })

  describe('accessibility', () => {
    it('is a modal dialog named by its header', () => {
      render(<Example defaultOpen />)
      const element = screen.getByRole('dialog', { name: 'Title' })
      expect(element).toHaveAttribute('aria-modal', 'true')
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Title')
    })

    it('is named by aria-label when there is no header', () => {
      render(
        <Modal defaultOpen>
          <ModalContent aria-label="Settings" />
        </Modal>,
      )
      expect(screen.getByRole('dialog', { name: 'Settings' })).not.toHaveAttribute(
        'aria-labelledby',
      )
    })

    it('takes aria-labelledby and aria-describedby', () => {
      render(
        <>
          <span id="other">Other name</span>
          <Modal defaultOpen>
            <ModalContent aria-describedby="other" aria-labelledby="other" />
          </Modal>
        </>,
      )
      expect(screen.getByRole('dialog', { name: 'Other name' })).toHaveAccessibleDescription(
        'Other name',
      )
    })

    it('lets the heading level be chosen', () => {
      render(
        <Modal defaultOpen>
          <ModalContent>
            <ModalHeader as="h3">Title</ModalHeader>
          </ModalContent>
        </Modal>,
      )
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument()
    })

    it('tells the trigger what it opens', async () => {
      render(<Example />)
      const trigger = screen.getByText('Open')
      expect(trigger).toHaveAttribute('aria-haspopup', 'dialog')
      expect(trigger).toHaveAttribute('aria-expanded', 'false')

      await userEvent.click(trigger)
      expect(trigger).toHaveAttribute('aria-expanded', 'true')
    })

    it('renders a button for a trigger that is text', async () => {
      render(
        <Modal>
          <ModalTrigger className="mine">Open it</ModalTrigger>
          <ModalContent aria-label="Text trigger" />
        </Modal>,
      )
      const trigger = screen.getByRole('button', { name: 'Open it' })
      expect(trigger).toHaveClass('mine')
      expect(trigger).toHaveAttribute('type', 'button')

      await userEvent.click(trigger)
      expect(dialog()).toBeInTheDocument()
    })

    it('names the X button, and lets the name be set', () => {
      const { rerender } = render(
        <Modal defaultOpen>
          <ModalContent aria-label="Close test">
            <ModalClose />
          </ModalContent>
        </Modal>,
      )
      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()

      rerender(
        <Modal defaultOpen>
          <ModalContent aria-label="Close test">
            <ModalClose label="Dismiss" />
          </ModalContent>
        </Modal>,
      )
      expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument()
    })

    it('uses the text of a ModalClose as its name', () => {
      render(
        <Modal defaultOpen>
          <ModalContent aria-label="Close text">
            <ModalClose>Got it</ModalClose>
          </ModalContent>
        </Modal>,
      )
      const button = screen.getByRole('button', { name: 'Got it' })
      expect(button).not.toHaveAttribute('aria-label')
    })
  })

  describe('focus', () => {
    it('moves the focus into the dialog', async () => {
      render(<Example />)
      await userEvent.click(screen.getByText('Open'))
      expect(screen.getByLabelText('Name')).toHaveFocus()
    })

    it('goes to the element given by initialFocus', () => {
      function WithInitialFocus(): React.ReactNode {
        const ref = createRef<HTMLButtonElement>()
        return (
          <Modal defaultOpen initialFocus={ref}>
            <ModalContent aria-label="Initial focus">
              <input aria-label="First" />
              <button ref={ref}>Second</button>
            </ModalContent>
          </Modal>
        )
      }
      render(<WithInitialFocus />)
      expect(screen.getByText('Second')).toHaveFocus()
    })

    it('keeps the focus inside while tabbing', async () => {
      render(<Example defaultOpen />)
      const name = screen.getByLabelText('Name')
      const cancel = screen.getByText('Cancel')
      const close = screen.getByRole('button', { name: 'Close' })
      expect(name).toHaveFocus()

      await userEvent.tab()
      expect(cancel).toHaveFocus()
      await userEvent.tab()
      expect(close).toHaveFocus()
      await userEvent.tab()
      expect(name).toHaveFocus()
      await userEvent.tab({ shift: true })
      expect(close).toHaveFocus()
    })

    it('gives the focus back to the trigger when it closes', async () => {
      render(<Example />)
      const trigger = screen.getByText('Open')
      await userEvent.click(trigger)
      await userEvent.keyboard('{Escape}')
      expect(trigger).toHaveFocus()
    })
  })

  describe('a body that scrolls', () => {
    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('can take the focus, so a keyboard user can scroll it', () => {
      vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(500)
      vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(200)
      render(<Example defaultOpen />)

      const body = screen.getByLabelText('Name').parentElement as HTMLElement
      expect(body).toHaveAttribute('tabindex', '0')
      expect(screen.getByRole('region', { name: 'Title' })).toBe(body)
    })

    it('is not a stop for the keyboard when it fits', () => {
      render(<Example defaultOpen />)
      const body = screen.getByLabelText('Name').parentElement as HTMLElement
      expect(body).not.toHaveAttribute('tabindex')
      expect(body).not.toHaveAttribute('role')
    })
  })

  describe('page scroll', () => {
    it('locks the scroll of the page while it is open', async () => {
      render(<Example />)
      await userEvent.click(screen.getByText('Open'))
      expect(document.body.style.overflow).toBe('hidden')

      await userEvent.keyboard('{Escape}')
      expect(document.body.style.overflow).toBe('')
    })
  })

  describe('nesting', () => {
    function Nested(): React.ReactNode {
      return (
        <Modal defaultOpen>
          <ModalContent aria-label="First">
            <Modal>
              <ModalTrigger>
                <button>Open second</button>
              </ModalTrigger>
              <ModalContent aria-label="Second" />
            </Modal>
          </ModalContent>
        </Modal>
      )
    }

    it('closes only the one on top', async () => {
      render(<Nested />)
      await userEvent.click(screen.getByText('Open second'))
      expect(screen.getAllByRole('dialog')).toHaveLength(2)

      await userEvent.keyboard('{Escape}')
      expect(screen.getAllByRole('dialog')).toHaveLength(1)
      expect(screen.getByRole('dialog', { name: 'First' })).toBeInTheDocument()

      await userEvent.keyboard('{Escape}')
      expect(screen.queryByRole('dialog')).toBeNull()
    })
  })

  describe('styling', () => {
    it('applies the classes of the size to the dialog', () => {
      render(<Example defaultOpen size="lg" />)
      expect(dialog()).toHaveClass('content', 'lg')
      expect(dialog().parentElement).toHaveClass('backdrop')
    })

    it('is medium by default', () => {
      render(<Example defaultOpen />)
      expect(dialog()).toHaveClass('md')
    })

    it('styles the parts', () => {
      render(<Example defaultOpen />)
      expect(screen.getByText('Title')).toHaveClass('header')
      expect(screen.getByLabelText('Name').parentElement).toHaveClass('body')
      expect(screen.getByText('Cancel').parentElement).toHaveClass('footer')
      expect(screen.getByRole('button', { name: 'Close' })).toHaveClass('close')
    })

    it('keeps the className and style of every part, and forwards their refs', () => {
      const refs = {
        body: createRef<HTMLElement>(),
        close: createRef<HTMLElement>(),
        content: createRef<HTMLDialogElement>(),
        footer: createRef<HTMLDivElement>(),
        header: createRef<HTMLHeadingElement>(),
      }
      render(
        <Modal defaultOpen>
          <ModalContent className="c" ref={refs.content} style={{ width: '120px' }}>
            <ModalHeader className="h" ref={refs.header} style={{ width: '121px' }}>
              Title
            </ModalHeader>
            <ModalBody className="b" ref={refs.body} style={{ width: '122px' }}>
              Body
            </ModalBody>
            <ModalFooter className="f" ref={refs.footer} style={{ width: '123px' }}>
              Footer
            </ModalFooter>
            <ModalClose className="x" ref={refs.close} style={{ width: '124px' }} />
          </ModalContent>
        </Modal>,
      )
      expect(refs.content.current).toBe(dialog())
      expect(dialog()).toHaveClass('content', 'c')
      expect(dialog()).toHaveStyle({ width: '120px' })
      expect(refs.header.current).toBe(screen.getByText('Title'))
      expect(screen.getByText('Title')).toHaveClass('header', 'h')
      expect(screen.getByText('Title')).toHaveStyle({ width: '121px' })
      expect(refs.body.current).toBe(screen.getByText('Body'))
      expect(screen.getByText('Body')).toHaveClass('body', 'b')
      expect(screen.getByText('Body')).toHaveStyle({ width: '122px' })
      expect(refs.footer.current).toBe(screen.getByText('Footer'))
      expect(screen.getByText('Footer')).toHaveClass('footer', 'f')
      expect(screen.getByText('Footer')).toHaveStyle({ width: '123px' })
      expect(refs.close.current).toBe(screen.getByRole('button', { name: 'Close' }))
      expect(screen.getByRole('button', { name: 'Close' })).toHaveClass('close', 'x')
      expect(screen.getByRole('button', { name: 'Close' })).toHaveStyle({ width: '124px' })
    })

    it('drops the Plume classes when unstyled', () => {
      render(
        <Modal defaultOpen variant="unstyled">
          <ModalContent className="mine">
            <ModalHeader className="h">Title</ModalHeader>
            <ModalBody className="b">Body</ModalBody>
            <ModalFooter className="f">Footer</ModalFooter>
            <ModalClose className="x" />
          </ModalContent>
        </Modal>,
      )
      expect(dialog()).toHaveClass('mine')
      expect(dialog()).not.toHaveClass('content')
      expect(dialog().parentElement).not.toHaveClass('backdrop')
      expect(screen.getByText('Title')).not.toHaveClass('header')
      expect(screen.getByText('Body')).not.toHaveClass('body')
      expect(screen.getByText('Footer')).not.toHaveClass('footer')
      expect(screen.getByRole('button', { name: 'Close' })).not.toHaveClass('close')
    })
  })

  describe('rendering', () => {
    it('renders into the root of the ThemeProvider', () => {
      render(
        <ThemeProvider>
          <Example defaultOpen />
        </ThemeProvider>,
      )
      expect(dialog().closest('[style*="--plume"]')).not.toBeNull()
    })

    it('throws when a part is used outside of a Modal', () => {
      vi.spyOn(console, 'error').mockImplementation(() => undefined)
      expect(() => render(<ModalContent />)).toThrow('ModalContent must be used within a <Modal>')
      expect(() => render(<ModalTrigger>Open</ModalTrigger>)).toThrow(
        'ModalTrigger must be used within a <Modal>',
      )
      expect(() => render(<ModalHeader>Title</ModalHeader>)).toThrow(
        'ModalHeader must be used within a <Modal>',
      )
      expect(() => render(<ModalBody />)).toThrow('ModalBody must be used within a <Modal>')
      expect(() => render(<ModalFooter />)).toThrow('ModalFooter must be used within a <Modal>')
      expect(() => render(<ModalClose />)).toThrow('ModalClose must be used within a <Modal>')
    })

    it('does not close when a pointer goes down inside the dialog', () => {
      render(<Example defaultOpen />)
      fireEvent.pointerDown(screen.getByLabelText('Name'))
      expect(dialog()).toBeInTheDocument()
    })
  })

  describe('backdrop', () => {
    it('takes a class next to the Plume one', () => {
      render(
        <Modal defaultOpen>
          <ModalContent classNames={{ backdrop: 'my-backdrop' }} aria-label="Name">
            Body
          </ModalContent>
        </Modal>,
      )
      const backdrop = screen.getByRole('dialog').parentElement
      expect(backdrop).toHaveClass('backdrop', 'my-backdrop')
      expect(backdrop).toHaveAttribute('data-plume-modal-backdrop')
    })

    it('has only the class of the user when unstyled', () => {
      render(
        <Modal defaultOpen variant="unstyled">
          <ModalContent classNames={{ backdrop: 'my-backdrop' }} aria-label="Name">
            Body
          </ModalContent>
        </Modal>,
      )
      expect(screen.getByRole('dialog').parentElement).toHaveAttribute('class', 'my-backdrop')
    })

    it('has no class attribute when unstyled and there is none', () => {
      render(
        <Modal defaultOpen variant="unstyled">
          <ModalContent aria-label="Name">Body</ModalContent>
        </Modal>,
      )
      expect(screen.getByRole('dialog').parentElement).not.toHaveAttribute('class')
    })
  })
})
