import type { StoryObj, Meta } from '@storybook/react-vite'
import { defaultTheme } from '../../../../theme'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

function Trail(): React.ReactNode {
  return (
    <>
      <BreadcrumbItem>
        <BreadcrumbLink href="#home">Home</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href="#components">Components</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink current>Breadcrumb</BreadcrumbLink>
      </BreadcrumbItem>
    </>
  )
}

/**
 * The path of the current page inside the site, as a row of links. Use it to show where the reader is and to let
 * them go back up one level.
 *
 * It follows the WAI-ARIA breadcrumb pattern: a `<nav>` named "Breadcrumb" (change it with `labels.breadcrumb`, or with `aria-label`) with an
 * ordered list inside, and `aria-current="page"` on the item that is the current page. The separators are drawn
 * by the component, hidden from screen readers, and the last one is not shown.
 *
 * Every item is a `BreadcrumbItem` with a `BreadcrumbLink` inside. The current page is a link without `href`
 * (rendered as text) or with one, and `current` on it. The component renders plain `<a>` elements, so with a
 * client-side router pass `onClick` and navigate there, or render the router link inside the `BreadcrumbItem`
 * yourself and add `aria-current="page"` to it.
 */
export default {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: {
    docs: {
      importNames: ['Breadcrumb', 'BreadcrumbItem', 'BreadcrumbLink', 'BreadcrumbSeparator'],
      toc: {
        title: 'On this page',
        disable: false,
      },
    },
    layout: 'centered',
  },
  argTypes: {
    children: { control: false },
    className: { control: 'text' },
    style: { control: false },
    labels: { control: false },
    separator: { control: 'text' },
    colorScheme: { control: 'select', options: colorSchemes },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'radio', options: ['plain', 'filled', 'unstyled'] },
    id: { control: false },
    title: { control: 'text' },
    hidden: { control: false },
    'aria-label': { control: 'text' },
    'aria-labelledby': { control: false },
  },
  args: {
    children: <Trail />,
  },
} satisfies Meta<typeof Breadcrumb>

type Story = StoryObj<typeof Breadcrumb>

/**
 * This is the default Breadcrumb: underlined links with a slash between them, and the current page in bold.
 */
export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Breadcrumb>
  <BreadcrumbItem>
    <BreadcrumbLink href="/">Home</BreadcrumbLink>
  </BreadcrumbItem>
  <BreadcrumbItem>
    <BreadcrumbLink href="/components">Components</BreadcrumbLink>
  </BreadcrumbItem>
  <BreadcrumbItem>
    <BreadcrumbLink current>Breadcrumb</BreadcrumbLink>
  </BreadcrumbItem>
