import type { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { defaultTheme } from '../../../../theme'
import {
  Sidebar,
  SidebarBackdrop,
  SidebarContent,
  SidebarItem,
  SidebarItemIcon,
  SidebarItemLabel,
  SidebarProvider,
  SidebarToggle,
  type SidebarProps,
  type SidebarProviderProps,
} from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

function Glyph({ path }: Readonly<{ path: string }>): React.ReactNode {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="1em"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="1em"
    >
      <path d={path} />
    </svg>
  )
}

const pages = [
  { href: '#home', icon: 'M3 11l9-8 9 8M5 10v10h14V10', label: 'Home' },
  { href: '#projects', icon: 'M3 7h18v13H3zM8 7V4h8v3', label: 'Projects' },
  {
    href: '#team',
    icon: 'M16 20v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6',
    label: 'Team',
  },
  {
    href: '#settings',
    icon: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M12 2v3M12 19v3M2 12h3M19 12h3',
    label: 'Settings',
  },
]

function Items({ disabled }: Readonly<{ disabled?: string }>): React.ReactNode {
  return pages.map(({ href, icon, label }, index) => (
    <SidebarItem
      active={index === 0}
      disabled={disabled === label}
      href={href}
      icon={<Glyph path={icon} />}
      key={label}
    >
      {label}
    </SidebarItem>
  ))
}

function Shell({
  caption,
  children,
  compact = false,
  label = 'Pages',
  sidebar,
  ...provider
}: Readonly<
  SidebarProviderProps & {
    caption?: string
    compact?: boolean
    label?: string
    sidebar?: Partial<SidebarProps>
  }
>): React.ReactNode {
  return (
    <SidebarProvider {...provider} breakpoint={compact ? 'never' : provider.breakpoint}>
      <div className="flex flex-col gap-2" style={{ width: '100%' }}>
        {caption ? <p className="text-sm font-semibold">{caption}</p> : null}
        <div
          className="flex overflow-hidden rounded border border-gray-300"
          style={{
            height: compact ? undefined : '20rem',
            minHeight: compact ? '13rem' : undefined,
            transform: 'translateZ(0)',
            width: '100%',
          }}
        >
          <Sidebar
            aria-label="Application"
            {...sidebar}
            style={
              compact
                ? ({ '--sidebar-width': '11rem', ...sidebar?.style } as React.CSSProperties)
                : sidebar?.style
            }
          >
            {children ?? (
              <SidebarContent aria-label={label}>
                <Items />
              </SidebarContent>
            )}
          </Sidebar>
          <div className="flex flex-1 flex-col gap-2 p-4" style={{ minWidth: 0 }}>
            <div>
              <SidebarToggle />
            </div>
            <p className="text-sm">
              {compact ? 'The page.' : 'The page. Use the button to open or collapse the sidebar.'}
            </p>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}

/**
 * The navigation of an app, a column of links next to the page. On a wide screen it can be collapsed to a rail of
 * icons; below a breakpoint it leaves the page and opens over it, like a drawer.
 *
 * It is made of a `SidebarProvider`, which keeps the state and wraps the whole layout, and the `Sidebar` itself.
 * The provider is separate so that the `SidebarToggle` can be anywhere inside it, for example in the header of the
 * page, and not only in the sidebar.
 *
 * **Wide screens.** The toggle collapses the sidebar to the width of the icons (`collapsed`, `defaultCollapsed` and
 * `onCollapsedChange`). The labels of the items stay in the page for screen readers, and the toggle has
 * `aria-expanded`. Give an icon to every item, because it is all that shows in the rail.
 *
 * **Small screens.** Below the **breakpoint** (`sm` 640px, `md` 768px, the default, or `lg` 1024px; `never` keeps it always docked) the sidebar is
 * hidden, and the toggle opens it (`open`, `defaultOpen` and `onOpenChange`). Then it is a modal dialog: the focus
 * moves into it and stays there, the page behind doesn't scroll, and <kbd>Esc</kbd> or a press on the backdrop
 * closes it and gives the focus back to the toggle. The hiding is done in CSS, so the server renders it closed.
 * The panel is `position: fixed`, so don't put it inside an element with a `transform`.
 *
 * `SidebarContent` is the `<nav>` with the links and should have an `aria-label` that tells it apart from other
 * navigations. A `SidebarItem` with an `href` is a link and one without it is a button, for actions. The item of
 * the current page takes `active`, which sets `aria-current="page"`. With a client-side router pass `onClick` and
 * navigate there.
 */
const meta: Meta<typeof Sidebar> = {
  title: 'Components/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      importNames: [
        'SidebarProvider',
        'Sidebar',
        'SidebarToggle',
        'SidebarBackdrop',
        'SidebarContent',
        'SidebarItem',
        'SidebarItemIcon',
        'SidebarItemLabel',
      ],
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
    side: { control: 'radio', options: ['left', 'right'] },
    colorScheme: { control: 'select', options: colorSchemes },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'radio', options: ['plain', 'filled', 'solid', 'unstyled'] },
    title: { control: 'text' },
    hidden: { control: false },
    'aria-label': { control: 'text' },
    'aria-labelledby': { control: false },
  },
  args: {
    children: undefined,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%' }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => <Shell sidebar={args} />,
}

