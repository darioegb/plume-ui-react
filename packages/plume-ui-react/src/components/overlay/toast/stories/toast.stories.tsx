import type { StoryObj, Meta } from '@storybook/react-vite'
import { Button } from '../../../interaction/button'
import { Icon } from '../../../presentation/icon'
import {
  ToastProvider,
  useToast,
  type ToastApi,
  type ToastPosition,
  type ToastProviderProps,
} from '..'

const positions: ToastPosition[] = [
  'top-start',
  'top',
  'top-end',
  'center-start',
  'center',
  'center-end',
  'bottom-start',
  'bottom',
  'bottom-end',
]

function Fire({
  className,
  label,
  make,
  variant = 'solid',
}: Readonly<{
  className?: string
  label: string
  make: (api: ToastApi) => void
  variant?: 'ghost' | 'outline' | 'solid'
}>): React.ReactNode {
  const api = useToast()
  return <Button className={className} label={label} onClick={() => make(api)} variant={variant} />
}

function Demo({
  children,
  ...props
}: Readonly<Partial<ToastProviderProps> & { children?: React.ReactNode }>): React.ReactNode {
  return (
    <ToastProvider {...props}>
      {children ?? (
        <Fire
          label="Show a toast"
          make={(api) => api.toast({ description: 'Your changes were saved.', title: 'Saved' })}
        />
      )}
    </ToastProvider>
  )
}

/**
 * A short message that appears over the page to say that something happened, and goes away by itself. Wrap the
 * app in a `ToastProvider` and call `useToast()` from any component below it to show one.
 *
 * Screen readers announce each toast without moving the focus: `success`, `info`, `warning` and neutral toasts are
 * polite, and `error` is assertive (`role="alert"`). The timer stops while the pointer is over a toast or the
 * focus is inside it, so it can be read and reached with the keyboard, and <kbd>Esc</kbd> dismisses the toast
 * that has the focus. Something the user has to read or act on shouldn't disappear: set `duration` to `0`.
 *
 * ### useToast
 *
 * `useToast()` returns `toast`, `success`, `info`, `warning` and `error`, which take a string, a node or an
 * options object and return the id of the toast, plus `dismiss(id)` and `dismissAll()`.
 *
 * | Option | Description |
 * | --- | --- |
 * | `title`, `description` | The text of the toast. |
 * | `status` | `neutral`, `info`, `success`, `warning` or `error`. The `success`, `info`, `warning` and `error` methods set it. |
 * | `icon` | A node that replaces the icon of the status, or `false` for a toast with no icon. |
 * | `duration` | Milliseconds before it goes away. `0` keeps it until it is dismissed. Defaults to the one of the provider. |
 * | `action` | `{ label, onClick }`: a button that runs `onClick` and dismisses the toast. |
 * | `dismissible` | Whether it has a dismiss button, and <kbd>Esc</kbd> dismisses it. `true` by default. |
 * | `id` | Shows the toast with a known id. Calling again with the same id updates it and restarts its timer. |
 * | `onDismiss` | Called when the toast goes away, for any reason. |
 */
