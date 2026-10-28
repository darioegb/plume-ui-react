import type { StoryObj, Meta } from '@storybook/react-vite'
import { useEffect, useId, useState } from 'react'
import { defaultTheme } from '../../../../theme'
import { Collapse, CollapseBody, CollapseClip, type CollapseProps } from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

const text =
  'Plume is a set of accessible React components that you can use with its own styles or with Tailwind and Bootstrap classes. Every component has an unstyled variant that keeps the structure and drops the looks.'

const frame = { maxWidth: '100%', width: '26rem' }

const triggerClass =
  'flex w-full items-center justify-between gap-2 rounded border border-gray-300 px-3 py-2 text-start text-sm font-medium'

function Chevron({ open }: Readonly<{ open: boolean }>): React.ReactNode {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="1em"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : undefined, transition: 'transform 0.2s' }}
      viewBox="0 0 24 24"
      width="1em"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function Toggle({
  children,
  defaultOpen = false,
  label = 'Details',
  ...collapse
}: Readonly<
  Pick<CollapseProps, 'colorScheme' | 'size' | 'variant'> & {
    children?: React.ReactNode
    defaultOpen?: boolean
    label?: string
  }
>): React.ReactNode {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()
  return (
    <div style={frame}>
      <button
        aria-controls={id}
        aria-expanded={open}
        className={`${triggerClass} mb-2`}
        onClick={() => setOpen(!open)}
        type="button"
      >
        {label}
        <Chevron open={open} />
      </button>
      <Collapse id={id} open={open} {...collapse}>
        {children ?? text}
      </Collapse>
    </div>
  )
}

function Showcase({
  children,
  label,
}: Readonly<{ children: React.ReactNode; label: string }>): React.ReactNode {
  const [open, setOpen] = useState(true)
  const id = useId()
  return (
    <div style={frame}>
      <button
        aria-controls={id}
        aria-expanded={open}
        className={`${triggerClass} mb-3`}
        onClick={() => setOpen(!open)}
        type="button"
      >
        {open ? 'Hide' : 'Show'} {label}
        <Chevron open={open} />
      </button>
      <Collapse id={id} open={open} variant="unstyled">
        <CollapseBody className="flex flex-col gap-3">{children}</CollapseBody>
      </Collapse>
    </div>
  )
}

function ControlledExample({ open: initial, ...args }: Readonly<CollapseProps>): React.ReactNode {
  const [open, setOpen] = useState(initial ?? false)
  const id = useId()
  useEffect(() => setOpen(initial ?? false), [initial])
  return (
    <div style={frame}>
      <button
        aria-controls={id}
        aria-expanded={open}
        className={`${triggerClass} mb-2`}
        onClick={() => setOpen(!open)}
        type="button"
      >
        Details
        <Chevron open={open} />
      </button>
      <Collapse {...args} id={id} open={open} />
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
 * The content sits in a box that takes the **variant**: `filled` is the default, `outline` draws a border and
 * `accent` adds a bar at the start, like a note. They take a **colorScheme** and a **size** (the padding), and
 * `unstyled` draws nothing: it is only the height animation, and you style the box with `CollapseBody`.
 *
 * The parts don't read a context: they are plain elements, so a Server Component can render them.
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
    children: { control: 'text' },
    className: { control: 'text' },
    variant: { control: 'radio', options: ['filled', 'outline', 'accent', 'unstyled'] },
    colorScheme: { control: 'select', options: [undefined, ...colorSchemes] },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    style: { control: false },
    open: { control: 'boolean' },
    id: { control: false },
    title: { control: 'text' },
    hidden: { control: false },
    role: { control: 'text' },
    'aria-label': { control: false },
    'aria-labelledby': { control: false },
  },
  args: {
    children: text,
    open: false,
  },
  render: (args) => <ControlledExample {...args} />,
} satisfies Meta<typeof Collapse>

type Story = StoryObj<typeof Collapse>

