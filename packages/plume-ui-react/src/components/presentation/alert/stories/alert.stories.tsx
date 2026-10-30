import type { StoryObj, Meta } from '@storybook/react-vite'
import { Button } from '../../../interaction/button'
import {
  Alert,
  AlertAction,
  AlertContent,
  AlertDescription,
  AlertDismiss,
  AlertIcon,
  AlertTitle,
} from '..'

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
 * button, named by **labels.dismiss**, and it goes away when it is pressed. **onDismiss** tells you, so you can keep
 * it away. An **action**, such as a button or a link, goes at the end.
 *
 * Every element of the Alert is a part you can import. Given no parts, the `Alert` builds the usual layout from its
 * props (**icon**, the children as the content, **action** and **dismissible**). Give it any of the parts as direct
 * children and it renders them as written, so you can reorder, omit or replace each one, and give it its own
 * `className`. In that case **action** and **dismissible** have no effect: compose `AlertAction` and `AlertDismiss`
 * instead.
 */
export default {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: {
    docs: {
      importNames: [
        'Alert',
        'AlertAction',
        'AlertContent',
        'AlertDescription',
        'AlertDismiss',
        'AlertIcon',
        'AlertTitle',
      ],
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
    },
    status: {
      control: 'radio',
      options: statuses,
    },
    variant: {
      control: 'radio',
      options: ['subtle', 'solid', 'outline', 'unstyled'],
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
    icon: {
      control: false,
    },
    action: {
      control: false,
    },
    dismissible: {
      control: 'boolean',
    },
    labels: {
      control: false,
    },
    className: {
      control: 'text',
    },
    style: {
      control: false,
    },
    onDismiss: {
      control: false,
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
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-3">
  <Alert variant="subtle">
    <AlertTitle>Subtle</AlertTitle>
    <AlertDescription>An alert with the subtle variant.</AlertDescription>
  </Alert>
  <Alert variant="solid">
    <AlertTitle>Solid</AlertTitle>
    <AlertDescription>An alert with the solid variant.</AlertDescription>
  </Alert>
  <Alert variant="outline">
    <AlertTitle>Outline</AlertTitle>
    <AlertDescription>An alert with the outline variant.</AlertDescription>
  </Alert>
  <Alert className="flex gap-2 rounded-md border border-gray-400 p-3" variant="unstyled">
    <AlertTitle>Unstyled</AlertTitle>
    <AlertDescription>An alert with the unstyled variant.</AlertDescription>
  </Alert>
</div>`,
      },
    },
  },
  render: (args) => (
    <div className="flex flex-col gap-3">
      {(['subtle', 'solid', 'outline'] as const).map((variant) => (
        <Alert {...args} key={variant} variant={variant}>
          <AlertTitle>{variant[0].toUpperCase() + variant.slice(1)}</AlertTitle>
          <AlertDescription>An alert with the {variant} variant.</AlertDescription>
        </Alert>
      ))}
      <Alert
        {...args}
        className="flex gap-2 rounded-md border border-gray-400 p-3"
        variant="unstyled"
      >
        <AlertTitle>Unstyled</AlertTitle>
        <AlertDescription>An alert with the unstyled variant.</AlertDescription>
      </Alert>
    </div>
  ),
}

/**
 * Use the **size** prop to change the padding and the text of the Alert.
 */
export const Sizes: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-3">
  <Alert size="sm">
    <AlertTitle>Size sm</AlertTitle>
    <AlertDescription>The padding and the text follow the size.</AlertDescription>
  </Alert>
  <Alert size="md">
    <AlertTitle>Size md</AlertTitle>
    <AlertDescription>The padding and the text follow the size.</AlertDescription>
  </Alert>
  <Alert size="lg">
    <AlertTitle>Size lg</AlertTitle>
    <AlertDescription>The padding and the text follow the size.</AlertDescription>
  </Alert>
</div>`,
      },
    },
  },
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
 * The color of an Alert is its **status**: `info`, `success`, `warning` or `error`. It also sets the icon and the
 * role. The other variants use the same colors: `solid` fills the Alert with it and `outline` draws its border.
 */
export const Colors: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-3">
  <Alert status="info">
    <AlertTitle>Info</AlertTitle>
    <AlertDescription>An alert with the info status.</AlertDescription>
  </Alert>
  <Alert status="success">
    <AlertTitle>Success</AlertTitle>
    <AlertDescription>An alert with the success status.</AlertDescription>
  </Alert>
  <Alert status="warning">
    <AlertTitle>Warning</AlertTitle>
    <AlertDescription>An alert with the warning status.</AlertDescription>
  </Alert>
  <Alert status="error">
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>An alert with the error status.</AlertDescription>
  </Alert>
</div>`,
      },
    },
  },
  render: (args) => (
    <div className="flex flex-col gap-3">
      {statuses.map((status) => (
        <Alert {...args} key={status} status={status} variant="subtle">
          <AlertTitle>{status[0].toUpperCase() + status.slice(1)}</AlertTitle>
          <AlertDescription>An alert with the {status} status.</AlertDescription>
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
 * so you can keep it away the next time. Change **labels.dismiss** to translate the name of the button.
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
 * Give the `Alert` its parts as direct children and it renders them as written. Here the dismiss button comes
 * first, the icon is replaced, the action goes under the text and the content has its own class. Omit a part and it
 * is not there: with parts, **action** and **dismissible** have no effect.
 */
export const Compound: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Alert status="warning">
  <AlertDismiss />
  <AlertIcon>⚠️</AlertIcon>
  <AlertContent className="flex-col">
    <AlertTitle>Your trial ends tomorrow</AlertTitle>
    <AlertDescription>Choose a plan to keep your projects.</AlertDescription>
    <AlertAction>
      <Button colorScheme="warning" label="Choose a plan" size="sm" />
    </AlertAction>
  </AlertContent>
</Alert>`,
      },
    },
  },
  render: (args) => (
    <Alert {...args} status="warning">
      <AlertDismiss />
      <AlertIcon>⚠️</AlertIcon>
      <AlertContent style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <AlertTitle>Your trial ends tomorrow</AlertTitle>
        <AlertDescription>Choose a plan to keep your projects.</AlertDescription>
        <AlertAction>
          <Button colorScheme="warning" label="Choose a plan" size="sm" />
        </AlertAction>
      </AlertContent>
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
  status="info"
  style={{ padding: '0.75rem 1rem' }}
  variant="unstyled"
>
  <AlertIcon className="text-blue-700" />
  <AlertContent className="text-sm">
    <AlertTitle className="font-semibold">Your trial ends tomorrow</AlertTitle>
    <AlertDescription>Choose a plan to keep your projects.</AlertDescription>
  </AlertContent>
  <AlertDismiss className="rounded-sm p-1 hover:bg-blue-100" />
</Alert>`,
      },
    },
  },
  render: () => (
    <Alert
      className="w-[28rem] max-w-full rounded-lg border-l-4 border-blue-700 bg-blue-50 text-blue-900"
      status="info"
      style={{ padding: '0.75rem 1rem' }}
      variant="unstyled"
    >
      <AlertIcon className="text-blue-700" />
      <AlertContent className="text-sm">
        <AlertTitle className="font-semibold">Your trial ends tomorrow</AlertTitle>
        <AlertDescription>Choose a plan to keep your projects.</AlertDescription>
      </AlertContent>
      <AlertDismiss className="rounded-sm p-1 hover:bg-blue-100" />
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
  status="info"
  style={{ width: '28rem', maxWidth: '100%' }}
  variant="unstyled"
>
  <AlertIcon className="text-primary" />
  <AlertContent>
    <AlertTitle className="fw-semibold">Your trial ends tomorrow</AlertTitle>
    <AlertDescription>Choose a plan to keep your projects.</AlertDescription>
  </AlertContent>
  <AlertDismiss className="btn-close ms-auto" />
</Alert>`,
      },
    },
  },
  render: () => (
    <Alert
      className="alert alert-primary d-flex align-items-start gap-2 mb-0"
      status="info"
      style={{ width: '28rem', maxWidth: '100%' }}
      variant="unstyled"
    >
      <AlertIcon className="text-primary" />
      <AlertContent>
        <AlertTitle className="fw-semibold">Your trial ends tomorrow</AlertTitle>
        <AlertDescription>Choose a plan to keep your projects.</AlertDescription>
      </AlertContent>
      <AlertDismiss className="btn-close ms-auto" />
    </Alert>
  ),
}
