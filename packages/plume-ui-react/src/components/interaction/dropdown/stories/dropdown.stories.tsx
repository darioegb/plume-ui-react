import type { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { Icon } from '../../../presentation/icon'
import { Button } from '../../button'
import {
  Dropdown,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
  DropdownSeparator,
  DropdownTrigger,
  type DropdownProps,
} from '..'

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

const glyph = (path: string): React.ReactNode => (
  <Icon>
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d={path} />
    </svg>
  </Icon>
)

const userIcon = glyph(
  'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
)
const settingsIcon = glyph(
  'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
)
const logoutIcon = glyph('M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9')

function Example(props: Readonly<Omit<DropdownProps, 'children'>>): React.ReactNode {
  return (
    <Dropdown {...props}>
      <DropdownTrigger>
        <Button label="Actions" variant="outline" />
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem>Profile</DropdownItem>
        <DropdownItem>Settings</DropdownItem>
        <DropdownItem>Sign out</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

/**
 * A menu of actions that opens from a button. Use it for a list of commands (a profile menu, the actions of a row,
 * a "more" button) and not for choosing a value, which is what a `Select` does.
 *
 * It follows the WAI-ARIA menu button pattern. The trigger opens it with a click, <kbd>Enter</kbd>, <kbd>Space</kbd> or
 * <kbd>↓</kbd> (<kbd>↑</kbd> opens it on the last item). The focus moves into the menu, where the arrows, <kbd>Home</kbd> and
 * <kbd>End</kbd> move between the items, typing a few letters jumps to the item that starts with them, and a
 * disabled item is skipped. <kbd>Esc</kbd> and <kbd>Tab</kbd> close it and give the focus back to the trigger, and so
 * does selecting an item.
 *
 * ### Subcomponents
 *
 * | Component | Props |
 * | --- | --- |
 * | `DropdownTrigger` | `children`. One element, such as a `Button`, which gets the click and keyboard handlers and the `aria-*` attributes and is what the menu is anchored to. With text, it renders a plain `<button>`. |
 * | `DropdownMenu` | `className`, `style`, `aria-label`, `aria-labelledby`, `children`. The menu. It is named after the trigger unless you give it a name. |
 * | `DropdownItem` | `onSelect`, `closeOnSelect`, `disabled`, `href`, `target`, `rel`, `icon`, `shortcut`, `className`, `style`, `children`. An action. With `href` it is a link. |
 * | `DropdownSeparator` | `className`, `style`. A line between groups of items. |
 * | `DropdownLabel` | `className`, `style`, `children`. A heading for the items that follow. It isn't focusable. |
 */
export default {
  title: 'Components/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    docs: {
      story: { inline: false, iframeHeight: 340 },
      importNames: [
        'Dropdown',
        'DropdownTrigger',
        'DropdownMenu',
        'DropdownItem',
        'DropdownSeparator',
        'DropdownLabel',
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
      description: 'The `DropdownTrigger` and the `DropdownMenu`.',
      table: { type: { summary: 'ReactNode' } },
    },
    placement: {
      control: 'select',
      description:
        'Where the menu opens, relative to the trigger: a side, with an optional alignment (`bottom-start`, `top-end`).',
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
      table: { type: { summary: 'Placement' }, defaultValue: { summary: 'bottom-start' } },
    },
    offset: {
      control: 'number',
      description: 'Distance in pixels between the trigger and the menu.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '4' } },
    },
    flip: {
      control: 'boolean',
      description: 'Opens on the opposite side when there is no room on the one asked for.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
    shift: {
      control: 'boolean',
      description: 'Slides the menu along its side to keep it inside the screen.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
    size: {
      control: 'radio',
      description: 'Size of the text and of the padding of the items.',
      options: ['sm', 'md', 'lg'],
      table: { type: { summary: `"sm" | "md" | "lg"` }, defaultValue: { summary: 'md' } },
    },
    variant: {
      control: 'radio',
      description:
        'Visual variant. `elevated` floats the menu with a shadow and `outline` draws its border. `unstyled` drops the Plume styles so you can bring your own.',
      options: ['elevated', 'outline', 'unstyled'],
      table: {
        type: { summary: `"elevated" | "outline" | "unstyled"` },
        defaultValue: { summary: 'elevated' },
      },
    },
    closeOnSelect: {
      control: 'boolean',
      description: 'Whether selecting an item closes the menu. An item can override it.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
    open: {
      control: 'boolean',
      description: 'Whether the menu is open, for a controlled menu. Pair it with `onOpenChange`.',
      table: { type: { summary: 'boolean' } },
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Whether the menu is open at first, for an uncontrolled menu.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    onOpenChange: {
      control: false,
      description: 'Called with the new state when the menu opens or closes.',
      table: { category: 'Events', type: { summary: '(open: boolean) => void' } },
    },
  },
  render: (args) => <Example {...args} />,
} satisfies Meta<typeof Dropdown>

type Story = StoryObj<typeof Dropdown>

/**
 * This is the default Dropdown. Open it with the mouse or with <kbd>Enter</kbd>, <kbd>Space</kbd> and the arrows.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick how the menu looks: `elevated` floats it with a shadow, `outline` draws its
 * border, and `unstyled` drops the Plume styles so you can style it yourself.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center gap-4">
      <Example variant="elevated" />
      <Example variant="outline" />
      <Dropdown variant="unstyled">
        <DropdownTrigger>
          <Button label="Unstyled" variant="outline" />
        </DropdownTrigger>
        <DropdownMenu className="min-w-40 rounded border border-border bg-surface p-1 text-foreground shadow">
          <DropdownItem className="block w-full rounded px-3 py-1 text-left hover:bg-surface-muted focus:bg-surface-muted focus:outline-none">
            Profile
          </DropdownItem>
          <DropdownItem className="block w-full rounded px-3 py-1 text-left hover:bg-surface-muted focus:bg-surface-muted focus:outline-none">
            Settings
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  ),
}

/**
 * Use the **size** prop to change the text and the padding of the items.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center gap-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Dropdown key={size} size={size}>
          <DropdownTrigger>
            <Button label={`Size ${size}`} size={size} variant="outline" />
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem>Profile</DropdownItem>
            <DropdownItem>Settings</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      ))}
    </div>
  ),
}

/**
 * Use **placement** to open the menu on another side, and with an alignment (`bottom-end` lines the menu up with
 * the end of the trigger). When there is no room, it flips to the opposite side.
 */
export const Placements: Story = {
  parameters: { docs: { story: { inline: false, iframeHeight: 460 } } },
  render: () => (
    <div className="grid grid-cols-3 gap-4 p-12">
      {placements.map((placement) => (
        <Dropdown key={placement} placement={placement}>
          <DropdownTrigger>
            <Button label={placement} size="sm" variant="outline" />
          </DropdownTrigger>
          <DropdownMenu aria-label={placement}>
            <DropdownItem>Profile</DropdownItem>
            <DropdownItem>Settings</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      ))}
    </div>
  ),
}

/**
 * An **icon** goes before the text of an item and a **shortcut** after it. The icon is decorative, so it is hidden
 * from screen readers. The shortcut is only text: it doesn't register the key for you.
 */
export const IconsAndShortcuts: Story = {
  render: () => (
    <Dropdown>
      <DropdownTrigger>
        <Button label="Account" variant="outline" />
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem icon={userIcon} shortcut="⌘P">
          Profile
        </DropdownItem>
        <DropdownItem icon={settingsIcon} shortcut="⌘,">
          Settings
        </DropdownItem>
        <DropdownItem icon={logoutIcon} shortcut="⇧⌘Q">
          Sign out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
}

/**
 * A **DropdownLabel** titles the items that follow and a **DropdownSeparator** draws a line between groups.
 * Neither can take the focus, so the arrows go from item to item.
 */
export const Groups: Story = {
  render: () => (
    <Dropdown>
      <DropdownTrigger>
        <Button label="Menu" variant="outline" />
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownLabel>Account</DropdownLabel>
        <DropdownItem>Profile</DropdownItem>
        <DropdownItem>Billing</DropdownItem>
        <DropdownSeparator />
        <DropdownLabel>Workspace</DropdownLabel>
        <DropdownItem>Members</DropdownItem>
        <DropdownItem>Invite people</DropdownItem>
        <DropdownSeparator />
        <DropdownItem>Sign out</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
}

/**
 * With **href** an item is a link, so it can be opened in a new tab or copied. Use **target** and **rel** as in
 * an `<a>`. An item can also be **disabled**: it stays in the menu, is skipped by the arrows and does nothing.
 */
export const LinksAndDisabled: Story = {
  render: () => (
    <Dropdown>
      <DropdownTrigger>
        <Button label="Resources" variant="outline" />
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem
          href="https://github.com/darioegb/plume-ui-react"
          rel="noreferrer"
          target="_blank"
        >
          Source code
        </DropdownItem>
        <DropdownItem href="https://darioegb.github.io/plume-ui-react/">Documentation</DropdownItem>
        <DropdownItem disabled>Changelog (soon)</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
}

function ControlledExample(): React.ReactNode {
  const [open, setOpen] = useState(false)
  const [last, setLast] = useState('nothing yet')
  return (
    <div className="flex flex-col items-center gap-3">
      <Dropdown closeOnSelect={false} onOpenChange={setOpen} open={open}>
        <DropdownTrigger>
          <Button label={open ? 'Close the menu' : 'Open the menu'} variant="outline" />
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem onSelect={() => setLast('Copy')}>Copy</DropdownItem>
          <DropdownItem onSelect={() => setLast('Paste')}>Paste</DropdownItem>
          <DropdownItem closeOnSelect onSelect={() => setLast('Done')}>
            Done
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <small>You chose: {last}</small>
    </div>
  )
}

/**
 * Pass **open** and **onOpenChange** to control the menu from your own state. With **closeOnSelect** off the menu
 * stays open after an item is chosen, and one item turns it back on for itself.
 */
export const Controlled: Story = {
  render: () => <ControlledExample />,
}

/**
 * Some examples of Dropdown with Tailwind classes. With `variant="unstyled"` the menu, its items, separators and labels have only the classes you give them. An item is a `button` (or an `a` with `href`), and the one the arrows reach has the focus, so `focus:` styles it.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Dropdown variant="unstyled">
  <DropdownTrigger>
    <Button
      className="rounded bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
      label="Account"
      variant="unstyled"
    />
  </DropdownTrigger>
  <DropdownMenu className="min-w-48 rounded-lg border border-border bg-surface p-1 text-sm text-foreground shadow-lg">
    <DropdownLabel className="px-3 py-1 text-xs font-semibold uppercase text-[var(--plume-muted)]">
      Signed in as ada
    </DropdownLabel>
    <DropdownItem
      className="rounded px-3 py-2 hover:bg-surface-muted focus:bg-surface-muted focus:outline-none"
      icon={userIcon}
      shortcut="⌘P"
    >
      Profile
    </DropdownItem>
    <DropdownItem
      className="rounded px-3 py-2 hover:bg-surface-muted focus:bg-surface-muted focus:outline-none"
      icon={settingsIcon}
      shortcut="⌘,"
    >
      Settings
    </DropdownItem>
    <DropdownSeparator className="my-1 h-px bg-border" />
    <DropdownItem
      className="rounded px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 focus:bg-red-50 focus:outline-none dark:hover:bg-red-950 dark:focus:bg-red-950"
      icon={logoutIcon}
    >
      Sign out
    </DropdownItem>
  </DropdownMenu>
</Dropdown>`,
      },
    },
  },
  render: () => (
    <Dropdown variant="unstyled">
      <DropdownTrigger>
        <Button
          className="rounded bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
          label="Account"
          variant="unstyled"
        />
      </DropdownTrigger>
      <DropdownMenu className="min-w-48 rounded-lg border border-border bg-surface p-1 text-sm text-foreground shadow-lg">
        <DropdownLabel className="px-3 py-1 text-xs font-semibold uppercase text-[var(--plume-muted)]">
          Signed in as ada
        </DropdownLabel>
        <DropdownItem
          className="rounded px-3 py-2 hover:bg-surface-muted focus:bg-surface-muted focus:outline-none"
          icon={userIcon}
          shortcut="⌘P"
        >
          Profile
        </DropdownItem>
        <DropdownItem
          className="rounded px-3 py-2 hover:bg-surface-muted focus:bg-surface-muted focus:outline-none"
          icon={settingsIcon}
          shortcut="⌘,"
        >
          Settings
        </DropdownItem>
        <DropdownSeparator className="my-1 h-px bg-border" />
        <DropdownItem
          className="rounded px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 focus:bg-red-50 focus:outline-none dark:hover:bg-red-950 dark:focus:bg-red-950"
          icon={logoutIcon}
        >
          Sign out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
}

/**
 * Some examples of Dropdown with Bootstrap classes: `dropdown-menu show` on the menu, `dropdown-item` on its items, `dropdown-divider` on the separator and `dropdown-header text-body-secondary` on the label.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Dropdown variant="unstyled">
  <DropdownTrigger>
    <Button className="btn btn-primary dropdown-toggle" label="Account" variant="unstyled" />
  </DropdownTrigger>
  <DropdownMenu className="dropdown-menu show">
    <DropdownLabel className="dropdown-header text-body-secondary">Signed in as ada</DropdownLabel>
    <DropdownItem className="dropdown-item">Profile</DropdownItem>
    <DropdownItem className="dropdown-item">Settings</DropdownItem>
    <DropdownItem className="dropdown-item" disabled>
      Billing (soon)
    </DropdownItem>
    <DropdownSeparator className="dropdown-divider" />
    <DropdownItem className="dropdown-item text-danger-emphasis">Sign out</DropdownItem>
  </DropdownMenu>
</Dropdown>`,
      },
    },
  },
  render: () => (
    <Dropdown variant="unstyled">
      <DropdownTrigger>
        <Button
          className="btn btn-primary dropdown-toggle"
          label="Account"
          variant="unstyled"
        />
      </DropdownTrigger>
      <DropdownMenu className="dropdown-menu show">
        <DropdownLabel className="dropdown-header text-body-secondary">
          Signed in as ada
        </DropdownLabel>
        <DropdownItem className="dropdown-item">Profile</DropdownItem>
        <DropdownItem className="dropdown-item">Settings</DropdownItem>
        <DropdownItem className="dropdown-item" disabled>
          Billing (soon)
        </DropdownItem>
        <DropdownSeparator className="dropdown-divider" />
        <DropdownItem className="dropdown-item text-danger-emphasis">Sign out</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
}
