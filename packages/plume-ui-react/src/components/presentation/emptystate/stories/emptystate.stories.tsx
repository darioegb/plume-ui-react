import type { StoryObj, Meta } from '@storybook/react-vite'
import { Button } from '../../../interaction/button'
import {
  EmptyState,
  EmptyStateAction,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
} from '..'

const inbox = (
  <svg
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <path d="M22 12h-6l-2 3h-4l-2-3H2" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
)

/**
 * What a list, a table or a page shows when there is nothing to show yet: a title that says so, a line that
 * explains why or what to do, and an action. Every part is optional, so use only the ones that help.
 *
 * Plume doesn't ship an icon set: pass your own SVG as the **icon**. It is decorative, so it is hidden from
 * assistive technology, and its size follows the **size** of the EmptyState.
 *
 * The **title** is a `<div>` by default, because the right heading level depends on the page. Use **titleAs**
 * (`h2` to `h6`) when the title should be part of the outline. When the state appears after the user did
 * something (a search with no results), pass `role="status"` so a screen reader announces it.
 *
 * It has no text of its own: you write the title, the description and the label of the action, so they can be
 * translated like the rest of your interface.
 *
 * Given the **icon**, **title**, **description** and **action** props it renders them in that order. To reorder them,
 * leave one out or style each, give it its parts as children instead: the props are then ignored. The EmptyState
 * has no state to share, so it is a plain component that a Server Component can render.
 *
 * ### Subcomponents
 *
 * | Component | Props |
 * | --- | --- |
 * | `EmptyStateIcon` | `className`, `style`, `ref`, `children`. The decorative icon, hidden from assistive technology. |
 * | `EmptyStateTitle` | `className`, `style`, `ref`, `children`, `as` (`div` by default, or `h2` to `h6`). |
 * | `EmptyStateDescription` | `className`, `style`, `ref`, `children`. The `<p>` that explains. |
 * | `EmptyStateAction` | `className`, `style`, `ref`, `children`. What the user can do about it. |
 */
