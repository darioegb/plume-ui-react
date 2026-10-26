import type { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { defaultTheme } from '../../../../theme'
import { Badge } from '../../badge'
import { Icon } from '../../icon'
import {
  List,
  ListDivider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

const icon = (path: string): React.ReactNode => (
  <Icon size="sm">
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

const inboxIcon = icon(
  'M22 12h-6l-2 3h-4l-2-3H2M5.5 5h13l3.5 7v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6z',
)
const sendIcon = icon('m22 2-7 20-4-9-9-4zM22 2 11 13')
const trashIcon = icon('M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14')

const files = ['Annual report.pdf', 'Budget.xlsx', 'Meeting notes.md']

/**
 * A list of items, for plain content, menus, settings and navigation. Compose it with the parts you need:
 * `ListItem` is a row, `ListItemButton` makes the row a button or a link, `ListItemIcon` and `ListItemText`
 * (with a `primary` and a `secondary` line) fill it, `ListSubheader` titles a section and `ListDivider`
 * separates two.
 *
 * The `variant` picks the container: `plain` has none, `bordered` is a bordered box with dividers, like a list
 * group, and `filled` has a muted background. `marker` adds bullets or numbers to a list of plain text items.
 */
export default {
  title: 'Components/List',
  component: List,
  tags: ['autodocs'],
  parameters: {
    docs: {
      importNames: [
        'List',
        'ListItem',
        'ListItemButton',
        'ListItemIcon',
        'ListItemText',
        'ListSubheader',
        'ListDivider',
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
    },
    className: {
      control: 'text',
    },
    style: {
      control: false,
    },
    colorScheme: {
      control: 'select',
      options: colorSchemes,
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'radio',
      options: ['plain', 'bordered', 'filled', 'unstyled'],
    },
    divided: {
      control: 'boolean',
    },
    marker: {
      control: 'radio',
      options: ['none', 'bullet', 'number'],
    },
    as: {
      control: 'radio',
      options: [undefined, 'ul', 'ol'],
    },
    id: {
      control: false,
    },
    title: {
      control: 'text',
    },
    role: {
      control: 'text',
    },
    'aria-label': {
      control: 'text',
    },
    'aria-labelledby': {
      control: false,
    },
  },
  args: {
    'aria-label': 'Files',
    style: { maxWidth: '100%', width: '18rem' },
  },
  render: (args) => (
    <List {...args}>
      {files.map((file) => (
        <ListItem key={file}>{file}</ListItem>
      ))}
    </List>
  ),
} satisfies Meta<typeof List>

type Story = StoryObj<typeof List>

/**
 * This is the default List, with no container and no markers.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick the container: `plain` has none, `bordered` draws a border and divides the
 * items, `filled` gives the List a muted background, and `unstyled` drops the Plume styles so you can style it
 * yourself.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center gap-6">
      {(['plain', 'bordered', 'filled'] as const).map((variant) => (
        <List
          aria-label={variant}
          key={variant}
          style={{ maxWidth: '100%', width: '14rem' }}
          variant={variant}
        >
          {files.map((file) => (
            <ListItem key={file}>{file}</ListItem>
          ))}
        </List>
      ))}
      <List
        aria-label="unstyled"
        className="border border-gray-400 rounded divide-y divide-gray-300"
        style={{ maxWidth: '100%', width: '14rem' }}
        variant="unstyled"
      >
        {files.map((file) => (
          <ListItem className="p-2" key={file}>
            {file}
          </ListItem>
        ))}
      </List>
    </div>
  ),
}

/**
 * Use the **size** prop to change the text and the padding of the items.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center gap-6">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <List
          aria-label={size}
          key={size}
          size={size}
          style={{ maxWidth: '100%', width: '14rem' }}
          variant="bordered"
        >
          {files.map((file) => (
            <ListItem key={file}>{file}</ListItem>
          ))}
        </List>
      ))}
    </div>
  ),
}

/**
 * Use the **colorScheme** prop to pick the color of the selected item and of the focus ring.
 */
export const Colors: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center gap-4">
      {colorSchemes.map((scheme) => (
        <List
          aria-label={scheme}
          colorScheme={scheme as keyof typeof defaultTheme.colors}
          key={scheme}
          style={{ maxWidth: '100%', width: '9rem' }}
        >
          <ListItem>
            <ListItemButton selected>{scheme}</ListItemButton>
          </ListItem>
        </List>
      ))}
    </div>
  ),
}

/**
 * Use **marker** for bullets or numbers in a list of plain text. A numbered list is an `<ol>`, and a
 * `ListItem` can set its own number with **value**.
 */
export const Markers: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center gap-10">
      <List aria-label="Bullets" marker="bullet">
        <ListItem>Install the package</ListItem>
        <ListItem>Wrap the app in the ThemeProvider</ListItem>
        <ListItem>Import the stylesheet</ListItem>
      </List>
      <List aria-label="Steps" marker="number">
        <ListItem>Install the package</ListItem>
        <ListItem>Wrap the app in the ThemeProvider</ListItem>
        <ListItem value={10}>Import the stylesheet</ListItem>
      </List>
    </div>
  ),
}

