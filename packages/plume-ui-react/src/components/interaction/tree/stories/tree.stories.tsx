import type { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { defaultTheme } from '../../../../theme'
import {
  Tree,
  TreeItem,
  TreeItemCheckbox,
  TreeItemChevron,
  TreeItemGroup,
  TreeItemIcon,
  TreeItemLabel,
} from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

const frame = { maxWidth: '100%', width: '18rem' }

const stack = (gap: string): React.CSSProperties => ({
  display: 'flex',
  flexDirection: 'column',
  gap,
  ...frame,
})

function Glyph({ path }: Readonly<{ path: string }>): React.ReactNode {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="1em"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="1em"
    >
      <path d={path} />
    </svg>
  )
}

const folder = 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'
const file = 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5'

function Files(
  props: Readonly<Partial<React.ComponentProps<typeof Tree>> & { icons?: boolean }>,
): React.ReactNode {
  const { icons = false, ...tree } = props
  const dir = icons ? <Glyph path={folder} /> : undefined
  const doc = icons ? <Glyph path={file} /> : undefined
  return (
    <Tree aria-label="Project files" {...(tree as React.ComponentProps<typeof Tree>)}>
      <TreeItem value="src">
        <TreeItemLabel icon={dir}>src</TreeItemLabel>
        <TreeItemGroup>
          <TreeItem value="components">
            <TreeItemLabel icon={dir}>components</TreeItemLabel>
            <TreeItemGroup>
              <TreeItem value="button">
                <TreeItemLabel icon={doc}>button.tsx</TreeItemLabel>
              </TreeItem>
              <TreeItem value="tree">
                <TreeItemLabel icon={doc}>tree.tsx</TreeItemLabel>
              </TreeItem>
            </TreeItemGroup>
          </TreeItem>
          <TreeItem value="index">
            <TreeItemLabel icon={doc}>index.ts</TreeItemLabel>
          </TreeItem>
        </TreeItemGroup>
      </TreeItem>
      <TreeItem value="public">
        <TreeItemLabel icon={dir}>public</TreeItemLabel>
        <TreeItemGroup>
          <TreeItem value="logo">
            <TreeItemLabel icon={doc}>logo.svg</TreeItemLabel>
          </TreeItem>
        </TreeItemGroup>
      </TreeItem>
      <TreeItem value="readme">
        <TreeItemLabel icon={doc}>README.md</TreeItemLabel>
      </TreeItem>
      <TreeItem disabled value="secret">
        <TreeItemLabel icon={doc}>.env</TreeItemLabel>
      </TreeItem>
    </Tree>
  )
}

/**
 * A hierarchical list where branches open and close, like a file explorer, a category menu or an outline. Use it
 * for nested data that the user browses and picks from.
 *
 * It follows the WAI-ARIA tree view pattern. The root has `role="tree"` (give it an `aria-label`), every
 * `TreeItem` is a `treeitem` with its `aria-level`, `aria-selected` and, when it has children, `aria-expanded`,
 * and the children sit in a `group` inside it. An item is named by its `TreeItemLabel`, not by the text of its
 * children. Only one item is reachable with <kbd>Tab</kbd> (the selected one, or the first), and the arrows move
 * inside the tree:
 *
 * | Key | What it does |
 * | --- | --- |
 * | <kbd>↓</kbd> <kbd>↑</kbd> | Move to the next or the previous visible item. |
 * | <kbd>→</kbd> | Open a closed branch, or go to its first child if it is open. |
 * | <kbd>←</kbd> | Close an open branch, or go to the parent. |
 * | <kbd>Home</kbd> <kbd>End</kbd> | Go to the first or the last visible item. |
 * | <kbd>Enter</kbd> | Select the item and, if it is a branch, open or close it. |
 * | <kbd>Space</kbd> | Select the item. |
 * | A letter | Go to the next item whose label starts with what you type. |
 *
 * Pressing an item with the pointer does the same as <kbd>Enter</kbd>. Items that are **disabled** can't be
 * selected and are skipped by the keyboard.
 *
 * **Selection.** With the default `selection="single"` one item is selected, and **value** / **defaultValue** hold
 * its `value`. With `selection="multiple"` they hold a list and the tree has `aria-multiselectable`. With
 * `selection="none"` nothing is selected and the tree only opens and closes, for navigation. **expanded** /
 * **defaultExpanded** hold the list of open branches.
 *
 * **Checkboxes.** With `selection="checkbox"` every item has a checkbox and the tree uses `aria-checked` (true,
 * false or `mixed`) instead of `aria-selected`, which suits a list of permissions or categories. By default it
 * **cascades**: checking a branch checks everything under it (except the items that are disabled), a branch shows
 * the mixed state while only some of its items are checked, and it is checked when all are. **value** is the list of
 * checked items, and a branch is in it only when everything under it is checked; a branch you put in the list counts
 * as everything under it. Pressing the label or <kbd>Space</kbd> or <kbd>Enter</kbd> toggles the checkbox, and the
 * chevron or the <kbd>←</kbd> <kbd>→</kbd> keys open and close the branches. Pass `cascade={false}` to check every
 * item on its own.
 */
