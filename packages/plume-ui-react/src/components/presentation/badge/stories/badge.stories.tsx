import type { StoryObj, Meta } from '@storybook/react-vite'
import { defaultTheme } from '../../../../theme'
import { Badge } from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

/**
 * A small label that tags something with a status, a count or a category. It renders a `<span>`, so it can sit
 * inside a heading, a button or a line of text. Its meaning has to be in the text: when a color or a dot is all
 * it shows, give it an `aria-label`. A Badge with an `aria-label` or an `aria-labelledby` is an image for
 * assistive technology, because a plain `<span>` can't take a name, and the label replaces its text.
 */
export default {
  title: 'Components/Badge',
  component: Badge,
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
    dot: {
      control: 'boolean',
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
    children: 'New',
  },
} satisfies Meta<typeof Badge>

type Story = StoryObj<typeof Badge>

/**
 * This is the default Badge. Its **children** are the content.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick how the Badge looks: `solid` fills it with the color, `subtle` tints it,
 * `outline` only draws its border, and `unstyled` drops the Plume styles so you can style it yourself.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center items-center gap-4">
      <Badge variant="solid">Solid</Badge>
      <Badge variant="subtle">Subtle</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge className="px-2 py-1 rounded bg-black text-white" variant="unstyled">
        Unstyled
      </Badge>
    </div>
  ),
}

/**
 * Use the **size** prop to change the size of the Badge.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center items-center gap-4">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
}

/**
 * Use the **colorScheme** prop to pick a color from the theme.
 */
export const Colors: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center items-center gap-4">
      {colorSchemes.map((scheme) => (
        <Badge colorScheme={scheme as keyof typeof defaultTheme.colors} key={scheme}>
          {scheme}
        </Badge>
      ))}
    </div>
  ),
}

/**
 * Use the **shape** prop to round the corners of the Badge into a pill.
 */
export const Shapes: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center items-center gap-4">
      <Badge shape="rounded">Rounded</Badge>
      <Badge shape="pill">Pill</Badge>
    </div>
  ),
}

/**
 * Add **dot** to show a status dot before the content.
 */
export const WithDot: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center items-center gap-4">
      <Badge colorScheme="success" dot variant="subtle">
        Online
      </Badge>
      <Badge colorScheme="warning" dot variant="subtle">
        Away
      </Badge>
      <Badge colorScheme="error" dot variant="subtle">
        Offline
      </Badge>
    </div>
  ),
}

/**
 * A Badge with **dot** and no children is just the dot, in the color of the scheme. A dot says nothing to a
 * screen reader, so name it with **aria-label**, and the Badge gets the `img` role.
 */
export const DotOnly: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center items-center gap-4">
      <Badge aria-label="Online" colorScheme="success" dot />
      <Badge aria-label="Away" colorScheme="warning" dot />
      <Badge aria-label="Offline" colorScheme="error" dot />
      <Badge aria-label="Offline" colorScheme="error" dot size="lg" />
    </div>
  ),
}

/**
 * Some examples of Badge with Tailwind classes. With `variant="unstyled"` the `className` is the only class of the badge.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-wrap items-center gap-3">
  <Badge
    className="inline-flex items-center rounded-full bg-primary-solid px-2.5 py-0.5 text-xs font-semibold text-primary-on-solid"
    variant="unstyled"
  >
    New
  </Badge>
  <Badge
    className="inline-flex items-center rounded border border-emerald-600 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400"
    variant="unstyled"
  >
    Paid
  </Badge>
  <Badge
    className="inline-flex items-center rounded-md bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800"
    variant="unstyled"
  >
    Failed
  </Badge>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge
        className="inline-flex items-center rounded-full bg-primary-solid px-2.5 py-0.5 text-xs font-semibold text-primary-on-solid"
        variant="unstyled"
      >
        New
      </Badge>
      <Badge
        className="inline-flex items-center rounded border border-emerald-600 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400"
        variant="unstyled"
      >
        Paid
      </Badge>
      <Badge
        className="inline-flex items-center rounded-md bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800"
        variant="unstyled"
      >
        Failed
      </Badge>
    </div>
  ),
}

/**
 * Some examples of Badge with Bootstrap classes: `badge` with a `text-bg-*` color, and `rounded-pill`.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="d-flex flex-wrap align-items-center gap-2">
  <Badge className="badge text-bg-primary" variant="unstyled">
    New
  </Badge>
  <Badge className="badge rounded-pill text-bg-success" variant="unstyled">
    Paid
  </Badge>
  <Badge className="badge text-bg-danger" variant="unstyled">
    Failed
  </Badge>
  <Badge className="badge border text-body" variant="unstyled">
    Draft
  </Badge>
</div>`,
      },
    },
  },
  render: () => (
    <div className="d-flex flex-wrap align-items-center gap-2">
      <Badge className="badge text-bg-primary" variant="unstyled">
        New
      </Badge>
      <Badge className="badge rounded-pill text-bg-success" variant="unstyled">
        Paid
      </Badge>
      <Badge className="badge text-bg-danger" variant="unstyled">
        Failed
      </Badge>
      <Badge className="badge border text-body" variant="unstyled">
        Draft
      </Badge>
    </div>
  ),
}