/**
 * Add **divided** to draw a line between the items of a `plain` or `filled` List. The `bordered` variant has
 * them already, and turning it off with `divided={false}` leaves the box alone.
 */
export const Dividers: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center gap-6">
      <List aria-label="Divided" divided style={{ maxWidth: '100%', width: '14rem' }}>
        {files.map((file) => (
          <ListItem key={file}>{file}</ListItem>
        ))}
      </List>
      <List
        aria-label="Bordered without dividers"
        divided={false}
        style={{ maxWidth: '100%', width: '14rem' }}
        variant="bordered"
      >
        {files.map((file) => (
          <ListItem key={file}>{file}</ListItem>
        ))}
      </List>
    </div>
  ),
}

/**
 * **ListItemIcon** puts an icon at the start of the row, and **ListItemText** takes the text, with a
 * **secondary** line under the **primary** one.
 */
export const IconsAndText: Story = {
  render: () => (
    <List aria-label="Mailbox" style={{ maxWidth: '100%', width: '20rem' }} variant="bordered">
      <ListItem>
        <ListItemIcon>{inboxIcon}</ListItemIcon>
        <ListItemText primary="Inbox" secondary="12 unread messages" />
      </ListItem>
      <ListItem>
        <ListItemIcon>{sendIcon}</ListItemIcon>
        <ListItemText primary="Sent" secondary="Last one yesterday" />
      </ListItem>
      <ListItem>
        <ListItemIcon>{trashIcon}</ListItemIcon>
        <ListItemText primary="Trash" />
      </ListItem>
    </List>
  ),
}

/**
 * Anything after the text sits at the end of the row. Here, a **Badge** with a count.
 */
export const TrailingContent: Story = {
  render: () => (
    <List aria-label="Mailbox" style={{ maxWidth: '100%', width: '20rem' }} variant="bordered">
      <ListItem>
        <ListItemIcon>{inboxIcon}</ListItemIcon>
        <ListItemText primary="Inbox" />
        <Badge shape="pill" size="sm">
          12
        </Badge>
      </ListItem>
      <ListItem>
        <ListItemIcon>{sendIcon}</ListItemIcon>
        <ListItemText primary="Sent" />
      </ListItem>
      <ListItem>
        <ListItemIcon>{trashIcon}</ListItemIcon>
        <ListItemText primary="Trash" />
        <Badge colorScheme="secondary" shape="pill" size="sm" variant="subtle">
          3
        </Badge>
      </ListItem>
    </List>
  ),
}

/**
 * Put a **ListItemButton** inside a `ListItem` to make the row a button. With **href** it is a link. A button
 * can be **selected**, which highlights it and sets `aria-current`, or **disabled**.
 */
export const Interactive: Story = {
  render: () => (
    <List aria-label="Mailbox" style={{ maxWidth: '100%', width: '20rem' }} variant="bordered">
      <ListItem>
        <ListItemButton selected>
          <ListItemIcon>{inboxIcon}</ListItemIcon>
          <ListItemText primary="Inbox (selected)" />
        </ListItemButton>
      </ListItem>
      <ListItem>
        <ListItemButton href="#sent">
          <ListItemIcon>{sendIcon}</ListItemIcon>
          <ListItemText primary="Sent (a link)" />
        </ListItemButton>
      </ListItem>
      <ListItem>
        <ListItemButton disabled>
          <ListItemIcon>{trashIcon}</ListItemIcon>
          <ListItemText primary="Trash (disabled)" />
        </ListItemButton>
      </ListItem>
    </List>
  ),
}

