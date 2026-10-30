import type { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { defaultTheme } from '../../../../theme'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarToggle } from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

function Parts({
  align,
  contentClassName,
  itemClassName,
}: Readonly<{
  align?: 'start' | 'center' | 'end'
  contentClassName?: string
  itemClassName?: string
}>): React.ReactNode {
  return (
    <>
      <NavbarBrand href="#home">Plume</NavbarBrand>
      <NavbarToggle />
      <NavbarContent align={align} className={contentClassName}>
        <NavbarItem active className={itemClassName} href="#home">
          Home
        </NavbarItem>
        <NavbarItem className={itemClassName} href="#components">
          Components
        </NavbarItem>
        <NavbarItem className={itemClassName} href="#docs">
          Docs
        </NavbarItem>
        <NavbarItem className={itemClassName} href="#pricing">
          Pricing
        </NavbarItem>
      </NavbarContent>
    </>
  )
}

/**
 * The bar at the top of a page, with the brand and the main links. Below a breakpoint the links fold behind a
 * toggle button, which makes it usable on a phone.
 *
 * It is a `<nav>`: give it a name with `aria-label` if the page has more than one navigation. The toggle is a
 * `<button>` with `aria-expanded` and `aria-controls` pointing at the content, and a label that you can change.
 * The item of the current page takes `active`, which sets `aria-current="page"`. When the menu is open on a small
 * screen, <kbd>Esc</kbd> closes it and returns the focus to the toggle, and so does pressing outside it.
 *
 * The folding is done in CSS with a media query, so it works on the server and before the JavaScript loads (the
 * menu is closed, and a closed menu is not reachable). **breakpoint** picks where it happens: `sm` (640px), `md`
 * (768px, the default) or `lg` (1024px), and `never` keeps the content always visible. The state of the menu is in
 * `open`, `defaultOpen` and `onOpenChange`; it only matters below the breakpoint.
 *
 * The parts are plain `<a>` and `<button>` elements. A `NavbarItem` with an `href` is a link and one without it is
 * a button, for actions. With a client-side router pass `onClick` and navigate there, or render the router link
 * inside the content yourself.
 */
export default {
  title: 'Components/Navbar',
  component: Navbar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      importNames: ['Navbar', 'NavbarBrand', 'NavbarContent', 'NavbarItem', 'NavbarToggle'],
      toc: {
        title: 'On this page',
        disable: false,
      },
    },
    layout: 'padded',
  },
  argTypes: {
    children: { control: false },
    className: { control: 'text' },
    style: { control: false },
    breakpoint: { control: 'radio', options: ['sm', 'md', 'lg', 'never'] },
    sticky: { control: 'boolean' },
    open: { control: false },
    defaultOpen: { control: 'boolean' },
    onOpenChange: { control: false },
    colorScheme: { control: 'select', options: colorSchemes },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'radio', options: ['plain', 'filled', 'solid', 'unstyled'] },
    id: { control: false },
    title: { control: 'text' },
    hidden: { control: false },
    'aria-label': { control: 'text' },
    'aria-labelledby': { control: false },
  },
  args: {
    'aria-label': 'Main',
    children: <Parts />,
  },
} satisfies Meta<typeof Navbar>

type Story = StoryObj<typeof Navbar>

/**
 * This is the default Navbar. Make the window narrower than 768px to see the links fold behind the toggle.
 */
export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Navbar aria-label="Main">
  <NavbarBrand href="/">Plume</NavbarBrand>
  <NavbarToggle />
  <NavbarContent>
    <NavbarItem active href="/">
      Home
    </NavbarItem>
    <NavbarItem href="/components">Components</NavbarItem>
    <NavbarItem href="/docs">Docs</NavbarItem>
    <NavbarItem href="/pricing">Pricing</NavbarItem>
  </NavbarContent>
