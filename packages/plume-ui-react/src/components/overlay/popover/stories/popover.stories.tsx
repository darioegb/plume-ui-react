import type { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { Button } from '../../../interaction/button'
import { Input } from '../../../form/input'
import { Popover, PopoverClose, PopoverContent, PopoverTrigger, type PopoverProps } from '..'

const placements = [
  'top-start',
  'top',
  'top-end',
  'right',
  'bottom-start',
  'bottom',
  'bottom-end',
  'left',
] as const

function Example(props: Readonly<Omit<PopoverProps, 'children'>>): React.ReactNode {
  return (
    <Popover {...props}>
      <PopoverTrigger>
        <Button label="Open popover" />
      </PopoverTrigger>
      <PopoverContent aria-label="Details">
        <strong>Team members</strong>
        <p style={{ margin: '0.5rem 0 0' }}>
          Anyone in the team can see this project and comment on it.
        </p>
      </PopoverContent>
    </Popover>
  )
}

/**
 * A panel of content that opens next to the element that triggers it, for details, a small form or a set of
 * options that don't deserve a whole dialog. It stays where it is anchored when the page scrolls or the window
 * resizes, and flips or shifts to stay inside the screen.
 *
 * The focus moves into it when it opens and goes back to the trigger when it closes. <kbd>Esc</kbd> and a click
 * outside close it, and the trigger toggles it. Unlike a `Modal`, the page behind keeps scrolling.
 */
export default {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: {
    docs: {
      story: { inline: false, iframeHeight: 420 },
      importNames: ['Popover', 'PopoverTrigger', 'PopoverContent', 'PopoverClose'],
      toc: {
        title: 'On this page',
        disable: false,
      },
    },
    layout: 'centered',
  },
  argTypes: {
    children: { control: false },
    placement: {
      control: 'select',
      options: [
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end',
        'right',
        'right-start',
        'right-end',
      ],
    },
    offset: { control: 'number' },
    flip: { control: 'boolean' },
    shift: { control: 'boolean' },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'radio', options: ['elevated', 'outline', 'unstyled'] },
    open: { control: 'boolean' },
    defaultOpen: { control: 'boolean' },
    onOpenChange: { control: false },
  },
  render: (args) => <Example {...args} />,
} satisfies Meta<typeof Popover>

type Story = StoryObj<typeof Popover>

/**
 * This is the default Popover. The trigger toggles it, and <kbd>Esc</kbd> or a click outside close it.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick how the panel looks: `elevated` floats it with a shadow, `outline` draws its
 * border, and `unstyled` drops the Plume styles so you can style it yourself.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center gap-4">
      {(['elevated', 'outline'] as const).map((variant) => (
        <Popover key={variant} variant={variant}>
          <PopoverTrigger>
            <Button label={variant[0].toUpperCase() + variant.slice(1)} variant="outline" />
          </PopoverTrigger>
          <PopoverContent aria-label={variant}>
            A popover with the {variant} variant.
          </PopoverContent>
        </Popover>
      ))}
      <Popover variant="unstyled">
        <PopoverTrigger>
          <Button label="Unstyled" variant="outline" />
        </PopoverTrigger>
        <PopoverContent
          aria-label="unstyled"
          className="rounded-lg border-2 border-gray-400 bg-white p-3 text-black"
        >
          A popover with the unstyled variant.
        </PopoverContent>
      </Popover>
    </div>
  ),
}

/**
 * Use the **size** prop to change the maximum width of the panel.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center gap-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Popover key={size} size={size}>
          <PopoverTrigger>
            <Button label={`Size ${size}`} variant="outline" />
          </PopoverTrigger>
          <PopoverContent aria-label={`Size ${size}`}>
            The panel is as wide as its content, up to the maximum of its size. A longer text wraps
            when it reaches it, so it can be read in a column of the right width.
          </PopoverContent>
        </Popover>
      ))}
    </div>
  ),
}

/**
 * Use **placement** to open the panel on another side, and with an alignment (`bottom-start`). If there is no
 * room, it flips to the opposite side, and **shift** keeps it inside the screen.
 */
export const Placements: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-3 p-2 sm:grid-cols-3 sm:gap-4 sm:p-12">
      {placements.map((placement) => (
        <Popover key={placement} placement={placement} size="sm">
          <PopoverTrigger>
            <Button
              className="w-full whitespace-nowrap"
              label={placement}
              size="sm"
              variant="outline"
            />
          </PopoverTrigger>
          <PopoverContent aria-label={placement}>Opens at {placement}.</PopoverContent>
        </Popover>
      ))}
    </div>
  ),
}