/**
 * This is the default Collapse, closed. Press the button to open it, or use the **open** control.
 */
export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `const [open, setOpen] = useState(false)
const id = useId()

<button aria-controls={id} aria-expanded={open} onClick={() => setOpen(!open)} type="button">
  Details
</button>
<Collapse id={id} open={open}>
  Plume is a set of accessible React components.
</Collapse>`,
      },
    },
  },
}

/**
 * Use the **variant** prop to pick how the box looks. `unstyled` drops the Plume styles: it keeps the animation and
 * leaves the box to you.
 */
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `const [open, setOpen] = useState(true)

<Collapse open={open} variant="filled">Content</Collapse>
<Collapse open={open} variant="outline">Content</Collapse>
<Collapse open={open} variant="accent">Content</Collapse>
<Collapse open={open} variant="unstyled">
  <CollapseBody className="rounded-lg bg-gray-900 p-3 text-sm text-gray-100">Content</CollapseBody>
</Collapse>`,
      },
    },
  },
  render: () => (
    <Showcase label="variants">
      {(['filled', 'outline', 'accent'] as const).map((variant) => (
        <Collapse key={variant} open variant={variant}>
          {variant}: {text}
        </Collapse>
      ))}
      <Collapse open variant="unstyled">
        <CollapseBody className="rounded-lg bg-gray-900 p-3 text-sm text-gray-100">
          unstyled: {text}
        </CollapseBody>
      </Collapse>
    </Showcase>
  ),
}

/**
 * Use the **size** prop to change the text and the padding of the box.
 */
export const Sizes: Story = {
  parameters: {
    docs: {
      source: {
        code: `const [open, setOpen] = useState(true)

<Collapse open={open} size="sm">Content</Collapse>
<Collapse open={open} size="md">Content</Collapse>
<Collapse open={open} size="lg">Content</Collapse>`,
      },
    },
  },
  render: () => (
    <Showcase label="sizes">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Collapse key={size} open size={size}>
          {size}: {text}
        </Collapse>
      ))}
    </Showcase>
  ),
}

/**
 * Use the **colorScheme** prop to pick a color from the theme. It tints the box.
 */
export const Colors: Story = {
  parameters: {
    docs: {
      source: {
        code: `const [open, setOpen] = useState(true)

<Collapse colorScheme="primary" open={open} size="sm">Content</Collapse>
<Collapse colorScheme="success" open={open} size="sm">Content</Collapse>`,
      },
    },
  },
  render: () => (
    <Showcase label="colors">
      {colorSchemes.map((scheme) => (
        <Collapse
          colorScheme={scheme as keyof typeof defaultTheme.colors}
          key={scheme}
          open
          size="sm"
        >
          {scheme}: {text}
        </Collapse>
      ))}
    </Showcase>
  ),
}

/**
 * Keep the state next to the button that controls it, and link them with `aria-expanded` and `aria-controls`.
 */
export const WithButton: Story = {
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <div>
      <button aria-controls={id} aria-expanded={open} onClick={() => setOpen(!open)} type="button">
        Details
      </button>
      <Collapse id={id} open={open}>
        Plume is a set of accessible React components.
      </Collapse>
    </div>
  )
}`,
      },
    },
  },
  render: () => <Toggle />,
}

/**
 * Any variant can be the box of a "show more", with its own **colorScheme**.
 */
export const Accent: Story = {
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <div>
      <button aria-controls={id} aria-expanded={open} onClick={() => setOpen(!open)} type="button">
        Warning
      </button>
      <Collapse colorScheme="warning" id={id} open={open} variant="accent">
        This action cannot be undone. Check the details before you go on.
      </Collapse>
    </div>
  )
}`,
      },
    },
  },
  render: () => (
    <Toggle colorScheme="warning" label="Warning" variant="accent">
      This action cannot be undone. Check the details before you go on.
    </Toggle>
  ),
}