export default {
  title: 'Components/Tree',
  component: Tree,
  tags: ['autodocs'],
  parameters: {
    docs: {
      importNames: [
        'Tree',
        'TreeItem',
        'TreeItemLabel',
        'TreeItemGroup',
        'TreeItemChevron',
        'TreeItemCheckbox',
        'TreeItemIcon',
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
    className: { control: 'text' },
    style: { control: false },
    selection: { control: 'radio', options: ['single', 'multiple', 'checkbox', 'none'] },
    cascade: { control: 'boolean' },
    value: { control: false },
    defaultValue: { control: false },
    onValueChange: { control: false },
    expanded: { control: false },
    defaultExpanded: { control: false },
    onExpandedChange: { control: false },
    colorScheme: { control: 'select', options: colorSchemes },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'radio', options: ['solid', 'ghost', 'accent', 'unstyled'] },
    id: { control: false },
    title: { control: 'text' },
    hidden: { control: false },
    'aria-label': { control: 'text' },
    'aria-labelledby': { control: false },
  },
  args: {
    'aria-label': 'Project files',
    defaultExpanded: ['src'],
    defaultValue: 'index',
    style: frame,
  },
  render: (args) => <Files {...args} icons />,
} satisfies Meta<typeof Tree>

type Story = StoryObj<typeof Tree>

/**
 * This is the default Tree: one item can be selected, and a branch opens when it is pressed.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick how the selected item looks. `unstyled` drops the Plume styles so you can style
 * it yourself.
 */
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-6">
  <Tree aria-label="solid" defaultExpanded={['src']} defaultValue="index" variant="solid">
    <TreeItem value="src">
      <TreeItemLabel>src</TreeItemLabel>
      <TreeItemGroup>
        <TreeItem value="index">
          <TreeItemLabel>index.ts</TreeItemLabel>
        </TreeItem>
      </TreeItemGroup>
    </TreeItem>
    <TreeItem value="readme">
      <TreeItemLabel>README.md</TreeItemLabel>
    </TreeItem>
  </Tree>
  <Tree aria-label="ghost" defaultExpanded={['src']} defaultValue="index" variant="ghost">
    <TreeItem value="src">
      <TreeItemLabel>src</TreeItemLabel>
      <TreeItemGroup>
        <TreeItem value="index">
          <TreeItemLabel>index.ts</TreeItemLabel>
        </TreeItem>
      </TreeItemGroup>
    </TreeItem>
    <TreeItem value="readme">
      <TreeItemLabel>README.md</TreeItemLabel>
    </TreeItem>
  </Tree>
  <Tree aria-label="accent" defaultExpanded={['src']} defaultValue="index" variant="accent">
    <TreeItem value="src">
      <TreeItemLabel>src</TreeItemLabel>
      <TreeItemGroup>
        <TreeItem value="index">
          <TreeItemLabel>index.ts</TreeItemLabel>
        </TreeItem>
      </TreeItemGroup>
    </TreeItem>
    <TreeItem value="readme">
      <TreeItemLabel>README.md</TreeItemLabel>
    </TreeItem>
  </Tree>
</div>`,
      },
    },
  },
  render: () => (
    <div style={stack('1.5rem')}>
      {(['solid', 'ghost', 'accent'] as const).map((variant) => (
        <Files
          aria-label={variant}
          defaultExpanded={['src']}
          defaultValue="index"
          key={variant}
          variant={variant}
        />
      ))}
    </div>
  ),
}

/**
 * Use the **size** prop to change the text and the rows.
 */
export const Sizes: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-6">
  <Tree aria-label="Size sm" defaultExpanded={['src']} defaultValue="index" size="sm">
    <TreeItem value="src">
      <TreeItemLabel>src</TreeItemLabel>
      <TreeItemGroup>
        <TreeItem value="index">
          <TreeItemLabel>index.ts</TreeItemLabel>
        </TreeItem>
      </TreeItemGroup>
    </TreeItem>
    <TreeItem value="readme">
      <TreeItemLabel>README.md</TreeItemLabel>
    </TreeItem>
  </Tree>
  <Tree aria-label="Size md" defaultExpanded={['src']} defaultValue="index" size="md">
    <TreeItem value="src">
      <TreeItemLabel>src</TreeItemLabel>
      <TreeItemGroup>
        <TreeItem value="index">
          <TreeItemLabel>index.ts</TreeItemLabel>
        </TreeItem>
      </TreeItemGroup>
    </TreeItem>
    <TreeItem value="readme">
      <TreeItemLabel>README.md</TreeItemLabel>
    </TreeItem>
  </Tree>
  <Tree aria-label="Size lg" defaultExpanded={['src']} defaultValue="index" size="lg">
    <TreeItem value="src">
      <TreeItemLabel>src</TreeItemLabel>
      <TreeItemGroup>
        <TreeItem value="index">
          <TreeItemLabel>index.ts</TreeItemLabel>
        </TreeItem>
      </TreeItemGroup>
    </TreeItem>
    <TreeItem value="readme">
      <TreeItemLabel>README.md</TreeItemLabel>
    </TreeItem>
  </Tree>
</div>`,
      },
    },
  },
  render: () => (
    <div style={stack('1.5rem')}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Files
          aria-label={`Size ${size}`}
          defaultExpanded={['src']}
          defaultValue="index"
          key={size}
          size={size}
        />
      ))}
    </div>
  ),
}

