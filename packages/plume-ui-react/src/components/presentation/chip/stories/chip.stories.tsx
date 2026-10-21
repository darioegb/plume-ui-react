import type { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { defaultTheme } from '../../../../theme'
import { Chip } from '..'

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
 * `removeLabel`, and an icon is decorative, so the text has to say what the chip is. A `Badge` labels a status
 * or a count and is never interactive, a `Chip` is a value that can go away.
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
      description: 'Text of the Chip.',
      table: { type: { summary: 'ReactNode' } },
    },
    className: {
      control: 'text',
      description: 'Custom CSS class for the Chip.',
      table: { type: { summary: 'string' } },
    },
    classNames: {
      control: false,
      description:
        'Custom CSS classes for the parts of the Chip, in every variant: `icon`, `label` and `remove`. With `variant="unstyled"` they are the only classes the parts have.',
      table: { type: { summary: `Partial<Record<ChipPart, string>>` } },
    },
    style: {
      control: false,
      description:
        'Inline styles for the Chip. They are applied after the color variables, so they can override them (e.g. `--chip-tint`).',
      table: { type: { summary: 'CSSProperties' } },
    },
    colorScheme: {
      control: 'select',
      description: 'Color scheme from the theme palette, including custom schemes added to it.',
      options: colorSchemes,
      table: { type: { summary: 'ColorScheme' }, defaultValue: { summary: 'secondary' } },
    },
    size: {
      control: 'radio',
      description: 'Size of the Chip.',
      options: ['sm', 'md', 'lg'],
      table: { type: { summary: `"sm" | "md" | "lg"` }, defaultValue: { summary: 'md' } },
    },
    shape: {
      control: 'radio',
      description: 'Corners of the Chip.',
      options: ['rounded', 'pill'],
      table: { type: { summary: `"rounded" | "pill"` }, defaultValue: { summary: 'pill' } },
    },
    variant: {
      control: 'radio',
      description:
        'Visual variant. `subtle` tints the Chip, `solid` fills it and `outline` only draws its border. `unstyled` drops the Plume styles so you can bring your own.',
      options: ['solid', 'outline', 'subtle', 'unstyled'],
      table: {
        type: { summary: `"solid" | "outline" | "subtle" | "unstyled"` },
        defaultValue: { summary: 'subtle' },
      },
    },
    icon: {
      control: false,
      description:
        'An icon or an image before the text. It is decorative, so it is hidden from screen readers: give an image `alt=""`.',
      table: { type: { summary: 'ReactNode' } },
    },
    onRemove: {
      control: false,
      description: 'Shows a remove button, and is called when it is clicked.',
      table: { type: { summary: '(event: MouseEvent<HTMLButtonElement>) => void' } },
    },
    removeLabel: {
      control: 'text',
      description:
        'Accessible name of the remove button. By default it is `Remove` followed by the text of the Chip.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Dims the Chip and disables its remove button.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    id: {
      control: false,
      description: 'Id of the `<span>`.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    title: {
      control: 'text',
      description: 'Native tooltip of the Chip.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    hidden: {
      control: false,
      description: 'Hides the Chip.',
      table: { category: 'HTML attributes', type: { summary: 'boolean' } },
    },
    'aria-label': {
      control: false,
      description: 'Accessible name of the Chip, when its text is not enough.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    'aria-labelledby': {
      control: false,
      description: 'Id of the element that names the Chip.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
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
      <Chip className="rounded border border-gray-400 px-2 py-0.5 text-sm" variant="unstyled">
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
 * a screen reader says which one goes away, or give it your own with **removeLabel**.
 */
export const Removable: Story = {
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
 * Some examples of Chip with Tailwind classes. With `variant="unstyled"` the `className` is the only class of the Chip and `classNames` the only ones of its icon, label and remove button, which keeps its position and its row.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-wrap items-center gap-3">
  <Chip
    className="rounded-full bg-primary-solid py-0.5 pl-3 pr-1 text-xs font-semibold text-primary-on-solid"
    classNames={{ remove: "h-4 w-4 justify-center rounded-full hover:bg-white/25" }}
    onRemove={() => undefined}
    variant="unstyled"
  >
    Design
  </Chip>
  <Chip
    className="rounded-md border border-emerald-600 py-0.5 pl-2 pr-1 text-xs font-medium text-emerald-700 dark:text-emerald-400"
    classNames={{ remove: "h-4 w-4 justify-center rounded hover:bg-emerald-100 dark:hover:bg-emerald-950" }}
    onRemove={() => undefined}
    variant="unstyled"
  >
    Research
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
        classNames={{ remove: 'h-4 w-4 justify-center rounded-full hover:bg-white/25' }}
        onRemove={() => undefined}
        variant="unstyled"
      >
        Design
      </Chip>
      <Chip
        className="rounded-md border border-emerald-600 py-0.5 pl-2 pr-1 text-xs font-medium text-emerald-700 dark:text-emerald-400"
        classNames={{
          remove: 'h-4 w-4 justify-center rounded hover:bg-emerald-100 dark:hover:bg-emerald-950',
        }}
        onRemove={() => undefined}
        variant="unstyled"
      >
        Research
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