function SelectableMailbox(): React.ReactNode {
  const [selected, setSelected] = useState('inbox')
  const boxes = [
    { id: 'inbox', icon: inboxIcon, label: 'Inbox' },
    { id: 'sent', icon: sendIcon, label: 'Sent' },
    { id: 'trash', icon: trashIcon, label: 'Trash' },
  ]
  return (
    <List aria-label="Mailbox" style={{ maxWidth: '100%', width: '20rem' }} variant="bordered">
      {boxes.map((box) => (
        <ListItem key={box.id}>
          <ListItemButton onClick={() => setSelected(box.id)} selected={selected === box.id}>
            <ListItemIcon>{box.icon}</ListItemIcon>
            <ListItemText primary={box.label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  )
}

/**
 * The List doesn't keep the selection: you set **selected** on the button, from your own state.
 */
export const Selectable: Story = {
  render: () => <SelectableMailbox />,
}

/**
 * **ListSubheader** titles the items that follow, and **ListDivider** separates two groups.
 */
export const Sections: Story = {
  render: () => (
    <List aria-label="Mailbox" style={{ maxWidth: '100%', width: '20rem' }} variant="bordered">
      <ListSubheader>Folders</ListSubheader>
      <ListItem>
        <ListItemButton>
          <ListItemIcon>{inboxIcon}</ListItemIcon>
          <ListItemText primary="Inbox" />
        </ListItemButton>
      </ListItem>
      <ListItem>
        <ListItemButton>
          <ListItemIcon>{sendIcon}</ListItemIcon>
          <ListItemText primary="Sent" />
        </ListItemButton>
      </ListItem>
      <ListDivider />
      <ListSubheader>Other</ListSubheader>
      <ListItem>
        <ListItemButton>
          <ListItemIcon>{trashIcon}</ListItemIcon>
          <ListItemText primary="Trash" />
        </ListItemButton>
      </ListItem>
    </List>
  ),
}

/**
 * The List is its parts: a `ListSubheader` titles a section, a `ListItem` is a row that can hold a `ListItemButton`
 * (or only text), and inside a row go a `ListItemIcon`, a `ListItemText` and anything else, such as a `Badge` at the
 * end. Every part takes `className`, `style` and `ref`.
 */
export const Compound: Story = {
  parameters: {
    docs: {
      source: {
        code: `<List aria-label="Mailbox" style={{ maxWidth: '100%', width: '20rem' }} variant="bordered">
  <ListSubheader>Folders</ListSubheader>
  <ListItem>
    <ListItemButton selected>
      <ListItemIcon>{inboxIcon}</ListItemIcon>
      <ListItemText primary="Inbox" secondary="12 unread messages" />
      <Badge shape="pill" size="sm">
        12
      </Badge>
    </ListItemButton>
  </ListItem>
  <ListDivider />
  <ListItem>
    <ListItemText className="font-semibold" primary="Trash" />
  </ListItem>
</List>`,
      },
    },
  },
  render: () => (
    <List aria-label="Mailbox" style={{ maxWidth: '100%', width: '20rem' }} variant="bordered">
      <ListSubheader>Folders</ListSubheader>
      <ListItem>
        <ListItemButton selected>
          <ListItemIcon>{inboxIcon}</ListItemIcon>
          <ListItemText primary="Inbox" secondary="12 unread messages" />
          <Badge shape="pill" size="sm">
            12
          </Badge>
        </ListItemButton>
      </ListItem>
      <ListDivider />
      <ListItem>
        <ListItemText className="font-semibold" primary="Trash" />
      </ListItem>
    </List>
  ),
}

/**
 * Some examples of List with Tailwind classes. With `variant="unstyled"` the List and its parts have no Plume styles. `ListItemButton` sets `aria-current` when it is `selected`, which Tailwind reads with `aria-[current=true]:`.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<List
  className="w-72 max-w-full divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface text-sm text-foreground"
  variant="unstyled"
>
  <ListItem>
    <ListItemButton
      className="flex w-full items-center gap-3 bg-transparent px-4 py-2 text-left hover:bg-surface-muted aria-[current=true]:bg-surface-muted aria-[current=true]:font-semibold"
      selected
    >
      <ListItemIcon>{inboxIcon}</ListItemIcon>
      <ListItemText className="flex-1" primary="Inbox" />
      <Badge
        className="rounded-full bg-primary-solid px-2 py-0.5 text-xs text-primary-on-solid"
        variant="unstyled"
      >
        4
      </Badge>
    </ListItemButton>
  </ListItem>
  <ListItem>
    <ListItemButton
      className="flex w-full items-center gap-3 bg-transparent px-4 py-2 text-left hover:bg-surface-muted"
    >
      <ListItemIcon>{sendIcon}</ListItemIcon>
      <ListItemText primary="Sent" />
    </ListItemButton>
  </ListItem>
  <ListItem>
    <ListItemButton
      className="flex w-full items-center gap-3 bg-transparent px-4 py-2 text-left hover:bg-surface-muted"
    >
      <ListItemIcon>{trashIcon}</ListItemIcon>
      <ListItemText primary="Trash" />
    </ListItemButton>
  </ListItem>
</List>`,
      },
    },
  },
  render: () => (
    <List
      className="w-72 max-w-full divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface text-sm text-foreground"
      variant="unstyled"
    >
      <ListItem>
        <ListItemButton
          className="flex w-full items-center gap-3 bg-transparent px-4 py-2 text-left hover:bg-surface-muted aria-[current=true]:bg-surface-muted aria-[current=true]:font-semibold"
          selected
        >
          <ListItemIcon>{inboxIcon}</ListItemIcon>
          <ListItemText className="flex-1" primary="Inbox" />
          <Badge
            className="rounded-full bg-primary-solid px-2 py-0.5 text-xs text-primary-on-solid"
            variant="unstyled"
          >
            4
          </Badge>
        </ListItemButton>
      </ListItem>
      <ListItem>
        <ListItemButton className="flex w-full items-center gap-3 bg-transparent px-4 py-2 text-left hover:bg-surface-muted">
          <ListItemIcon>{sendIcon}</ListItemIcon>
          <ListItemText primary="Sent" />
        </ListItemButton>
      </ListItem>
      <ListItem>
        <ListItemButton className="flex w-full items-center gap-3 bg-transparent px-4 py-2 text-left hover:bg-surface-muted">
          <ListItemIcon>{trashIcon}</ListItemIcon>
          <ListItemText primary="Trash" />
        </ListItemButton>
      </ListItem>
    </List>
  ),
}

/**
 * Some examples of List with Bootstrap classes: `list-group` on the List and `list-group-item` on its items. An item with a button uses `list-group-item-action` and `active` for the selected one.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="d-flex flex-column gap-4" style={{ width: '20rem', maxWidth: '100%' }}>
  <List className="list-group" variant="unstyled">
    <ListItem className="list-group-item d-flex justify-content-between align-items-center">
      Inbox
      <Badge className="badge rounded-pill text-bg-primary" variant="unstyled">
        4
      </Badge>
    </ListItem>
    <ListItem className="list-group-item">Sent</ListItem>
    <ListItem className="list-group-item">Trash</ListItem>
  </List>
  <List className="list-group" variant="unstyled">
    <ListItem className="list-group-item p-0">
      <ListItemButton className="list-group-item list-group-item-action active border-0" selected>
        Inbox
      </ListItemButton>
    </ListItem>
    <ListItem className="list-group-item p-0">
      <ListItemButton className="list-group-item list-group-item-action border-0">
        Sent
      </ListItemButton>
    </ListItem>
  </List>
</div>`,
      },
    },
  },
  render: () => (
    <div className="d-flex flex-column gap-4" style={{ width: '20rem', maxWidth: '100%' }}>
      <List className="list-group" variant="unstyled">
        <ListItem className="list-group-item d-flex justify-content-between align-items-center">
          Inbox
          <Badge className="badge rounded-pill text-bg-primary" variant="unstyled">
            4
          </Badge>
        </ListItem>
        <ListItem className="list-group-item">Sent</ListItem>
        <ListItem className="list-group-item">Trash</ListItem>
      </List>
      <List className="list-group" variant="unstyled">
        <ListItem className="list-group-item p-0">
          <ListItemButton
            className="list-group-item list-group-item-action active border-0"
            selected
          >
            Inbox
          </ListItemButton>
        </ListItem>
        <ListItem className="list-group-item p-0">
          <ListItemButton className="list-group-item list-group-item-action border-0">
            Sent
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  ),
}
