import type { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { defaultTheme } from '../../../../theme'
import { Paginator } from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

const stack = (gap: string): React.CSSProperties => ({
  alignItems: 'flex-start',
  display: 'flex',
  flexDirection: 'column',
  gap,
  maxWidth: '100%',
})

/**
 * Buttons to move between the pages of a list or a table. Use it when a result set is too long to show at once.
 *
 * It is a `<nav>` named "Pagination" (give it your own **aria-label** when there is more than one on the page)
 * with a list of buttons: the pages, the previous and the next one, and with **showEdges** the first and the last.
 * The current page has `aria-current="page"` and its name says so ("Page 3, current page"). A button that can't be
 * used (the previous one on the first page) is disabled. Every control is a real `button`, so the keyboard works as
 * usual: <kbd>Tab</kbd> to move and <kbd>Enter</kbd> or <kbd>Space</kbd> to press. The buttons are `Button`
 * components, so they share its sizes, shapes and colors.
 *
 * Pass the number of pages in **count**, or the **total** of items and the **pageSize** and it works the number of
 * pages out. When there are many pages only some are shown, and the rest are folded behind an ellipsis: the
 * **siblingCount** pages around the current one and the **boundaryCount** pages at each end. The list always has
 * the same number of items, so the buttons don't move while the user pages. It renders nothing when there are no
 * pages.
 *
 * It keeps the page itself, or follows **page** when you control it. It doesn't load anything: use
 * **onPageChange** to fetch the page, for example from a `Table`.
 */
export default {
  title: 'Components/Paginator',
  component: Paginator,
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
    className: {
      control: 'text',
      description: 'Custom CSS class for the Paginator.',
      table: { type: { summary: 'string' } },
    },
    classNames: {
      control: false,
      description:
        'Custom CSS classes for the parts: `list`, `item` (every `<li>`), `page`, `previous`, `next`, `first`, `last` and `ellipsis`.',
      table: { type: { summary: 'Partial<Record<PaginatorPart, string>>' } },
    },
    style: {
      control: false,
      description: 'Inline styles for the Paginator.',
      table: { type: { summary: 'CSSProperties' } },
    },
    count: {
      control: 'number',
      description:
        'The number of pages. Without it, the pages are worked out from **total** and **pageSize**. With no pages the Paginator renders nothing.',
      table: { type: { summary: 'number' } },
    },
    total: {
      control: 'number',
      description: 'The number of items in all the pages. It is used when there is no **count**.',
      table: { type: { summary: 'number' } },
    },
    pageSize: {
      control: 'number',
      description: 'The number of items in a page, to work the pages out of **total**.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '10' } },
    },
    page: {
      control: false,
      description:
        'The current page, starting at 1. Makes the Paginator controlled: pass `onPageChange` to update it. It is kept between 1 and the last page.',
      table: { type: { summary: 'number' } },
    },
    defaultPage: {
      control: 'number',
      description: 'The page that is current first, when the Paginator is not controlled.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '1' } },
    },
    onPageChange: {
      control: false,
      description: 'Called with the new page when the user picks another one.',
      table: { category: 'Events', type: { summary: '(page: number) => void' } },
    },
    siblingCount: {
      control: 'number',
      description: 'How many pages are shown on each side of the current one.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '1' } },
    },
    boundaryCount: {
      control: 'number',
      description: 'How many pages are always shown at the start and at the end.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '1' } },
    },
    showEdges: {
      control: 'boolean',
      description: 'Adds the buttons that go to the first and to the last page.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables every button.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    colorScheme: {
      control: 'select',
      description:
        'Color scheme from the theme palette, including custom schemes added to it. It colors the current page; the other buttons are neutral.',
      options: colorSchemes,
      table: { type: { summary: 'ColorScheme' }, defaultValue: { summary: 'primary' } },
    },
    size: {
      control: 'radio',
      description: 'Size of the buttons.',
      options: ['sm', 'md', 'lg'],
      table: { type: { summary: `"sm" | "md" | "lg"` }, defaultValue: { summary: 'md' } },
    },
    shape: {
      control: 'radio',
      description: 'Corners of the buttons.',
      options: ['rounded', 'pill'],
      table: { type: { summary: `"rounded" | "pill"` }, defaultValue: { summary: 'rounded' } },
    },
    variant: {
      control: 'radio',
      description:
        'Visual variant. `solid` fills the current page and leaves the others flat, `outline` draws a border on every button and tints the current one, and `ghost` has no border or fill: the current page is only tinted. `unstyled` drops the Plume styles so you can bring your own; the layout keeps working.',
      options: ['solid', 'outline', 'ghost', 'unstyled'],
      table: {
        type: { summary: `"solid" | "outline" | "ghost" | "unstyled"` },
        defaultValue: { summary: 'solid' },
      },
    },
    id: {
      control: false,
      description: 'Id of the nav.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    title: {
      control: 'text',
      description: 'Native tooltip of the nav.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    hidden: {
      control: false,
      description: 'Hides the Paginator.',
      table: { category: 'HTML attributes', type: { summary: 'boolean' } },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible name of the nav. Give a different one to each Paginator on a page.',
      table: {
        category: 'Accessibility',
        type: { summary: 'string' },
        defaultValue: { summary: '"Pagination"' },
      },
    },
    'aria-labelledby': {
      control: false,
      description: 'Id of the element that names the nav.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    labels: {
      control: false,
      description:
        'The texts the Paginator adds, to translate them: `previous`, `next`, `first` and `last` name the buttons of the edges, `page(page, current)` names a page button and `pagination` names the navigation when there is no `aria-label` or `aria-labelledby`. Pass only the ones you want to change.',
      table: {
        category: 'Accessibility',
        type: { summary: 'Partial<PaginatorLabels>' },
        defaultValue: {
          summary:
            '{ first: "First page", last: "Last page", next: "Next page", page: "Page 3" / "Page 3, current page", pagination: "Pagination", previous: "Previous page" }',
        },
      },
    },
  },
  args: {
    count: 10,
  },
} satisfies Meta<typeof Paginator>