</Navbar>`,
      },
    },
  },
}

/**
 * Use the **variant** prop to pick how the Navbar looks. `unstyled` drops the Plume styles so you can style it
 * yourself.
 */
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-6">
  <Navbar aria-label="plain" variant="plain">
    <NavbarBrand href="/">Plume</NavbarBrand>
    <NavbarToggle />
    <NavbarContent>
      <NavbarItem active href="/">
        Home
      </NavbarItem>
      <NavbarItem href="/components">Components</NavbarItem>
      <NavbarItem href="/docs">Docs</NavbarItem>
    </NavbarContent>
  </Navbar>
  <Navbar aria-label="solid" variant="solid">
    <NavbarBrand href="/">Plume</NavbarBrand>
    <NavbarToggle />
    <NavbarContent>
      <NavbarItem active href="/">
        Home
      </NavbarItem>
      <NavbarItem href="/components">Components</NavbarItem>
      <NavbarItem href="/docs">Docs</NavbarItem>
    </NavbarContent>
  </Navbar>
  <Navbar
    aria-label="unstyled"
    className="gap-4 rounded-xl bg-slate-900 px-4 py-2 text-slate-100"
    variant="unstyled"
  >
    <NavbarBrand href="/">Plume</NavbarBrand>
    <NavbarToggle />
    <NavbarContent className="gap-2">
      <NavbarItem
        active
        className="rounded-lg px-3 py-1 hover:bg-slate-700 data-[active]:bg-slate-700 data-[active]:font-bold"
        href="/"
      >
        Home
      </NavbarItem>
      <NavbarItem
        className="rounded-lg px-3 py-1 hover:bg-slate-700 data-[active]:bg-slate-700 data-[active]:font-bold"
        href="/docs"
      >
        Docs
      </NavbarItem>
    </NavbarContent>
  </Navbar>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      {(['plain', 'filled', 'solid'] as const).map((variant) => (
        <div className="flex flex-col gap-2" key={variant}>
          <p className="text-sm font-semibold">{variant}</p>
          <Navbar aria-label={variant} variant={variant}>
            <Parts />
          </Navbar>
        </div>
      ))}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold">unstyled, with Tailwind classes</p>
        <Navbar
          aria-label="unstyled"
          className="gap-4 rounded-xl bg-slate-900 px-4 py-2 text-slate-100"
          variant="unstyled"
        >
          <Parts
            contentClassName="gap-2"
            itemClassName="rounded-lg px-3 py-1 hover:bg-slate-700 data-[active]:bg-slate-700 data-[active]:font-bold"
          />
        </Navbar>
      </div>
    </div>
  ),
}

/**
 * Use the **size** prop to change the size.
 */
export const Sizes: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-6">
  <Navbar aria-label="sm" size="sm">
    <NavbarBrand href="/">Plume</NavbarBrand>
    <NavbarToggle />
    <NavbarContent>
      <NavbarItem active href="/">
        Home
      </NavbarItem>
      <NavbarItem href="/components">Components</NavbarItem>
      <NavbarItem href="/docs">Docs</NavbarItem>
    </NavbarContent>
  </Navbar>
  <Navbar aria-label="md" size="md">
    <NavbarBrand href="/">Plume</NavbarBrand>
    <NavbarToggle />
    <NavbarContent>
      <NavbarItem active href="/">
        Home
      </NavbarItem>
      <NavbarItem href="/components">Components</NavbarItem>
      <NavbarItem href="/docs">Docs</NavbarItem>
    </NavbarContent>
  </Navbar>
  <Navbar aria-label="lg" size="lg">
    <NavbarBrand href="/">Plume</NavbarBrand>
    <NavbarToggle />
    <NavbarContent>
      <NavbarItem active href="/">
        Home
      </NavbarItem>
      <NavbarItem href="/components">Components</NavbarItem>
      <NavbarItem href="/docs">Docs</NavbarItem>
    </NavbarContent>
  </Navbar>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Navbar aria-label={size} key={size} size={size}>
          <Parts />
        </Navbar>
      ))}
    </div>
  ),
}

/**
 * Use the **colorScheme** prop to pick a color from the theme. It colors the active item, and the whole bar in the
 * `solid` variant. Here every scheme is shown in the default `plain` variant.
 */
export const Colors: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-4">
  <Navbar aria-label="primary" colorScheme="primary">
    <NavbarBrand href="/">Plume</NavbarBrand>
    <NavbarToggle />
    <NavbarContent>
      <NavbarItem active href="/">
        Home
      </NavbarItem>
      <NavbarItem href="/components">Components</NavbarItem>
      <NavbarItem href="/docs">Docs</NavbarItem>
    </NavbarContent>
  </Navbar>
  <Navbar aria-label="success" colorScheme="success">
    <NavbarBrand href="/">Plume</NavbarBrand>
    <NavbarToggle />
    <NavbarContent>
      <NavbarItem active href="/">
        Home
      </NavbarItem>
      <NavbarItem href="/components">Components</NavbarItem>
      <NavbarItem href="/docs">Docs</NavbarItem>
    </NavbarContent>
  </Navbar>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      {colorSchemes.map((scheme) => (
        <Navbar
          aria-label={scheme}
          colorScheme={scheme as keyof typeof defaultTheme.colors}
          key={scheme}
        >
          <Parts />
        </Navbar>
      ))}
    </div>
  ),
}

/**
 * Use **align** on the `NavbarContent` to place the links: at the `start` next to the brand, in the `center` or at
 * the `end`.
 */
export const Alignment: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-6">
  <Navbar aria-label="start">
    <NavbarBrand href="/">Plume</NavbarBrand>
    <NavbarToggle />
    <NavbarContent align="start">
      <NavbarItem active href="/">
        Home
      </NavbarItem>
      <NavbarItem href="/components">Components</NavbarItem>
      <NavbarItem href="/docs">Docs</NavbarItem>
    </NavbarContent>
  </Navbar>
  <Navbar aria-label="center">
    <NavbarBrand href="/">Plume</NavbarBrand>
    <NavbarToggle />
    <NavbarContent align="center">
      <NavbarItem active href="/">
        Home
      </NavbarItem>
      <NavbarItem href="/components">Components</NavbarItem>
      <NavbarItem href="/docs">Docs</NavbarItem>
    </NavbarContent>
  </Navbar>
  <Navbar aria-label="end">
    <NavbarBrand href="/">Plume</NavbarBrand>
    <NavbarToggle />
    <NavbarContent align="end">
      <NavbarItem active href="/">
        Home
      </NavbarItem>
      <NavbarItem href="/components">Components</NavbarItem>
      <NavbarItem href="/docs">Docs</NavbarItem>
    </NavbarContent>
  </Navbar>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      {(['start', 'center', 'end'] as const).map((align) => (
        <Navbar aria-label={align} key={align}>
          <Parts align={align} />
        </Navbar>
      ))}
    </div>
  ),
}

/**
 * An item with **disabled** can't be activated or focused. An item without `href` is a button, for actions that are
 * not a page.
 */
export const Disabled: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Navbar aria-label="With a disabled item">
  <NavbarBrand href="/">Plume</NavbarBrand>
  <NavbarToggle />
  <NavbarContent>
    <NavbarItem active href="/">
      Home
    </NavbarItem>
    <NavbarItem disabled href="/pricing">
      Pricing (soon)
    </NavbarItem>
    <NavbarItem onClick={() => undefined}>Action</NavbarItem>
  </NavbarContent>
</Navbar>`,
      },
    },
  },
  render: () => (
    <Navbar aria-label="With a disabled item">
      <NavbarBrand href="#home">Plume</NavbarBrand>
      <NavbarToggle />
      <NavbarContent>
        <NavbarItem active href="#home">
          Home
        </NavbarItem>
        <NavbarItem disabled href="#pricing">
          Pricing (soon)
        </NavbarItem>
        <NavbarItem onClick={() => undefined}>Action</NavbarItem>
      </NavbarContent>
    </Navbar>
  ),
}

