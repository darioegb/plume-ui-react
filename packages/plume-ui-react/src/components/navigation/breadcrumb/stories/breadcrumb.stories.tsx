import type { StoryObj, Meta } from '@storybook/react-vite'
import { defaultTheme } from '../../../../theme'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '..'

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
 * It follows the WAI-ARIA breadcrumb pattern: a `<nav>` named "Breadcrumb" (change it with `aria-label`) with an
 * ordered list inside, and `aria-current="page"` on the item that is the current page. The separators are drawn
 * by the component, hidden from screen readers, and the last one is not shown.
 *
 * Every item is a `BreadcrumbItem` with a `BreadcrumbLink` inside. The current page is a link without `href`
 * (rendered as text) or with one, and `current` on it. The component renders plain `<a>` elements, so with a
 * client-side router pass `onClick` and navigate there, or render the router link inside the `BreadcrumbItem`
 * yourself and add `aria-current="page"` to it.
 *
 * ### Subcomponents
 *
 * | Component | Props |
 * | --- | --- |
 * | `BreadcrumbItem` | `separator`, `id`, `title`, `hidden`, `className`, `style`, `children`. One `<li>`, with the separator after it. `separator` replaces the separator of the breadcrumb for this item, and `null` removes it. |
 * | `BreadcrumbLink` | `current`, `href`, `target`, `rel`, `hrefLang`, `referrerPolicy`, `onClick`, `id`, `title`, `hidden`, `className`, `style`, `children`. A link, or a `<span>` when it has no `href`. `current` marks the current page with `aria-current="page"` and `data-current`. |
 * | `BreadcrumbSeparator` | `className`, `style`, `children`. The separator. `BreadcrumbItem` renders it for you, so use it only to put one in another place. |
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
    children: {
      control: false,
      description: 'The `BreadcrumbItem` parts of the Breadcrumb.',
      table: { type: { summary: 'ReactNode' } },
    },
    className: {
      control: 'text',
      description: 'Custom CSS class for the `<nav>`.',
      table: { type: { summary: 'string' } },
    },
    style: {
      control: false,
      description:
        'Inline styles for the `<nav>`. They are applied after the color variables, so they can override them (e.g. `--breadcrumb-text`).',
      table: { type: { summary: 'CSSProperties' } },
    },
    classNames: {
      control: false,
      description:
        'Custom CSS classes for the parts, in every variant: `list` (the `<ol>`), `separator` (every separator). With `variant="unstyled"` they are the only classes the parts have.',
      table: { type: { summary: 'Partial<Record<BreadcrumbPart, string>>' } },
    },
    separator: {
      control: 'text',
      description:
        'What goes between the items. It can be any node, like an icon. An item can use its own.',
      table: { type: { summary: 'ReactNode' }, defaultValue: { summary: '"/"' } },
    },
    colorScheme: {
      control: 'select',
      description:
        'Color scheme from the theme palette, including custom schemes added to it. It colors the links and the current page in the `filled` variant.',
      options: colorSchemes,
      table: { type: { summary: 'ColorScheme' }, defaultValue: { summary: 'primary' } },
    },
    size: {
      control: 'radio',
      description: 'Size of the Breadcrumb.',
      options: ['sm', 'md', 'lg'],
      table: { type: { summary: `"sm" | "md" | "lg"` }, defaultValue: { summary: 'md' } },
    },
    variant: {
      control: 'radio',
      description:
        'Visual variant. `plain` is text with underlined links, `filled` puts every item on a muted background. `unstyled` drops the Plume styles so you can bring your own; the list and the hidden last separator keep working.',
      options: ['plain', 'filled', 'unstyled'],
      table: {
        type: { summary: `"plain" | "filled" | "unstyled"` },
        defaultValue: { summary: 'plain' },
      },
    },
    id: {
      control: false,
      description: 'Id of the `<nav>`.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    title: {
      control: 'text',
      description: 'Native tooltip of the `<nav>`.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    hidden: {
      control: false,
      description: 'Hides the Breadcrumb.',
      table: { category: 'HTML attributes', type: { summary: 'boolean' } },
    },
    'aria-label': {
      control: 'text',
      description:
        'Accessible name of the navigation. Use it to translate it, or to tell two breadcrumbs of a page apart.',
      table: {
        category: 'Accessibility',
        type: { summary: 'string' },
        defaultValue: { summary: '"Breadcrumb"' },
      },
    },
    'aria-labelledby': {
      control: false,
      description:
        'Id of the element that names the navigation. It replaces the default `aria-label`.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
  },
  args: {
    children: <Trail />,
  },
} satisfies Meta<typeof Breadcrumb>