</Breadcrumb>`,
      },
    },
  },
}

/**
 * Use the **variant** prop to pick how the Breadcrumb looks. `unstyled` drops the Plume styles so you can style it
 * yourself.
 */
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-6">
  <Breadcrumb aria-label="Plain" variant="plain">
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbItem>
      <BreadcrumbLink href="/components">Components</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbItem>
      <BreadcrumbLink current>Breadcrumb</BreadcrumbLink>
    </BreadcrumbItem>
  </Breadcrumb>
  <Breadcrumb aria-label="Filled" variant="filled">
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbItem>
      <BreadcrumbLink href="/components">Components</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbItem>
      <BreadcrumbLink current>Breadcrumb</BreadcrumbLink>
    </BreadcrumbItem>
  </Breadcrumb>
  <Breadcrumb
    aria-label="Unstyled"
    className="text-sm"
    separator={<span className="mx-2 text-gray-400">/</span>}
    variant="unstyled"
  >
    <BreadcrumbItem>
      <BreadcrumbLink className="underline" href="/">
        Home
      </BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbItem>
      <BreadcrumbLink className="underline" href="/components">
        Components
      </BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbItem>
      <BreadcrumbLink className="font-bold" current>
        Breadcrumb
      </BreadcrumbLink>
    </BreadcrumbItem>
  </Breadcrumb>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <Breadcrumb aria-label="Plain" variant="plain">
        <Trail />
      </Breadcrumb>
      <Breadcrumb aria-label="Filled" variant="filled">
        <Trail />
      </Breadcrumb>
      <Breadcrumb
        aria-label="Unstyled"
        className="text-sm"
        separator={<span className="mx-2 text-gray-400">/</span>}
        variant="unstyled"
      >
        <BreadcrumbItem>
          <BreadcrumbLink className="underline" href="#home">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink className="underline" href="#components">
            Components
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink className="font-bold" current>
            Breadcrumb
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
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
  <Breadcrumb aria-label="Size sm" size="sm" variant="filled">
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbItem>
      <BreadcrumbLink href="/components">Components</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbItem>
      <BreadcrumbLink current>Breadcrumb</BreadcrumbLink>
    </BreadcrumbItem>
  </Breadcrumb>
  <Breadcrumb aria-label="Size md" size="md" variant="filled">
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbItem>
      <BreadcrumbLink href="/components">Components</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbItem>
      <BreadcrumbLink current>Breadcrumb</BreadcrumbLink>
    </BreadcrumbItem>
  </Breadcrumb>
  <Breadcrumb aria-label="Size lg" size="lg" variant="filled">
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbItem>
      <BreadcrumbLink href="/components">Components</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbItem>
      <BreadcrumbLink current>Breadcrumb</BreadcrumbLink>
    </BreadcrumbItem>
  </Breadcrumb>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Breadcrumb aria-label={`Size ${size}`} key={size} size={size} variant="filled">
          <Trail />
        </Breadcrumb>
      ))}
    </div>
  ),
}

/**
 * Use the **colorScheme** prop to pick a color from the theme. It colors the links, and the current page in the
 * `filled` variant. Here every scheme is shown in the default `plain` variant.
 */
export const Colors: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-4">
  <Breadcrumb aria-label="primary" colorScheme="primary">
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbItem>
      <BreadcrumbLink href="/components">Components</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbItem>
      <BreadcrumbLink current>Breadcrumb</BreadcrumbLink>
    </BreadcrumbItem>
  </Breadcrumb>
  <Breadcrumb aria-label="success" colorScheme="success">
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbItem>
      <BreadcrumbLink href="/components">Components</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbItem>
      <BreadcrumbLink current>Breadcrumb</BreadcrumbLink>
    </BreadcrumbItem>
  </Breadcrumb>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      {colorSchemes.map((scheme) => (
        <Breadcrumb
          aria-label={scheme}
          colorScheme={scheme as keyof typeof defaultTheme.colors}
          key={scheme}
        >
          <Trail />
        </Breadcrumb>
      ))}
    </div>
  ),
}

/**
 * Use the **separator** prop to change what goes between the items, for example an arrow or an icon. A single item
 * can have its own, and `separator={null}` removes it.
 */
export const Separators: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-6">
  <Breadcrumb aria-label="Arrow" separator="›">
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbItem>
      <BreadcrumbLink href="/components">Components</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbItem>
      <BreadcrumbLink current>Breadcrumb</BreadcrumbLink>
    </BreadcrumbItem>
  </Breadcrumb>
  <Breadcrumb aria-label="Long arrow" separator="→">
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbItem>
      <BreadcrumbLink href="/components">Components</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbItem>
      <BreadcrumbLink current>Breadcrumb</BreadcrumbLink>
    </BreadcrumbItem>
  </Breadcrumb>
  <Breadcrumb aria-label="Per item">
    <BreadcrumbItem separator="»">
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbItem separator={null}>
      <BreadcrumbLink href="/components">Components (no separator)</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbItem>
      <BreadcrumbLink current>Breadcrumb</BreadcrumbLink>
    </BreadcrumbItem>
  </Breadcrumb>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <Breadcrumb aria-label="Arrow" separator="›">
        <Trail />
      </Breadcrumb>
      <Breadcrumb aria-label="Long arrow" separator="→">
        <Trail />
      </Breadcrumb>
      <Breadcrumb aria-label="Per item">
        <BreadcrumbItem separator="»">
          <BreadcrumbLink href="#home">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem separator={null}>
          <BreadcrumbLink href="#components">Components (no separator)</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink current>Breadcrumb</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    </div>
  ),
}

/**
 * A long trail wraps onto the next line instead of overflowing, which keeps it usable on a phone.
 */
export const Long: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Breadcrumb style={{ maxWidth: '20rem' }}>
  <BreadcrumbItem>
    <BreadcrumbLink href="/home">Home</BreadcrumbLink>
  </BreadcrumbItem>
  <BreadcrumbItem>
    <BreadcrumbLink href="/library">Library</BreadcrumbLink>
  </BreadcrumbItem>
  <BreadcrumbItem>
    <BreadcrumbLink href="/components">Components</BreadcrumbLink>
  </BreadcrumbItem>
  <BreadcrumbItem>
    <BreadcrumbLink href="/navigation">Navigation</BreadcrumbLink>
  </BreadcrumbItem>
  <BreadcrumbItem>
    <BreadcrumbLink href="/breadcrumb">Breadcrumb</BreadcrumbLink>
  </BreadcrumbItem>
  <BreadcrumbItem>
    <BreadcrumbLink current>Examples</BreadcrumbLink>
  </BreadcrumbItem>
</Breadcrumb>`,
      },
    },
  },
  render: () => (
    <Breadcrumb style={{ maxWidth: '20rem' }}>
      {['Home', 'Library', 'Components', 'Navigation', 'Breadcrumb', 'Examples'].map(
        (name, index, all) => (
          <BreadcrumbItem key={name}>
            {index === all.length - 1 ? (
              <BreadcrumbLink current>{name}</BreadcrumbLink>
            ) : (
              <BreadcrumbLink href={`#${name}`}>{name}</BreadcrumbLink>
            )}
          </BreadcrumbItem>
        ),
      )}
    </Breadcrumb>
  ),
}