export default {
  title: 'Components/Toast',
  component: ToastProvider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      story: { inline: false, iframeHeight: 420 },
      importNames: ['ToastProvider', 'useToast'],
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
      description: 'The app. Any component below the provider can call `useToast()`.',
      table: { type: { summary: 'ReactNode' } },
    },
    position: {
      control: 'select',
      description: 'Where the toasts stack on the screen.',
      options: positions,
      table: { type: { summary: 'ToastPosition' }, defaultValue: { summary: 'bottom-end' } },
    },
    duration: {
      control: 'number',
      description:
        'Milliseconds before a toast goes away, unless it sets its own. `0` keeps them until dismissed.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '5000' } },
    },
    icons: {
      control: false,
      description:
        'The icons of the toasts. `false` shows none. An object replaces the icon of a status (`success`, `info`, `warning`, `error`) and can give one to `neutral`. A toast can set its own with the `icon` option.',
      table: { type: { summary: 'false | Partial<Record<ToastStatus, ReactNode>>' } },
    },
    max: {
      control: 'number',
      description: 'How many toasts are shown at a time. When there are more, the oldest go first.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '5' } },
    },
    variant: {
      control: 'radio',
      description:
        'Visual variant. `solid` fills the toast with the color of its status, `subtle` tints it and `outline` draws its border with an accent. `unstyled` drops the Plume styles so you can bring your own.',
      options: ['solid', 'subtle', 'outline', 'unstyled'],
      table: {
        type: { summary: `"solid" | "subtle" | "outline" | "unstyled"` },
        defaultValue: { summary: 'subtle' },
      },
    },
    className: {
      control: 'text',
      description: 'Custom CSS class for the region that holds the toasts.',
      table: { type: { summary: 'string' } },
    },
    toastClassName: {
      control: 'text',
      description: 'Custom CSS class for every toast.',
      table: { type: { summary: 'string' } },
    },
    classNames: {
      control: false,
      description:
        'Custom CSS classes for the parts of every toast, in every variant: `icon`, `content`, `title`, `description`, `action` and `dismiss`. With `variant="unstyled"` they are the only classes the parts have.',
      table: { type: { summary: `Partial<Record<ToastPart, string>>` } },
    },
    regionLabel: {
      control: 'text',
      description: 'Accessible name of the region that holds the toasts.',
      table: {
        category: 'Accessibility',
        type: { summary: 'string' },
        defaultValue: { summary: 'Notifications' },
      },
    },
    dismissLabel: {
      control: 'text',
      description: 'Accessible name of the dismiss button of each toast.',
      table: {
        category: 'Accessibility',
        type: { summary: 'string' },
        defaultValue: { summary: 'Dismiss notification' },
      },
    },
  },
  render: (args) => <Demo {...args} />,
} satisfies Meta<typeof ToastProvider>

type Story = StoryObj<typeof ToastProvider>

/**
 * This is the default ToastProvider. The button calls `toast()` with a title and a description.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop of the provider to pick how the toasts look: `solid` fills them with the color of
 * their status, `subtle` tints them, `outline` draws their border with an accent, and `unstyled` drops the
 * Plume styles so you can style them yourself. Each button below has its own provider and position, and its own
 * `regionLabel`: with several providers on a page, each region needs a name of its own.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center gap-4">
      {(
        [
          ['solid', 'top-start'],
          ['subtle', 'top-end'],
          ['outline', 'bottom-start'],
        ] as const
      ).map(([variant, position]) => (
        <ToastProvider
          key={variant}
          position={position}
          regionLabel={`${variant} notifications`}
          variant={variant}
        >
          <Fire
            label={variant[0].toUpperCase() + variant.slice(1)}
            make={(api) => api.success({ description: `A ${variant} toast.`, title: 'Saved' })}
            variant="outline"
          />
        </ToastProvider>
      ))}
      <ToastProvider
        className="fixed bottom-4 right-4 flex flex-col gap-2"
        regionLabel="unstyled notifications"
        toastClassName="flex items-center gap-3 rounded bg-black px-4 py-2 text-white"
        variant="unstyled"
      >
        <Fire
          label="Unstyled"
          make={(api) => api.toast({ title: 'An unstyled toast' })}
          variant="outline"
        />
      </ToastProvider>
    </div>
  ),
}

/**
 * The **success**, **info**, **warning** and **error** methods set the status. An `error` toast is announced
 * at once (`role="alert"`) and the others politely.
 */
export const Statuses: Story = {
  render: () => (
    <Demo>
      <div className="flex flex-wrap justify-center gap-2">
        <Fire
          label="Neutral"
          make={(api) => api.toast({ title: 'Something happened' })}
          variant="outline"
        />
        <Fire
          label="Info"
          make={(api) => api.info({ title: 'A new version is out' })}
          variant="outline"
        />
        <Fire
          label="Success"
          make={(api) => api.success({ description: 'Your changes were saved.', title: 'Saved' })}
          variant="outline"
        />
        <Fire
          label="Warning"
          make={(api) =>
            api.warning({ description: 'You are close to the limit.', title: 'Almost full' })
          }
          variant="outline"
        />
        <Fire
          label="Error"
          make={(api) =>
            api.error({
              description: 'Check your connection and try again.',
              title: 'Could not save',
            })
          }
          variant="outline"
        />
      </div>
    </Demo>
  ),
}

