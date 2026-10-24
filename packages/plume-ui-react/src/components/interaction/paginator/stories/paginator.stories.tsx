import type { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { defaultTheme } from '../../../../theme'
import {
  Paginator,
  PaginatorEllipsis,
  PaginatorFirst,
  PaginatorItem,
  PaginatorLast,
  PaginatorList,
  PaginatorNext,
  PaginatorPage,
  PaginatorPages,
  PaginatorPrevious,
} from '..'
import type { PaginatorProps } from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

const stack = (gap: string): React.CSSProperties => ({
  alignItems: 'flex-start',
  display: 'flex',
  flexDirection: 'column',
  gap,
  maxWidth: '100%',
})

interface PartClasses {
  ellipsis?: string
  item?: string
  list?: string
  next?: string
  page?: string
  previous?: string
}

function Styled({
  classes,
  ...props
}: Readonly<PaginatorProps & { classes: PartClasses }>): React.ReactNode {
  return (
    <Paginator {...props}>
      <PaginatorList className={classes.list}>
        <PaginatorItem className={classes.item}>
          <PaginatorPrevious className={classes.previous} />
        </PaginatorItem>
        <PaginatorPages>
          {(entry) => (
            <PaginatorItem className={classes.item}>
              {typeof entry === 'number' ? (
                <PaginatorPage className={classes.page} page={entry} />
              ) : (
                <PaginatorEllipsis className={classes.ellipsis} />
              )}
            </PaginatorItem>
          )}
        </PaginatorPages>
        <PaginatorItem className={classes.item}>
          <PaginatorNext className={classes.next} />
        </PaginatorItem>
      </PaginatorList>
    </Paginator>
  )
}

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
 *
 * Every element of the Paginator is a part you can import. Given no children, the `Paginator` builds the usual
 * list from its props (**showEdges** adds the first and the last button). Give it children and it renders them as
 * written, so you can reorder, omit or replace each part and give each one its own `className`. The pages are
 * data-driven, so `PaginatorPages` takes a function that gets each entry (a page number, or `start-ellipsis` and
 * `end-ellipsis`) and returns what to render for it. In that case **showEdges** has no effect: compose
 * `PaginatorFirst` and `PaginatorLast` instead.
 *
 * ### Subcomponents
 *
 * | Component | Props |
 * | --- | --- |
 * | `PaginatorList` | `id`, `className`, `style`, `ref`, `children`. The `<ul>`. Without children it builds the default: the edges, the previous button, the pages and the next button, each in a `PaginatorItem`. |
 * | `PaginatorItem` | `id`, `className`, `style`, `ref`, `children`. A `<li>`. Every control goes in one. |
 * | `PaginatorPages` | `children`. Renders the entries of the current range, with no element of its own. Children is a function that gets the entry and its position, and returns what to render (usually a `PaginatorItem`). Without it, each entry is a page button or an ellipsis. |
 * | `PaginatorPage` | `page` (required), `aria-label`, `disabled`, `onClick`, `id`, `title`, `className`, `style`, `ref`, `children`. The button of a page. It has `aria-current="page"` and `data-current` when it is the current one, its name comes from **labels.page** and its text is the number unless you pass children. |
 * | `PaginatorEllipsis` | `id`, `className`, `style`, `ref`, `children`. The `…` that stands for the folded pages, `aria-hidden`. |
 * | `PaginatorPrevious`, `PaginatorNext` | `aria-label`, `disabled`, `onClick`, `id`, `title`, `className`, `style`, `ref`, `children`. They go to the previous and the next page, are disabled at the ends and take their name from **labels.previous** and **labels.next**. Children replace the icon. |
 * | `PaginatorFirst`, `PaginatorLast` | The same props. They go to the first and the last page, and take their name from **labels.first** and **labels.last**. |
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
    children: {
      control: false,
      description:
        'The parts of the Paginator, usually a `PaginatorList`. Without it the Paginator builds the default list.',
      table: { type: { summary: 'ReactNode' } },
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
      <Styled
        aria-label="unstyled"
        classes={{
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
 * Compose the parts to build the list yourself. Here the page is written out with its edges, the pages show a `#`
 * and the entries that fold pages are a plain dot.
 */
export const Compound: Story = {
  render: () => (
    <Paginator aria-label="Compound" count={20} defaultPage={10}>
      <PaginatorList>
        <PaginatorItem>
          <PaginatorFirst />
        </PaginatorItem>
        <PaginatorItem>
          <PaginatorPrevious />
        </PaginatorItem>
        <PaginatorPages>
          {(entry) => (
            <PaginatorItem>
              {typeof entry === 'number' ? (
                <PaginatorPage page={entry}>#{entry}</PaginatorPage>
              ) : (
                <PaginatorEllipsis>·</PaginatorEllipsis>
              )}
            </PaginatorItem>
          )}
        </PaginatorPages>
        <PaginatorItem>
          <PaginatorNext />
        </PaginatorItem>
        <PaginatorItem>
          <PaginatorLast />
        </PaginatorItem>
      </PaginatorList>
    </Paginator>
  ),
}

/**
 * A disabled Paginator can't be used. The current page keeps showing.
 */
export const Disabled: Story = {
  args: { defaultPage: 3, disabled: true },
}

/**
 * Some examples of Paginator with Tailwind classes. With `variant="unstyled"` the Plume classes are gone and the
 * structure stays: the list, the buttons and `aria-current`. Compose the parts to give each one its classes, and
 * use `data-[current]:` on the current page and `disabled:` on the ones that can't be used.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Paginator count={10} variant="unstyled">
  <PaginatorList className="gap-1">
    <PaginatorItem>
      <PaginatorPrevious className="grid size-9 place-items-center rounded-md text-foreground hover:bg-surface-muted disabled:opacity-40" />
    </PaginatorItem>
    <PaginatorPages>
      {(entry) => (
        <PaginatorItem>
          {typeof entry === 'number' ? (
            <PaginatorPage
              className="grid size-9 place-items-center rounded-md text-sm text-foreground hover:bg-surface-muted data-[current]:bg-primary-solid data-[current]:text-primary-on-solid"
              page={entry}
            />
          ) : (
            <PaginatorEllipsis className="grid size-9 place-items-center text-muted" />
          )}
        </PaginatorItem>
      )}
    </PaginatorPages>
    <PaginatorItem>
      <PaginatorNext className="grid size-9 place-items-center rounded-md text-foreground hover:bg-surface-muted disabled:opacity-40" />
    </PaginatorItem>
  </PaginatorList>
</Paginator>`,
      },
    },
  },
  render: () => (
    <Styled
      classes={{
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
<Paginator className="bs-pagination" count={10} variant="unstyled">
  <PaginatorList className="pagination mb-0">
    <PaginatorItem className="page-item">
      <PaginatorPrevious className="page-link" />
    </PaginatorItem>
    <PaginatorPages>
      {(entry) => (
        <PaginatorItem className="page-item">
          {typeof entry === 'number' ? (
            <PaginatorPage className="page-link" page={entry} />
          ) : (
            <PaginatorEllipsis className="page-link disabled" />
          )}
        </PaginatorItem>
      )}
    </PaginatorPages>
    <PaginatorItem className="page-item">
      <PaginatorNext className="page-link" />
    </PaginatorItem>
  </PaginatorList>
</Paginator>`,
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
      <Styled
        className="bs-pagination"
        classes={{
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