/**
 * Use the **colorScheme** prop to pick a color from the theme. It colors the selected item.
 */
export const Colors: Story = {
  render: () => (
    <div style={stack('1rem')}>
      {colorSchemes.map((scheme) => (
        <Tree
          aria-label={scheme}
          colorScheme={scheme as keyof typeof defaultTheme.colors}
          defaultValue="selected"
          key={scheme}
          size="sm"
        >
          <TreeItem value="selected">
            <TreeItemLabel>{scheme}</TreeItemLabel>
          </TreeItem>
        </Tree>
      ))}
    </div>
  ),
}

/**
 * Give a `TreeItemLabel` an **icon** to show something before the text. The icon is decorative, so it is hidden
 * from assistive technology.
 */
export const Icons: Story = {
  parameters: {
    docs: {
      source: {
        code: `function Glyph({ path }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="1em"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="1em"
    >
      <path d={path} />
    </svg>
  )
}

const folder = 'M3 7h6l2 2h10v10H3z'
const file = 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5'

<Tree aria-label="Project files" defaultExpanded={['src', 'components']}>
  <TreeItem value="src">
    <TreeItemLabel icon={<Glyph path={folder} />}>src</TreeItemLabel>
    <TreeItemGroup>
      <TreeItem value="components">
        <TreeItemLabel icon={<Glyph path={folder} />}>components</TreeItemLabel>
        <TreeItemGroup>
          <TreeItem value="button">
            <TreeItemLabel icon={<Glyph path={file} />}>button.tsx</TreeItemLabel>
          </TreeItem>
          <TreeItem value="tree">
            <TreeItemLabel icon={<Glyph path={file} />}>tree.tsx</TreeItemLabel>
          </TreeItem>
        </TreeItemGroup>
      </TreeItem>
      <TreeItem value="index">
        <TreeItemLabel icon={<Glyph path={file} />}>index.ts</TreeItemLabel>
      </TreeItem>
    </TreeItemGroup>
  </TreeItem>
  <TreeItem value="readme">
    <TreeItemLabel icon={<Glyph path={file} />}>README.md</TreeItemLabel>
  </TreeItem>
  <TreeItem disabled value="secret">
    <TreeItemLabel icon={<Glyph path={file} />}>.env</TreeItemLabel>
  </TreeItem>
</Tree>`,
      },
    },
  },
  render: () => <Files defaultExpanded={['src', 'components']} icons style={frame} />,
}

