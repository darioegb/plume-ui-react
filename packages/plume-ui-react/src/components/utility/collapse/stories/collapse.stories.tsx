import type { StoryObj, Meta } from '@storybook/react-vite'
import { useId, useState } from 'react'
import { Collapse } from '..'

const text =
  'Plume is a set of accessible React components that you can use with its own styles or with Tailwind and Bootstrap classes. Every component has an unstyled variant that keeps the structure and drops the looks.'

function Toggle({
  children,
  defaultOpen = false,
}: Readonly<{ children?: React.ReactNode; defaultOpen?: boolean }>): React.ReactNode {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()
  return (
    <div style={{ maxWidth: '100%', width: '26rem' }}>
      <button
        aria-controls={id}
        aria-expanded={open}
        className="rounded border border-gray-400 px-3 py-1 text-sm"
        onClick={() => setOpen(!open)}
        type="button"
      >
        {open ? 'Hide' : 'Show'} details
      </button>
      <Collapse id={id} open={open}>
        {children ?? <p className="pt-3 text-sm">{text}</p>}
      </Collapse>
    </div>
  )
}

/**
 * A box that opens and closes with a height animation. Use it to show or hide a piece of content from a button,
 * like "show more" or a filter panel. It is what an `Accordion` item does, without the heading and the keyboard
 * of an accordion.
 *
 * Collapse only shows or hides: keep the state in your own code and pass it as **open**. Add the button that
 * controls it with `aria-expanded` and `aria-controls` pointing at the id of the Collapse, as the examples do.
 * While it is closed, the content is hidden from assistive technology and can't be focused, and the animation
 * is turned off with `prefers-reduced-motion`.
 *
 * It has no variants because it draws nothing: it is only the height animation. Give it a `className` and a
 * `bodyClassName` (the box with the content, which is where the padding goes) to style it.
 */
export default {
  title: 'Components/Collapse',
  component: Collapse,
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
      description: 'What is shown when it is open.',
      table: { type: { summary: 'ReactNode' } },
    },
    className: {
      control: 'text',
      description: 'Custom CSS class for the Collapse, the element that animates its height.',
      table: { type: { summary: 'string' } },
    },
    bodyClassName: {
      control: 'text',
      description: 'Custom CSS class for the box with the content, where the padding goes.',
      table: { type: { summary: 'string' } },
    },
    style: {
      control: false,
      description: 'Inline styles for the Collapse.',
      table: { type: { summary: 'CSSProperties' } },
    },
    open: {
      control: 'boolean',
      description: 'Whether the content is shown.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    id: {
      control: false,
      description: 'Id of the Collapse. Point `aria-controls` of the button at it.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    title: {
      control: 'text',
      description: 'Native tooltip of the Collapse.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    hidden: {
      control: false,
      description: 'Hides the Collapse.',
      table: { category: 'HTML attributes', type: { summary: 'boolean' } },
    },
    role: {
      control: 'text',
      description:
        'Role of the Collapse. Use `region` with a name when the content is important enough to be a landmark.',
      table: { category: 'Accessibility', type: { summary: 'AriaRole' } },
    },
    'aria-label': {
      control: false,
      description: 'Accessible name of the Collapse.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    'aria-labelledby': {
      control: false,
      description: 'Id of the element that names the Collapse.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
  },
  args: {
    children: <p className="text-sm">{text}</p>,
    open: true,
    style: { maxWidth: '100%', width: '26rem' },
  },
} satisfies Meta<typeof Collapse>

type Story = StoryObj<typeof Collapse>

/**
 * This is the default Collapse, open. Use the control to close it.
 */
export const Default: Story = {}

/**
 * Keep the state next to the button that controls it, and link them with `aria-expanded` and `aria-controls`.
 */
export const WithButton: Story = {
  render: () => <Toggle />,
}

/**
 * It starts closed by default, which keeps the content out of the page and out of the keyboard until it is opened.
 */
export const StartsOpen: Story = {
  render: () => <Toggle defaultOpen />,
}

/**
 * The height follows the content, whatever it is, and the Collapse can hold other Collapses.
 */
export const Nested: Story = {
  render: () => {
    function Example(): React.ReactNode {
      const [outer, setOuter] = useState(true)
      const [inner, setInner] = useState(false)
      return (
        <div className="flex flex-col gap-2" style={{ maxWidth: '100%', width: '26rem' }}>
          <button
            aria-expanded={outer}
            className="self-start rounded border border-gray-400 px-3 py-1 text-sm"
            onClick={() => setOuter(!outer)}
            type="button"
          >
            Outer
          </button>
          <Collapse open={outer}>
            <div className="flex flex-col gap-2 pt-2 text-sm">
              <p>{text}</p>
              <button
                aria-expanded={inner}
                className="self-start rounded border border-gray-400 px-3 py-1"
                onClick={() => setInner(!inner)}
                type="button"
              >
                Inner
              </button>
              <Collapse open={inner}>
                <p className="rounded bg-gray-100 p-3 text-gray-900">
                  Content of the inner Collapse.
                </p>
              </Collapse>
            </div>
          </Collapse>
        </div>
      )
    }
    return <Example />
  },
}

/**
 * Some examples of Collapse with Tailwind classes. The Collapse brings the animation, so the classes only style
 * the content: `bodyClassName` is the box where the padding and the background go. Use `data-[open]:` on the
 * Collapse to react to its state.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `const [open, setOpen] = useState(false)

<button aria-controls="more" aria-expanded={open} className="rounded bg-primary-solid px-3 py-1 text-sm text-primary-on-solid" onClick={() => setOpen(!open)} type="button">
  Details
</button>
<Collapse bodyClassName="mt-2 rounded-lg border border-border bg-surface-muted p-4 text-sm text-foreground" id="more" open={open}>
  Content
</Collapse>`,
      },
    },
  },
  render: () => {
    function Example(): React.ReactNode {
      const [open, setOpen] = useState(true)
      return (
        <div style={{ maxWidth: '100%', width: '26rem' }}>
          <button
            aria-controls="tailwind-more"
            aria-expanded={open}
            className="rounded bg-primary-solid px-3 py-1 text-sm text-primary-on-solid"
            onClick={() => setOpen(!open)}
            type="button"
          >
            Details
          </button>
          <Collapse
            bodyClassName="mt-2 rounded-lg border border-border bg-surface-muted p-4 text-sm text-foreground"
            id="tailwind-more"
            open={open}
          >
            {text}
          </Collapse>
        </div>
      )
    }
    return <Example />
  },
}

/**
 * Some examples of Collapse with Bootstrap classes: `btn` for the button and `card card-body` for the content.
 * Bootstrap's own `collapse` class needs its JavaScript, so the component does the animation instead.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `const [open, setOpen] = useState(false)

<button aria-controls="more" aria-expanded={open} className="btn btn-primary btn-sm" onClick={() => setOpen(!open)} type="button">
  Details
</button>
<Collapse id="more" open={open}>
  <div className="card card-body mt-2">Content</div>
</Collapse>`,
      },
    },
  },
  render: () => {
    function Example(): React.ReactNode {
      const [open, setOpen] = useState(true)
      return (
        <div style={{ maxWidth: '100%', width: '26rem' }}>
          <button
            aria-controls="bootstrap-more"
            aria-expanded={open}
            className="btn btn-primary btn-sm"
            onClick={() => setOpen(!open)}
            type="button"
          >
            Details
          </button>
          <Collapse id="bootstrap-more" open={open}>
            <div className="card card-body mt-2">{text}</div>
          </Collapse>
        </div>
      )
    }
    return <Example />
  },
}