type Story = StoryObj<typeof Breadcrumb>

/**
 * This is the default Breadcrumb: underlined links with a slash between them, and the current page in bold.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick how the Breadcrumb looks. `unstyled` drops the Plume styles so you can style it
 * yourself.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Breadcrumb aria-label="Plain" variant="plain">
        <Trail />
      </Breadcrumb>
      <Breadcrumb aria-label="Filled" variant="filled">
        <Trail />
      </Breadcrumb>
      <Breadcrumb classNames={{ separator: 'mx-2 text-gray-400' }}
        aria-label="Unstyled"
        className="text-sm"
       
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
 * Some examples of Breadcrumb with Tailwind classes. With `variant="unstyled"` the Plume classes are gone and the
 * structure stays (the list is a wrapping row and the last separator is hidden). Style the parts with their own
 * classes: `classNames.separator` for the separators and `data-[current]:` on the link for the current page.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Breadcrumb classNames={{ list: 'gap-y-1', separator: 'mx-2 opacity-50' }}
  className="text-sm text-foreground"
 
  separator="/"
 
  variant="unstyled"
>
  <BreadcrumbItem>
    <BreadcrumbLink className="text-primary-text hover:underline" href="/">Home</BreadcrumbLink>
  </BreadcrumbItem>
  <BreadcrumbItem>
    <BreadcrumbLink className="text-primary-text hover:underline" href="/components">Components</BreadcrumbLink>
  </BreadcrumbItem>
  <BreadcrumbItem>
    <BreadcrumbLink className="font-semibold text-foreground" current>Breadcrumb</BreadcrumbLink>
  </BreadcrumbItem>
</Breadcrumb>`,
      },
    },
  },
  render: () => (
    <Breadcrumb classNames={{ list: 'gap-y-1', separator: 'mx-2 opacity-50' }}
      className="text-sm text-foreground"
     
      separator="/"
     
      variant="unstyled"
    >
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
        code: `<Breadcrumb classNames={{ list: 'breadcrumb mb-0' }} variant="unstyled">
  <BreadcrumbItem className="breadcrumb-item" separator={null}>
    <BreadcrumbLink href="/">Home</BreadcrumbLink>
  </BreadcrumbItem>
  <BreadcrumbItem className="breadcrumb-item" separator={null}>
    <BreadcrumbLink href="/components">Components</BreadcrumbLink>
  </BreadcrumbItem>
  <BreadcrumbItem className="breadcrumb-item active" separator={null}>
    <BreadcrumbLink current>Breadcrumb</BreadcrumbLink>
  </BreadcrumbItem>
</Breadcrumb>`,
      },
    },
  },
  render: () => (
    <Breadcrumb classNames={{ list: 'breadcrumb mb-0' }} variant="unstyled">
      <BreadcrumbItem className="breadcrumb-item" separator={null}>
        <BreadcrumbLink href="#home">Home</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem className="breadcrumb-item" separator={null}>
        <BreadcrumbLink href="#components">Components</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem className="breadcrumb-item active" separator={null}>
        <BreadcrumbLink current>Breadcrumb</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  ),
}
