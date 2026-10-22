import type { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { defaultTheme } from '../../../../theme'
import { Tree, TreeItem, TreeItemGroup, TreeItemLabel } from '..'

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
 *
 * ### Subcomponents
 *
 * | Component | Props |
 * | --- | --- |
 * | `TreeItem` | `value` (required, the id of the node), `disabled`, `aria-label`, `id`, `title`, `hidden`, `className`, `style`, `children`. One node. Put a `TreeItemLabel` and, for a branch, a `TreeItemGroup` as its direct children. It has `data-selected` and `data-expanded`. |
 * | `TreeItemLabel` | `icon`, `title`, `className`, `style`, `children`. The text of the node, with the chevron of a branch and an optional leading icon. |
 * | `TreeItemGroup` | `id`, `title`, `className`, `style`, `children`. The children of a branch: more `TreeItem`s. It opens and closes with a height animation. It must be a direct child of the `TreeItem`. |
 */
export default {
  title: 'Components/Tree',
  component: Tree,
  tags: ['autodocs'],
  parameters: {
    docs: {
      importNames: ['Tree', 'TreeItem', 'TreeItemLabel', 'TreeItemGroup'],
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
      description: 'The root items: `TreeItem`s.',
      table: { type: { summary: 'ReactNode' } },
    },
    className: {
      control: 'text',
      description: 'Custom CSS class for the Tree.',
      table: { type: { summary: 'string' } },
    },
    style: {
      control: false,
      description:
        'Inline styles for the Tree. They are applied after the color variables, so they can override them (e.g. `--tree-solid`).',
      table: { type: { summary: 'CSSProperties' } },
    },
    selection: {
      control: 'radio',
      description:
        'How the items are picked. `single` selects one, `multiple` any number, `checkbox` shows a checkbox on every item (with `aria-checked`), and `none` selects nothing: the tree only opens and closes.',
      options: ['single', 'multiple', 'checkbox', 'none'],
      table: {
        type: { summary: `"single" | "multiple" | "checkbox" | "none"` },
        defaultValue: { summary: 'single' },
      },
    },
    cascade: {
      control: 'boolean',
      description:
        'Only with `selection="checkbox"`. Checking a branch checks everything under it, and a branch is checked, unchecked or mixed from the items under it. Items that are disabled keep their state.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
    value: {
      control: false,
      description:
        'The `value` of the selected item, or a list of them with `selection="multiple"` or `"checkbox"`. Makes the selection controlled: pass `onValueChange` to update it.',
      table: { type: { summary: 'string | string[]' } },
    },
    defaultValue: {
      control: false,
      description: 'The selected item or items when the selection is not controlled.',
      table: { type: { summary: 'string | string[]' } },
    },
    onValueChange: {
      control: false,
      description:
        'Called with the new selection: a `value`, or a list of them with `selection="multiple"` or `"checkbox"`.',
      table: { category: 'Events', type: { summary: '(value: string | string[]) => void' } },
    },
    expanded: {
      control: false,
      description:
        'The `value` of every open branch. Makes the open state controlled: pass `onExpandedChange` to update it.',
      table: { type: { summary: 'string[]' } },
    },
    defaultExpanded: {
      control: false,
      description: 'The branches that are open first, when the open state is not controlled.',
      table: { type: { summary: 'string[]' } },
    },
    onExpandedChange: {
      control: false,
      description: 'Called with the list of open branches when one opens or closes.',
      table: { category: 'Events', type: { summary: '(expanded: string[]) => void' } },
    },
    colorScheme: {
      control: 'select',
      description: 'Color scheme from the theme palette, including custom schemes added to it.',
      options: colorSchemes,
      table: { type: { summary: 'ColorScheme' }, defaultValue: { summary: 'primary' } },
    },
    size: {
      control: 'radio',
      description: 'Size of the text and the rows.',
      options: ['sm', 'md', 'lg'],
      table: { type: { summary: `"sm" | "md" | "lg"` }, defaultValue: { summary: 'md' } },
    },
    variant: {
      control: 'radio',
      description:
        'How the selected item looks. `solid` fills its row with the color, `ghost` tints it and `accent` draws a bar at its start. `unstyled` drops the Plume styles so you can bring your own; the structure and the keyboard keep working.',
      options: ['solid', 'ghost', 'accent', 'unstyled'],
      table: {
        type: { summary: `"solid" | "ghost" | "accent" | "unstyled"` },
        defaultValue: { summary: 'solid' },
      },
    },
    id: {
      control: false,
      description: 'Id of the Tree.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    title: {
      control: 'text',
      description: 'Native tooltip of the Tree.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    hidden: {
      control: false,
      description: 'Hides the Tree.',
      table: { category: 'HTML attributes', type: { summary: 'boolean' } },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible name of the Tree, for example "Project files".',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    'aria-labelledby': {
      control: false,
      description: 'Id of the element that names the Tree.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
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
  render: () => <CheckboxTree defaultValue={['users:read', 'reports']} />,
}

/**
 * With `cascade={false}` every checkbox is independent: checking a branch does not check what is under it, and
 * a branch does not show the mixed state.
 */
export const IndependentCheckboxes: Story = {
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
          className="rounded border border-gray-400 px-2 py-1 text-sm"
          onClick={() => setExpanded(['src', 'components', 'public'])}
          type="button"
        >
          Open all
        </button>
        <button
          className="rounded border border-gray-400 px-2 py-1 text-sm"
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
 * Some examples of Tree with Tailwind classes. With `variant="unstyled"` the Plume classes are gone and the
 * structure and the keyboard stay. Style the parts from their own classes: give the `TreeItem` the `group` class and use
 * `group-aria-[selected=true]:` on its `TreeItemLabel`, and `--tree-level` (set on every item) to indent.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Tree aria-label="Project files" className="text-sm text-foreground" defaultExpanded={["src"]} variant="unstyled">
  <TreeItem className="group outline-none" value="src">
    <TreeItemLabel
      className="flex cursor-pointer items-center gap-2 rounded-md py-1.5 pr-3 hover:bg-surface-muted group-aria-[selected=true]:bg-primary-solid group-aria-[selected=true]:text-primary-on-solid group-focus-visible:ring-2 group-focus-visible:ring-primary-solid [&_[data-plume-tree-chevron]]:group-aria-[expanded=true]:rotate-90"
      style={{ paddingInlineStart: "calc(0.75rem + (var(--tree-level) - 1) * 1.25rem)" }}
    >
      src
    </TreeItemLabel>
    <TreeItemGroup>
      <TreeItem className="group outline-none" value="index">
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
        <TreeItem className="group outline-none" value="src">
          <TreeItemLabel className={row} style={indent}>
            src
          </TreeItemLabel>
          <TreeItemGroup>
            <TreeItem className="group outline-none" value="index">
              <TreeItemLabel className={row} style={indent}>
                index.ts
              </TreeItemLabel>
            </TreeItem>
            <TreeItem className="group outline-none" value="tree">
              <TreeItemLabel className={row} style={indent}>
                tree.tsx
              </TreeItemLabel>
            </TreeItem>
          </TreeItemGroup>
        </TreeItem>
        <TreeItem className="group outline-none" value="readme">
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
