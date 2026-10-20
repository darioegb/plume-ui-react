import type { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { Button } from '../../../interaction/button'
import { Icon } from '../../../presentation/icon'
import { Tooltip } from '..'

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

const saveIcon = (
  <Icon>
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8" />
    </svg>
  </Icon>
)

/**
 * A short hint that appears when the pointer rests on an element or when it takes the focus. Wrap the element in
 * a `Tooltip` and give it a `content`. The tooltip is linked to the element with `aria-describedby` while it is
 * open, it never takes the focus, and <kbd>Esc</kbd> closes it. The pointer can move onto the tooltip without it
 * closing, so its text can be read and selected.
 *
 * Use it for a name or a hint that is nice to have, never for what the user needs to know: it doesn't appear on
 * touch screens, and an element that is disabled doesn't fire the events that open it. An icon-only button needs
 * its own `aria-label`: the tooltip describes it, it doesn't name it.
 */
export default {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    docs: {
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
      description:
        'The element that opens the tooltip, such as a `Button`. It gets the handlers and `aria-describedby`, and it has to be able to take the focus, so keyboard users reach the tooltip too. A plain element needs a `tabIndex`.',
      table: { type: { summary: 'ReactElement' } },
    },
    content: {
      control: 'text',
      description: 'What the tooltip says. Keep it short.',
      table: { type: { summary: 'ReactNode' } },
    },
    className: {
      control: 'text',
      description: 'Custom CSS class for the tooltip.',
      table: { type: { summary: 'string' } },
    },
    style: {
      control: false,
      description: 'Inline styles for the tooltip.',
      table: { type: { summary: 'CSSProperties' } },
    },
    placement: {
      control: 'select',
      description:
        'Where the tooltip appears, relative to the element: a side, with an optional alignment (`top-start`, `bottom-end`). It flips to the opposite side when there is no room.',
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
      table: { type: { summary: 'Placement' }, defaultValue: { summary: 'top' } },
    },
    offset: {
      control: 'number',
      description: 'Distance in pixels between the element and the tooltip.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '6' } },
    },
    openDelay: {
      control: 'number',
      description: 'Milliseconds the pointer has to rest on the element before the tooltip opens.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '300' } },
    },
    closeDelay: {
      control: 'number',
      description:
        'Milliseconds before the tooltip closes when the pointer leaves, which lets it reach the tooltip.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '100' } },
    },
    size: {
      control: 'radio',
      description: 'Size of the text and of the padding of the tooltip.',
      options: ['sm', 'md', 'lg'],
      table: { type: { summary: `"sm" | "md" | "lg"` }, defaultValue: { summary: 'md' } },
    },
    variant: {
      control: 'radio',
      description:
        'Visual variant. `solid` is a dark tooltip on a light page and a light one on a dark page, and `outline` is a bordered surface. `unstyled` drops the Plume styles so you can bring your own.',
      options: ['solid', 'outline', 'unstyled'],
      table: {
        type: { summary: `"solid" | "outline" | "unstyled"` },
        defaultValue: { summary: 'solid' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Turns the tooltip off.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    open: {
      control: 'boolean',
      description:
        'Whether the tooltip is open, for a controlled tooltip. Pair it with `onOpenChange`.',
      table: { type: { summary: 'boolean' } },
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Whether the tooltip is open at first, for an uncontrolled tooltip.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    onOpenChange: {
      control: false,
      description: 'Called with the new state when the tooltip opens or closes.',
      table: { category: 'Events', type: { summary: '(open: boolean) => void' } },
    },
  },
  args: {
    content: 'Save the changes',
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button label="Hover or focus me" />
    </Tooltip>
  ),
} satisfies Meta<typeof Tooltip>

type Story = StoryObj<typeof Tooltip>

/**
 * This is the default Tooltip. It opens when the pointer rests on the button or when the button takes the focus
 * with the keyboard, and closes with <kbd>Esc</kbd>, on blur or when the pointer leaves.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick how the tooltip looks: `solid` is dark on a light page and light on a dark
 * one, `outline` is a bordered surface, and `unstyled` drops the Plume styles so you can style it yourself.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center gap-4">
      <Tooltip content="A solid tooltip" variant="solid">
        <Button label="Solid" variant="outline" />
      </Tooltip>
      <Tooltip content="An outline tooltip" variant="outline">
        <Button label="Outline" variant="outline" />
      </Tooltip>
      <Tooltip
        className="rounded bg-yellow-200 px-2 py-1 text-black"
        content="An unstyled tooltip"
        variant="unstyled"
      >
        <Button label="Unstyled" variant="outline" />
      </Tooltip>
    </div>
  ),
}

/**
 * Use the **size** prop to change the text and the padding of the tooltip.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center gap-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Tooltip content={`Size ${size}`} key={size} size={size}>
          <Button label={`Size ${size}`} variant="outline" />
        </Tooltip>
      ))}
    </div>
  ),
}

/**
 * Use **placement** to put the tooltip on another side, and with an alignment (`bottom-start`). When there is
 * no room, it flips to the opposite side.
 */
export const Placements: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 p-12">
      {placements.map((placement) => (
        <Tooltip content={placement} key={placement} placement={placement}>
          <Button label={placement} size="sm" variant="outline" />
        </Tooltip>
      ))}
    </div>
  ),
}

/**
 * **openDelay** is how long the pointer rests before the tooltip opens, and **closeDelay** how long it waits
 * after the pointer leaves. Set **openDelay** to `0` for a tooltip that opens at once. Focus always opens it
 * with no delay.
 */
export const Delays: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center gap-4">
      <Tooltip content="No delay" openDelay={0}>
        <Button label="Opens at once" variant="outline" />
      </Tooltip>
      <Tooltip content="A second later" openDelay={1000}>
        <Button label="Opens after a second" variant="outline" />
      </Tooltip>
    </div>
  ),
}

/**
 * An icon-only button needs an **aria-label** to have a name. The tooltip repeats it for sighted users who
 * don't know the icon.
 */
export const IconButton: Story = {
  render: () => (
    <Tooltip content="Save">
      <Button aria-label="Save" variant="icon">
        {saveIcon}
      </Button>
    </Tooltip>
  ),
}

/**
 * The **content** can be more than text, as long as it stays short and has nothing the user has to click:
 * the tooltip never takes the focus.
 */
export const RichContent: Story = {
  render: () => (
    <Tooltip
      content={
        <span>
          <strong>Save</strong> <kbd>Ctrl</kbd> + <kbd>S</kbd>
        </span>
      }
      variant="outline"
    >
      <Button label="Save" variant="outline" />
    </Tooltip>
  ),
}

function ControlledExample(): React.ReactNode {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex flex-col items-center gap-3">
      <Tooltip content="Controlled tooltip" onOpenChange={setOpen} open={open}>
        <Button label="Hover or focus me" variant="outline" />
      </Tooltip>
      <Button
        label={open ? 'Close the tooltip' : 'Open the tooltip'}
        onClick={() => setOpen(!open)}
        size="sm"
      />
    </div>
  )
}

/**
 * Pass **open** and **onOpenChange** to control the tooltip from your own state.
 */
export const Controlled: Story = {
  render: () => <ControlledExample />,
}