export default {
  title: 'Components/EmptyState',
  component: EmptyState,
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
    title: {
      control: 'text',
      description: 'What is empty, in a few words.',
      table: { type: { summary: 'ReactNode' } },
    },
    description: {
      control: 'text',
      description: 'Why it is empty, or what the user can do about it.',
      table: { type: { summary: 'ReactNode' } },
    },
    icon: {
      control: false,
      description:
        'An SVG shown above the title. It is decorative and takes the size of the EmptyState.',
      table: { type: { summary: 'ReactNode' } },
    },
    action: {
      control: false,
      description: 'What the user can do: usually a `Button` or a link.',
      table: { type: { summary: 'ReactNode' } },
    },
    titleAs: {
      control: 'radio',
      description: 'Element of the title: a `div` or a heading level.',
      options: ['div', 'h2', 'h3', 'h4', 'h5', 'h6'],
      table: {
        type: { summary: `"div" | "h2" | "h3" | "h4" | "h5" | "h6"` },
        defaultValue: { summary: 'div' },
      },
    },
    className: {
      control: 'text',
      description: 'Custom CSS class for the EmptyState.',
      table: { type: { summary: 'string' } },
    },
    children: {
      control: false,
      description:
        'The parts to render (`EmptyStateIcon`, `EmptyStateTitle`, `EmptyStateDescription`, `EmptyStateAction`). When given, the `icon`, `title`, `description` and `action` props are ignored.',
      table: { type: { summary: 'ReactNode' } },
    },
    style: {
      control: false,
      description: 'Inline styles for the EmptyState.',
      table: { type: { summary: 'CSSProperties' } },
    },
    size: {
      control: 'radio',
      description: 'Size of the EmptyState: its padding, its text and the size of the icon.',
      options: ['sm', 'md', 'lg'],
      table: { type: { summary: `"sm" | "md" | "lg"` }, defaultValue: { summary: 'md' } },
    },
    variant: {
      control: 'radio',
      description:
        'Visual variant. `plain` has no box, `outline` draws a dashed border and `filled` gives it a muted background. `unstyled` drops the Plume styles so you can bring your own.',
      options: ['plain', 'outline', 'filled', 'unstyled'],
      table: {
        type: { summary: `"plain" | "outline" | "filled" | "unstyled"` },
        defaultValue: { summary: 'plain' },
      },
    },
    id: {
      control: false,
      description: 'Id of the EmptyState.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    hidden: {
      control: false,
      description: 'Hides the EmptyState.',
      table: { category: 'HTML attributes', type: { summary: 'boolean' } },
    },
    role: {
      control: 'text',
      description:
        'Role of the EmptyState. Use `status` when it appears as the result of something the user did, so it is announced.',
      table: { category: 'Accessibility', type: { summary: 'AriaRole' } },
    },
    'aria-live': {
      control: 'radio',
      description: 'How a change of the EmptyState is announced.',
      options: ['off', 'polite', 'assertive'],
      table: { category: 'Accessibility', type: { summary: `"off" | "polite" | "assertive"` } },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible name of the EmptyState.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    'aria-labelledby': {
      control: false,
      description: 'Id of the element that names the EmptyState.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
  },
  args: {
    action: <Button label="Create a project" size="sm" />,
    description: 'Projects you create will show up here.',
    icon: inbox,
    title: 'No projects yet',
  },
} satisfies Meta<typeof EmptyState>

type Story = StoryObj<typeof EmptyState>

/**
 * This is the default EmptyState, with an icon, a title, a description and an action.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick how it looks: `plain` has no box, `outline` draws a dashed border, `filled`
 * gives it a muted background, and `unstyled` drops the Plume styles so you can style it yourself.
 */
export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-start justify-center gap-6">
      {(['plain', 'outline', 'filled'] as const).map((variant) => (
        <EmptyState
          {...args}
          key={variant}
          style={{ width: '18rem' }}
          title={variant[0].toUpperCase() + variant.slice(1)}
          variant={variant}
        />
      ))}
      <EmptyState
        className="flex flex-col items-center gap-2 rounded-lg border border-border p-6 text-center"
        style={{ width: '18rem' }}
        variant="unstyled"
      >
        <EmptyStateIcon className="text-muted [&>svg]:size-12">{inbox}</EmptyStateIcon>
        <EmptyStateTitle className="text-lg font-bold">Unstyled</EmptyStateTitle>
        <EmptyStateDescription className="text-sm text-muted">
          Projects you create will show up here.
        </EmptyStateDescription>
        <EmptyStateAction className="mt-3">
          <Button label="Create a project" size="sm" />
        </EmptyStateAction>
      </EmptyState>
    </div>
  ),
}

/**
 * Use the **size** prop to change the padding, the text and the icon.
 */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-start justify-center gap-6">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <EmptyState
          {...args}
          key={size}
          size={size}
          style={{ width: '18rem' }}
          title={`Size ${size}`}
          variant="outline"
        />
      ))}
    </div>
  ),
}

/**
 * All the parts are optional.
 */
export const Parts: Story = {
  render: () => (
    <div className="flex flex-wrap items-start justify-center gap-6">
      <EmptyState style={{ width: '16rem' }} title="Only a title" variant="outline" />
      <EmptyState
        description="A title with a description."
        style={{ width: '16rem' }}
        title="No messages"
        variant="outline"
      />
      <EmptyState icon={inbox} style={{ width: '16rem' }} title="With an icon" variant="outline" />
      <EmptyState
        action={<Button label="Clear filters" size="sm" variant="outline" />}
        description="Try other filters."
        style={{ width: '16rem' }}
        title="No results"
        variant="outline"
      />
    </div>
  ),
}

/**
 * Give the EmptyState its parts as children to change the order or leave one out. Here the action comes first and
 * there is no icon. The `icon`, `title`, `description` and `action` props are ignored when it has children.
 */
