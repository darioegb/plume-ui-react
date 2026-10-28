import type { StoryObj, Meta } from '@storybook/react-vite'
import { Heading } from '..'

/**
 * A heading of the page, with the text styles `heading-1` to `heading-6` of the theme: the size, the weight, the
 * line height and the letter spacing of each one come from the tokens, so a theme that changes them changes
 * every heading.
 *
 * The **level** is the element (`h1` to `h6`) and says where the heading is in the outline of the page, which is
 * what assistive technology reads. The **size** is how it looks, and follows the level unless you give it: an
 * `h2` that has to look like a small heading is `level={2} size={5}`, and stays an `h2`. Don't pick a level for
 * its looks, and don't skip levels.
 *
 * A Heading has no variants besides `unstyled`: it draws no fill or border, only text, so its look is the
 * **size**. There is no `colorScheme` either: it takes the text color around it, and `className` can change it.
 */
export default {
  title: 'Components/Heading',
  component: Heading,
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
    level: {
      control: 'radio',
      options: [1, 2, 3, 4, 5, 6],
    },
    size: {
      control: 'radio',
      options: [undefined, 1, 2, 3, 4, 5, 6],
    },
    truncate: {
      control: 'boolean',
    },
    variant: {
      control: 'radio',
      options: ['default', 'unstyled'],
    },
    id: {
      control: false,
    },
    title: {
      control: 'text',
    },
    hidden: {
      control: 'boolean',
    },
    lang: {
      control: false,
    },
    'aria-label': {
      control: 'text',
    },
    'aria-labelledby': {
      control: false,
    },
  },
  args: {
    children: 'The quick brown fox',
  },
} satisfies Meta<typeof Heading>

type Story = StoryObj<typeof Heading>

/**
 * This is the default Heading: an `h2` that looks like a size 2.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to drop the Plume styles: `default` has the text style of the size, `unstyled` keeps
 * only the element and your `className`. The look of a Heading is its **size**, not a variant.
 */
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-4">
  <Heading variant="default">Default</Heading>
  <Heading variant="unstyled">Unstyled</Heading>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Heading variant="default">Default</Heading>
      <Heading variant="unstyled">Unstyled</Heading>
    </div>
  ),
}

/**
 * Use the **size** prop to change how the heading looks, from 1 (the biggest) to 6, without changing its
 * **level**. Here every heading is an `h2`.
 */
export const Sizes: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-3">
  <Heading size={1}>Size 1</Heading>
  <Heading size={2}>Size 2</Heading>
  <Heading size={3}>Size 3</Heading>
  <Heading size={4}>Size 4</Heading>
  <Heading size={5}>Size 5</Heading>
  <Heading size={6}>Size 6</Heading>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3">
      {([1, 2, 3, 4, 5, 6] as const).map((size) => (
        <Heading key={size} size={size}>
          Size {size}
        </Heading>
      ))}
    </div>
  ),
}

/**
 * The **level** picks the element and the outline of the page, and by default also the look. Check the levels
 * of the page with the accessibility tree of the browser.
 */
export const Levels: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-3">
  <Heading level={1}>Level 1</Heading>
  <Heading level={2}>Level 2</Heading>
  <Heading level={3}>Level 3</Heading>
  <Heading level={4}>Level 4</Heading>
  <Heading level={5}>Level 5</Heading>
  <Heading level={6}>Level 6</Heading>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3">
      {([1, 2, 3, 4, 5, 6] as const).map((level) => (
        <Heading key={level} level={level}>
          Level {level}
        </Heading>
      ))}
    </div>
  ),
}

/**
 * A section title that is an `h2` in the outline and looks like a small heading, because **size** and **level**
 * are separate.
 */
export const LevelAndSize: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-2">
  <Heading level={1}>Account</Heading>
  <Heading level={2} size={5}>
    Notifications
  </Heading>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-2">
      <Heading level={1}>Account</Heading>
      <Heading level={2} size={5}>
        Notifications
      </Heading>
    </div>
  ),
}

/**
 * With **truncate** the heading stays on one line and ends with an ellipsis. It needs a width to fit in.
 */
export const Truncate: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div style={{ width: '16rem' }}>
  <Heading truncate>A title that is longer than the space it has</Heading>
</div>`,
      },
    },
  },
  render: () => (
    <div style={{ width: '16rem' }}>
      <Heading truncate>A title that is longer than the space it has</Heading>
    </div>
  ),
}

/**
 * Some examples of Heading with Tailwind classes. With `variant="unstyled"` only the element is left, so the
 * classes bring the whole look.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-3">
  <Heading className="text-3xl font-bold tracking-tight text-foreground" level={1} variant="unstyled">
    Dashboard
  </Heading>
  <Heading className="text-sm font-semibold uppercase tracking-wide text-muted" level={2} variant="unstyled">
    Overview
  </Heading>
  <Heading className="text-heading-4 text-primary-text" level={3} variant="unstyled">
    With the text style of the theme
  </Heading>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3">
      <Heading
        className="text-3xl font-bold tracking-tight text-foreground"
        level={1}
        variant="unstyled"
      >
        Dashboard
      </Heading>
      <Heading
        className="text-sm font-semibold uppercase tracking-wide text-muted"
        level={2}
        variant="unstyled"
      >
        Overview
      </Heading>
      <Heading className="text-heading-4 text-primary-text" level={3} variant="unstyled">
        With the text style of the theme
      </Heading>
    </div>
  ),
}

/**
 * Some examples of Heading with Bootstrap classes. The `display-*` and `h*` classes give the look and the
 * **level** keeps the outline.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="d-flex flex-column gap-3">
  <Heading className="display-5" level={1} variant="unstyled">
    Dashboard
  </Heading>
  <Heading className="h4 text-body-secondary" level={2} variant="unstyled">
    Overview
  </Heading>
</div>`,
      },
    },
  },
  render: () => (
    <div className="d-flex flex-column gap-3">
      <Heading className="display-5" level={1} variant="unstyled">
        Dashboard
      </Heading>
      <Heading className="h4 text-body-secondary" level={2} variant="unstyled">
        Overview
      </Heading>
    </div>
  ),
}