function ControlledNavbar(): React.ReactNode {
  const [open, setOpen] = useState(true)
  return (
    <div className="flex flex-col gap-4">
      <Navbar aria-label="Controlled" breakpoint="never" onOpenChange={setOpen} open={open}>
        <Parts />
      </Navbar>
      <button
        className="self-start rounded-sm border border-gray-400 px-3 py-1 text-sm"
        onClick={() => setOpen(!open)}
        type="button"
      >
        {open ? 'Close' : 'Open'} the menu from outside
      </button>
      <p className="text-sm">Open: {String(open)}</p>
    </div>
  )
}

/**
 * Pass **open** and **onOpenChange** to control the menu, for example to close it when the user picks a link. It
 * only matters below the breakpoint; here the breakpoint is `never`, so the menu is always visible and the state
 * is shown under the bar.
 */
export const Controlled: Story = {
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [open, setOpen] = useState(true)
  return (
    <>
      <Navbar aria-label="Controlled" breakpoint="never" onOpenChange={setOpen} open={open}>
        <NavbarBrand href="#home">Plume</NavbarBrand>
        <NavbarToggle />
        <NavbarContent>
          <NavbarItem active href="#home">
            Home
          </NavbarItem>
          <NavbarItem href="#docs">Docs</NavbarItem>
        </NavbarContent>
      </Navbar>
      <button onClick={() => setOpen(!open)} type="button">
        {open ? 'Close' : 'Open'} the menu from outside
      </button>
      <p>Open: {String(open)}</p>
    </>
  )
}`,
      },
    },
  },
  render: () => <ControlledNavbar />,
}

/**
 * The Navbar is its parts, so you can reorder them. Here the `NavbarToggle` comes first, with its own `label`, the
 * links sit at the `end` of the `NavbarContent`, and the last item is a button with its own `className`. Every part
 * takes `className`, `style` and `ref`.
 */
export const Compound: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Navbar aria-label="Compound">
  <NavbarToggle label="Menu" />
  <NavbarBrand href="#home">Plume</NavbarBrand>
  <NavbarContent align="end">
    <NavbarItem active href="#home">
      Home
    </NavbarItem>
    <NavbarItem href="#docs">Docs</NavbarItem>
    <NavbarItem className="font-semibold" onClick={() => undefined}>
      Sign in
    </NavbarItem>
  </NavbarContent>
</Navbar>`,
      },
    },
  },
  render: () => (
    <Navbar aria-label="Compound">
      <NavbarToggle label="Menu" />
      <NavbarBrand href="#home">Plume</NavbarBrand>
      <NavbarContent align="end">
        <NavbarItem active href="#home">
          Home
        </NavbarItem>
        <NavbarItem href="#docs">Docs</NavbarItem>
        <NavbarItem className="font-semibold" onClick={() => undefined}>
          Sign in
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  ),
}