const bell = (
  <Icon>
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  </Icon>
)

/**
 * The status icons are optional and can be replaced. Set **icons** on the provider to `false` for no icons, or to
 * an object with a node for each status, which can also give an icon to `neutral`. A single toast can set its own
 * with the **icon** option, or hide it with `icon: false`. Icons are decorative, so they are hidden from screen
 * readers: the status is announced by the role of the toast.
 */
export const Icons: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center gap-4">
      <ToastProvider icons={false} regionLabel="no icons notifications" position="top-start">
        <Fire
          label="No icons"
          make={(api) => api.success({ description: 'Your changes were saved.', title: 'Saved' })}
          variant="outline"
        />
      </ToastProvider>
      <ToastProvider
        icons={{ neutral: bell, success: <span>🎉</span> }}
        position="bottom"
        regionLabel="custom icons notifications"
      >
        <Fire
          label="Custom icons"
          make={(api) => {
            api.toast({ title: 'A neutral toast with an icon' })
            api.success({ title: 'Saved' })
          }}
          variant="outline"
        />
      </ToastProvider>
      <Demo position="top-end" regionLabel="one icon notifications">
        <Fire
          label="One toast"
          make={(api) => api.info({ icon: bell, title: 'This toast has its own icon' })}
          variant="outline"
        />
      </Demo>
    </div>
  ),
}

/**
 * Use the **position** prop of the provider to choose the corner, the edge or the center of the screen where the toasts stack. The newest
 * one is the closest to the edge of the screen.
 */
export const Positions: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {positions.map((position) => (
        <ToastProvider key={position} position={position} regionLabel={`${position} notifications`}>
          <Fire
            className="w-full whitespace-nowrap"
            label={position}
            make={(api) => api.info({ title: position })}
            variant="outline"
          />
        </ToastProvider>
      ))}
    </div>
  ),
}

/**
 * An **action** adds a button to the toast, which runs its `onClick` and dismisses the toast. Give a toast with
 * an action a long **duration**, or none, so the user has time to use it.
 */
export const WithAction: Story = {
  render: () => (
    <Demo>
      <Fire
        label="Delete the file"
        make={(api) =>
          api.toast({
            action: { label: 'Undo', onClick: () => api.success('The file is back') },
            description: 'Annual report.pdf was moved to the trash.',
            duration: 10000,
            title: 'File deleted',
          })
        }
      />
    </Demo>
  ),
}

/**
 * Set **duration** to `0` for a toast that stays until the user dismisses it. Use it for what has to be read or
 * acted on, such as an error.
 */
export const Persistent: Story = {
  render: () => (
    <Demo>
      <Fire
        label="Show a persistent toast"
        make={(api) =>
          api.error({
            description: 'The connection was lost. We will keep trying.',
            duration: 0,
            title: 'You are offline',
          })
        }
      />
    </Demo>
  ),
}

/**
 * Calling with the same **id** updates the toast that is on the screen, and restarts its timer, instead of
 * stacking another one. It fits a task that goes from running to done.
 */
export const UpdatingAToast: Story = {
  render: () => (
    <Demo>
      <Fire
        label="Start the upload"
        make={(api) => {
          api.info({ duration: 0, id: 'upload', title: 'Uploading…' })
          window.setTimeout(() => api.success({ id: 'upload', title: 'Upload complete' }), 1500)
        }}
      />
    </Demo>
  ),
}

/**
 * **dismiss(id)** removes a toast and **dismissAll()** removes every one. A toast can also be made not
 * dismissible with **dismissible: false**, which takes away its dismiss button.
 */
export const Dismissing: Story = {
  render: () => (
    <Demo>
      <div className="flex flex-wrap justify-center gap-2">
        <Fire
          label="Add a toast"
          make={(api) => api.info({ duration: 0, title: 'A toast that stays' })}
          variant="outline"
        />
        <Fire label="Dismiss all" make={(api) => api.dismissAll()} variant="ghost" />
      </div>
    </Demo>
  ),
}

