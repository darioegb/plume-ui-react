import type { StoryObj, Meta } from '@storybook/react-vite'
import { useRef, useState } from 'react'
import { Button } from '../../../interaction/button'
import { Input } from '../../../form/input'
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
 * keeps the state and shares it with its parts.
 *
 * ### Subcomponents
 *
 * | Component | Props |
 * | --- | --- |
 * | `ModalTrigger` | `children`. One element, such as a `Button`, which gets the click handler and the `aria-*` attributes. With text, it renders a plain `<button>`. |
 * | `ModalContent` | `className`, `style`, `aria-label`, `aria-labelledby`, `aria-describedby`, `children`. The dialog. It is named by the `ModalHeader`, or by `aria-label` when there is none. |
 * | `ModalHeader` | `as` (`h1` to `h6`, `h2` by default), `className`, `style`, `children`. The title, which names the dialog. |
 * | `ModalBody` | `className`, `style`, `children`. The content. It scrolls when it is taller than the screen. |
 * | `ModalFooter` | `className`, `style`, `children`. A row for the actions. |
 * | `ModalClose` | `label`, `className`, `style`, `children`. A button that closes the Modal. Without children it is the corner X button, named by `label` (`Close` by default). With an element, such as a `Button`, it gives it the click handler. |
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
      importNames: [
        'Modal',
        'ModalTrigger',
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
    children: {
      control: false,
      description: 'The `ModalTrigger` and the `ModalContent`.',
      table: { type: { summary: 'ReactNode' } },
    },
    size: {
      control: 'radio',
      description: 'Maximum width of the dialog.',
      options: ['sm', 'md', 'lg'],
      table: { type: { summary: `"sm" | "md" | "lg"` }, defaultValue: { summary: 'md' } },
    },
    variant: {
      control: 'radio',
      description:
        'Visual variant. `default` has the backdrop, the surface and the spacing of the parts. `unstyled` drops the Plume styles so you can bring your own.',
      options: ['default', 'unstyled'],
      table: {
        type: { summary: `"default" | "unstyled"` },
        defaultValue: { summary: 'default' },
      },
    },
    open: {
      control: 'boolean',
      description:
        'Whether the Modal is open, for a controlled Modal. Pair it with `onOpenChange`.',
      table: { type: { summary: 'boolean' } },
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Whether the Modal is open at first, for an uncontrolled Modal.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Whether <kbd>Esc</kbd> closes the Modal.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
    closeOnOutside: {
      control: 'boolean',
      description: 'Whether a click on the backdrop closes the Modal.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
    initialFocus: {
      control: false,
      description:
        'A ref to the element that gets the focus when the Modal opens. By default, the first element that can be focused.',
      table: { type: { summary: 'RefObject<HTMLElement | null>' } },
    },
    onOpenChange: {
      control: false,
      description: 'Called with the new state when the Modal opens or closes.',
      table: { category: 'Events', type: { summary: '(open: boolean) => void' } },
    },
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
