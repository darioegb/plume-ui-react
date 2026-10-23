import type { StoryObj, Meta } from '@storybook/react-vite'
import { Button } from '../../../interaction/button'
import { Alert, AlertDescription, AlertTitle } from '..'

const statuses = ['info', 'success', 'warning', 'error'] as const

/**
 * A message that stays in the page, next to the content it is about: a notice, a confirmation, a warning or an
 * error. It is the inline counterpart of the `Toast`, which appears for a moment and goes away on its own.
 *
 * The **status** gives it its color and its icon. It is also its role: an `error` is announced right away
 * (`role="alert"`) and the other statuses politely (`role="status"`), so a screen reader reads a message that shows
 * up after something the user did. When the Alert is part of the page from the start, use **role** to change it
 * (`note` for a message that doesn't need to be announced).
 *
 * Put a `AlertTitle` and a `AlertDescription` inside, or just the text. With **dismissible** it gets a close
 * button, named by **dismissLabel**, and it goes away when it is pressed. **onDismiss** tells you, so you can keep
 * it away. An **action**, such as a button or a link, goes at the end.
 *
 * ### Subcomponents
 *
 * | Component | Props |
 * | --- | --- |
 * | `AlertTitle` | `as` (`div` by default, or `h2` to `h6`), `id`, `className`, `style`, `children`. The title, in bold. Use a heading when it belongs in the outline of the page. |
 * | `AlertDescription` | `id`, `className`, `style`, `children`. The details. |
 */
export default {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: {
    docs: {
      importNames: ['Alert', 'AlertTitle', 'AlertDescription'],
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
      description: 'The `AlertTitle` and `AlertDescription` of the Alert, or plain text.',
      table: { type: { summary: 'ReactNode' } },
    },
    status: {
      control: 'radio',
      description: 'The kind of message: it sets the color, the icon and the role of the Alert.',
      options: statuses,
      table: {
        type: { summary: `"info" | "success" | "warning" | "error"` },
        defaultValue: { summary: 'info' },
      },
    },
    variant: {
      control: 'radio',
      description:
        'Visual variant. `subtle` tints the background, `solid` fills it and `outline` draws its border. `unstyled` drops the Plume styles so you can bring your own.',
      options: ['subtle', 'solid', 'outline', 'unstyled'],
      table: {
        type: { summary: `"subtle" | "solid" | "outline" | "unstyled"` },
        defaultValue: { summary: 'subtle' },
      },
    },
    size: {
      control: 'radio',
      description: 'Size of the Alert: its padding and its text.',
      options: ['sm', 'md', 'lg'],
      table: { type: { summary: `"sm" | "md" | "lg"` }, defaultValue: { summary: 'md' } },
    },
    icon: {
      control: false,
      description:
        'The icon at the start. By default, the one of the status. Pass your own, or `false` for none. It is decorative.',
      table: { type: { summary: 'ReactNode | false' } },
    },
    action: {
      control: false,
      description: 'What the user can do about the message: a `Button` or a link, at the end.',
      table: { type: { summary: 'ReactNode' } },
    },
    dismissible: {
      control: 'boolean',
      description: 'Shows a button that closes the Alert.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    dismissLabel: {
      control: 'text',
      description: 'Accessible name of the dismiss button. Change it to translate it.',
      table: {
        category: 'Accessibility',
        type: { summary: 'string' },
        defaultValue: { summary: 'Dismiss' },
      },
    },
    className: {
      control: 'text',
      description: 'Custom CSS class for the Alert.',
      table: { type: { summary: 'string' } },
    },
    classNames: {
      control: false,
      description: 'Custom CSS classes for the parts: `icon`, `content`, `action` and `dismiss`.',
      table: { type: { summary: 'Partial<Record<AlertPart, string>>' } },
    },
    style: {
      control: false,
      description:
        'Inline styles for the Alert. They are applied after the color variables, so they can override them (e.g. `--alert-solid`).',
      table: { type: { summary: 'CSSProperties' } },
    },
    onDismiss: {
      control: false,
      description: 'Called when the dismiss button is pressed.',
      table: { category: 'Events', type: { summary: '() => void' } },
    },
    id: {
      control: false,
      description: 'Id of the Alert.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    title: {
      control: 'text',
      description: 'Native tooltip of the Alert.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    hidden: {
      control: 'boolean',
      description: 'Hides the Alert.',
      table: { category: 'HTML attributes', type: { summary: 'boolean' } },
    },
    role: {
      control: 'text',
      description:
        "Role of the Alert. By default `alert` for an error and `status` for the rest. Use `note` for a message that is part of the page and doesn't need to be announced.",
      table: { category: 'Accessibility', type: { summary: 'AriaRole' } },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible name of the Alert.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    'aria-labelledby': {
      control: false,
      description: 'Id of the element that names the Alert, such as its title.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
  },
  args: {
    style: { width: '28rem', maxWidth: '100%' },
  },
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>Your trial ends tomorrow</AlertTitle>
      <AlertDescription>Choose a plan to keep your projects and your history.</AlertDescription>
    </Alert>
  ),
} satisfies Meta<typeof Alert>

type Story = StoryObj<typeof Alert>

/**
 * This is the default Alert: an info message with a title and a description.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick how the Alert looks: `subtle` tints the background, `solid` fills it,
 * `outline` draws its border, and `unstyled` drops the Plume styles so you can style it yourself.
 */
export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      {(['subtle', 'solid', 'outline'] as const).map((variant) => (
        <Alert {...args} key={variant} variant={variant}>
          <AlertTitle>{variant[0].toUpperCase() + variant.slice(1)}</AlertTitle>
          <AlertDescription>An alert with the {variant} variant.</AlertDescription>
        </Alert>
      ))}
    </div>
  ),
}