function ControlledExample(): React.ReactNode {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex flex-col items-center gap-3">
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger>
          <Button label="Open popover" />
        </PopoverTrigger>
        <PopoverContent aria-label="Controlled popover">
          Opened and closed from the outside.
        </PopoverContent>
      </Popover>
      <div className="flex gap-2">
        <Button label="Open" onClick={() => setOpen(true)} size="sm" variant="outline" />
        <Button label="Close" onClick={() => setOpen(false)} size="sm" variant="outline" />
      </div>
      <p>The popover is {open ? 'open' : 'closed'}.</p>
    </div>
  )
}

/**
 * Pass **open** and **onOpenChange** to control the popover from your own state, for instance to close it
 * after something happens inside it.
 */
export const Controlled: Story = {
  render: () => <ControlledExample />,
}

/**
 * A small form in a popover. **PopoverClose** closes it from a button of its own, and the focus goes to the
 * first field when it opens.
 */
export const WithForm: Story = {
  render: () => (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <Button label="Rename" variant="outline" />
      </PopoverTrigger>
      <PopoverContent aria-label="Rename file">
        <div className="flex flex-col gap-3">
          <Input aria-label="Name" defaultValue="Annual report.pdf" />
          <div className="flex justify-end gap-2">
            <PopoverClose>
              <Button label="Cancel" size="sm" variant="ghost" />
            </PopoverClose>
            <PopoverClose>
              <Button label="Save" size="sm" />
            </PopoverClose>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
}

/**
 * The Popover is its parts: the `PopoverTrigger` is the element that opens it and the one it is anchored to, the
 * `PopoverContent` is the panel (it takes `className`, `style` and `ref`) and a `PopoverClose` can go anywhere inside
 * it, with its own `label` as the accessible name when its child has no text.
 */
export const Compound: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Popover placement="bottom-start">
  <PopoverTrigger>
    <Button label="Share" variant="outline" />
  </PopoverTrigger>
  <PopoverContent aria-label="Share link" className="max-w-xs">
    <div className="flex flex-col gap-3">
      <p>Anyone with the link can view the file.</p>
      <PopoverClose label="Dismiss">
        <Button label="Got it" size="sm" />
      </PopoverClose>
    </div>
  </PopoverContent>
</Popover>`,
      },
    },
  },
  render: () => (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <Button label="Share" variant="outline" />
      </PopoverTrigger>
      <PopoverContent aria-label="Share link" className="max-w-xs">
        <div className="flex flex-col gap-3">
          <p>Anyone with the link can view the file.</p>
          <PopoverClose label="Dismiss">
            <Button label="Got it" size="sm" />
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  ),
}

/**
 * Some examples of Popover with Tailwind classes. With `variant="unstyled"` the content is the only thing with classes: the ones you give it.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Popover variant="unstyled">
  <PopoverTrigger>
    <Button
      className="rounded bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
      label="Open popover"
      variant="unstyled"
    />
  </PopoverTrigger>
  <PopoverContent
    aria-label="Details"
    className="w-72 rounded-lg border border-border bg-surface p-4 text-sm text-foreground shadow-lg"
  >
    <strong className="block">Team members</strong>
    <p className="mt-2 text-[var(--plume-muted)]">
      Anyone in the team can see this project and comment on it.
    </p>
  </PopoverContent>
</Popover>`,
      },
    },
  },
  render: () => (
    <Popover variant="unstyled">
      <PopoverTrigger>
        <Button
          className="rounded bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
          label="Open popover"
          variant="unstyled"
        />
      </PopoverTrigger>
      <PopoverContent
        aria-label="Details"
        className="w-72 rounded-lg border border-border bg-surface p-4 text-sm text-foreground shadow-lg"
      >
        <strong className="block">Team members</strong>
        <p className="mt-2 text-[var(--plume-muted)]">
          Anyone in the team can see this project and comment on it.
        </p>
      </PopoverContent>
    </Popover>
  ),
}

/**
 * Some examples of Popover with Bootstrap classes: `popover` on the content with `popover-header` and `popover-body` inside. Bootstrap positions its popovers with JavaScript, here the Popover does it.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Popover variant="unstyled">
  <PopoverTrigger>
    <Button className="btn btn-primary" label="Open popover" variant="unstyled" />
  </PopoverTrigger>
  <PopoverContent aria-label="Details" className="popover">
    <h3 className="popover-header">Team members</h3>
    <div className="popover-body">
      Anyone in the team can see this project and comment on it.
    </div>
  </PopoverContent>
</Popover>`,
      },
    },
  },
  render: () => (
    <Popover variant="unstyled">
      <PopoverTrigger>
        <Button className="btn btn-primary" label="Open popover" variant="unstyled" />
      </PopoverTrigger>
      <PopoverContent aria-label="Details" className="popover">
        <h3 className="popover-header">Team members</h3>
        <div className="popover-body">
          Anyone in the team can see this project and comment on it.
        </div>
      </PopoverContent>
    </Popover>
  ),
}
