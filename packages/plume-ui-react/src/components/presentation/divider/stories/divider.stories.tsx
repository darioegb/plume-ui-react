import type { StoryObj, Meta } from '@storybook/react-vite'
import { Divider, DividerLabel } from '..'

/**
 * A line that separates two groups of content. Without children it is an `<hr>`, so assistive technology
 * announces a separator between the groups. With children, the text sits between two lines (the classic "or"
 * between two ways of signing in) and it is read as plain text, because a separator can't have content.
 *
 * Use **orientation** `vertical` to separate things in a row, such as the items of a toolbar: give the row
 * a height and the line stretches to it. A vertical Divider has no label.
 *
 * When the line is only decoration, because the content already says where one part ends and the next begins,
 * pass **decorative** to hide it from assistive technology. `List` and `Dropdown` already use the Divider for
 * their `ListDivider` and `DropdownSeparator`.
 *
 * The label is a part, `DividerLabel`. A plain child is wrapped in it for you, so `<Divider>or</Divider>` and
 * `<Divider><DividerLabel>or</DividerLabel></Divider>` render the same. Use the part when you want its own class,
 * style or ref, or to put something else (an icon) next to the text. The Divider has no state to share, so it is
 * a plain component that a Server Component can render.
 *
 * ### Subcomponents
 *
 * | Component | Props |
 * | --- | --- |
 * | `DividerLabel` | `className`, `style`, `ref`, `children`. The text between the two lines of a horizontal Divider. |
 */
export default {
  title: 'Components/Divider',
  component: Divider,
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
      description:
        'A label shown between two lines, as text or as a `DividerLabel`. It only works with a horizontal Divider, and without it the Divider is an `<hr>`.',
      table: { type: { summary: 'ReactNode' } },
    },
    align: {
      control: 'radio',
      description: 'Where the label sits along the line.',
      options: ['start', 'center', 'end'],
      table: {
        type: { summary: `"start" | "center" | "end"` },
        defaultValue: { summary: 'center' },
      },
    },
    orientation: {
      control: 'radio',
      description: 'Direction of the line.',
      options: ['horizontal', 'vertical'],
      table: {
        type: { summary: `"horizontal" | "vertical"` },
        defaultValue: { summary: 'horizontal' },
      },
    },
    variant: {
      control: 'radio',
      description:
        'Style of the line. `unstyled` drops the Plume styles so you can bring your own.',
      options: ['solid', 'dashed', 'dotted', 'unstyled'],
      table: {
        type: { summary: `"solid" | "dashed" | "dotted" | "unstyled"` },
        defaultValue: { summary: 'solid' },
      },
    },
    size: {
      control: 'radio',
      description: 'Thickness of the line: 1, 2 or 3 pixels.',
      options: ['sm', 'md', 'lg'],
      table: { type: { summary: `"sm" | "md" | "lg"` }, defaultValue: { summary: 'sm' } },
    },
    spacing: {
      control: 'radio',
      description: 'Space around the line. By default there is none.',
      options: [undefined, 'sm', 'md', 'lg'],
      table: { type: { summary: `"sm" | "md" | "lg"` } },
    },
    decorative: {
      control: 'boolean',
      description: 'Hides the line from assistive technology (`role="none"`).',
      table: {
        category: 'Accessibility',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    className: {
      control: 'text',
      description: 'Custom CSS class for the Divider.',
      table: { type: { summary: 'string' } },
    },
    style: {
      control: false,
      description:
        'Inline styles for the Divider. Set `--divider-color` to change the color of the line.',
      table: { type: { summary: 'CSSProperties' } },
    },
    id: {
      control: false,
      description: 'Id of the Divider.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    title: {
      control: 'text',
      description: 'Native tooltip of the Divider.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    hidden: {
      control: 'boolean',
      description: 'Hides the Divider.',
      table: { category: 'HTML attributes', type: { summary: 'boolean' } },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible name of the separator.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    'aria-labelledby': {
      control: false,
      description: 'Id of the element that names the separator.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
  },
  args: {
    spacing: 'md',
  },
  render: (args) => (
    <div style={{ maxWidth: '100%', width: '22rem' }}>
      <p className="text-sm">Account</p>
      <Divider {...args} />
      <p className="text-sm">Notifications</p>
    </div>
  ),
} satisfies Meta<typeof Divider>

type Story = StoryObj<typeof Divider>

/**
 * This is the default Divider: a thin solid line between two groups of content.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick the style of the line: `solid`, `dashed` or `dotted`. `unstyled` drops the
 * Plume styles so you can style it yourself.
 */
export const Variants: Story = {
  render: (args) => (
    <div style={{ maxWidth: '100%', width: '22rem' }}>
      {(['solid', 'dashed', 'dotted'] as const).map((variant) => (
        <Divider {...args} key={variant} variant={variant} />
      ))}
      <Divider
        {...args}
        className="border-0 border-t-4 border-double border-gray-500"
        variant="unstyled"
      />
    </div>
  ),
}

/**
 * Use the **size** prop to change the thickness of the line.
 */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ maxWidth: '100%', width: '22rem' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Divider {...args} key={size} size={size} />
      ))}
    </div>
  ),
}