/**
 * Use the **status** prop to say what kind of message it is: `info`, `success`, `warning` or `error`.
 */
export const Statuses: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      {statuses.map((status) => (
        <Alert {...args} key={status} status={status}>
          <AlertTitle>{status[0].toUpperCase() + status.slice(1)}</AlertTitle>
          <AlertDescription>An alert with the {status} status.</AlertDescription>
        </Alert>
      ))}
    </div>
  ),
}

/**
 * Use the **size** prop to change the padding and the text of the Alert.
 */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Alert {...args} key={size} size={size}>
          <AlertTitle>Size {size}</AlertTitle>
          <AlertDescription>The padding and the text follow the size.</AlertDescription>
        </Alert>
      ))}
    </div>
  ),
}

/**
 * The title and the description are optional: an Alert can be a single line of text.
 */
export const TextOnly: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <Alert {...args}>Your changes were saved.</Alert>
      <Alert {...args}>
        <AlertTitle>Only a title</AlertTitle>
      </Alert>
    </div>
  ),
}

/**
 * By default the icon is the one of the status. Pass your own **icon**, or `false` to show none.
 */
export const Icons: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <Alert
        {...args}
        icon={
          <svg
            fill="none"
            height="1em"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="1em"
          >
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />
          </svg>
        }
      >
        <AlertTitle>A custom icon</AlertTitle>
      </Alert>
      <Alert {...args} icon={false}>
        <AlertTitle>No icon</AlertTitle>
      </Alert>
    </div>
  ),
}

/**
 * With **dismissible** the Alert has a close button and goes away when it is pressed. **onDismiss** tells you,
 * so you can keep it away the next time. Change **dismissLabel** to translate the name of the button.
 */
export const Dismissible: Story = {
  args: { dismissible: true, status: 'success' },
}

/**
 * An **action** goes at the end of the Alert: a button or a link to what the user can do about the message.
 */
export const WithAction: Story = {
  args: {
    action: <Button colorScheme="warning" label="Choose a plan" size="sm" />,
    dismissible: true,
    status: 'warning',
  },
}

/**
 * An `error` is announced right away (`role="alert"`) and the other statuses politely (`role="status"`). When the
 * Alert is part of the page from the start, give it `role="note"` so it is not announced when the page loads.
 * Use `as="h2"` in the title when it belongs in the outline of the page.
 */
export const Accessibility: Story = {
  render: (args) => (
    <Alert {...args} role="note" status="warning">
      <AlertTitle as="h2">Scheduled maintenance</AlertTitle>
      <AlertDescription>The service will be down on Sunday from 02:00 to 04:00.</AlertDescription>
    </Alert>
  ),
}

/**
 * Some examples of Alert with Tailwind classes. With `variant="unstyled"` the Alert and its parts have no Plume styles, so each takes the classes you give it.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Alert
  className="w-[28rem] max-w-full rounded-lg border-l-4 border-blue-700 bg-blue-50 text-blue-900"
  classNames={{
    content: 'text-sm',
    dismiss: 'rounded p-1 hover:bg-blue-100',
    icon: 'text-blue-700',
  }}
  dismissible
  status="info"
  style={{ padding: '0.75rem 1rem' }}
  variant="unstyled"
>
  <AlertTitle className="font-semibold">Your trial ends tomorrow</AlertTitle>
  <AlertDescription>Choose a plan to keep your projects.</AlertDescription>
</Alert>`,
      },
    },
  },
  render: () => (
    <Alert
      className="w-[28rem] max-w-full rounded-lg border-l-4 border-blue-700 bg-blue-50 text-blue-900"
      classNames={{
        content: 'text-sm',
        dismiss: 'rounded p-1 hover:bg-blue-100',
        icon: 'text-blue-700',
      }}
      dismissible
      status="info"
      style={{ padding: '0.75rem 1rem' }}
      variant="unstyled"
    >
      <AlertTitle className="font-semibold">Your trial ends tomorrow</AlertTitle>
      <AlertDescription>Choose a plan to keep your projects.</AlertDescription>
    </Alert>
  ),
}

/**
 * Some examples of Alert with Bootstrap classes: `alert` and `alert-primary`, with the dismiss button as `btn-close`.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Alert
  className="alert alert-primary d-flex align-items-start gap-2 mb-0"
  classNames={{ dismiss: 'btn-close ms-auto', icon: 'text-primary' }}
  dismissible
  status="info"
  style={{ width: '28rem', maxWidth: '100%' }}
  variant="unstyled"
>
  <AlertTitle className="fw-semibold">Your trial ends tomorrow</AlertTitle>
  <AlertDescription>Choose a plan to keep your projects.</AlertDescription>
</Alert>`,
      },
    },
  },
  render: () => (
    <Alert
      className="alert alert-primary d-flex align-items-start gap-2 mb-0"
      classNames={{ dismiss: 'btn-close ms-auto', icon: 'text-primary' }}
      dismissible
      status="info"
      style={{ width: '28rem', maxWidth: '100%' }}
      variant="unstyled"
    >
      <AlertTitle className="fw-semibold">Your trial ends tomorrow</AlertTitle>
      <AlertDescription>Choose a plan to keep your projects.</AlertDescription>
    </Alert>
  ),
}