/**
 * It starts closed by default, which keeps the content out of the page and out of the keyboard until it is opened.
 * Start the state as `true` to render it open.
 */
export const StartsOpen: Story = {
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [open, setOpen] = useState(true)
  const id = useId()
  return (
    <div>
      <button aria-controls={id} aria-expanded={open} onClick={() => setOpen(!open)} type="button">
        Details
      </button>
      <Collapse id={id} open={open}>
        Plume is a set of accessible React components.
      </Collapse>
    </div>
  )
}`,
      },
    },
  },
  render: () => <Toggle defaultOpen />,
}

/**
 * The height follows the content, whatever it is, and the Collapse can hold other Collapses.
 */
export const Nested: Story = {
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [outer, setOuter] = useState(true)
  const [inner, setInner] = useState(false)
  return (
    <div className="flex flex-col gap-2">
      <button aria-expanded={outer} onClick={() => setOuter(!outer)} type="button">
        Outer
      </button>
      <Collapse open={outer} variant="outline">
        <div className="flex flex-col gap-2">
          <p>Plume is a set of accessible React components.</p>
          <button aria-expanded={inner} onClick={() => setInner(!inner)} type="button">
            Inner
          </button>
          <Collapse open={inner}>Content of the inner Collapse.</Collapse>
        </div>
      </Collapse>
    </div>
  )
}`,
      },
    },
  },
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
          <Collapse open={outer} variant="outline">
            <div className="flex flex-col gap-2">
              <p>{text}</p>
              <button
                aria-expanded={inner}
                className="self-start rounded border border-gray-400 px-3 py-1"
                onClick={() => setInner(!inner)}
                type="button"
              >
                Inner
              </button>
              <Collapse open={inner}>Content of the inner Collapse.</Collapse>
            </div>
          </Collapse>
        </div>
      )
    }
    return <Example />
  },
}

/**
 * Use the `CollapseBody` part to give the box its own class or style, or `CollapseClip` to reach the element that
 * clips it. Put the part inside the Collapse and it replaces the box the Collapse draws.
 */
export const Compound: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Collapse open>
  <CollapseClip>
    <CollapseBody className="shadow-lg" style={{ borderRadius: 16 }}>
      Content
    </CollapseBody>
  </CollapseClip>
</Collapse>`,
      },
    },
  },
  render: () => (
    <Showcase label="box">
      <Collapse open variant="unstyled">
        <CollapseClip>
          <CollapseBody className="shadow-lg" style={{ borderRadius: 16 }}>
            {text}
          </CollapseBody>
        </CollapseClip>
      </Collapse>
    </Showcase>
  ),
}

/**
 * Some examples of Collapse with Tailwind classes. The Collapse brings the animation, so the classes only style
 * the content: `CollapseBody` is the box where the padding and the background go. Use `data-[open]:` on the
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
<Collapse id="more" open={open} variant="unstyled">
  <CollapseBody className="mt-2 rounded-lg border border-border bg-surface-muted p-4 text-sm text-foreground">
    Content
  </CollapseBody>
</Collapse>`,
      },
    },
  },
  render: () => {
    function Example(): React.ReactNode {
      const [open, setOpen] = useState(false)
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
          <Collapse id="tailwind-more" open={open} variant="unstyled">
            <CollapseBody className="mt-2 rounded-lg border border-border bg-surface-muted p-4 text-sm text-foreground">
              {text}
            </CollapseBody>
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
<Collapse id="more" open={open} variant="unstyled">
  <div className="card card-body mt-2">Content</div>
</Collapse>`,
      },
    },
  },
  render: () => {
    function Example(): React.ReactNode {
      const [open, setOpen] = useState(false)
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
          <Collapse id="bootstrap-more" open={open} variant="unstyled">
            <div className="card card-body mt-2">{text}</div>
          </Collapse>
        </div>
      )
    }
    return <Example />
  },
}