/**
 * With `selection="multiple"` any number of items can be selected: pressing one toggles it, and the Tree has
 * `aria-multiselectable`.
 */
export const MultipleSelection: Story = {
  args: {
    defaultExpanded: ['src', 'components'],
    defaultValue: ['button', 'readme'],
    selection: 'multiple',
  },
}

/**
 * With `selection="none"` the items are not selectable and the Tree only opens and closes its branches, which
 * suits a navigation or an outline.
 */
export const NoSelection: Story = {
  args: { defaultValue: undefined, selection: 'none' },
}

const sections = [
  { actions: ['Read', 'Create', 'Edit', 'Delete'], name: 'Users' },
  { actions: ['View invoices', 'Issue refunds'], name: 'Billing' },
  { actions: ['Read', 'Export'], name: 'Reports' },
]

const slug = (text: string): string => text.toLowerCase().replace(/ /g, '-')

function CheckboxTree({
  cascade = true,
  defaultValue = [],
}: Readonly<{ cascade?: boolean; defaultValue?: string[] }>): React.ReactNode {
  const [value, setValue] = useState<string[]>(defaultValue)
  return (
    <div style={stack('0.75rem')}>
      <Tree
        aria-label="Sections"
        cascade={cascade}
        defaultExpanded={['users', 'billing']}
        onValueChange={setValue}
        selection="checkbox"
        value={value}
      >
        {sections.map(({ actions, name }) => (
          <TreeItem key={name} value={slug(name)}>
            <TreeItemLabel>{name}</TreeItemLabel>
            <TreeItemGroup>
              {actions.map((action) => (
                <TreeItem
                  disabled={name === 'Users' && action === 'Delete'}
                  key={action}
                  value={`${slug(name)}:${slug(action)}`}
                >
                  <TreeItemLabel>{action}</TreeItemLabel>
                </TreeItem>
              ))}
            </TreeItemGroup>
          </TreeItem>
        ))}
      </Tree>
      <p className="text-sm">Checked: {value.join(', ') || 'nothing'}</p>
    </div>
  )
}

/**
 * With `selection="checkbox"` every item has a checkbox, which suits a list of permissions, categories or
 * filters. Checking a branch checks everything under it, and a branch shows the mixed state while only some of
 * its items are checked. An item that is disabled (here, "Delete" of Users) keeps its state when its branch is
 * toggled. The chevron opens and closes a branch without changing its checkbox.
 */
