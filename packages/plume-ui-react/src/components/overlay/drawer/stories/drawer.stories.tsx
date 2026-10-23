import type { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { Button } from '../../../interaction/button'
import { Field } from '../../../form/field'
import { Input } from '../../../form/input'
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
  type DrawerProps,
} from '..'

function Example({
  label = 'Open drawer',
  ...props
}: Readonly<Omit<DrawerProps, 'children'> & { label?: string }>): React.ReactNode {
  return (
    <Drawer {...props}>
      <DrawerTrigger>
        <Button label={label} />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>Filters</DrawerHeader>
        <DrawerBody>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Field label="Name">
              <Input />
            </Field>
            <Field label="Email">
              <Input type="email" />
            </Field>
          </div>
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose>
            <Button label="Cancel" variant="ghost" />
          </DrawerClose>
          <DrawerClose>
            <Button label="Apply" />
          </DrawerClose>
        </DrawerFooter>
        <DrawerClose />
      </DrawerContent>
    </Drawer>
  )
}

/**
 * A panel that slides in from an edge of the screen and blocks the page until it is closed, for the filters of a
 * list, the details of a row or a short form. It is a `Modal` that sticks to a side: the focus moves into it when
 * it opens, stays inside while the user tabs and goes back to the trigger when it closes, the page behind doesn't
 * scroll, and <kbd>Esc</kbd> or a click on the backdrop close it. It is not the `Sidebar`, which is the
 * navigation of the app and stays on the page.
 *
 * Compose it with `DrawerTrigger`, `DrawerContent` and the parts you need. The `Drawer` itself renders nothing: it
 * keeps the state and shares it with its parts. Its props, apart from **side** and **shape**, are the ones of `Modal`.
 *
 * ### Subcomponents
 *
 * | Component | Props |
 * | --- | --- |
 * | `DrawerTrigger` | `children`. One element, such as a `Button`, which gets the click handler and the `aria-*` attributes. With text, it renders a plain `<button>`. |
 * | `DrawerContent` | `className`, `classNames.backdrop`, `style`, `aria-label`, `aria-labelledby`, `aria-describedby`, `children`. The panel. It is named by the `DrawerHeader`, or by `aria-label` when there is none. `classNames.backdrop` styles the layer behind it. |
 * | `DrawerHeader` | `as` (`h1` to `h6`, `h2` by default), `className`, `style`, `children`. The title, which names the panel. |
 * | `DrawerBody` | `className`, `style`, `children`. The content. It scrolls when it is taller than the screen. |
 * | `DrawerFooter` | `className`, `style`, `children`. A row for the actions. |
 * | `DrawerClose` | `label`, `className`, `style`, `children`. A button that closes the Drawer. Without children it is the corner X button, named by `label` (`Close` by default). With an element, such as a `Button`, it gives it the click handler. |
 *
 * With `variant="unstyled"` the Plume styles are dropped, but the `DrawerContent` keeps `data-side`, so you can
 * place and animate it with your own classes.
 */
