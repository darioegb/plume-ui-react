import type { StoryObj, Meta } from '@storybook/react-vite'
import { useRef, useState } from 'react'
import { Button } from '../../../interaction/button'
import { Input } from '../../../form/input'
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTrigger,
  type ModalProps,
} from '..'

const text =
  'Deleting a project removes its files, its history and its members. This cannot be undone, so make sure you have a copy of what you need before you go on.'

function Example(props: Readonly<Omit<ModalProps, 'children'>>): React.ReactNode {
  return (
    <Modal {...props}>
      <ModalTrigger>
        <Button label="Open modal" />
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>Delete project</ModalHeader>
        <ModalBody>{text}</ModalBody>
        <ModalFooter>
          <ModalClose>
            <Button label="Cancel" variant="ghost" />
          </ModalClose>
          <ModalClose>
            <Button colorScheme="error" label="Delete" />
          </ModalClose>
        </ModalFooter>
        <ModalClose />
      </ModalContent>
    </Modal>
  )
}

/**
 * A dialog that asks for the user's attention and blocks the page until it is closed. The focus moves into it
 * when it opens, stays inside while the user tabs, and goes back to the trigger when it closes. The page behind
 * doesn't scroll. <kbd>Esc</kbd> and a click on the backdrop close it.
 *
 * Compose it with `ModalTrigger`, `ModalContent` and the parts you need. The `Modal` itself renders nothing: it
 * keeps the state and shares it with its parts. `ModalContent` draws the backdrop around itself; to style or
 * replace the layer, wrap `ModalContent` in a `ModalBackdrop`.
 *
 * The page behind the Modal is not hidden from screen readers with `inert`, because the Modal lives inside the
 * same root as the app. `aria-modal` and the focus trap keep the user inside.
 */
export default {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      story: { inline: false, iframeHeight: 520 },
      importNames: [
        'Modal',
        'ModalTrigger',
        'ModalBackdrop',
        'ModalContent',
        'ModalHeader',
        'ModalBody',
        'ModalFooter',
        'ModalClose',
      ],
      toc: {
        title: 'On this page',
        disable: false,
      },
    },
    layout: 'centered',
  },
  argTypes: {
    children: { control: false },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'radio', options: ['default', 'unstyled'] },
    open: { control: 'boolean' },
    defaultOpen: { control: 'boolean' },
    closeOnEscape: { control: 'boolean' },
    closeOnOutside: { control: 'boolean' },
    initialFocus: { control: false },
    onOpenChange: { control: false },
  },
  render: (args) => <Example {...args} />,
} satisfies Meta<typeof Modal>

type Story = StoryObj<typeof Modal>

/**
 * This is the default Modal. The trigger opens it, and the X, a button of the footer, <kbd>Esc</kbd> or a click
 * on the backdrop close it.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick how the Modal looks. `unstyled` drops the Plume styles, so the backdrop, the
 * surface and the parts are yours to style.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center gap-4">
      <Example variant="default" />
      <Modal variant="unstyled">
        <ModalTrigger>
          <Button label="Open unstyled modal" variant="outline" />
        </ModalTrigger>
        <ModalContent className="fixed inset-0 m-auto h-fit max-w-sm rounded-xl bg-white p-6 text-black shadow-2xl">
          <ModalHeader className="mb-2 text-lg font-bold">Unstyled</ModalHeader>
          <ModalBody className="mb-4">The Plume styles are gone.</ModalBody>
          <ModalFooter className="flex justify-end">
            <ModalClose>
              <Button label="Close" />
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  ),
}

/**
 * Use the **size** prop to change the maximum width of the dialog.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center gap-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Modal key={size} size={size}>
          <ModalTrigger>
            <Button label={`Open ${size}`} variant="outline" />
          </ModalTrigger>
          <ModalContent>
            <ModalHeader>Size {size}</ModalHeader>
            <ModalBody>{text}</ModalBody>
            <ModalFooter>
              <ModalClose>
                <Button label="Close" />
              </ModalClose>
            </ModalFooter>
          </ModalContent>
        </Modal>
      ))}
    </div>
  ),
}

function ControlledExample(): React.ReactNode {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex flex-col items-center gap-3">
      <Button label="Open from outside the Modal" onClick={() => setOpen(true)} />
      <p>The Modal is {open ? 'open' : 'closed'}.</p>
      <Modal onOpenChange={setOpen} open={open}>
        <ModalContent aria-label="Controlled modal">
          <ModalBody>{text}</ModalBody>
          <ModalFooter>
            <ModalClose>
              <Button label="Close" />
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

/**
 * Pass **open** and **onOpenChange** to control the Modal, and open it from anywhere, with no `ModalTrigger`.
 * Without a title, name the dialog with **aria-label** on the `ModalContent`. When it closes, the focus goes
 * back to the element that had it before.
 */