export const Checkboxes: Story = {
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [value, setValue] = useState(['users:read', 'reports'])
  return (
    <div className="flex flex-col gap-3">
      <Tree
        aria-label="Sections"
        defaultExpanded={['users']}
        onValueChange={setValue}
        selection="checkbox"
        value={value}
      >
        <TreeItem value="users">
          <TreeItemLabel>Users</TreeItemLabel>
          <TreeItemGroup>
            <TreeItem value="users:read">
              <TreeItemLabel>Read</TreeItemLabel>
            </TreeItem>
            <TreeItem value="users:edit">
              <TreeItemLabel>Edit</TreeItemLabel>
            </TreeItem>
            <TreeItem disabled value="users:delete">
              <TreeItemLabel>Delete</TreeItemLabel>
            </TreeItem>
          </TreeItemGroup>
        </TreeItem>
        <TreeItem value="reports">
          <TreeItemLabel>Reports</TreeItemLabel>
          <TreeItemGroup>
            <TreeItem value="reports:read">
              <TreeItemLabel>Read</TreeItemLabel>
            </TreeItem>
            <TreeItem value="reports:export">
              <TreeItemLabel>Export</TreeItemLabel>
            </TreeItem>
          </TreeItemGroup>
        </TreeItem>
      </Tree>
      <p className="text-sm">Checked: {value.join(', ') || 'nothing'}</p>
    </div>
  )
}`,
      },
    },
  },
  render: () => <CheckboxTree defaultValue={['users:read', 'reports']} />,
}

/**
 * With `cascade={false}` every checkbox is independent: checking a branch does not check what is under it, and
 * a branch does not show the mixed state.
 */
export const IndependentCheckboxes: Story = {
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [value, setValue] = useState(['users'])
  return (
    <div className="flex flex-col gap-3">
      <Tree
        aria-label="Sections"
        cascade={false}
        defaultExpanded={['users']}
        onValueChange={setValue}
        selection="checkbox"
        value={value}
      >
        <TreeItem value="users">
          <TreeItemLabel>Users</TreeItemLabel>
          <TreeItemGroup>
            <TreeItem value="users:read">
              <TreeItemLabel>Read</TreeItemLabel>
            </TreeItem>
            <TreeItem value="users:edit">
              <TreeItemLabel>Edit</TreeItemLabel>
            </TreeItem>
            <TreeItem disabled value="users:delete">
              <TreeItemLabel>Delete</TreeItemLabel>
            </TreeItem>
          </TreeItemGroup>
        </TreeItem>
        <TreeItem value="reports">
          <TreeItemLabel>Reports</TreeItemLabel>
          <TreeItemGroup>
            <TreeItem value="reports:read">
              <TreeItemLabel>Read</TreeItemLabel>
            </TreeItem>
            <TreeItem value="reports:export">
              <TreeItemLabel>Export</TreeItemLabel>
            </TreeItem>
          </TreeItemGroup>
        </TreeItem>
      </Tree>
      <p className="text-sm">Checked: {value.join(', ') || 'nothing'}</p>
    </div>
  )
}`,
      },
    },
  },
  render: () => <CheckboxTree cascade={false} defaultValue={['users']} />,
}

function ControlledTree(): React.ReactNode {
  const [expanded, setExpanded] = useState<string[]>(['src'])
  const [selected, setSelected] = useState('index')
  return (
    <div style={stack('0.75rem')}>
      <Files
        expanded={expanded}
        icons
        onExpandedChange={setExpanded}
        onValueChange={setSelected}
        value={selected}
      />
      <p className="text-sm">Selected: {selected || 'nothing'}</p>
      <p className="text-sm">Open: {expanded.join(', ') || 'nothing'}</p>
      <div className="flex gap-2">
        <button
          className="rounded-sm border border-gray-400 px-2 py-1 text-sm"
          onClick={() => setExpanded(['src', 'components', 'public'])}
          type="button"
        >
          Open all
        </button>
        <button
          className="rounded-sm border border-gray-400 px-2 py-1 text-sm"
          onClick={() => setExpanded([])}
          type="button"
        >
          Close all
        </button>
      </div>
    </div>
  )
}

/**
 * Pass **value** and **onValueChange** to control the selection, and **expanded** and **onExpandedChange** to
 * control the open branches, for example to open or close all of them from a button.
 */