export default meta

type Story = StoryObj<typeof Sidebar>

/**
 * This is the default Sidebar. The button collapses it to the icons; on a screen narrower than 768px it opens the
 * sidebar over the page instead.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick how the Sidebar looks. `unstyled` drops the Plume styles so you can style it
 * yourself.
 */
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-6">
  <SidebarProvider breakpoint="never">
    <div className="flex">
      <Sidebar aria-label="Application" variant="plain">
        <SidebarContent aria-label="Pages plain">
          <SidebarItem active href="#home" icon={<HomeIcon />}>
            Home
          </SidebarItem>
          <SidebarItem href="#projects" icon={<FolderIcon />}>
            Projects
          </SidebarItem>
        </SidebarContent>
      </Sidebar>
      <main className="flex-1 p-4">
        <SidebarToggle />
        <p>The page.</p>
      </main>
    </div>
  </SidebarProvider>
  <SidebarProvider breakpoint="never">
    <div className="flex">
      <Sidebar aria-label="Application" variant="solid">
        <SidebarContent aria-label="Pages solid">
          <SidebarItem active href="#home" icon={<HomeIcon />}>
            Home
          </SidebarItem>
          <SidebarItem href="#projects" icon={<FolderIcon />}>
            Projects
          </SidebarItem>
        </SidebarContent>
      </Sidebar>
      <main className="flex-1 p-4">
        <SidebarToggle />
        <p>The page.</p>
      </main>
    </div>
  </SidebarProvider>
  <SidebarProvider breakpoint="never">
    <div className="flex">
      <Sidebar
        aria-label="Application"
        className="rounded-r-2xl bg-slate-900 p-3 text-slate-100"
        variant="unstyled"
      >
        <SidebarContent aria-label="Pages unstyled" className="gap-1">
          <SidebarItem
            active
            className="rounded-lg px-3 py-2 hover:bg-slate-700 data-[active]:bg-slate-700"
            href="#home"
          >
            Home
          </SidebarItem>
          <SidebarItem
            className="rounded-lg px-3 py-2 hover:bg-slate-700 data-[active]:bg-slate-700"
            href="#projects"
          >
            Projects
          </SidebarItem>
        </SidebarContent>
      </Sidebar>
      <main className="flex-1 p-4">
        <SidebarToggle />
        <p>The page.</p>
      </main>
    </div>
  </SidebarProvider>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      {(['plain', 'filled', 'solid'] as const).map((variant) => (
        <Shell
          caption={variant}
          compact
          key={variant}
          label={`Pages ${variant}`}
          sidebar={{ variant }}
        />
      ))}
      <Shell
        caption="unstyled, with Tailwind classes"
        compact
        label="Pages unstyled"
        sidebar={{
          className: 'rounded-r-2xl bg-slate-900 p-3 text-slate-100',
          variant: 'unstyled',
        }}
      >
        <SidebarContent aria-label="Pages unstyled" className="gap-1">
          {pages.map(({ href, label }, index) => (
            <SidebarItem
              active={index === 0}
              className="rounded-lg px-3 py-2 hover:bg-slate-700 data-[active]:bg-slate-700 data-[active]:font-bold"
              href={href}
              key={label}
            >
              {label}
            </SidebarItem>
          ))}
        </SidebarContent>
      </Shell>
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
  <SidebarProvider breakpoint="never">
    <div className="flex">
      <Sidebar aria-label="Application" size="sm">
        <SidebarContent aria-label="Pages sm">
          <SidebarItem active href="#home" icon={<HomeIcon />}>
            Home
          </SidebarItem>
          <SidebarItem href="#projects" icon={<FolderIcon />}>
            Projects
          </SidebarItem>
        </SidebarContent>
      </Sidebar>
      <main className="flex-1 p-4">
        <SidebarToggle />
        <p>The page.</p>
      </main>
    </div>
  </SidebarProvider>
  <SidebarProvider breakpoint="never">
    <div className="flex">
      <Sidebar aria-label="Application" size="lg">
        <SidebarContent aria-label="Pages lg">
          <SidebarItem active href="#home" icon={<HomeIcon />}>
            Home
          </SidebarItem>
          <SidebarItem href="#projects" icon={<FolderIcon />}>
            Projects
          </SidebarItem>
        </SidebarContent>
      </Sidebar>
      <main className="flex-1 p-4">
        <SidebarToggle />
        <p>The page.</p>
      </main>
    </div>
  </SidebarProvider>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Shell caption={size} compact key={size} label={`Pages ${size}`} sidebar={{ size }} />
      ))}
    </div>
  ),
}