export default {
  title: 'Components/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      story: { inline: false, iframeHeight: 520 },
      importNames: [
        'Drawer',
        'DrawerTrigger',
        'DrawerContent',
        'DrawerHeader',
        'DrawerBody',
        'DrawerFooter',
        'DrawerClose',
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
      description: 'The `DrawerTrigger` and the `DrawerContent`.',
      table: { type: { summary: 'ReactNode' } },
    },
    side: {
      control: 'radio',
      description: 'The edge of the screen the panel comes from.',
      options: ['left', 'right', 'top', 'bottom'],
      table: {
        type: { summary: `"left" | "right" | "top" | "bottom"` },
        defaultValue: { summary: 'right' },
      },
    },
    shape: {
      control: 'radio',
      description:
        'Corners of the panel: `rounded` rounds the ones that face the page and `square` leaves them sharp.',
      options: ['rounded', 'square'],
      table: { type: { summary: `"rounded" | "square"` }, defaultValue: { summary: 'rounded' } },
    },
    size: {
      control: 'radio',
      description:
        'Width of the panel when it comes from the left or the right, and maximum height when it comes from the top or the bottom.',
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
        'Whether the Drawer is open, for a controlled Drawer. Pair it with `onOpenChange`.',
      table: { type: { summary: 'boolean' } },
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Whether the Drawer is open at first, for an uncontrolled Drawer.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Whether <kbd>Esc</kbd> closes the Drawer.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
    closeOnOutside: {
      control: 'boolean',
      description: 'Whether a click on the backdrop closes the Drawer.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
    initialFocus: {
      control: false,
      description:
        'A ref to the element that gets the focus when the Drawer opens. By default, the first element that can be focused.',
      table: { type: { summary: 'RefObject<HTMLElement | null>' } },
    },
    onOpenChange: {
      control: false,
      description: 'Called with the new state when the Drawer opens or closes.',
      table: { category: 'Events', type: { summary: '(open: boolean) => void' } },
    },
  },
  render: (args) => <Example {...args} />,
} satisfies Meta<typeof Drawer>

type Story = StoryObj<typeof Drawer>

/**
 * This is the default Drawer, which comes from the right. The trigger opens it, and the X, a button of the
 * footer, <kbd>Esc</kbd> or a click on the backdrop close it.
 */
export const Default: Story = {}

/**
 * Use the **side** prop to choose the edge it comes from: `left`, `right`, `top` or `bottom`.
 */
export const Sides: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center gap-3">
      {(['left', 'right', 'top', 'bottom'] as const).map((side) => (
        <Example key={side} label={`From the ${side}`} side={side} />
      ))}
    </div>
  ),
}

/**
 * Use the **shape** prop to choose between `rounded` corners, which is the default, and `square` ones.
 */
export const Shapes: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center gap-3">
      {(['rounded', 'square'] as const).map((shape) => (
        <Example key={shape} label={`Shape ${shape}`} shape={shape} />
      ))}
    </div>
  ),
}

/**
 * Use the **size** prop to change the width of a side panel, or the maximum height of one from the top or the
 * bottom.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center gap-3">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Example key={size} label={`Size ${size}`} size={size} />
      ))}
    </div>
  ),
}

function ControlledExample(): React.ReactNode {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col items-center gap-3">
      <Button
        label={open ? 'Close the drawer' : 'Open the drawer'}
        onClick={() => setOpen(!open)}
      />
      <p className="text-sm">The drawer is {open ? 'open' : 'closed'}.</p>
      <Drawer onOpenChange={setOpen} open={open}>
        <DrawerContent>
          <DrawerHeader>Controlled drawer</DrawerHeader>
          <DrawerBody>Its state lives in the component that renders it.</DrawerBody>
          <DrawerClose />
        </DrawerContent>
      </Drawer>
    </div>
  )
}

/**
 * Pass **open** and **onOpenChange** to keep the state yourself, for example to open the Drawer from somewhere
 * that is not a trigger.
 */
export const Controlled: Story = {
  render: () => <ControlledExample />,
}

/**
 * The body scrolls when the content is taller than the screen, while the header and the footer stay in view.
 */
export const LongContent: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger>
        <Button label="Open drawer" />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>Activity</DrawerHeader>
        <DrawerBody>
          {Array.from({ length: 24 }, (_, index) => (
            <p className="mb-3" key={index}>
              Item {index + 1} of the activity of the project.
            </p>
          ))}
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose>
            <Button label="Done" />
          </DrawerClose>
        </DrawerFooter>
        <DrawerClose />
      </DrawerContent>
    </Drawer>
  ),
}

/**
 * With `closeOnOutside={false}` and `closeOnEscape={false}` the Drawer only closes from its own buttons, which
 * suits a form the user must finish or cancel.
 */
export const Persistent: Story = {
  render: () => <Example closeOnEscape={false} closeOnOutside={false} />,
}