/**
 * **max** limits how many toasts are on the screen at a time. The oldest one goes first.
 */
export const Limit: Story = {
  render: () => (
    <Demo duration={0} max={3}>
      <Fire
        label="Add a toast"
        make={(api) => api.info({ title: `Toast at ${new Date().toLocaleTimeString()}` })}
      />
    </Demo>
  ),
}

/**
 * Some examples of Toast with Tailwind classes. With `variant="unstyled"` the region is yours to place (`className`), `toastClassName` styles every toast and `classNames` each of its parts: `icon`, `content`, `title`, `description`, `action` and `dismiss`.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<ToastProvider
  className="fixed bottom-4 right-4 z-10 flex flex-col gap-2"
  classNames={{
    action: "mt-2 rounded border border-border px-2 py-1 text-xs font-semibold hover:bg-surface-muted",
    content: "flex-1",
    description: "block text-[var(--plume-muted)]",
    dismiss: "rounded p-1 text-[var(--plume-muted)] hover:bg-surface-muted",
    icon: "mt-0.5 text-emerald-600",
    title: "block font-semibold",
  }}
  toastClassName="flex w-80 max-w-full items-start gap-3 rounded-lg border border-border bg-surface p-4 text-sm text-foreground shadow-lg"
  variant="unstyled"
>
  <App />
</ToastProvider>`,
      },
    },
  },
  render: () => (
    <ToastProvider
      className="fixed bottom-4 right-4 z-10 flex flex-col gap-2"
      classNames={{
        action:
          'mt-2 rounded border border-border px-2 py-1 text-xs font-semibold hover:bg-surface-muted',
        content: 'flex-1',
        description: 'block text-[var(--plume-muted)]',
        dismiss: 'rounded p-1 text-[var(--plume-muted)] hover:bg-surface-muted',
        icon: 'mt-0.5 text-emerald-600',
        title: 'block font-semibold',
      }}
      regionLabel="Tailwind notifications"
      toastClassName="flex w-80 max-w-full items-start gap-3 rounded-lg border border-border bg-surface p-4 text-sm text-foreground shadow-lg"
      variant="unstyled"
    >
      <Fire
        label="Show a toast"
        make={(api) =>
          api.success({
            action: { label: 'Undo' },
            description: 'Your changes were saved.',
            title: 'Saved',
          })
        }
        variant="outline"
      />
    </ToastProvider>
  ),
}

/**
 * Some examples of Toast with Bootstrap classes: `toast-container` on the region, `toast show` on every toast and `toast-body` on its content.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<ToastProvider
  className="toast-container position-fixed bottom-0 end-0 p-3"
  classNames={{
    action: "btn btn-sm btn-primary mt-2",
    content: "toast-body flex-grow-1",
    description: "d-block text-body-secondary",
    dismiss: "btn btn-sm btn-light border-0 m-2 align-self-start",
    icon: "ms-3 mt-3 text-success",
    title: "d-block fw-semibold",
  }}
  toastClassName="toast show d-flex align-items-start"
  variant="unstyled"
>
  <App />
</ToastProvider>`,
      },
    },
  },
  render: () => (
    <ToastProvider
      className="toast-container position-fixed bottom-0 end-0 p-3"
      classNames={{
        action: 'btn btn-sm btn-primary mt-2',
        content: 'toast-body flex-grow-1',
        description: 'd-block text-body-secondary',
        dismiss: 'btn btn-sm btn-light border-0 m-2 align-self-start',
        icon: 'ms-3 mt-3 text-success',
        title: 'd-block fw-semibold',
      }}
      regionLabel="Bootstrap notifications"
      toastClassName="toast show d-flex align-items-start"
      variant="unstyled"
    >
      <Fire
        label="Show a toast"
        make={(api) =>
          api.success({
            action: { label: 'Undo' },
            description: 'Your changes were saved.',
            title: 'Saved',
          })
        }
        variant="outline"
      />
    </ToastProvider>
  ),
}