/**
 * Use the **colorScheme** prop to pick a color from the theme. It colors the active item, and the whole sidebar in the
 * `solid` variant. Here every scheme is shown in the default `plain` variant.
 */
export const Colors: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-4">
  <SidebarProvider breakpoint="never">
    <div className="flex">
      <Sidebar aria-label="Application" colorScheme="primary" size="sm">
        <SidebarContent aria-label="Pages primary">
          <SidebarItem active href="#home" icon={<HomeIcon />}>
            Home
          </SidebarItem>
          <SidebarItem href="#projects" icon={<FolderIcon />}>
            Projects
          </SidebarItem>
        </SidebarContent>
      </Sidebar>
      <main className="flex-1 p-4">
        <SidebarToggle />
        <p>The page.</p>
      </main>
    </div>
  </SidebarProvider>
  <SidebarProvider breakpoint="never">
    <div className="flex">
      <Sidebar aria-label="Application" colorScheme="success" size="sm">
        <SidebarContent aria-label="Pages success">
          <SidebarItem active href="#home" icon={<HomeIcon />}>
            Home
          </SidebarItem>
          <SidebarItem href="#projects" icon={<FolderIcon />}>
            Projects
          </SidebarItem>
        </SidebarContent>
      </Sidebar>
      <main className="flex-1 p-4">
        <SidebarToggle />
        <p>The page.</p>
      </main>
    </div>
  </SidebarProvider>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      {colorSchemes.map((scheme) => (
        <Shell
          caption={scheme}
          compact
          key={scheme}
          label={`Pages ${scheme}`}
          sidebar={{
            colorScheme: scheme as keyof typeof defaultTheme.colors,
            size: 'sm',
          }}
        />
      ))}
    </div>
  ),
}

/**
 * With **defaultCollapsed** it starts as a rail of icons. The labels are still read by screen readers.
 */
export const Collapsed: Story = {
  parameters: {
    docs: {
      source: {
        code: `<SidebarProvider breakpoint="never" defaultCollapsed>
  <div className="flex">
    <Sidebar aria-label="Application">
      <SidebarContent aria-label="Pages">
        <SidebarItem active href="#home" icon={<HomeIcon />}>
          Home
        </SidebarItem>
        <SidebarItem href="#projects" icon={<FolderIcon />}>
          Projects
        </SidebarItem>
      </SidebarContent>
    </Sidebar>
    <main className="flex-1 p-4">
      <SidebarToggle />
      <p>The page.</p>
    </main>
  </div>
</SidebarProvider>`,
      },
    },
  },
  render: () => <Shell compact defaultCollapsed />,
}

/**
 * **side** is where the sidebar slides in from on a small screen. On a wide screen, put it on the right of your
 * layout.
 */
export const Right: Story = {
  parameters: {
    docs: {
      source: {
        code: `<SidebarProvider>
  <div className="flex">
    <main className="flex-1 p-4">
      <SidebarToggle />
      <p>The sidebar is on the right.</p>
    </main>
    <Sidebar aria-label="Application" side="right">
      <SidebarContent aria-label="Pages">
        <SidebarItem active href="#home" icon={<HomeIcon />}>
          Home
        </SidebarItem>
        <SidebarItem href="#projects" icon={<FolderIcon />}>
          Projects
        </SidebarItem>
        <SidebarItem href="#team" icon={<UsersIcon />}>
          Team
        </SidebarItem>
      </SidebarContent>
    </Sidebar>
  </div>
</SidebarProvider>`,
      },
    },
  },
  render: () => (
    <SidebarProvider>
      <div
        className="flex overflow-hidden rounded border border-gray-300"
        style={{ height: '20rem', width: '100%' }}
      >
        <div className="flex flex-1 flex-col gap-2 p-4" style={{ minWidth: 0 }}>
          <div>
            <SidebarToggle />
          </div>
          <p className="text-sm">The sidebar is on the right.</p>
        </div>
        <Sidebar aria-label="Application" side="right">
          <SidebarContent aria-label="Pages">
            <Items />
          </SidebarContent>
        </Sidebar>
      </div>
    </SidebarProvider>
  ),
}