export const Controlled: Story = {
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [expanded, setExpanded] = useState(['src'])
  const [selected, setSelected] = useState('index')
  return (
    <div className="flex flex-col gap-3">
      <Tree
        aria-label="Project files"
        expanded={expanded}
        onExpandedChange={setExpanded}
        onValueChange={setSelected}
        value={selected}
      >
        <TreeItem value="src">
          <TreeItemLabel>src</TreeItemLabel>
          <TreeItemGroup>
            <TreeItem value="components">
              <TreeItemLabel>components</TreeItemLabel>
              <TreeItemGroup>
                <TreeItem value="button">
                  <TreeItemLabel>button.tsx</TreeItemLabel>
                </TreeItem>
              </TreeItemGroup>
            </TreeItem>
            <TreeItem value="index">
              <TreeItemLabel>index.ts</TreeItemLabel>
            </TreeItem>
          </TreeItemGroup>
        </TreeItem>
        <TreeItem value="public">
          <TreeItemLabel>public</TreeItemLabel>
          <TreeItemGroup>
            <TreeItem value="logo">
              <TreeItemLabel>logo.svg</TreeItemLabel>
            </TreeItem>
          </TreeItemGroup>
        </TreeItem>
      </Tree>
      <p className="text-sm">Selected: {selected || 'nothing'}</p>
      <p className="text-sm">Open: {expanded.join(', ') || 'nothing'}</p>
      <div className="flex gap-2">
        <button
          className="rounded-sm border border-gray-400 px-2 py-1 text-sm"
          onClick={() => setExpanded(['src', 'components', 'public'])}
          type="button"
        >
          Open all
        </button>
        <button
          className="rounded-sm border border-gray-400 px-2 py-1 text-sm"
          onClick={() => setExpanded([])}
          type="button"
        >
          Close all
        </button>
      </div>
    </div>
  )
}`,
      },
    },
  },
  render: () => <ControlledTree />,
}

/**
 * An item with **disabled** can't be selected or opened, and the keyboard skips it. It is marked with
 * `aria-disabled`.
 */
export const Disabled: Story = {
  args: { defaultExpanded: [], defaultValue: undefined },
}

/**
 * A label is made of **TreeItemChevron**, **TreeItemCheckbox** and **TreeItemIcon**. Write them as its children to
 * reorder them or give each its own class: here the icon comes first and the chevron last.
 */
export const Compound: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Tree aria-label="Files" selection="checkbox">
  <TreeItem value="docs">
    <TreeItemLabel>
      <TreeItemCheckbox />
      <TreeItemIcon>
        <svg
          aria-hidden="true"
          fill="none"
          height="1em"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="1em"
        >
          <path d="M3 7h6l2 2h10v10H3z" />
        </svg>
      </TreeItemIcon>
      Documents
      <TreeItemChevron />
    </TreeItemLabel>
    <TreeItemGroup>
      <TreeItem value="alpha">
        <TreeItemLabel>
          <TreeItemCheckbox />
          Alpha
        </TreeItemLabel>
      </TreeItem>
    </TreeItemGroup>
  </TreeItem>
</Tree>`,
      },
    },
  },
  render: () => (
    <Tree aria-label="Files" selection="checkbox" style={frame}>
      <TreeItem value="docs">
        <TreeItemLabel>
          <TreeItemCheckbox />
          <TreeItemIcon>
            <Glyph path="M3 7h6l2 2h10v10H3z" />
          </TreeItemIcon>
          Documents
          <TreeItemChevron />
        </TreeItemLabel>
        <TreeItemGroup>
          <TreeItem value="alpha">
            <TreeItemLabel>
              <TreeItemCheckbox />
              Alpha
            </TreeItemLabel>
          </TreeItem>
        </TreeItemGroup>
      </TreeItem>
    </Tree>
  ),
}