/**
 * With children, the Divider shows a label between two lines. Use **align** to move it to the start or the end.
 */
export const WithLabel: Story = {
  render: (args) => (
    <div style={{ maxWidth: '100%', width: '22rem' }}>
      <Divider {...args}>or</Divider>
      <Divider {...args} align="start">
        Start
      </Divider>
      <Divider {...args} align="end">
        End
      </Divider>
      <Divider {...args} variant="dashed">
        Dashed
      </Divider>
    </div>
  ),
}

/**
 * Use the `DividerLabel` part to give the label its own class or style, or to put something else next to the text.
 */
export const Compound: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Divider>
  <DividerLabel style={{ fontWeight: 600 }}>or continue with</DividerLabel>
</Divider>`,
      },
    },
  },
  render: () => (
    <div style={{ maxWidth: '100%', width: '22rem' }}>
      <Divider>
        <DividerLabel style={{ fontWeight: 600 }}>or continue with</DividerLabel>
      </Divider>
    </div>
  ),
}

/**
 * A **vertical** Divider separates things in a row. The row needs a height, which the line stretches to.
 */
export const Vertical: Story = {
  render: (args) => (
    <div className="flex h-8 items-center">
      <span className="text-sm">Home</span>
      <Divider {...args} orientation="vertical" />
      <span className="text-sm">Docs</span>
      <Divider {...args} orientation="vertical" variant="dashed" />
      <span className="text-sm">Blog</span>
    </div>
  ),
}

/**
 * **spacing** adds space around the line, so you don't need a margin of your own.
 */
export const Spacing: Story = {
  render: (args) => (
    <div style={{ maxWidth: '100%', width: '22rem' }}>
      {([undefined, 'sm', 'md', 'lg'] as const).map((spacing) => (
        <div key={spacing ?? 'none'}>
          <p className="text-sm">spacing: {spacing ?? 'none'}</p>
          <Divider {...args} spacing={spacing} />
        </div>
      ))}
    </div>
  ),
}

/**
 * Without a label the Divider is an `<hr>`, which a screen reader announces as a separator. When the line is
 * only decoration, pass **decorative** so it is skipped.
 */
export const Accessibility: Story = {
  render: (args) => (
    <div style={{ maxWidth: '100%', width: '22rem' }}>
      <p className="text-sm">Announced as a separator</p>
      <Divider {...args} />
      <p className="text-sm">Hidden from assistive technology</p>
      <Divider {...args} decorative />
      <p className="text-sm">Last</p>
    </div>
  ),
}

/**
 * Some examples of Divider with Tailwind classes. With `variant="unstyled"` the Divider has no Plume styles, so it takes the classes you give it.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Divider className="my-[0.75rem] border-0 border-t border-dashed border-blue-700" variant="unstyled" />
<Divider
  className="flex items-center gap-[0.5rem] before:h-px before:flex-1 before:bg-blue-700 after:h-px after:flex-1 after:bg-blue-700"
  variant="unstyled"
>
  <DividerLabel className="px-[0.75rem] text-sm uppercase tracking-wide text-muted">or</DividerLabel>
</Divider>`,
      },
    },
  },
  render: () => (
    <div style={{ maxWidth: '100%', width: '22rem' }}>
      <Divider
        className="my-[0.75rem] border-0 border-t border-dashed border-blue-700"
        variant="unstyled"
      />
      <Divider
        className="flex items-center gap-[0.5rem] before:h-px before:flex-1 before:bg-blue-700 after:h-px after:flex-1 after:bg-blue-700"
        variant="unstyled"
      >
        <DividerLabel className="px-[0.75rem] text-sm uppercase tracking-wide text-muted">
          or
        </DividerLabel>
      </Divider>
    </div>
  ),
}

/**
 * Some examples of Divider with Bootstrap classes.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Divider className="border-primary border-1 opacity-100 my-3" variant="unstyled" />
<Divider className="d-flex align-items-center gap-2 text-body-secondary" variant="unstyled">
  <DividerLabel className="small text-uppercase">or</DividerLabel>
</Divider>`,
      },
    },
  },
  render: () => (
    <div style={{ maxWidth: '100%', width: '22rem' }}>
      <Divider className="border-primary border-1 opacity-100 my-3" variant="unstyled" />
      <Divider className="d-flex align-items-center gap-2 text-body-secondary" variant="unstyled">
        <DividerLabel className="small text-uppercase">or</DividerLabel>
      </Divider>
    </div>
  ),
}