/**
 * Some examples of Navbar with Tailwind classes. With `variant="unstyled"` the Plume classes are gone and the
 * structure stays: the toggle appears and the content folds below the breakpoint. Style every part with its own
 * classes, and use `data-[active]:` on the items and `data-[open]:` on the toggle.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Navbar
  aria-label="Main"
  className="gap-x-4 border-b border-border bg-surface px-4 py-2 text-sm text-foreground"
  variant="unstyled"
>
  <NavbarBrand className="font-bold" href="/">Plume</NavbarBrand>
  <NavbarToggle className="rounded-sm p-1 text-2xl hover:bg-surface-muted" />
  <NavbarContent className="gap-1 max-md:pt-2">
    <NavbarItem active className="rounded-sm px-3 py-2 hover:bg-surface-muted data-[active]:bg-primary-solid data-[active]:text-primary-on-solid" href="/">Home</NavbarItem>
    <NavbarItem className="rounded-sm px-3 py-2 hover:bg-surface-muted" href="/components">Components</NavbarItem>
    <NavbarItem className="rounded-sm px-3 py-2 hover:bg-surface-muted" href="/docs">Docs</NavbarItem>
  </NavbarContent>
</Navbar>`,
      },
    },
  },
  render: () => (
    <Navbar
      aria-label="Main"
      className="gap-x-4 border-b border-border bg-surface px-4 py-2 text-sm text-foreground"
      variant="unstyled"
    >
      <NavbarBrand className="font-bold" href="#home">
        Plume
      </NavbarBrand>
      <NavbarToggle className="rounded-sm p-1 text-2xl hover:bg-surface-muted" />
      <NavbarContent className="gap-1 max-md:pt-2">
        <NavbarItem
          active
          className="rounded-sm px-3 py-2 hover:bg-surface-muted data-[active]:bg-primary-solid data-[active]:text-primary-on-solid"
          href="#home"
        >
          Home
        </NavbarItem>
        <NavbarItem className="rounded-sm px-3 py-2 hover:bg-surface-muted" href="#components">
          Components
        </NavbarItem>
        <NavbarItem className="rounded-sm px-3 py-2 hover:bg-surface-muted" href="#docs">
          Docs
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  ),
}

/**
 * Some examples of Navbar with Bootstrap classes: `navbar`, `navbar-expand-md`, `navbar-brand`,
 * `navbar-nav` and `nav-link`. Bootstrap folds its menu with its own JavaScript and the `collapse` class, which the
 * story doesn't use: the folding of the component is what shows and hides the menu, so the classes only give it
 * the look.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Navbar aria-label="Main" className="navbar navbar-expand-md bg-body-tertiary px-3" variant="unstyled">
  <NavbarBrand className="navbar-brand" href="/">Plume</NavbarBrand>
  <NavbarToggle className="navbar-toggler" />
  <NavbarContent className="navbar-nav">
    <NavbarItem active className="nav-link active" href="/">Home</NavbarItem>
    <NavbarItem className="nav-link" href="/components">Components</NavbarItem>
    <NavbarItem className="nav-link" href="/docs">Docs</NavbarItem>
  </NavbarContent>
</Navbar>`,
      },
    },
  },
  render: () => (
    <Navbar
      aria-label="Main"
      className="navbar navbar-expand-md bg-body-tertiary px-3"
      variant="unstyled"
    >
      <NavbarBrand className="navbar-brand" href="#home">
        Plume
      </NavbarBrand>
      <NavbarToggle className="navbar-toggler" />
      <NavbarContent className="navbar-nav">
        <NavbarItem active className="nav-link active" href="#home">
          Home
        </NavbarItem>
        <NavbarItem className="nav-link" href="#components">
          Components
        </NavbarItem>
        <NavbarItem className="nav-link" href="#docs">
          Docs
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  ),
}