/**
 * Some examples of Tree with Tailwind classes. With `variant="unstyled"` the Plume classes are gone and the
 * structure and the keyboard stay. Style the parts from their own classes: give the `TreeItem` the `group` class and use
 * `group-aria-[selected=true]:` on its `TreeItemLabel`, and `--tree-level` (set on every item) to indent.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Tree aria-label="Project files" className="text-sm text-foreground" defaultExpanded={["src"]} variant="unstyled">
  <TreeItem className="group outline-hidden" value="src">
    <TreeItemLabel
      className="flex cursor-pointer items-center gap-2 rounded-md py-1.5 pr-3 hover:bg-surface-muted group-aria-[selected=true]:bg-primary-solid group-aria-[selected=true]:text-primary-on-solid group-focus-visible:ring-2 group-focus-visible:ring-primary-solid [&_[data-plume-tree-chevron]]:group-aria-[expanded=true]:rotate-90"
      style={{ paddingInlineStart: "calc(0.75rem + (var(--tree-level) - 1) * 1.25rem)" }}
    >
      src
    </TreeItemLabel>
    <TreeItemGroup>
      <TreeItem className="group outline-hidden" value="index">
        <TreeItemLabel className="..." style={{ paddingInlineStart: "calc(0.75rem + (var(--tree-level) - 1) * 1.25rem)" }}>index.ts</TreeItemLabel>
      </TreeItem>
    </TreeItemGroup>
  </TreeItem>
</Tree>`,
      },
    },
  },
  render: () => {
    const row =
      'flex cursor-pointer items-center gap-2 rounded-md py-1.5 pr-3 hover:bg-surface-muted group-aria-[selected=true]:bg-primary-solid group-aria-[selected=true]:text-primary-on-solid group-focus-visible:ring-2 group-focus-visible:ring-primary-solid [&_[data-plume-tree-chevron]]:group-aria-[expanded=true]:rotate-90'
    const indent = { paddingInlineStart: 'calc(0.75rem + (var(--tree-level) - 1) * 1.25rem)' }
    return (
      <Tree
        aria-label="Project files"
        className="text-sm text-foreground"
        defaultExpanded={['src']}
        defaultValue="index"
        style={frame}
        variant="unstyled"
      >
        <TreeItem className="group outline-hidden" value="src">
          <TreeItemLabel className={row} style={indent}>
            src
          </TreeItemLabel>
          <TreeItemGroup>
            <TreeItem className="group outline-hidden" value="index">
              <TreeItemLabel className={row} style={indent}>
                index.ts
              </TreeItemLabel>
            </TreeItem>
            <TreeItem className="group outline-hidden" value="tree">
              <TreeItemLabel className={row} style={indent}>
                tree.tsx
              </TreeItemLabel>
            </TreeItem>
          </TreeItemGroup>
        </TreeItem>
        <TreeItem className="group outline-hidden" value="readme">
          <TreeItemLabel className={row} style={indent}>
            README.md
          </TreeItemLabel>
        </TreeItem>
      </Tree>
    )
  },
}

/**
 * Some examples of Tree with Bootstrap classes. Bootstrap has no tree, so the story uses its utilities
 * (`d-flex`, `rounded`, `pe-3`...) on the labels, and a rule that reads `aria-selected` for the selected row,
 * scoped to its own class.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<style>{'.bs-tree [role="treeitem"]{outline:0}.bs-tree [aria-selected="true"]>span{background-color:var(--bs-primary);color:#fff}.bs-tree [aria-expanded="true"]>span [data-plume-tree-chevron]{transform:rotate(90deg)}.bs-tree [role="treeitem"]:focus-visible>span{outline:2px solid var(--bs-primary);outline-offset:-2px}'}</style>
<Tree aria-label="Project files" className="bs-tree" defaultExpanded={["src"]} variant="unstyled">
  <TreeItem value="src">
    <TreeItemLabel className="d-flex align-items-center gap-2 rounded pe-3 py-2">src</TreeItemLabel>
    <TreeItemGroup>
      <TreeItem value="index">
        <TreeItemLabel className="d-flex align-items-center gap-2 rounded pe-3 py-2">index.ts</TreeItemLabel>
      </TreeItem>
    </TreeItemGroup>
  </TreeItem>
</Tree>`,
      },
    },
  },
  render: () => {
    const row = 'd-flex align-items-center gap-2 rounded pe-3 py-2'
    const indent = { paddingInlineStart: 'calc(1rem + (var(--tree-level) - 1) * 1.25rem)' }
    return (
      <>
        <style>
          {
            '.bs-tree [role="treeitem"]{outline:0}.bs-tree [aria-selected="true"]>span{background-color:var(--bs-primary);color:#fff}.bs-tree [aria-expanded="true"]>span [data-plume-tree-chevron]{transform:rotate(90deg)}.bs-tree [role="treeitem"]:focus-visible>span{outline:2px solid var(--bs-primary);outline-offset:-2px}'
          }
        </style>
        <Tree
          aria-label="Project files"
          className="bs-tree"
          defaultExpanded={['src']}
          defaultValue="index"
          style={frame}
          variant="unstyled"
        >
          <TreeItem value="src">
            <TreeItemLabel className={row} style={indent}>
              src
            </TreeItemLabel>
            <TreeItemGroup>
              <TreeItem value="index">
                <TreeItemLabel className={row} style={indent}>
                  index.ts
                </TreeItemLabel>
              </TreeItem>
              <TreeItem value="tree">
                <TreeItemLabel className={row} style={indent}>
                  tree.tsx
                </TreeItemLabel>
              </TreeItem>
            </TreeItemGroup>
          </TreeItem>
          <TreeItem value="readme">
            <TreeItemLabel className={row} style={indent}>
              README.md
            </TreeItemLabel>
          </TreeItem>
        </Tree>
      </>
    )
  },
}