/**
 * Some examples of Drawer with Tailwind classes. With `variant="unstyled"` the Drawer and its parts have no Plume styles, so each takes the classes you give it. The `DrawerContent` keeps `data-side`, and here Tailwind positions the panel with it.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Drawer side="right" variant="unstyled">
  <DrawerTrigger>
    <Button
      className="rounded bg-blue-700 px-[1rem] py-[0.5rem] text-sm font-semibold text-white hover:bg-blue-800"
      label="Open drawer"
      variant="unstyled"
    />
  </DrawerTrigger>
  <DrawerContent classNames={{ backdrop: 'flex justify-end bg-black/50' }}
   
    className="flex h-full w-80 max-w-full flex-col bg-surface text-foreground shadow-xl"
  >
    <DrawerHeader className="border-b border-border px-[1.25rem] py-[1rem] text-lg font-semibold">
      Filters
    </DrawerHeader>
    <DrawerBody className="flex-1 overflow-y-auto px-[1.25rem] py-[1rem] text-sm">
      Choose what the list shows.
    </DrawerBody>
    <DrawerFooter className="flex justify-end gap-2 border-t border-border px-[1.25rem] py-[0.75rem]">
      <DrawerClose>
        <Button
          className="rounded bg-blue-700 px-[1rem] py-[0.5rem] text-sm font-semibold text-white hover:bg-blue-800"
          label="Apply"
          variant="unstyled"
        />
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>`,
      },
    },
  },
  render: () => (
    <Drawer side="right" variant="unstyled">
      <DrawerTrigger>
        <Button
          className="rounded bg-blue-700 px-[1rem] py-[0.5rem] text-sm font-semibold text-white hover:bg-blue-800"
          label="Open drawer"
          variant="unstyled"
        />
      </DrawerTrigger>
      <DrawerContent classNames={{ backdrop: 'flex justify-end bg-black/50' }}
       
        className="flex h-full w-80 max-w-full flex-col bg-surface text-foreground shadow-xl"
      >
        <DrawerHeader className="border-b border-border px-[1.25rem] py-[1rem] text-lg font-semibold">
          Filters
        </DrawerHeader>
        <DrawerBody className="flex-1 overflow-y-auto px-[1.25rem] py-[1rem] text-sm">
          Choose what the list shows.
        </DrawerBody>
        <DrawerFooter className="flex justify-end gap-2 border-t border-border px-[1.25rem] py-[0.75rem]">
          <DrawerClose>
            <Button
              className="rounded bg-blue-700 px-[1rem] py-[0.5rem] text-sm font-semibold text-white hover:bg-blue-800"
              label="Apply"
              variant="unstyled"
            />
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}

/**
 * Some examples of Drawer with Bootstrap classes: the backdrop takes `d-flex` and `justify-content-end` to put the panel on the right, and the panel takes `offcanvas`-like classes of its own.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Drawer side="right" variant="unstyled">
  <DrawerTrigger>
    <Button className="btn btn-primary" label="Open drawer" variant="unstyled" />
  </DrawerTrigger>
  <DrawerContent classNames={{ backdrop: 'd-flex justify-content-end bg-black bg-opacity-50' }}
   
    className="d-flex flex-column h-100 bg-body shadow"
    style={{ width: '20rem', maxWidth: '100%' }}
  >
    <DrawerHeader className="fs-5 fw-semibold border-bottom px-3 py-3 m-0">Filters</DrawerHeader>
    <DrawerBody className="flex-grow-1 overflow-auto p-3">Choose what the list shows.</DrawerBody>
    <DrawerFooter className="d-flex justify-content-end gap-2 border-top p-3">
      <DrawerClose>
        <Button className="btn btn-primary" label="Apply" variant="unstyled" />
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>`,
      },
    },
  },
  render: () => (
    <Drawer side="right" variant="unstyled">
      <DrawerTrigger>
        <Button className="btn btn-primary" label="Open drawer" variant="unstyled" />
      </DrawerTrigger>
      <DrawerContent classNames={{ backdrop: 'd-flex justify-content-end bg-black bg-opacity-50' }}
       
        className="d-flex flex-column h-100 bg-body shadow"
        style={{ width: '20rem', maxWidth: '100%' }}
      >
        <DrawerHeader className="fs-5 fw-semibold border-bottom px-3 py-3 m-0">
          Filters
        </DrawerHeader>
        <DrawerBody className="flex-grow-1 overflow-auto p-3">
          Choose what the list shows.
        </DrawerBody>
        <DrawerFooter className="d-flex justify-content-end gap-2 border-top p-3">
          <DrawerClose>
            <Button className="btn btn-primary" label="Apply" variant="unstyled" />
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}
