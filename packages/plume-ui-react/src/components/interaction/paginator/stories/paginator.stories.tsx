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
  PaginatorPageSize,
  PaginatorPrevious,
  PaginatorSummary,
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
 * Pass the **total** of items and the **pageSize**; the Paginator works the number of pages out. When there are
 * many pages only some are shown, and the rest are folded behind an ellipsis: the
 * **siblingCount** pages around the current one and the **boundaryCount** pages at each end. The list always has
 * the same number of items, so the buttons don't move while the user pages. It renders nothing without a **total**.
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
    className: { control: 'text' },
    children: { control: false },
    style: { control: false },
    total: { control: 'number' },
    pageSize: { control: 'number' },
    defaultPageSize: { control: 'number' },
    onPageSizeChange: { control: false },
    page: { control: false },
    defaultPage: { control: 'number' },
    onPageChange: { control: false },
    siblingCount: { control: 'number' },
    boundaryCount: { control: 'number' },
    showEdges: { control: 'boolean' },
    disabled: { control: 'boolean' },
    colorScheme: { control: 'select', options: colorSchemes },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    shape: { control: 'radio', options: ['rounded', 'pill'] },
    variant: { control: 'radio', options: ['solid', 'outline', 'ghost', 'unstyled'] },
    id: { control: false },
    title: { control: 'text' },
    hidden: { control: false },
    'aria-label': { control: 'text' },
    'aria-labelledby': { control: false },
    labels: { control: false },
  },
  args: {
    total: 100,
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
          total={100}
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
        total={100}
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
        <Paginator aria-label={`Size ${size}`} total={100} defaultPage={4} key={size} size={size} />
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
          total={50}
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
        <Paginator aria-label={shape} total={60} defaultPage={3} key={shape} shape={shape} />
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
      <Paginator aria-label="Default" total={500} defaultPage={25} />
      <Paginator aria-label="Two siblings" total={500} defaultPage={25} siblingCount={2} />
      <Paginator
        aria-label="Two siblings and boundaries"
        boundaryCount={2}
        total={500}
        defaultPage={25}
      />
    </div>
  ),
}

/**
 * The number of pages comes from the **total** of items and the **pageSize**. Here there are 237 items in pages of
 * 25, so ten pages.
 */
export const WithTotal: Story = {
  args: { pageSize: 25, total: 237 },
}

function CompactExample(props: Readonly<PaginatorProps>): React.ReactNode {
  const [pageSize, setPageSize] = useState(10)
  return (
    <div style={{ inlineSize: 'min(32rem, 100%)' }}>
      <Paginator
        {...props}
        aria-label="Results"
        onPageSizeChange={setPageSize}
        pageSize={pageSize}
        total={237}
      >
        <PaginatorPageSize options={[10, 25, 50]} />
        <PaginatorSummary />
        <PaginatorList>
          <PaginatorItem>
            <PaginatorPrevious />
          </PaginatorItem>
          <PaginatorItem>
            <PaginatorNext />
          </PaginatorItem>
        </PaginatorList>
      </Paginator>
    </div>
  )
}

/**
 * Show the numbered pages, or a compact range with just the previous and next buttons, like a table footer — one or
 * the other, not both. This is the compact form: `PaginatorPageSize` chooses how many items a page has,
 * `PaginatorSummary` shows the range of the current page ("21–30 of 237") instead of the numbers, and a
 * `PaginatorList` with only `PaginatorPrevious` and `PaginatorNext` moves between pages. `total` feeds the summary;
 * when the size changes the page changes too, so the first item of the old page stays in view. Their texts are
 * `labels.pageSize` and `labels.summary`. The parts sit in source order, so reorder them or push one aside with a
 * `marginInlineStart: 'auto'` style to lay the toolbar out your way.
 */
export const Compact: Story = {
  parameters: {
    docs: {
      story: { inline: false, iframeHeight: 300 },
      source: {
        code: `function ResultsFooter() {
  const [pageSize, setPageSize] = useState(10)
  return (
    <Paginator
      aria-label="Results"
      onPageSizeChange={setPageSize}
      pageSize={pageSize}
      total={237}
    >
      <PaginatorPageSize options={[10, 25, 50]} />
      <PaginatorSummary />
      <PaginatorList>
        <PaginatorItem>
          <PaginatorPrevious />
        </PaginatorItem>
        <PaginatorItem>
          <PaginatorNext />
        </PaginatorItem>
      </PaginatorList>
    </Paginator>
  )
}`,
      },
    },
  },
  render: (args) => <CompactExample {...args} />,
}

function PageSizeExample(props: Readonly<PaginatorProps>): React.ReactNode {
  const [pageSize, setPageSize] = useState(10)
  return (
    <div style={{ inlineSize: 'min(40rem, 100%)' }}>
      <Paginator
        {...props}
        aria-label="Products"
        onPageSizeChange={setPageSize}
        pageSize={pageSize}
        total={237}
      >
        <PaginatorList />
        <PaginatorPageSize options={[10, 25, 50]} style={{ marginInlineStart: 'auto' }} />
      </Paginator>
    </div>
  )
}

/**
 * `PaginatorPageSize` is not tied to the compact form: drop it next to the numbered pages to let the user change how
 * many items a page has. It is a `Select`; pass **pageSize** and **onPageSizeChange** to control it, or
 * **defaultPageSize** to leave it to the Paginator. Changing the size keeps the first item of the old page in view.
 * Here it is pushed to the trailing edge with a `marginInlineStart: 'auto'` style.
 */
export const WithPageSize: Story = {
  parameters: {
    docs: {
      story: { inline: false, iframeHeight: 300 },
      source: {
        code: `function Products() {
  const [pageSize, setPageSize] = useState(10)
  return (
    <Paginator
      aria-label="Products"
      onPageSizeChange={setPageSize}
      pageSize={pageSize}
      total={237}
    >
      <PaginatorList />
      <PaginatorPageSize options={[10, 25, 50]} style={{ marginInlineStart: 'auto' }} />
    </Paginator>
  )
}`,
      },
    },
  },
  render: (args) => <PageSizeExample {...args} />,
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
      <Paginator total={120} onPageChange={setPage} page={page} />
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
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [page, setPage] = useState(3)
  return (
    <div className="flex flex-col gap-3">
      <Paginator onPageChange={setPage} page={page} total={120} />
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
}`,
      },
    },
  },
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
 * Compose the parts to build the list yourself. Here the page is written out with its edges, the pages show a `#`
 * and the entries that fold pages are a plain dot.
 */
export const Compound: Story = {
  render: () => (
    <Paginator aria-label="Compound" total={200} defaultPage={10}>
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
 * Some examples of Paginator with Tailwind classes. With `variant="unstyled"` the Plume classes are gone and the
 * structure stays: the list, the buttons and `aria-current`. Compose the parts to give each one its classes, and
 * use `data-[current]:` on the current page and `disabled:` on the ones that can't be used.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Paginator total={100} variant="unstyled">
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
      total={100}
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
<Paginator className="bs-pagination" total={100} variant="unstyled">
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
        total={100}
        defaultPage={4}
        variant="unstyled"
      />
    </>
  ),
}