type Story = StoryObj<typeof Paginator>

/**
 * This is the default Paginator.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick how the buttons look. `unstyled` drops the Plume styles so you can style it
 * yourself.
 */
export const Variants: Story = {
  render: () => (
    <div style={stack('1.5rem')}>
      {(['solid', 'outline', 'ghost'] as const).map((variant) => (
        <Paginator
          aria-label={variant}
          count={10}
          defaultPage={4}
          key={variant}
          variant={variant}
        />
      ))}
      <Paginator
        aria-label="unstyled"
        classNames={{
          list: 'flex gap-2',
          page: 'rounded border border-gray-400 px-3 py-1 data-[current]:bg-gray-900 data-[current]:text-white',
        }}
        count={10}
        defaultPage={4}
        variant="unstyled"
      />
    </div>
  ),
}

/**
 * Use the **size** prop to change the size of the buttons.
 */
export const Sizes: Story = {
  render: () => (
    <div style={stack('1.5rem')}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Paginator aria-label={`Size ${size}`} count={10} defaultPage={4} key={size} size={size} />
      ))}
    </div>
  ),
}

/**
 * Use the **colorScheme** prop to pick a color from the theme. It colors the current page.
 */
export const Colors: Story = {
  render: () => (
    <div style={stack('1rem')}>
      {colorSchemes.map((scheme) => (
        <Paginator
          aria-label={scheme}
          colorScheme={scheme as keyof typeof defaultTheme.colors}
          count={5}
          defaultPage={2}
          key={scheme}
          size="sm"
        />
      ))}
    </div>
  ),
}

/**
 * Use the **shape** prop to round the corners of the buttons all the way.
 */
export const Shapes: Story = {
  render: () => (
    <div style={stack('1.5rem')}>
      {(['rounded', 'pill'] as const).map((shape) => (
        <Paginator aria-label={shape} count={6} defaultPage={3} key={shape} shape={shape} />
      ))}
    </div>
  ),
}

/**
 * With many pages only some are shown: the **siblingCount** pages around the current one and the
 * **boundaryCount** pages at each end, and the rest is folded behind an ellipsis. The number of items doesn't change
 * from page to page, so the buttons stay where they are.
 */
export const ManyPages: Story = {
  render: () => (
    <div style={stack('1.5rem')}>
      <Paginator aria-label="Default" count={50} defaultPage={25} />
      <Paginator aria-label="Two siblings" count={50} defaultPage={25} siblingCount={2} />
      <Paginator
        aria-label="Two siblings and boundaries"
        boundaryCount={2}
        count={50}
        defaultPage={25}
      />
    </div>
  ),
}

/**
 * Pass the **total** of items and the **pageSize** instead of the number of pages. Here there are 237 items in
 * pages of 25.
 */
export const WithTotal: Story = {
  args: { count: undefined, pageSize: 25, total: 237 },
}

