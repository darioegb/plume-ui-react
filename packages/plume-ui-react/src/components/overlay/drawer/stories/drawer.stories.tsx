import type { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { Button } from '../../../interaction/button'
import { Field } from '../../../form/field'
import { Input } from '../../../form/input'
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
        'DrawerBackdrop',
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
    children: { control: false },
    side: { control: 'radio', options: ['left', 'right', 'top', 'bottom'] },
    shape: { control: 'radio', options: ['rounded', 'square'] },
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
} satisfies Meta<typeof Drawer>

type Story = StoryObj<typeof Drawer>

/**
 * This is the default Drawer, which comes from the right. The trigger opens it, and the X, a button of the
 * footer, <kbd>Esc</kbd> or a click on the backdrop close it.
 */
export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Drawer>
  <DrawerTrigger>
    <Button label="Open drawer" />
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>Filters</DrawerHeader>
    <DrawerBody>
      <div className="flex flex-col gap-4">
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
</Drawer>`,
      },
    },
  },
}

/**
 * Use the **side** prop to choose the edge it comes from: `left`, `right`, `top` or `bottom`.
 */
export const Sides: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-wrap justify-center gap-3">
  <Drawer side="left">
    <DrawerTrigger>
      <Button label="From the left" />
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>Filters</DrawerHeader>
      <DrawerBody>
        <Field label="Name">
          <Input />
        </Field>
        <Field label="Email">
          <Input type="email" />
        </Field>
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
  <Drawer side="bottom">
    <DrawerTrigger>
      <Button label="From the bottom" />
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>Filters</DrawerHeader>
      <DrawerBody>
        <Field label="Name">
          <Input />
        </Field>
        <Field label="Email">
          <Input type="email" />
        </Field>
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
</div>`,
      },
    },
  },
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
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-wrap justify-center gap-3">
  <Drawer shape="rounded">
    <DrawerTrigger>
      <Button label="Shape rounded" />
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>Filters</DrawerHeader>
      <DrawerBody>
        <Field label="Name">
          <Input />
        </Field>
        <Field label="Email">
          <Input type="email" />
        </Field>
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
  <Drawer shape="square">
    <DrawerTrigger>
      <Button label="Shape square" />
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>Filters</DrawerHeader>
      <DrawerBody>
        <Field label="Name">
          <Input />
        </Field>
        <Field label="Email">
          <Input type="email" />
        </Field>
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
</div>`,
      },
    },
  },
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
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-wrap justify-center gap-3">
  <Drawer size="sm">
    <DrawerTrigger>
      <Button label="Size sm" />
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>Filters</DrawerHeader>
      <DrawerBody>
        <Field label="Name">
          <Input />
        </Field>
        <Field label="Email">
          <Input type="email" />
        </Field>
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
  <Drawer size="lg">
    <DrawerTrigger>
      <Button label="Size lg" />
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>Filters</DrawerHeader>
      <DrawerBody>
        <Field label="Name">
          <Input />
        </Field>
        <Field label="Email">
          <Input type="email" />
        </Field>
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
</div>`,
      },
    },
  },
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
  parameters: {
    docs: {
      source: {
        code: `function Example() {
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
}`,
      },
    },
  },
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
  parameters: {
    docs: {
      source: {
        code: `<Drawer closeOnEscape={false} closeOnOutside={false}>
  <DrawerTrigger>
    <Button label="Open drawer" />
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>Filters</DrawerHeader>
    <DrawerBody>
      <Field label="Name">
        <Input />
      </Field>
      <Field label="Email">
        <Input type="email" />
      </Field>
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
</Drawer>`,
      },
    },
  },
  render: () => <Example closeOnEscape={false} closeOnOutside={false} />,
}

/**
 * `DrawerContent` draws the backdrop around itself, on the side of the Drawer. To style the layer, wrap
 * `DrawerContent` in a `DrawerBackdrop`. It takes `className`, `style` and `ref`, and carries `data-side`.
 */
export const Compound: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Drawer>
  <DrawerTrigger>
    <Button label="Open drawer" />
  </DrawerTrigger>
  <DrawerBackdrop style={{ backgroundColor: 'rgb(0 0 0 / 75%)' }}>
    <DrawerContent>
      <DrawerHeader>Filters</DrawerHeader>
      <DrawerBody>Choose what to show.</DrawerBody>
      <DrawerFooter>
        <DrawerClose>
          <Button label="Done" />
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </DrawerBackdrop>
</Drawer>`,
      },
    },
  },
  render: () => (
    <Drawer>
      <DrawerTrigger>
        <Button label="Open drawer" />
      </DrawerTrigger>
      <DrawerBackdrop style={{ backgroundColor: 'rgb(0 0 0 / 75%)' }}>
        <DrawerContent>
          <DrawerHeader>Filters</DrawerHeader>
          <DrawerBody>Choose what to show.</DrawerBody>
          <DrawerFooter>
            <DrawerClose>
              <Button label="Done" />
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </DrawerBackdrop>
    </Drawer>
  ),
}

/**
 * Some examples of Drawer with Tailwind classes. With `variant="unstyled"` the Drawer and its parts have no Plume styles, so each takes the classes you give it. `DrawerBackdrop` and `DrawerContent` keep `data-side`, and here Tailwind positions the panel with it.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Drawer side="right" variant="unstyled">
  <DrawerTrigger>
    <Button
      className="rounded-sm bg-blue-700 px-[1rem] py-[0.5rem] text-sm font-semibold text-white hover:bg-blue-800"
      label="Open drawer"
      variant="unstyled"
    />
  </DrawerTrigger>
  <DrawerBackdrop className="flex justify-end bg-black/50">
    <DrawerContent
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
            className="rounded-sm bg-blue-700 px-[1rem] py-[0.5rem] text-sm font-semibold text-white hover:bg-blue-800"
            label="Apply"
            variant="unstyled"
          />
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </DrawerBackdrop>
</Drawer>`,
      },
    },
  },
  render: () => (
    <Drawer side="right" variant="unstyled">
      <DrawerTrigger>
        <Button
          className="rounded-sm bg-blue-700 px-[1rem] py-[0.5rem] text-sm font-semibold text-white hover:bg-blue-800"
          label="Open drawer"
          variant="unstyled"
        />
      </DrawerTrigger>
      <DrawerBackdrop className="flex justify-end bg-black/50">
        <DrawerContent
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
                className="rounded-sm bg-blue-700 px-[1rem] py-[0.5rem] text-sm font-semibold text-white hover:bg-blue-800"
                label="Apply"
                variant="unstyled"
              />
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </DrawerBackdrop>
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
  <DrawerBackdrop className="d-flex justify-content-end bg-black bg-opacity-50">
    <DrawerContent
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
  </DrawerBackdrop>
</Drawer>`,
      },
    },
  },
  render: () => (
    <Drawer side="right" variant="unstyled">
      <DrawerTrigger>
        <Button className="btn btn-primary" label="Open drawer" variant="unstyled" />
      </DrawerTrigger>
      <DrawerBackdrop className="d-flex justify-content-end bg-black bg-opacity-50">
        <DrawerContent
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
      </DrawerBackdrop>
    </Drawer>
  ),
}
