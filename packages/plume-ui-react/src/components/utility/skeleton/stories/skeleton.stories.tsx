import type { StoryObj, Meta } from '@storybook/react-vite'
import { Skeleton } from '..'

/**
 * A placeholder that takes the place of content that is still loading, so the page keeps its shape and does not
 * jump when the content arrives. Use it for what will be text, an image or an avatar.
 *
 * A Skeleton carries no information, so it is hidden from screen readers (`aria-hidden`). Tell them the area is
 * loading on the container that holds the skeletons, with `aria-busy="true"` and, if it helps, a visually hidden
 * message or a live region. It has no size or color scheme on purpose: its size comes from `width` and `height`
 * (or from its `shape`), and its color from the surface of the theme, so it follows the color mode. The pulse and
 * the wave stop with `prefers-reduced-motion`.
 */
export default {
  title: 'Components/Skeleton',
  component: Skeleton,
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
    className: {
      control: 'text',
      description: 'Custom CSS class for the Skeleton.',
      table: { type: { summary: 'string' } },
    },
    lineClassName: {
      control: 'text',
      description:
        'Custom CSS class for every line when `lines` is more than one. With `variant="unstyled"` it is the only class the lines have.',
      table: { type: { summary: 'string' } },
    },
    style: {
      control: false,
      description:
        'Inline styles for the Skeleton. They are applied after the size variables, so they can override them.',
      table: { type: { summary: 'CSSProperties' } },
    },
    shape: {
      control: 'radio',
      description:
        'What the Skeleton stands for: a line of `text`, a `rect` (an image or a card) or a `circle` (an avatar).',
      options: ['text', 'rect', 'circle'],
      table: { type: { summary: `"text" | "rect" | "circle"` }, defaultValue: { summary: 'text' } },
    },
    width: {
      control: 'text',
      description:
        'Width, in pixels as a number or with any CSS unit as a string. A text fills its container by default, a circle is 3rem.',
      table: { type: { summary: 'number | string' } },
    },
    height: {
      control: 'text',
      description:
        'Height, in pixels as a number or with any CSS unit as a string. A text is one line tall, a rect 6rem and a circle 3rem.',
      table: { type: { summary: 'number | string' } },
    },
    lines: {
      control: 'number',
      description:
        'How many lines of text to show. The last one is shorter. It only applies to the `text` shape.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '1' } },
    },
    variant: {
      control: 'radio',
      description:
        'Animation. `pulse` fades it in and out, `wave` sweeps a light across it. `unstyled` drops the Plume styles, the animation too, and keeps the structure so you can bring your own.',
      options: ['pulse', 'wave', 'unstyled'],
      table: {
        type: { summary: `"pulse" | "wave" | "unstyled"` },
        defaultValue: { summary: 'pulse' },
      },
    },
    id: {
      control: false,
      description: 'Id of the Skeleton.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    hidden: {
      control: false,
      description: 'Hides the Skeleton.',
      table: { category: 'HTML attributes', type: { summary: 'boolean' } },
    },
  },
  args: {
    style: { width: '16rem' },
  },
} satisfies Meta<typeof Skeleton>

type Story = StoryObj<typeof Skeleton>

/**
 * This is the default Skeleton: a pulsing line of text.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick the animation. `unstyled` drops the Plume styles so you can style it yourself.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4" style={{ width: '16rem' }}>
      <Skeleton variant="pulse" />
      <Skeleton variant="wave" />
      <Skeleton className="rounded bg-gray-300" height={16} variant="unstyled" />
    </div>
  ),
}

/**
 * Use the **shape** prop to match what is loading: `text`, `rect` or `circle`. A Skeleton has no `size` prop; give
 * it a `width` and a `height` to fit the content.
 */
export const Shapes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Skeleton shape="circle" />
      <div className="flex flex-col gap-2">
        <Skeleton height={14} shape="text" width={160} />
        <Skeleton height={14} shape="text" width={110} />
      </div>
      <Skeleton height={64} shape="rect" width={96} />
    </div>
  ),
}

/**
 * Use **lines** for a paragraph. The last line is shorter, like the end of a real one, and the lines are spaced by
 * the Skeleton itself.
 */
export const Lines: Story = {
  args: { lines: 4 },
}

/**
 * Put the skeletons where the content will be, mark the container with `aria-busy` and swap them for the real
 * content when it is ready. The skeleton is hidden from screen readers, so `aria-busy` is what tells them the area
 * is loading.
 */
export const Loading: Story = {
  render: () => (
    <div aria-busy="true" className="flex w-72 gap-3 rounded-lg border border-gray-300 p-4">
      <Skeleton shape="circle" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton height={16} width="60%" />
        <Skeleton lines={3} />
      </div>
    </div>
  ),
}

/**
 * Some examples of Skeleton with Tailwind classes. With `variant="unstyled"` the Skeleton keeps its width and height
 * and has no color or animation of its own: `className` brings them, and `lineClassName` styles every line.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div aria-busy="true" className="flex w-72 gap-3 rounded-lg border border-border bg-surface p-4">
  <Skeleton className="animate-pulse rounded-full bg-surface-muted" height={48} variant="unstyled" width={48} />
  <div className="flex flex-1 flex-col gap-2">
    <Skeleton className="animate-pulse rounded bg-surface-muted" height={16} variant="unstyled" width="60%" />
    <Skeleton
      className="flex flex-col gap-2"
      lineClassName="h-3 animate-pulse rounded bg-surface-muted"
      lines={3}
      variant="unstyled"
    />
  </div>
</div>`,
      },
    },
  },
  render: () => (
    <div
      aria-busy="true"
      className="flex w-72 gap-3 rounded-lg border border-border bg-surface p-4"
    >
      <Skeleton
        className="animate-pulse rounded-full bg-surface-muted"
        height={48}
        variant="unstyled"
        width={48}
      />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton
          className="animate-pulse rounded bg-surface-muted"
          height={16}
          variant="unstyled"
          width="60%"
        />
        <Skeleton
          className="flex flex-col gap-2"
          lineClassName="h-3 animate-pulse rounded bg-surface-muted"
          lines={3}
          variant="unstyled"
        />
      </div>
    </div>
  ),
}

/**
 * Some examples of Skeleton with Bootstrap classes: `placeholder-glow` on the container and `placeholder` on the
 * Skeleton, with the `col-*` widths. Bootstrap's `placeholder` is `display: inline-block`, so `d-block` keeps the
 * Skeleton on its own line.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div aria-busy="true" className="card placeholder-glow" style={{ width: "18rem" }}>
  <div className="card-body">
    <Skeleton className="placeholder d-block col-6 mb-3" height={20} variant="unstyled" />
    <Skeleton
      className="d-flex flex-column gap-2"
      lineClassName="placeholder d-block col-12"
      lines={3}
      variant="unstyled"
    />
  </div>
</div>`,
      },
    },
  },
  render: () => (
    <div aria-busy="true" className="card placeholder-glow" style={{ width: '18rem' }}>
      <div className="card-body">
        <Skeleton className="placeholder d-block col-6 mb-3" height={20} variant="unstyled" />
        <Skeleton
          className="d-flex flex-column gap-2"
          lineClassName="placeholder d-block col-12"
          lines={3}
          variant="unstyled"
        />
      </div>
    </div>
  ),
}