export const Controlled: Story = {
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col items-center gap-3">
      <Button label="Open from outside the Modal" onClick={() => setOpen(true)} />
      <p>The Modal is {open ? 'open' : 'closed'}.</p>
      <Modal onOpenChange={setOpen} open={open}>
        <ModalContent aria-label="Controlled modal">
          <ModalBody>This cannot be undone.</ModalBody>
          <ModalFooter>
            <ModalClose>
              <Button label="Close" />
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}`,
      },
    },
  },
  render: () => <ControlledExample />,
}

function InitialFocusExample(): React.ReactNode {
  const input = useRef<HTMLInputElement>(null)
  return (
    <Modal initialFocus={input}>
      <ModalTrigger>
        <Button label="Rename project" />
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>Rename project</ModalHeader>
        <ModalBody>
          <Input aria-label="Name" defaultValue="My project" ref={input} />
        </ModalBody>
        <ModalFooter>
          <ModalClose>
            <Button label="Cancel" variant="ghost" />
          </ModalClose>
          <ModalClose>
            <Button label="Save" />
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

/**
 * The focus goes to the first element that can take it. Pass **initialFocus** with a ref to choose another one,
 * as the field of a form.
 */
export const InitialFocus: Story = {
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const input = useRef<HTMLInputElement>(null)

  return (
    <Modal initialFocus={input}>
      <ModalTrigger>
        <Button label="Rename project" />
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>Rename project</ModalHeader>
        <ModalBody>
          <Input aria-label="Name" defaultValue="My project" ref={input} />
        </ModalBody>
        <ModalFooter>
          <ModalClose>
            <Button label="Cancel" variant="ghost" />
          </ModalClose>
          <ModalClose>
            <Button label="Save" />
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}`,
      },
    },
  },
  render: () => <InitialFocusExample />,
}

/**
 * When the content is taller than the screen, the body scrolls and the header and the footer stay in place.
 */
export const LongContent: Story = {
  render: () => (
    <Modal>
      <ModalTrigger>
        <Button label="Open long modal" />
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>Terms of service</ModalHeader>
        <ModalBody>
          {Array.from({ length: 12 }, (_, index) => (
            <p key={index}>{text}</p>
          ))}
        </ModalBody>
        <ModalFooter>
          <ModalClose>
            <Button label="Decline" variant="ghost" />
          </ModalClose>
          <ModalClose>
            <Button label="Accept" />
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
}

/**
 * Turn **closeOnEscape** and **closeOnOutside** off when the user has to decide, so only the buttons close the
 * Modal. Leave a way out inside it.
 */
export const Persistent: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Modal closeOnEscape={false} closeOnOutside={false}>
  <ModalTrigger>
    <Button label="Open modal" />
  </ModalTrigger>
  <ModalContent>
    <ModalHeader>Delete project</ModalHeader>
    <ModalBody>
      Deleting a project removes its files, its history and its members. This cannot be undone.
    </ModalBody>
    <ModalFooter>
      <ModalClose>
        <Button label="Cancel" variant="ghost" />
      </ModalClose>
      <ModalClose>
        <Button colorScheme="error" label="Delete" />
      </ModalClose>
    </ModalFooter>
    <ModalClose />
  </ModalContent>
</Modal>`,
      },
    },
  },
  render: () => <Example closeOnEscape={false} closeOnOutside={false} />,
}

/**
 * A Modal can open another one. <kbd>Esc</kbd> and a click outside only close the one on top, and the focus goes
 * back to where it was in each.
 */
export const Nested: Story = {
  render: () => (
    <Modal>
      <ModalTrigger>
        <Button label="Open first modal" />
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>First modal</ModalHeader>
        <ModalBody>This one opens another.</ModalBody>
        <ModalFooter>
          <Modal size="sm">
            <ModalTrigger>
              <Button label="Open second modal" variant="outline" />
            </ModalTrigger>
            <ModalContent>
              <ModalHeader>Second modal</ModalHeader>
              <ModalBody>Close this one and the first stays open.</ModalBody>
              <ModalFooter>
                <ModalClose>
                  <Button label="Close" />
                </ModalClose>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </ModalFooter>
        <ModalClose />
      </ModalContent>
    </Modal>
  ),
}

/**
 * `ModalContent` draws the backdrop around itself. To style the layer, or to put something else next to the
 * dialog, wrap `ModalContent` in a `ModalBackdrop`. It takes `className`, `style` and `ref`, and it renders
 * nothing while the Modal is closed.
 */
export const Compound: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Modal>
  <ModalTrigger>
    <Button label="Open modal" />
  </ModalTrigger>
  <ModalBackdrop style={{ backgroundColor: 'rgb(0 0 0 / 75%)' }}>
    <ModalContent>
      <ModalHeader>Delete project</ModalHeader>
      <ModalBody>This cannot be undone.</ModalBody>
      <ModalFooter>
        <ModalClose>
          <Button label="Cancel" variant="ghost" />
        </ModalClose>
      </ModalFooter>
    </ModalContent>
  </ModalBackdrop>
</Modal>`,
      },
    },
  },
  render: () => (
    <Modal>
      <ModalTrigger>
        <Button label="Open modal" />
      </ModalTrigger>
      <ModalBackdrop style={{ backgroundColor: 'rgb(0 0 0 / 75%)' }}>
        <ModalContent>
          <ModalHeader>Delete project</ModalHeader>
          <ModalBody>This cannot be undone.</ModalBody>
          <ModalFooter>
            <ModalClose>
              <Button label="Cancel" variant="ghost" />
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </ModalBackdrop>
    </Modal>
  ),
}

