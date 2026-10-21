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
 *
 * ### Subcomponents
 *
 * | Component | Props |
 * | --- | --- |
 * | `NavbarBrand` | `href`, `target`, `rel`, `onClick`, `id`, `title`, `hidden`, `className`, `style`, `children`. The name or the logo. A link with `href`, a `<span>` without it. |
 * | `NavbarToggle` | `label`, `icon`, `disabled`, `onClick`, `id`, `title`, `className`, `style`, `children`. The button that opens and closes the content. It is only shown below the breakpoint. `label` is its accessible name (`"Toggle navigation"`), `icon` replaces the menu and close icons, and `children` replaces all of its content. |
 * | `NavbarContent` | `align`, `id`, `title`, `hidden`, `className`, `style`, `children`. What folds: the links and anything else you want in the menu. `align` (`start`, `center` or `end`) places them in the bar. It has `data-open` while the menu is open. |
 * | `NavbarItem` | `active`, `disabled`, `href`, `target`, `rel`, `onClick`, `id`, `title`, `hidden`, `className`, `style`, `children`. A link, or a button without `href`. It has `data-active` and `data-disabled`. |
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
    children: {
      control: false,
      description: 'The parts of the Navbar: `NavbarBrand`, `NavbarToggle` and `NavbarContent`.',
      table: { type: { summary: 'ReactNode' } },
    },
    className: {
      control: 'text',
      description: 'Custom CSS class for the Navbar.',
      table: { type: { summary: 'string' } },
    },
    style: {
      control: false,
      description:
        'Inline styles for the Navbar. They are applied after the color variables, so they can override them (e.g. `--navbar-solid`).',
      table: { type: { summary: 'CSSProperties' } },
    },
    breakpoint: {
      control: 'radio',
      description:
        'Below this width the content folds behind the toggle: `sm` is 640px, `md` 768px and `lg` 1024px. `never` keeps it always visible.',
      options: ['sm', 'md', 'lg', 'never'],
      table: {
        type: { summary: `"sm" | "md" | "lg" | "never"` },
        defaultValue: { summary: 'md' },
      },
    },
    sticky: {
      control: 'boolean',
      description: 'Keeps the Navbar at the top of the page when it scrolls.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    open: {
      control: false,
      description:
        'Whether the menu is open below the breakpoint. Makes the Navbar controlled: pass `onOpenChange` to update it.',
      table: { type: { summary: 'boolean' } },
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Whether the menu starts open, when it is not controlled.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    onOpenChange: {
      control: false,
      description: 'Called with the new state when the menu opens or closes.',
      table: { category: 'Events', type: { summary: '(open: boolean) => void' } },
    },
    colorScheme: {
      control: 'select',
      description:
        'Color scheme from the theme palette, including custom schemes added to it. It colors the active item, and the whole bar in the `solid` variant.',
      options: colorSchemes,
      table: { type: { summary: 'ColorScheme' }, defaultValue: { summary: 'primary' } },
    },
    size: {
      control: 'radio',
      description: 'Size of the Navbar.',
      options: ['sm', 'md', 'lg'],
      table: { type: { summary: `"sm" | "md" | "lg"` }, defaultValue: { summary: 'md' } },
    },
    variant: {
      control: 'radio',
      description:
        'Visual variant. `outline` has a line under the bar, `filled` a muted background and `solid` the color of the scheme. `unstyled` drops the Plume styles so you can bring your own; the layout and the folding keep working.',
      options: ['outline', 'filled', 'solid', 'unstyled'],
      table: {
        type: { summary: `"outline" | "filled" | "solid" | "unstyled"` },
        defaultValue: { summary: 'outline' },
      },
    },
    id: {
      control: false,
      description: 'Id of the Navbar. The content takes its own id from it.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    title: {
      control: 'text',
      description: 'Native tooltip of the Navbar.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    hidden: {
      control: false,
      description: 'Hides the Navbar.',
      table: { category: 'HTML attributes', type: { summary: 'boolean' } },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible name of the navigation. Needed when the page has more than one.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    'aria-labelledby': {
      control: false,
      description: 'Id of the element that names the navigation.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
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
export const Default: Story = {}

/**
 * Use the **variant** prop to pick how the Navbar looks. `unstyled` drops the Plume styles so you can style it
 * yourself.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(['outline', 'filled', 'solid'] as const).map((variant) => (
        <Navbar aria-label={variant} key={variant} variant={variant}>
          <Parts />
        </Navbar>
      ))}
      <Navbar
        aria-label="unstyled"
        className="gap-4 border-b border-border px-4 py-2 text-foreground"
        variant="unstyled"
      >
        <Parts contentClassName="gap-4" itemClassName="hover:underline data-[active]:font-bold" />
      </Navbar>
    </div>
  ),
}

/**
 * Use the **size** prop to change the size.
 */
export const Sizes: Story = {
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
 * `solid` variant.
 */
export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {colorSchemes.map((scheme) => (
        <div className="flex flex-col gap-2" key={scheme}>
          <Navbar
            aria-label={scheme}
            colorScheme={scheme as keyof typeof defaultTheme.colors}
            variant="outline"
          >
            <Parts />
          </Navbar>
          <Navbar
            aria-label={`${scheme} solid`}
            colorScheme={scheme as keyof typeof defaultTheme.colors}
            variant="solid"
          >
            <Parts />
          </Navbar>
        </div>
      ))}
    </div>
  ),
}

/**
 * Use **align** on the `NavbarContent` to place the links: at the `start` next to the brand, in the `center` or at
 * the `end`.
 */
export const Alignment: Story = {
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
        className="self-start rounded border border-gray-400 px-3 py-1 text-sm"
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
  render: () => <ControlledNavbar />,
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
  <NavbarToggle className="rounded p-1 text-2xl hover:bg-surface-muted" />
  <NavbarContent className="gap-1 max-md:pt-2">
    <NavbarItem active className="rounded px-3 py-2 hover:bg-surface-muted data-[active]:bg-primary-solid data-[active]:text-primary-on-solid" href="/">Home</NavbarItem>
    <NavbarItem className="rounded px-3 py-2 hover:bg-surface-muted" href="/components">Components</NavbarItem>
    <NavbarItem className="rounded px-3 py-2 hover:bg-surface-muted" href="/docs">Docs</NavbarItem>
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
      <NavbarToggle className="rounded p-1 text-2xl hover:bg-surface-muted" />
      <NavbarContent className="gap-1 max-md:pt-2">
        <NavbarItem
          active
          className="rounded px-3 py-2 hover:bg-surface-muted data-[active]:bg-primary-solid data-[active]:text-primary-on-solid"
          href="#home"
        >
          Home
        </NavbarItem>
        <NavbarItem className="rounded px-3 py-2 hover:bg-surface-muted" href="#components">
          Components
        </NavbarItem>
        <NavbarItem className="rounded px-3 py-2 hover:bg-surface-muted" href="#docs">
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