/**
 * **showEdges** adds the buttons that go to the first and to the last page.
 */
export const ShowEdges: Story = {
  args: { defaultPage: 5, showEdges: true },
}

function ControlledPaginator(): React.ReactNode {
  const [page, setPage] = useState(3)
  return (
    <div style={stack('0.75rem')}>
      <Paginator count={12} onPageChange={setPage} page={page} />
      <p className="text-sm">
        Showing items {(page - 1) * 10 + 1} to {page * 10}
      </p>
      <button
        className="rounded border border-gray-400 px-2 py-1 text-sm"
        onClick={() => setPage(1)}
        type="button"
      >
        Back to the first page
      </button>
    </div>
  )
}

/**
 * Pass **page** and **onPageChange** to control the current page, for example to load the items or to reset it
 * from outside.
 */
export const Controlled: Story = {
  render: () => <ControlledPaginator />,
}

/**
 * Use **labels** to translate what a screen reader says. The numbers stay as they are.
 */
export const Translated: Story = {
  args: {
    'aria-label': 'Paginación',
    defaultPage: 4,
    labels: {
      first: 'Primera página',
      last: 'Última página',
      next: 'Página siguiente',
      page: (page: number, current: boolean) =>
        current ? `Página ${page}, página actual` : `Página ${page}`,
      previous: 'Página anterior',
    },
    showEdges: true,
  },
}

/**
 * A disabled Paginator can't be used. The current page keeps showing.
 */
export const Disabled: Story = {
  args: { defaultPage: 3, disabled: true },
}

/**
 * Some examples of Paginator with Tailwind classes. With `variant="unstyled"` the Plume classes are gone and the
 * structure stays: the list, the buttons and `aria-current`. Style the parts with `classNames`, and use
 * `data-[current]:` on the current page and `disabled:` on the ones that can't be used.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Paginator
  classNames={{
    list: "gap-1",
    page: "size-9 rounded-md text-sm text-foreground hover:bg-surface-muted data-[current]:bg-primary-solid data-[current]:text-primary-on-solid",
    previous: "size-9 rounded-md text-foreground hover:bg-surface-muted disabled:opacity-40",
    next: "size-9 rounded-md text-foreground hover:bg-surface-muted disabled:opacity-40",
    ellipsis: "grid size-9 place-items-center text-muted",
  }}
  count={10}
  variant="unstyled"
/>`,
      },
    },
  },
  render: () => (
    <Paginator
      classNames={{
        ellipsis: 'grid size-9 place-items-center text-muted',
        list: 'gap-1',
        next: 'grid size-9 place-items-center rounded-md text-foreground hover:bg-surface-muted disabled:opacity-40',
        page: 'grid size-9 place-items-center rounded-md text-sm text-foreground hover:bg-surface-muted data-[current]:bg-primary-solid data-[current]:text-primary-on-solid',
        previous:
          'grid size-9 place-items-center rounded-md text-foreground hover:bg-surface-muted disabled:opacity-40',
      }}
      count={10}
      defaultPage={4}
      variant="unstyled"
    />
  ),
}

/**
 * Some examples of Paginator with Bootstrap classes: `pagination`, `page-item` and `page-link`. Bootstrap marks the
 * current page with an `active` class on the item, so the story adds the rules that read `aria-current` and
 * `disabled` instead, scoped to its own class.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<style>{'.bs-pagination [aria-current="page"]{background-color:var(--bs-primary);border-color:var(--bs-primary);color:#fff}.bs-pagination .page-link:disabled{color:var(--bs-secondary-color);pointer-events:none}'}</style>
<Paginator
  className="bs-pagination"
  classNames={{
    list: "pagination mb-0",
    item: "page-item",
    page: "page-link",
    previous: "page-link",
    next: "page-link",
    ellipsis: "page-link disabled",
  }}
  count={10}
  variant="unstyled"
/>`,
      },
    },
  },
  render: () => (
    <>
      <style>
        {
          '.bs-pagination [aria-current="page"]{background-color:var(--bs-primary);border-color:var(--bs-primary);color:#fff}.bs-pagination .page-link:disabled{color:var(--bs-secondary-color);pointer-events:none}'
        }
      </style>
      <Paginator
        className="bs-pagination"
        classNames={{
          ellipsis: 'page-link disabled',
          item: 'page-item',
          list: 'pagination mb-0',
          next: 'page-link',
          page: 'page-link',
          previous: 'page-link',
        }}
        count={10}
        defaultPage={4}
        variant="unstyled"
      />
    </>
  ),
}