/**
 * A disabled item can't be activated or focused. An item without `href` is a button, for an action that is not a
 * page.
 */
export const Disabled: Story = {
  parameters: {
    docs: {
      source: {
        code: `<SidebarProvider breakpoint="never">
  <div className="flex">
    <Sidebar aria-label="Application">
      <SidebarContent aria-label="Pages">
        <SidebarItem active href="#home" icon={<HomeIcon />}>
          Home
        </SidebarItem>
        <SidebarItem disabled href="#team" icon={<UsersIcon />}>
          Team
        </SidebarItem>
        <SidebarItem icon={<ArrowRightIcon />} onClick={() => undefined}>
          Sign out
        </SidebarItem>
      </SidebarContent>
    </Sidebar>
    <main className="flex-1 p-4">
      <SidebarToggle />
      <p>The page.</p>
    </main>
  </div>
</SidebarProvider>`,
      },
    },
  },
  render: () => (
    <Shell compact>
      <SidebarContent aria-label="Pages">
        <Items disabled="Team" />
        <SidebarItem icon={<Glyph path="M5 12h14M12 5l7 7-7 7" />} onClick={() => undefined}>
          Sign out
        </SidebarItem>
      </SidebarContent>
    </Shell>
  ),
}

function ControlledSidebar(): React.ReactNode {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div className="flex flex-col gap-3">
      <Shell collapsed={collapsed} compact onCollapsedChange={setCollapsed} />
      <label className="text-sm">
        <input
          checked={collapsed}
          onChange={(event) => setCollapsed(event.target.checked)}
          type="checkbox"
        />{' '}
        Collapsed
      </label>
    </div>
  )
}

/**
 * Pass **collapsed** and **onCollapsedChange** to control the rail on a wide screen, and **open** and
 * **onOpenChange** for the off-canvas panel on a small one, for example to close it after the user picks a link.
 */
export const Controlled: Story = {
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <>
      <SidebarProvider breakpoint="never" collapsed={collapsed} onCollapsedChange={setCollapsed}>
        <div className="flex">
          <Sidebar aria-label="Application">
            <SidebarContent aria-label="Pages">
              <SidebarItem active href="#home" icon={<HomeIcon />}>
                Home
              </SidebarItem>
              <SidebarItem href="#projects" icon={<FolderIcon />}>
                Projects
              </SidebarItem>
            </SidebarContent>
          </Sidebar>
          <main className="flex-1 p-4">
            <SidebarToggle />
            <p>The page.</p>
          </main>
        </div>
      </SidebarProvider>
      <label>
        <input
          checked={collapsed}
          onChange={(event) => setCollapsed(event.target.checked)}
          type="checkbox"
        />{' '}
        Collapsed
      </label>
    </>
  )
}`,
      },
    },
  },
  render: () => <ControlledSidebar />,
}

/**
 * Every element is a part, so you compose them. Here the label comes before the icon, the icon is styled on its
 * own, and a `SidebarBackdrop` replaces the default one, with its own class. Parts that are left out are not
 * rendered, and the `icon` prop is only used by the default composition.
 */
export const Compound: Story = {
  parameters: {
    docs: {
      source: {
        code: `<SidebarProvider>
  <Sidebar aria-label="Application">
    <SidebarBackdrop className="backdrop-blur-sm" />
    <SidebarContent aria-label="Pages">
      <SidebarItem active href="/">
        <SidebarItemLabel>Home</SidebarItemLabel>
        <SidebarItemIcon className="ms-auto text-primary-text">
          <HomeIcon />
        </SidebarItemIcon>
      </SidebarItem>
      <SidebarItem href="/projects">
        <SidebarItemLabel>Projects</SidebarItemLabel>
      </SidebarItem>
    </SidebarContent>
  </Sidebar>