/**
 * Every element of the Breadcrumb is a part: **BreadcrumbList** (the `<ol>`), `BreadcrumbItem`, `BreadcrumbLink` and
 * **BreadcrumbSeparator**. Put a `BreadcrumbList` in the `Breadcrumb` to style the list, and give an item
 * `separator={null}` to place a `BreadcrumbSeparator` of your own, with its own `className`, wherever you want.
 */
export const Compound: Story = {
  render: () => (
    <Breadcrumb aria-label="Compound">
      <BreadcrumbList className="gap-y-1">
        <BreadcrumbItem separator={null}>
          <BreadcrumbLink href="#home">Home</BreadcrumbLink>
          <BreadcrumbSeparator className="font-bold">›</BreadcrumbSeparator>
        </BreadcrumbItem>
        <BreadcrumbItem separator={null}>
          <BreadcrumbLink href="#components">Components</BreadcrumbLink>
          <BreadcrumbSeparator className="font-bold">›</BreadcrumbSeparator>
        </BreadcrumbItem>
        <BreadcrumbItem separator={null}>
          <BreadcrumbLink current>Breadcrumb</BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
}

/**
 * Some examples of Breadcrumb with Tailwind classes. With `variant="unstyled"` the Plume classes are gone and the
 * structure stays (the list is a wrapping row and the last separator is hidden). Style the parts with their own
 * classes: `className` on the `BreadcrumbList` and on the separator you pass, and `data-[current]:` on the link for
 * the current page.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Breadcrumb
  className="text-sm text-foreground"
  separator={<span className="mx-2 opacity-50">/</span>}
  variant="unstyled"
>
  <BreadcrumbList className="gap-y-1">
    <BreadcrumbItem>
      <BreadcrumbLink className="text-primary-text hover:underline" href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbItem>
      <BreadcrumbLink className="text-primary-text hover:underline" href="/components">Components</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbItem>
      <BreadcrumbLink className="font-semibold text-foreground" current>Breadcrumb</BreadcrumbLink>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`,
      },
    },
  },
  render: () => (
    <Breadcrumb
      className="text-sm text-foreground"
      separator={<span className="mx-2 opacity-50">/</span>}
      variant="unstyled"
    >
      <BreadcrumbList className="gap-y-1">
        <BreadcrumbItem>
          <BreadcrumbLink className="text-primary-text hover:underline" href="#home">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink className="text-primary-text hover:underline" href="#components">
            Components
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink className="font-semibold text-foreground" current>
            Breadcrumb
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
}

/**
 * Some examples of Breadcrumb with Bootstrap classes: `breadcrumb` on the list, `breadcrumb-item` on the items and
 * `active` on the current one. Bootstrap draws the separator with a `::before` of each item, so the separators of
 * the component are turned off with `separator={null}` on the items.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Breadcrumb variant="unstyled">
  <BreadcrumbList className="breadcrumb mb-0">
    <BreadcrumbItem className="breadcrumb-item" separator={null}>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbItem className="breadcrumb-item" separator={null}>
      <BreadcrumbLink href="/components">Components</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbItem className="breadcrumb-item active" separator={null}>
      <BreadcrumbLink current>Breadcrumb</BreadcrumbLink>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`,
      },
    },
  },
  render: () => (
    <Breadcrumb variant="unstyled">
      <BreadcrumbList className="breadcrumb mb-0">
        <BreadcrumbItem className="breadcrumb-item" separator={null}>
          <BreadcrumbLink href="#home">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem className="breadcrumb-item" separator={null}>
          <BreadcrumbLink href="#components">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem className="breadcrumb-item active" separator={null}>
          <BreadcrumbLink current>Breadcrumb</BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
}