export const Compound: Story = {
  parameters: {
    docs: {
      source: {
        code: `<EmptyState variant="outline">
  <EmptyStateAction>
    <Button label="Clear filters" size="sm" variant="outline" />
  </EmptyStateAction>
  <EmptyStateTitle as="h3">No results</EmptyStateTitle>
  <EmptyStateDescription>Try other filters.</EmptyStateDescription>
</EmptyState>`,
      },
    },
  },
  render: () => (
    <EmptyState style={{ width: '18rem' }} variant="outline">
      <EmptyStateAction>
        <Button label="Clear filters" size="sm" variant="outline" />
      </EmptyStateAction>
      <EmptyStateTitle as="h3">No results</EmptyStateTitle>
      <EmptyStateDescription>Try other filters.</EmptyStateDescription>
    </EmptyState>
  ),
}

/**
 * Use **titleAs** when the title belongs in the outline of the page, and `role="status"` when the state shows up
 * after something the user did, so a screen reader announces it.
 */
export const Accessibility: Story = {
  render: () => (
    <EmptyState
      description="Check the spelling or try a shorter search."
      role="status"
      style={{ width: '20rem' }}
      title={'No results for "plume"'}
      titleAs="h2"
      variant="outline"
    />
  ),
}

/**
 * Some examples of EmptyState with Tailwind classes. With `variant="unstyled"` the EmptyState and its parts have no Plume styles, so each takes the classes you give it.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<EmptyState
  className="flex w-80 max-w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border p-8 text-center"
  variant="unstyled"
>
  <EmptyStateIcon className="text-muted [&>svg]:size-12">{inbox}</EmptyStateIcon>
  <EmptyStateTitle className="text-lg font-semibold">No projects yet</EmptyStateTitle>
  <EmptyStateDescription className="text-sm text-muted">
    Projects you create will show up here.
  </EmptyStateDescription>
  <EmptyStateAction className="mt-3">
    <Button
      className="rounded bg-blue-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-800"
      label="Create a project"
      variant="unstyled"
    />
  </EmptyStateAction>
</EmptyState>`,
      },
    },
  },
  render: () => (
    <EmptyState
      className="flex w-80 max-w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border p-8 text-center"
      variant="unstyled"
    >
      <EmptyStateIcon className="text-muted [&>svg]:size-12">{inbox}</EmptyStateIcon>
      <EmptyStateTitle className="text-lg font-semibold">No projects yet</EmptyStateTitle>
      <EmptyStateDescription className="text-sm text-muted">
        Projects you create will show up here.
      </EmptyStateDescription>
      <EmptyStateAction className="mt-3">
        <Button
          className="rounded bg-blue-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-800"
          label="Create a project"
          variant="unstyled"
        />
      </EmptyStateAction>
    </EmptyState>
  ),
}

/**
 * Some examples of EmptyState with Bootstrap classes.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<EmptyState
  className="d-flex flex-column align-items-center gap-2 border border-2 rounded-3 p-4 text-center"
  style={{ width: '20rem', maxWidth: '100%' }}
  variant="unstyled"
>
  <EmptyStateIcon className="text-body-secondary">{inbox}</EmptyStateIcon>
  <EmptyStateTitle className="h5 mb-0">No projects yet</EmptyStateTitle>
  <EmptyStateDescription className="text-body-secondary small">
    Projects you create will show up here.
  </EmptyStateDescription>
  <EmptyStateAction className="mt-2">
    <Button className="btn btn-primary btn-sm" label="Create a project" variant="unstyled" />
  </EmptyStateAction>
</EmptyState>`,
      },
    },
  },
  render: () => (
    <EmptyState
      className="d-flex flex-column align-items-center gap-2 border border-2 rounded-3 p-4 text-center"
      style={{ width: '20rem', maxWidth: '100%' }}
      variant="unstyled"
    >
      <EmptyStateIcon className="text-body-secondary">{inbox}</EmptyStateIcon>
      <EmptyStateTitle className="h5 mb-0">No projects yet</EmptyStateTitle>
      <EmptyStateDescription className="text-body-secondary small">
        Projects you create will show up here.
      </EmptyStateDescription>
      <EmptyStateAction className="mt-2">
        <Button className="btn btn-primary btn-sm" label="Create a project" variant="unstyled" />
      </EmptyStateAction>
    </EmptyState>
  ),
}
