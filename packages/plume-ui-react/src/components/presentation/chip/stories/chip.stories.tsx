import type { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { defaultTheme } from '../../../../theme'
import { Chip, ChipIcon, ChipLabel, ChipRemove } from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

const avatar = (letter: string, color: string): React.ReactNode => (
  <img
    alt=""
    height={20}
    src={`data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="${color}"/><text x="12" y="16.5" font-family="sans-serif" font-size="12" font-weight="700" text-anchor="middle" fill="white">${letter}</text></svg>`,
    )}`}
    width={20}
  />
)

const noop = (): void => undefined

/**
 * A compact element for a value the user has entered or picked: a tag, a filter, a recipient, an option of a
 * `Select` that allows several. It can have an icon or an image and, with `onRemove`, a button to remove it.
 *
 * It renders a `<span>`. The remove button is named after the chip (`Remove Design`) unless you give it a
 * `labels.remove`, and an icon is decorative, so the text has to say what the chip is. A `Badge` labels a status
 * or a count and is never interactive, a `Chip` is a value that can go away.
 *
 * ### Parts
 *
 * Every element of the Chip is a part you can import. Without parts as children the Chip renders its text with the
 * `icon` before it and the remove button after it when it has `onRemove`. With parts, it renders them as written, so
 * you can reorder, leave out or replace each one.
 */
export default {
  title: 'Components/Chip',
  component: Chip,
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
      control: 'text',
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
    shape: {
      control: 'radio',
      options: ['rounded', 'pill'],
    },
    variant: {
      control: 'radio',
      options: ['solid', 'outline', 'subtle', 'unstyled'],
    },
    icon: {
      control: false,
    },
    onRemove: {
      control: false,
    },
    labels: {
      control: false,
    },
    disabled: {
      control: 'boolean',
    },
    id: {
      control: false,
    },
    title: {
      control: 'text',
    },
    hidden: {
      control: false,
    },
    'aria-label': {
      control: false,
    },
    'aria-labelledby': {
      control: false,
    },
  },
  args: {
    children: 'Design',
  },
} satisfies Meta<typeof Chip>

type Story = StoryObj<typeof Chip>

/**
 * This is the default Chip: a subtle, pill-shaped label.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick how the Chip looks: `subtle` tints it, `solid` fills it, `outline` only draws
 * its border, and `unstyled` drops the Plume styles so you can style it yourself.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Chip variant="subtle">Subtle</Chip>
      <Chip variant="solid">Solid</Chip>
      <Chip variant="outline">Outline</Chip>
      <Chip className="rounded-sm border border-gray-400 px-2 py-0.5 text-sm" variant="unstyled">
        Unstyled
      </Chip>
    </div>
  ),
}

/**
 * Use the **size** prop to change the text and the padding of the Chip.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Chip key={size} onRemove={noop} size={size}>
          Size {size}
        </Chip>
      ))}
    </div>
  ),
}

/**
 * Use the **colorScheme** prop to color the Chip with any color of the theme, including the ones you add.
 */
export const Colors: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {['primary', 'success', 'warning', 'error'].map((colorScheme) => (
        <Chip colorScheme={colorScheme as keyof typeof defaultTheme.colors} key={colorScheme}>
          {colorScheme}
        </Chip>
      ))}
    </div>
  ),
}

function RemovableExample(): React.ReactNode {
  const [tags, setTags] = useState(['Design', 'Research', 'Engineering', 'Product'])
  return (
    <div className="flex max-w-sm flex-wrap items-center justify-center gap-2">
      {tags.map((tag) => (
        <Chip key={tag} onRemove={() => setTags(tags.filter((item) => item !== tag))}>
          {tag}
        </Chip>
      ))}
      {tags.length === 0 ? <small>No tags left. Reload the story to get them back.</small> : null}
    </div>
  )
}

/**
 * With **onRemove** the Chip has a button to remove it. Its name is `Remove` followed by the text of the Chip, so
 * a screen reader says which one goes away, or give it your own with **labels.remove**.
 */
export const Removable: Story = {
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [tags, setTags] = useState(['Design', 'Research', 'Engineering', 'Product'])
  return (
    <div className="flex max-w-sm flex-wrap items-center justify-center gap-2">
      {tags.map((tag) => (
        <Chip key={tag} onRemove={() => setTags(tags.filter((item) => item !== tag))}>
          {tag}
        </Chip>
      ))}
      {tags.length === 0 ? <small>No tags left.</small> : null}
    </div>
  )
}`,
      },
    },
  },
  render: () => <RemovableExample />,
}

/**
 * An **icon** goes before the text, and it can be an image: give it `alt=""`, because it is decorative and the
 * text names the Chip.
 */