</SidebarProvider>`,
      },
    },
  },
  render: () => (
    <Shell>
      <SidebarBackdrop className="backdrop-blur-sm" />
      <SidebarContent aria-label="Pages">
        {pages.slice(0, 3).map(({ href, icon, label }, index) => (
          <SidebarItem active={index === 0} href={href} key={label}>
            <SidebarItemLabel>{label}</SidebarItemLabel>
            {index < 2 ? (
              <SidebarItemIcon className="ms-auto">
                <Glyph path={icon} />
              </SidebarItemIcon>
            ) : null}
          </SidebarItem>
        ))}
      </SidebarContent>
    </Shell>
  ),
}

/**
 * Some examples of Sidebar with Tailwind classes. With `variant="unstyled"` the Plume classes are gone and the
 * behavior stays: the collapsing, the hidden labels, and the panel that slides in on a small screen. Style the
 * parts with their own classes, and use `data-[active]:` on the items and `data-[collapsed]:` on the sidebar.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<SidebarProvider>
  <div className="flex">
    <Sidebar
      aria-label="Application"
      className="border-r border-border bg-surface p-3 text-sm text-foreground max-md:shadow-xl"
      variant="unstyled"
    >
      <SidebarBackdrop className="bg-black/50" />
      <SidebarContent aria-label="Pages" className="gap-1">
        <SidebarItem
          active
          className="gap-3 rounded-md px-3 py-2 hover:bg-surface-muted data-[active]:bg-primary-solid data-[active]:text-primary-on-solid"
          href="/"
          icon={<HomeIcon />}
        >
          Home
        </SidebarItem>
        <SidebarItem className="gap-3 rounded-md px-3 py-2 hover:bg-surface-muted" href="/projects" icon={<FolderIcon />}>
          Projects
        </SidebarItem>
      </SidebarContent>
    </Sidebar>
    <main className="flex-1 p-4">
      <SidebarToggle className="rounded p-1 hover:bg-surface-muted" variant="unstyled" />
    </main>
  </div>
</SidebarProvider>`,
      },
    },
  },
  render: () => (
    <Shell
      sidebar={{
        className: 'border-r border-border bg-surface p-3 text-sm text-foreground max-md:shadow-xl',
        variant: 'unstyled',
      }}
    >
      <SidebarBackdrop className="bg-black/50" />
      <SidebarContent aria-label="Pages" className="gap-1">
        {pages.slice(0, 3).map(({ href, icon, label }, index) => (
          <SidebarItem
            active={index === 0}
            className="gap-3 rounded-md px-3 py-2 hover:bg-surface-muted data-[active]:bg-primary-solid data-[active]:text-primary-on-solid"
            href={href}
            icon={<Glyph path={icon} />}
            key={label}
          >
            {label}
          </SidebarItem>
        ))}
      </SidebarContent>
    </Shell>
  ),
}

/**
 * Some examples of Sidebar with Bootstrap classes: `nav`, `flex-column` and `nav-link`. Bootstrap has no sidebar
 * component (its `offcanvas` needs its JavaScript), so the story composes its utilities and the component keeps
 * the behavior.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<SidebarProvider>
  <div className="d-flex">
    <Sidebar aria-label="Application" className="bg-body-tertiary border-end p-2" variant="unstyled">
      <SidebarContent aria-label="Pages" className="nav nav-pills flex-column">
        <SidebarItem active className="nav-link d-flex align-items-center gap-2 active" href="/" icon={<HomeIcon />}>Home</SidebarItem>
        <SidebarItem className="nav-link d-flex align-items-center gap-2 link-body-emphasis" href="/projects" icon={<FolderIcon />}>Projects</SidebarItem>
      </SidebarContent>
    </Sidebar>
    <main className="flex-fill p-3">
      <SidebarToggle className="btn btn-outline-secondary" variant="unstyled" />
    </main>
  </div>
</SidebarProvider>`,
      },
    },
  },
  render: () => (
    <Shell sidebar={{ className: 'bg-body-tertiary border-end p-2', variant: 'unstyled' }}>
      <SidebarContent aria-label="Pages" className="nav nav-pills flex-column">
        {pages.slice(0, 3).map(({ href, icon, label }, index) => (
          <SidebarItem
            active={index === 0}
            className={`nav-link d-flex align-items-center gap-2${index === 0 ? ' active' : ' link-body-emphasis'}`}
            href={href}
            icon={<Glyph path={icon} />}
            key={label}
          >
            {label}
          </SidebarItem>
        ))}
      </SidebarContent>
    </Shell>
  ),
}