/**
 * Some examples of Modal with Tailwind classes. With `variant="unstyled"` every part is yours: `ModalBackdrop` is the layer behind the dialog (it is centered and covers the screen, nothing else), and each part takes its own `className`.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Modal variant="unstyled">
  <ModalTrigger>
    <Button
      className="rounded bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
      label="Open modal"
      variant="unstyled"
    />
  </ModalTrigger>
  <ModalBackdrop className="bg-black/50 p-[1rem]">
    <ModalContent
      className="w-full max-w-md rounded-xl bg-surface text-foreground shadow-xl"
    >
      <ModalHeader className="border-b border-border px-[1.25rem] py-[1rem] text-lg font-semibold">
        Delete project
      </ModalHeader>
      <ModalBody className="px-[1.25rem] py-[1rem] text-sm">
        Deleting a project removes its files, its history and its members. This cannot be undone.
      </ModalBody>
      <ModalFooter className="flex justify-end gap-2 border-t border-border px-[1.25rem] py-[0.75rem]">
        <ModalClose>
          <Button
            className="rounded px-4 py-2 text-sm font-semibold hover:bg-surface-muted"
            label="Cancel"
            variant="unstyled"
          />
        </ModalClose>
        <ModalClose>
          <Button
            className="rounded bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
            label="Delete"
            variant="unstyled"
          />
        </ModalClose>
      </ModalFooter>
    </ModalContent>
  </ModalBackdrop>
</Modal>`,
      },
    },
  },
  render: () => (
    <Modal variant="unstyled">
      <ModalTrigger>
        <Button
          className="rounded bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
          label="Open modal"
          variant="unstyled"
        />
      </ModalTrigger>
      <ModalBackdrop className="bg-black/50 p-[1rem]">
        <ModalContent
          className="w-full max-w-md rounded-xl bg-surface text-foreground shadow-xl"
        >
          <ModalHeader className="border-b border-border px-[1.25rem] py-[1rem] text-lg font-semibold">
            Delete project
          </ModalHeader>
          <ModalBody className="px-[1.25rem] py-[1rem] text-sm">
            Deleting a project removes its files, its history and its members. This cannot be undone.
          </ModalBody>
          <ModalFooter className="flex justify-end gap-2 border-t border-border px-[1.25rem] py-[0.75rem]">
            <ModalClose>
              <Button
                className="rounded px-4 py-2 text-sm font-semibold hover:bg-surface-muted"
                label="Cancel"
                variant="unstyled"
              />
            </ModalClose>
            <ModalClose>
              <Button
                className="rounded bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
                label="Delete"
                variant="unstyled"
              />
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </ModalBackdrop>
    </Modal>
  ),
}

/**
 * Some examples of Modal with Bootstrap classes. The backdrop takes `modal`, which defines the variables of `modal-content`, and `d-flex` to show it, and the dialog takes `modal-content` with the usual `modal-header`, `modal-body` and `modal-footer`.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Modal variant="unstyled">
  <ModalTrigger>
    <Button className="btn btn-primary" label="Open modal" variant="unstyled" />
  </ModalTrigger>
  <ModalBackdrop className="modal d-flex align-items-center justify-content-center bg-black bg-opacity-50 p-3">
    <ModalContent
      className="modal-content"
      style={{ maxWidth: '32rem' }}
    >
      <ModalHeader className="modal-header fs-5 fw-semibold">Delete project</ModalHeader>
      <ModalBody className="modal-body">
        Deleting a project removes its files, its history and its members. This cannot be undone.
      </ModalBody>
      <ModalFooter className="modal-footer">
        <ModalClose>
          <Button className="btn btn-secondary" label="Cancel" variant="unstyled" />
        </ModalClose>
        <ModalClose>
          <Button className="btn btn-danger" label="Delete" variant="unstyled" />
        </ModalClose>
      </ModalFooter>
    </ModalContent>
  </ModalBackdrop>
</Modal>`,
      },
    },
  },
  render: () => (
    <Modal variant="unstyled">
      <ModalTrigger>
        <Button className="btn btn-primary" label="Open modal" variant="unstyled" />
      </ModalTrigger>
      <ModalBackdrop className="modal d-flex align-items-center justify-content-center bg-black bg-opacity-50 p-3">
        <ModalContent
          className="modal-content"
          style={{ maxWidth: '32rem' }}
        >
          <ModalHeader className="modal-header fs-5 fw-semibold">Delete project</ModalHeader>
          <ModalBody className="modal-body">
            Deleting a project removes its files, its history and its members. This cannot be undone.
          </ModalBody>
          <ModalFooter className="modal-footer">
            <ModalClose>
              <Button className="btn btn-secondary" label="Cancel" variant="unstyled" />
            </ModalClose>
            <ModalClose>
              <Button className="btn btn-danger" label="Delete" variant="unstyled" />
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </ModalBackdrop>
    </Modal>
  ),
}