export const WithImage: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Chip icon={avatar('A', '#6d28d9')} onRemove={noop}>
        Ada Lovelace
      </Chip>
      <Chip icon={avatar('G', '#b45309')} onRemove={noop} variant="outline">
        Grace Hopper
      </Chip>
      <Chip colorScheme="primary" icon={avatar('L', '#047857')} variant="solid">
        Linus Torvalds
      </Chip>
    </div>
  ),
}

/**
 * A **disabled** Chip is dimmed and its remove button can't be used.
 */
export const Disabled: Story = {
  render: () => (
    <Chip disabled onRemove={noop}>
      Design
    </Chip>
  ),
}

/**
 * Give the Chip its parts as children to reorder, leave out or replace them. Here the remove button comes first,
 * the icon is an emoji and the label is styled on its own. The `icon` prop is not used when the Chip is composed.
 */
export const Compound: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Chip onRemove={() => undefined}>
  <ChipRemove />
  <ChipLabel className="font-semibold">Design</ChipLabel>
  <ChipIcon>🎨</ChipIcon>
</Chip>`,
      },
    },
  },
  render: () => (
    <Chip onRemove={noop}>
      <ChipRemove />
      <ChipLabel className="font-semibold">Design</ChipLabel>
      <ChipIcon>🎨</ChipIcon>
    </Chip>
  ),
}

/**
 * Some examples of Chip with Tailwind classes. With `variant="unstyled"` the `className` is the only class of the Chip and the `className` of each part is the only one of that part, which keeps its position and its row.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-wrap items-center gap-3">
  <Chip
    className="rounded-full bg-primary-solid py-0.5 pl-3 pr-1 text-xs font-semibold text-primary-on-solid"
    onRemove={() => undefined}
    variant="unstyled"
  >
    <ChipLabel>Design</ChipLabel>
    <ChipRemove className="h-4 w-4 justify-center rounded-full hover:bg-white/25" />
  </Chip>
  <Chip
    className="rounded-md border border-emerald-600 py-0.5 pl-2 pr-1 text-xs font-medium text-emerald-700 dark:text-emerald-400"
    onRemove={() => undefined}
    variant="unstyled"
  >
    <ChipLabel>Research</ChipLabel>
    <ChipRemove className="h-4 w-4 justify-center rounded-sm hover:bg-emerald-100 dark:hover:bg-emerald-950" />
  </Chip>
  <Chip
    className="rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-900"
    variant="unstyled"
  >
    Read only
  </Chip>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Chip
        className="rounded-full bg-primary-solid py-0.5 pl-3 pr-1 text-xs font-semibold text-primary-on-solid"
        onRemove={() => undefined}
        variant="unstyled"
      >
        <ChipLabel>Design</ChipLabel>
        <ChipRemove className="h-4 w-4 justify-center rounded-full hover:bg-white/25" />
      </Chip>
      <Chip
        className="rounded-md border border-emerald-600 py-0.5 pl-2 pr-1 text-xs font-medium text-emerald-700 dark:text-emerald-400"
        onRemove={() => undefined}
        variant="unstyled"
      >
        <ChipLabel>Research</ChipLabel>
        <ChipRemove className="h-4 w-4 justify-center rounded-sm hover:bg-emerald-100 dark:hover:bg-emerald-950" />
      </Chip>
      <Chip className="rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-900" variant="unstyled">
        Read only
      </Chip>
    </div>
  ),
}

/**
 * Some examples of Chip with Bootstrap classes: `badge` with a `text-bg-*` color and `rounded-pill`, plus `d-inline-flex` to keep the icon and the remove button in a row (Bootstrap makes a badge `display: inline-block`).
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="d-flex flex-wrap align-items-center gap-2">
  <Chip
    className="badge rounded-pill text-bg-primary d-inline-flex align-items-center gap-2 fw-normal"
    onRemove={() => undefined}
    variant="unstyled"
  >
    Design
  </Chip>
  <Chip
    className="badge rounded-pill text-bg-success d-inline-flex align-items-center gap-2 fw-normal"
    onRemove={() => undefined}
    variant="unstyled"
  >
    Research
  </Chip>
  <Chip className="badge rounded-pill border text-body fw-normal" variant="unstyled">
    Read only
  </Chip>
</div>`,
      },
    },
  },
  render: () => (
    <div className="d-flex flex-wrap align-items-center gap-2">
      <Chip
        className="badge rounded-pill text-bg-primary d-inline-flex align-items-center gap-2 fw-normal"
        onRemove={() => undefined}
        variant="unstyled"
      >
        Design
      </Chip>
      <Chip
        className="badge rounded-pill text-bg-success d-inline-flex align-items-center gap-2 fw-normal"
        onRemove={() => undefined}
        variant="unstyled"
      >
        Research
      </Chip>
      <Chip className="badge rounded-pill border text-body fw-normal" variant="unstyled">
        Read only
      </Chip>
    </div>
  ),
}
