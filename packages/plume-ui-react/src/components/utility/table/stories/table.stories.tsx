import type { StoryObj, Meta } from '@storybook/react-vite'
import { useEffect, useState } from 'react'
import { Button } from '../../../interaction/button'
import { Paginator } from '../../../interaction/paginator'
import { Checkbox } from '../../../form/checkbox'
import { Field } from '../../../form/field'
import { Input } from '../../../form/input'
import { Select, SelectContent, SelectOption, SelectTrigger } from '../../../form/select'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableElement,
  TableEmpty,
  TableEmptyCell,
  TableFooter,
  TableHead,
  TableHeadSort,
  TableHeadSortIcon,
  TableHeader,
  TableLoading,
  TableRow,
  type TableParams,
  useTableState,
} from '..'

const people = [
  { age: 36, name: 'Ada Lovelace', role: 'Mathematician' },
  { age: 45, name: 'Grace Hopper', role: 'Rear admiral' },
  { age: 52, name: 'Margaret Hamilton', role: 'Engineer' },
  { age: 31, name: 'Katherine Johnson', role: 'Mathematician' },
]

function Rows({ selected }: Readonly<{ selected?: string }>): React.ReactNode {
  return people.map(({ age, name, role }) => (
    <TableRow key={name} selected={selected === name}>
      <TableCell>{name}</TableCell>
      <TableCell>{role}</TableCell>
      <TableCell align="end">{age}</TableCell>
    </TableRow>
  ))
}

function Content({ selected }: Readonly<{ selected?: string }>): React.ReactNode {
  return (
    <>
      <TableCaption>People of the team</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead align="end">Age</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <Rows selected={selected} />
      </TableBody>
    </>
  )
}

/**
 * Rows and columns of data. It is a real `<table>`, so assistive technology reads it as one: the headers are
 * announced with every cell, and the `TableCaption` names it.
 *
 * Use a `TableHead` for the header of a column (`scope="col"` is the default) or of a row (`scope="row"`), and a
 * `TableCell` for the data. Group the rows with `TableHeader`, `TableBody` and `TableFooter`, and add a
 * `TableCaption` so the table has a name. Without a caption give the table an `aria-label`.
 *
 * **Sorting, filters, pages and selection.** The Table only draws the data: it doesn't sort or filter anything.
 * Pass **onSort** to a `TableHead` to make its title a button, and **sort** (`ascending`, `descending` or `none`)
 * to say how the column is sorted, which sets `aria-sort`. To keep the state of the sort, the filters, the page
 * and the selection, use the `useTableState` hook, which works without a Table and can feed a `Paginator`. The
 * filters are yours to build with `Field`, `Input`, `Select` or any other control: the hook only keeps their values.
 *
 * **Loading and empty.** **loading** sets `aria-busy`, covers the body with a veil and a `Spinner` while you wait for the data. When there
 * are no rows, put a `TableEmpty` in the body with the message, or a `title`, a `description` and an `action` such as clearing the filters.
 *
 * **Wide tables.** The table scrolls inside its own box instead of the page. When it doesn't fit, the box becomes
 * a focusable region named like the table, so the keyboard can scroll it. Set **maxHeight** to limit the height,
 * and **stickyHeader** to keep the header in view while the body scrolls.
 *
 * It has no `colorScheme`: a table is mostly neutral, and the selected row uses the primary color.
 *
 * **Parts.** The `Table` is the box that scrolls (`className` and `style` go there) and renders the `<table>` and the
 * loading veil by default. Every element is a part: give the `Table` a `TableElement` (the `<table>`, which takes
 * **ref** of the `Table`) and, if you want it, a `TableLoading` as children and it renders them as written. Inside a
 * `TableHead`, a `TableHeadSort` and its `TableHeadSortIcon` replace the sort button of **onSort**, and inside a
 * `TableEmpty` a `TableEmptyCell` replaces the cell with the `EmptyState`.
 *
 * ### useTableState
 *
 * `useTableState({ rows, ... })` keeps the state of a table and returns it. It has two modes:
 *
 * - **Client** (the default). You pass all the **rows** and it returns the ones of the current page, already
 *   filtered and sorted, with the **total** of rows that match.
 * - **Server** (**manual**). You pass the rows of the current page and the **total** of the server. The hook does
 *   not sort or filter: it only keeps the **params** (`page`, `pageSize`, `sort` and `filters`) for you to send.
 *
 * | Option | |
 * | --- | --- |
 * | `rows`, `total`, `manual` | The data, the total of the server and the mode. |
 * | `defaultPage`, `defaultPageSize`, `defaultSort`, `defaultFilters` | The state to start with. The page size is 10 by default. |
 * | `getRowId` | The id of a row, for the selection. It is `row.id` by default. |
 * | `getValue` | The value of a column in a row, for sorting and filtering. It is `row[column]` by default. |
 * | `sortFns`, `filterFns` | A compare function (`(a, b) => number`) or a filter function (`(row, value) => boolean`) for a column. Define them outside of the component or memoize them. |
 *
 * It returns `rows`, `total`, `page`, `pageCount`, `pageSize`, `params`, `sort`, `filters` and `selected` with the
 * functions to change them: `setPage`, `setPageSize`, `setSort`, `toggleSort`, `setFilter`, `resetFilters`,
 * `toggleRow`, `toggleAll` and `clearSelection`, plus `getSortProps(column)` to spread on a `TableHead`, `hasFilters`,
 * `isSelected(row)`, `allSelected` and `someSelected`. Changing the sort, a filter or the page size goes back to the
 * first page. A filter with no value (`''`, `[]`, `null` or `undefined`) is ignored, a text matches anywhere in the
 * cell without caring about the case, and a list matches any of its items. Without a `filterFns` entry a column is
 * compared like that. The selection is kept between pages.
 */
export default {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    docs: {
      importNames: [
        'Table',
        'TableCaption',
        'TableHeader',
        'TableBody',
        'TableFooter',
        'TableRow',
        'TableHead',
        'TableCell',
        'TableElement',
        'TableEmpty',
        'TableEmptyCell',
        'TableHeadSort',
        'TableHeadSortIcon',
        'TableLoading',
        'useTableState',
      ],
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
    hoverable: { control: 'boolean' },
    loading: { control: 'boolean' },
    labels: { control: false },
    maxHeight: { control: 'text' },
    stickyHeader: { control: 'boolean' },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'radio', options: ['plain', 'bordered', 'striped', 'unstyled'] },
    id: { control: false },
    title: { control: 'text' },
    hidden: { control: false },
    'aria-label': { control: 'text' },
    'aria-labelledby': { control: false },
  },
  args: {
    children: <Content />,
    style: { maxWidth: '100%', width: '28rem' },
  },
} satisfies Meta<typeof Table>

type Story = StoryObj<typeof Table>

/**
 * This is the default Table: a line under every row and a thicker one under the header.
 */
export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Table>
  <TableCaption>People of the team</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Role</TableHead>
      <TableHead align="end">Age</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {people.map(({ age, name, role }) => (
      <TableRow key={name}>
        <TableCell>{name}</TableCell>
        <TableCell>{role}</TableCell>
        <TableCell align="end">{age}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>`,
      },
    },
  },
}

/**
 * Use the **variant** prop to pick how the Table looks. `unstyled` drops the Plume styles so you can style it
 * yourself.
 */
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-8">
  <Table aria-label="plain" variant="plain">
    <TableCaption>plain</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Role</TableHead>
        <TableHead align="end">Age</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>Ada Lovelace</TableCell>
        <TableCell>Mathematician</TableCell>
        <TableCell align="end">36</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Grace Hopper</TableCell>
        <TableCell>Rear admiral</TableCell>
        <TableCell align="end">45</TableCell>
      </TableRow>
    </TableBody>
  </Table>
  <Table aria-label="bordered" variant="bordered">
    <TableCaption>bordered</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Role</TableHead>
        <TableHead align="end">Age</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>Ada Lovelace</TableCell>
        <TableCell>Mathematician</TableCell>
        <TableCell align="end">36</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Grace Hopper</TableCell>
        <TableCell>Rear admiral</TableCell>
        <TableCell align="end">45</TableCell>
      </TableRow>
    </TableBody>
  </Table>
  <Table aria-label="striped" variant="striped">
    <TableCaption>striped</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Role</TableHead>
        <TableHead align="end">Age</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>Ada Lovelace</TableCell>
        <TableCell>Mathematician</TableCell>
        <TableCell align="end">36</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Grace Hopper</TableCell>
        <TableCell>Rear admiral</TableCell>
        <TableCell align="end">45</TableCell>
      </TableRow>
    </TableBody>
  </Table>
  <Table aria-label="unstyled" className="w-full text-left text-sm" variant="unstyled">
    <TableCaption className="pb-2 text-left font-bold">
      unstyled, with Tailwind classes
    </TableCaption>
    <TableHeader>
      <TableRow className="border-b-2 border-gray-400">
        <TableHead className="py-1">Name</TableHead>
        <TableHead className="py-1">Role</TableHead>
        <TableHead align="end" className="py-1">
          Age
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow className="border-b border-gray-300">
        <TableCell className="py-1">Ada Lovelace</TableCell>
        <TableCell className="py-1">Mathematician</TableCell>
        <TableCell align="end" className="py-1">
          36
        </TableCell>
      </TableRow>
      <TableRow className="border-b border-gray-300">
        <TableCell className="py-1">Grace Hopper</TableCell>
        <TableCell className="py-1">Rear admiral</TableCell>
        <TableCell align="end" className="py-1">
          45
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</div>`,
      },
    },
  },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        width: '36rem',
        maxWidth: '100%',
      }}
    >
      {(['plain', 'bordered', 'striped'] as const).map((variant) => (
        <Table aria-label={variant} key={variant} variant={variant}>
          <TableCaption>{variant}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead align="end">Age</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <Rows />
          </TableBody>
        </Table>
      ))}
      <Table aria-label="unstyled" className="w-full text-left text-sm" variant="unstyled">
        <TableCaption className="pb-2 text-left font-bold">
          unstyled, with Tailwind classes
        </TableCaption>
        <TableHeader>
          <TableRow className="border-b-2 border-gray-400">
            <TableHead className="py-1">Name</TableHead>
            <TableHead className="py-1">Role</TableHead>
            <TableHead align="end" className="py-1">
              Age
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {people.map(({ age, name, role }) => (
            <TableRow className="border-b border-gray-300" key={name}>
              <TableCell className="py-1">{name}</TableCell>
              <TableCell className="py-1">{role}</TableCell>
              <TableCell align="end" className="py-1">
                {age}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
}

/**
 * Use the **size** prop to change the density: the padding of the cells.
 */
export const Sizes: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-8">
  <Table aria-label="Size sm" size="sm">
    <TableCaption>sm</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Role</TableHead>
        <TableHead align="end">Age</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>Ada Lovelace</TableCell>
        <TableCell>Mathematician</TableCell>
        <TableCell align="end">36</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Grace Hopper</TableCell>
        <TableCell>Rear admiral</TableCell>
        <TableCell align="end">45</TableCell>
      </TableRow>
    </TableBody>
  </Table>
  <Table aria-label="Size md" size="md">
    <TableCaption>md</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Role</TableHead>
        <TableHead align="end">Age</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>Ada Lovelace</TableCell>
        <TableCell>Mathematician</TableCell>
        <TableCell align="end">36</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Grace Hopper</TableCell>
        <TableCell>Rear admiral</TableCell>
        <TableCell align="end">45</TableCell>
      </TableRow>
    </TableBody>
  </Table>
  <Table aria-label="Size lg" size="lg">
    <TableCaption>lg</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Role</TableHead>
        <TableHead align="end">Age</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>Ada Lovelace</TableCell>
        <TableCell>Mathematician</TableCell>
        <TableCell align="end">36</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Grace Hopper</TableCell>
        <TableCell>Rear admiral</TableCell>
        <TableCell align="end">45</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</div>`,
      },
    },
  },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        width: '36rem',
        maxWidth: '100%',
      }}
    >
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Table aria-label={`Size ${size}`} key={size} size={size}>
          <TableCaption>{size}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead align="end">Age</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <Rows />
          </TableBody>
        </Table>
      ))}
    </div>
  ),
}

/**
 * With **hoverable** the row under the pointer is highlighted. Use **selected** on a `TableRow` to mark one, which
 * sets `aria-selected` and `data-selected`.
 */
export const Hoverable: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Table hoverable>
  <TableCaption>People of the team</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Role</TableHead>
      <TableHead align="end">Age</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {people.map(({ age, name, role }) => (
      <TableRow key={name} selected={name === 'Grace Hopper'}>
        <TableCell>{name}</TableCell>
        <TableCell>{role}</TableCell>
        <TableCell align="end">{age}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>`,
      },
    },
  },
  args: {
    hoverable: true,
    children: <Content selected="Grace Hopper" />,
  },
}

/**
 * Use **align** on the heads and the cells to align a column, for example numbers to the end. The footer is a
 * `TableFooter` with its own rows.
 */
export const Alignment: Story = {
  render: () => (
    <Table aria-label="Invoice" style={{ maxWidth: '100%', width: '24rem' }}>
      <TableCaption>Invoice</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead align="center">Qty</TableHead>
          <TableHead align="end">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Keyboard</TableCell>
          <TableCell align="center">2</TableCell>
          <TableCell align="end">$120.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Mouse</TableCell>
          <TableCell align="center">1</TableCell>
          <TableCell align="end">$35.50</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableHead scope="row">Total</TableHead>
          <TableCell align="center">3</TableCell>
          <TableCell align="end">$155.50</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
}

function SortableTable(): React.ReactNode {
  const { getSortProps, rows } = useTableState({
    defaultSort: { column: 'name', direction: 'ascending' },
    rows: people,
  })

  return (
    <Table aria-label="Sortable people" hoverable style={{ maxWidth: '100%', width: '28rem' }}>
      <TableCaption>Click a header to sort</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead {...getSortProps('name')}>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead align="end" {...getSortProps('age')}>
            Age
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(({ age, name, role }) => (
          <TableRow key={name}>
            <TableCell>{name}</TableCell>
            <TableCell>{role}</TableCell>
            <TableCell align="end">{age}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

/**
 * Pass **onSort** to a head to make it a button and **sort** to show the direction, which sets `aria-sort`.
 * `getSortProps(column)` of `useTableState` gives both: each click goes ascending, descending and back to the
 * original order.
 */
export const Sortable: Story = {
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const { getSortProps, rows } = useTableState({
    defaultSort: { column: 'name', direction: 'ascending' },
    rows: people,
  })

  return (
    <Table aria-label="Sortable people" hoverable>
      <TableCaption>Click a header to sort</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead {...getSortProps('name')}>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead align="end" {...getSortProps('age')}>
            Age
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(({ age, name, role }) => (
          <TableRow key={name}>
            <TableCell>{name}</TableCell>
            <TableCell>{role}</TableCell>
            <TableCell align="end">{age}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}`,
      },
    },
  },
  render: () => <SortableTable />,
}

const roles = ['Admin', 'Editor', 'Viewer']

const members = Array.from({ length: 47 }, (_, index) => ({
  age: 20 + ((index * 7) % 35),
  id: `m${index + 1}`,
  name: `Member ${String(index + 1).padStart(2, '0')}`,
  role: roles[index % roles.length],
}))

type Member = (typeof members)[number]

const sizes = [5, 10, 20]

const text = (value: unknown): string => (typeof value === 'string' ? value : '')

function Filters({
  filters,
  hasFilters,
  onReset,
  setFilter,
}: Readonly<{
  filters: Record<string, unknown>
  hasFilters: boolean
  onReset: () => void
  setFilter: (column: string, value: unknown) => void
}>): React.ReactNode {
  return (
    <div style={{ alignItems: 'flex-end', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      <Field label="Name">
        <Input
          onChange={(event) => setFilter('name', event.target.value)}
          placeholder="Search"
          value={text(filters.name)}
        />
      </Field>
      <Field label="Role">
        <Select
          clearable
          onValueChange={(value) => setFilter('role', value)}
          value={text(filters.role)}
        >
          <SelectTrigger placeholder="Any role" />
          <SelectContent>
            {roles.map((role) => (
              <SelectOption key={role} value={role}>
                {role}
              </SelectOption>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Button disabled={!hasFilters} onClick={onReset} variant="outline">
        Clear filters
      </Button>
    </div>
  )
}

function MembersRows({
  onReset,
  rows,
}: Readonly<{ onReset: () => void; rows: Member[] }>): React.ReactNode {
  if (rows.length === 0) {
    return (
      <TableEmpty
        action={
          <Button onClick={onReset} size="sm" variant="outline">
            Clear filters
          </Button>
        }
        colSpan={3}
        description="Try other words or another role."
        title="No members match the filters"
      />
    )
  }
  return rows.map(({ age, id, name, role }) => (
    <TableRow key={id}>
      <TableCell>{name}</TableCell>
      <TableCell>{role}</TableCell>
      <TableCell align="end">{age}</TableCell>
    </TableRow>
  ))
}

function FilteredTable(): React.ReactNode {
  const state = useTableState({ rows: members, defaultPageSize: 5 })

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxWidth: '100%',
        width: '40rem',
      }}
    >
      <Filters
        filters={state.filters}
        hasFilters={state.hasFilters}
        onReset={state.resetFilters}
        setFilter={state.setFilter}
      />
      <Table aria-label="Members" hoverable>
        <TableCaption>{state.total} members</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead {...state.getSortProps('name')}>Name</TableHead>
            <TableHead {...state.getSortProps('role')}>Role</TableHead>
            <TableHead align="end" {...state.getSortProps('age')}>
              Age
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <MembersRows onReset={state.resetFilters} rows={state.rows} />
        </TableBody>
      </Table>
      <Paginator
        aria-label="Members pages"
        onPageChange={state.setPage}
        page={state.page}
        pageSize={state.pageSize}
        total={state.total}
      />
    </div>
  )
}

/**
 * In client mode `useTableState` sorts, filters and pages the rows you give it. The filters are ordinary controls
 * that call `setFilter(column, value)`: a text matches anywhere in the cell and a value must be equal. The
 * `Paginator` gets its `page`, `total` and `pageSize` from the hook, and `TableEmpty` offers to clear the filters when no row matches.
 */
export const Filtered: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        code: `function Example() {
  const state = useTableState({ rows: members, defaultPageSize: 5 })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-4">
        <Field label="Name">
          <Input
            onChange={(event) => state.setFilter('name', event.target.value)}
            placeholder="Search"
            value={String(state.filters.name ?? '')}
          />
        </Field>
        <Field label="Role">
          <Select
            clearable
            onValueChange={(value) => state.setFilter('role', value)}
            value={String(state.filters.role ?? '')}
          >
            <SelectTrigger placeholder="Any role" />
            <SelectContent>
              {['Admin', 'Editor', 'Viewer'].map((role) => (
                <SelectOption key={role} value={role}>
                  {role}
                </SelectOption>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Button disabled={!state.hasFilters} onClick={state.resetFilters} variant="outline">
          Clear filters
        </Button>
      </div>
      <Table aria-label="Members" hoverable>
        <TableCaption>{state.total} members</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead {...state.getSortProps('name')}>Name</TableHead>
            <TableHead {...state.getSortProps('role')}>Role</TableHead>
            <TableHead align="end" {...state.getSortProps('age')}>
              Age
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {state.rows.length === 0 ? (
            <TableEmpty
              action={
                <Button onClick={state.resetFilters} size="sm" variant="outline">
                  Clear filters
                </Button>
              }
              colSpan={3}
              description="Try other words or another role."
              title="No members match the filters"
            />
          ) : (
            state.rows.map(({ age, id, name, role }) => (
              <TableRow key={id}>
                <TableCell>{name}</TableCell>
                <TableCell>{role}</TableCell>
                <TableCell align="end">{age}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Paginator
        aria-label="Members pages"
        onPageChange={state.setPage}
        page={state.page}
        pageSize={state.pageSize}
        total={state.total}
      />
    </div>
  )
}`,
      },
    },
  },
  render: () => <FilteredTable />,
}

const delay = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, milliseconds))

async function fetchMembers({
  filters,
  page,
  pageSize,
  sort,
}: TableParams): Promise<{ rows: Member[]; total: number }> {
  await delay(600)
  const name = text(filters.name).toLowerCase()
  const role = text(filters.role)
  const matching = members.filter(
    (member) => member.name.toLowerCase().includes(name) && (role === '' || member.role === role),
  )
  if (sort) {
    const column = sort.column as keyof Member
    const factor = sort.direction === 'ascending' ? 1 : -1
    matching.sort(
      (first, second) =>
        factor *
        String(first[column]).localeCompare(String(second[column]), undefined, { numeric: true }),
    )
  }
  return { rows: matching.slice((page - 1) * pageSize, page * pageSize), total: matching.length }
}

function ServerSideTable(): React.ReactNode {
  const [data, setData] = useState<{ rows: Member[]; total: number }>({ rows: [], total: 0 })
  const [loading, setLoading] = useState(true)
  const state = useTableState({
    manual: true,
    rows: data.rows,
    total: data.total,
    defaultPageSize: 5,
  })
  const { params } = state

  useEffect(() => {
    let current = true
    setLoading(true)
    void fetchMembers(params).then((result) => {
      if (!current) return
      setData(result)
      setLoading(false)
    })
    return () => {
      current = false
    }
  }, [params])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxWidth: '100%',
        width: '40rem',
      }}
    >
      <Filters
        filters={state.filters}
        hasFilters={state.hasFilters}
        onReset={state.resetFilters}
        setFilter={state.setFilter}
      />
      <Table aria-label="Members from the server" hoverable loading={loading}>
        <TableCaption>{loading ? 'Loading…' : `${state.total} members`}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead {...state.getSortProps('name')}>Name</TableHead>
            <TableHead {...state.getSortProps('role')}>Role</TableHead>
            <TableHead align="end" {...state.getSortProps('age')}>
              Age
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && state.rows.length === 0 ? null : (
            <MembersRows onReset={state.resetFilters} rows={state.rows} />
          )}
        </TableBody>
      </Table>
      <Paginator
        aria-label="Members pages"
        onPageChange={state.setPage}
        page={state.page}
        pageSize={state.pageSize}
        total={state.total}
      />
    </div>
  )
}

/**
 * With **manual** the hook doesn't touch the rows: it keeps the `params` (page, page size, sort and filters) and
 * you fetch the page whenever they change, then pass the `rows` of that page and the `total` of the server. The
 * `loading` prop marks the table as busy while the request is on its way. Here the server is simulated.
 */
export const ServerSide: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        code: `function Example() {
  const [data, setData] = useState({ rows: [], total: 0 })
  const [loading, setLoading] = useState(true)
  const state = useTableState({
    manual: true,
    rows: data.rows,
    total: data.total,
    defaultPageSize: 5,
  })
  const { params } = state

  useEffect(() => {
    let current = true
    setLoading(true)
    fetchMembers(params).then((result) => {
      if (!current) return
      setData(result)
      setLoading(false)
    })
    return () => {
      current = false
    }
  }, [params])

  return (
    <div className="flex flex-col gap-4">
      <Input
        aria-label="Name"
        onChange={(event) => state.setFilter('name', event.target.value)}
        placeholder="Search"
        value={String(state.filters.name ?? '')}
      />
      <Table aria-label="Members from the server" hoverable loading={loading}>
        <TableCaption>{loading ? 'Loading…' : \`\${state.total} members\`}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead {...state.getSortProps('name')}>Name</TableHead>
            <TableHead {...state.getSortProps('role')}>Role</TableHead>
            <TableHead align="end" {...state.getSortProps('age')}>
              Age
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {state.rows.map(({ age, id, name, role }) => (
            <TableRow key={id}>
              <TableCell>{name}</TableCell>
              <TableCell>{role}</TableCell>
              <TableCell align="end">{age}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Paginator
        aria-label="Members pages"
        onPageChange={state.setPage}
        page={state.page}
        pageSize={state.pageSize}
        total={state.total}
      />
    </div>
  )
}`,
      },
    },
  },
  render: () => <ServerSideTable />,
}

function SelectableTable(): React.ReactNode {
  const state = useTableState({ rows: members, defaultPageSize: 5 })

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxWidth: '100%',
        width: '40rem',
      }}
    >
      <Table aria-label="Selectable members">
        <TableCaption>{state.selected.length} selected</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox
                aria-label="Select the page"
                checked={state.allSelected}
                indeterminate={state.someSelected}
                onChange={state.toggleAll}
              />
            </TableHead>
            <TableHead {...state.getSortProps('name')}>Name</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {state.rows.map((member) => (
            <TableRow key={member.id} selected={state.isSelected(member)}>
              <TableCell>
                <Checkbox
                  aria-label={`Select ${member.name}`}
                  checked={state.isSelected(member)}
                  onChange={() => state.toggleRow(member)}
                />
              </TableCell>
              <TableCell>{member.name}</TableCell>
              <TableCell>{member.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          justifyContent: 'space-between',
        }}
      >
        <Paginator
          aria-label="Members pages"
          onPageChange={state.setPage}
          page={state.page}
          pageSize={state.pageSize}
          total={state.total}
        />
        <Select
          onValueChange={(value) => state.setPageSize(Number(value))}
          value={String(state.pageSize)}
        >
          <SelectTrigger aria-label="Rows per page" />
          <SelectContent>
            {sizes.map((size) => (
              <SelectOption key={size} value={String(size)}>
                {`${size} per page`}
              </SelectOption>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

/**
 * `toggleRow`, `toggleAll` and `isSelected` keep the selection by the id of each row (`row.id`, or what
 * `getRowId` returns), so it survives the changes of page, sort and filter. `allSelected` and `someSelected`
 * refer to the current page, which suits the checkbox of the header.
 */
export const Selectable: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        code: `function Example() {
  const state = useTableState({ rows: members, defaultPageSize: 5 })

  return (
    <div className="flex flex-col gap-4">
      <Table aria-label="Selectable members">
        <TableCaption>{state.selected.length} selected</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox
                aria-label="Select the page"
                checked={state.allSelected}
                indeterminate={state.someSelected}
                onChange={state.toggleAll}
              />
            </TableHead>
            <TableHead {...state.getSortProps('name')}>Name</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {state.rows.map((member) => (
            <TableRow key={member.id} selected={state.isSelected(member)}>
              <TableCell>
                <Checkbox
                  aria-label={\`Select \${member.name}\`}
                  checked={state.isSelected(member)}
                  onChange={() => state.toggleRow(member)}
                />
              </TableCell>
              <TableCell>{member.name}</TableCell>
              <TableCell>{member.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Paginator
          aria-label="Members pages"
          onPageChange={state.setPage}
          page={state.page}
          pageSize={state.pageSize}
          total={state.total}
        />
        <Select
          onValueChange={(value) => state.setPageSize(Number(value))}
          value={String(state.pageSize)}
        >
          <SelectTrigger aria-label="Rows per page" />
          <SelectContent>
            {[5, 10, 20].map((size) => (
              <SelectOption key={size} value={String(size)}>
                {\`\${size} per page\`}
              </SelectOption>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}`,
      },
    },
  },
  render: () => <SelectableTable />,
}

/**
 * **loading** marks the table as busy while the data is on its way: it sets `aria-busy`, covers the body with a translucent veil and shows
 * a `Spinner` in the middle, named by **labels.loading**. The rows stay in place so the table doesn't jump when the
 * new data arrives.
 */
export const Loading: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Table aria-label="Loading people" loading>
  <TableCaption>People of the team</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Role</TableHead>
      <TableHead align="end">Age</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Ada Lovelace</TableCell>
      <TableCell>Mathematician</TableCell>
      <TableCell align="end">36</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Grace Hopper</TableCell>
      <TableCell>Rear admiral</TableCell>
      <TableCell align="end">45</TableCell>
    </TableRow>
  </TableBody>
</Table>`,
      },
    },
  },
  render: () => (
    <Table aria-label="Loading people" loading style={{ maxWidth: '100%', width: '28rem' }}>
      <Content />
    </Table>
  ),
}

/**
 * When there are no rows, a `TableEmpty` gives the reason instead of leaving the table blank. It holds an
 * `EmptyState`, so it can have a title, a description, an icon and an action.
 */
export const Empty: Story = {
  render: () => (
    <Table aria-label="Empty people" style={{ maxWidth: '100%', width: '28rem' }}>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead align="end">Age</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableEmpty
          colSpan={3}
          description="People you invite will show up here."
          title="There is nobody here yet"
        />
      </TableBody>
    </Table>
  ),
}

/**
 * With **stickyHeader** and **maxHeight** the header stays in view while the body scrolls inside the box. Because
 * the box scrolls, it can be focused to scroll it with the keyboard.
 */
export const StickyHeader: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Table
  aria-label="Long list"
  maxHeight="12rem"
  stickyHeader
  style={{ maxWidth: '100%', width: '28rem' }}
>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Role</TableHead>
      <TableHead align="end">Age</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {people.map(({ age, name, role }) => (
      <TableRow key={name}>
        <TableCell>{name}</TableCell>
        <TableCell>{role}</TableCell>
        <TableCell align="end">{age}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>`,
      },
    },
  },
  render: () => (
    <Table aria-label="Long list" maxHeight="12rem" stickyHeader style={{ maxWidth: '100%', width: '28rem' }}>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead align="end">Age</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...people, ...people, ...people].map(({ age, name, role }, index) => (
          <TableRow key={`${name}-${index}`}>
            <TableCell>{name}</TableCell>
            <TableCell>{role}</TableCell>
            <TableCell align="end">{age}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}

/**
 * A table wider than its box scrolls sideways inside it, and the page doesn't. When it overflows, the box is a
 * focusable region with the name of the table, so a keyboard user can scroll it too.
 */
export const Overflow: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div style={{ maxWidth: '20rem' }}>
  <Table aria-label="Wide table">
    <TableElement style={{ minWidth: '40rem' }}>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Country</TableHead>
          <TableHead align="end">Age</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {people.map(({ age, name, role }) => (
          <TableRow key={name}>
            <TableCell>{name}</TableCell>
            <TableCell>{role}</TableCell>
            <TableCell>Somewhere</TableCell>
            <TableCell align="end">{age}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </TableElement>
  </Table>
</div>`,
      },
    },
  },
  render: () => (
    <div style={{ maxWidth: '20rem' }}>
      <Table aria-label="Wide table">
        <TableElement style={{ minWidth: '40rem' }}>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Country</TableHead>
              <TableHead align="end">Age</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {people.map(({ age, name, role }) => (
              <TableRow key={name}>
                <TableCell>{name}</TableCell>
                <TableCell>{role}</TableCell>
                <TableCell>Somewhere</TableCell>
                <TableCell align="end">{age}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableElement>
      </Table>
    </div>
  ),
}

/**
 * Give the `Table` a `TableElement` (the `<table>`) and a `TableLoading` as children and it renders them as
 * written, so the veil can have its own content and the `<table>` its own class. A `TableHeadSort` with a
 * `TableHeadSortIcon` replaces the button of **onSort**, and a `TableEmptyCell` takes the place of the cell with the
 * `EmptyState`. Omit a part and it is not there: without a `TableLoading` the table is busy but shows no veil.
 */
export const Compound: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Table aria-label="People" loading>
  <TableLoading>Loading people…</TableLoading>
  <TableElement className="shadow-md">
    <TableHeader>
      <TableRow>
        <TableHead sort="ascending">
          <TableHeadSort onClick={sortByName}>
            Name
            <TableHeadSortIcon>▲</TableHeadSortIcon>
          </TableHeadSort>
        </TableHead>
        <TableHead>Role</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableEmpty>
        <TableEmptyCell className="px-8 pb-6 pt-12 text-center" colSpan={2}>Nobody here yet</TableEmptyCell>
      </TableEmpty>
    </TableBody>
  </TableElement>
</Table>`,
      },
    },
  },
  render: (args) => (
    <Table {...args} aria-label="People" loading>
      <TableLoading>Loading people…</TableLoading>
      <TableElement style={{ boxShadow: '0 1px 4px rgb(0 0 0 / 0.25)' }}>
        <TableHeader>
          <TableRow>
            <TableHead sort="ascending">
              <TableHeadSort>
                Name
                <TableHeadSortIcon>▲</TableHeadSortIcon>
              </TableHeadSort>
            </TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableEmpty>
            <TableEmptyCell colSpan={2} style={{ padding: '3rem 2rem 1.5rem', textAlign: 'center' }}>
              Nobody here yet
            </TableEmptyCell>
          </TableEmpty>
        </TableBody>
      </TableElement>
    </Table>
  ),
}

/**
 * Some examples of Table with Tailwind classes. With `variant="unstyled"` the Plume classes are gone and the
 * structure stays: the box that scrolls and the sticky header. The `className` of the `Table` is for the box; the
 * `<table>` has its own part, `TableElement`. Style every part with its own classes, and use `data-[selected]:` on
 * the rows.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Table aria-label="People" className="overflow-hidden rounded-lg border border-border" variant="unstyled">
  <TableElement className="w-full text-left text-sm text-foreground">
    <TableHeader className="bg-surface-muted">
      <TableRow>
        <TableHead className="px-4 py-2 font-semibold">Name</TableHead>
        <TableHead className="px-4 py-2 font-semibold">Role</TableHead>
        <TableHead align="end" className="px-4 py-2 font-semibold">Age</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody className="divide-y divide-border">
      <TableRow className="hover:bg-surface-muted data-[selected]:bg-primary-solid data-[selected]:text-primary-on-solid">
        <TableCell className="px-4 py-2">Ada Lovelace</TableCell>
        <TableCell className="px-4 py-2">Mathematician</TableCell>
        <TableCell align="end" className="px-4 py-2">36</TableCell>
      </TableRow>
    </TableBody>
  </TableElement>
</Table>`,
      },
    },
  },
  render: () => (
    <Table
      aria-label="People"
      className="overflow-hidden rounded-lg border border-border"
      style={{ maxWidth: '100%', width: '28rem' }}
      variant="unstyled"
    >
      <TableElement className="w-full text-left text-sm text-foreground">
        <TableHeader className="bg-surface-muted">
          <TableRow>
            <TableHead className="px-4 py-2 font-semibold">Name</TableHead>
            <TableHead className="px-4 py-2 font-semibold">Role</TableHead>
            <TableHead align="end" className="px-4 py-2 font-semibold">
              Age
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-border">
          {people.map(({ age, name, role }) => (
            <TableRow
              className="hover:bg-surface-muted data-[selected]:bg-primary-solid data-[selected]:text-primary-on-solid"
              key={name}
              selected={name === 'Grace Hopper'}
            >
              <TableCell className="px-4 py-2">{name}</TableCell>
              <TableCell className="px-4 py-2">{role}</TableCell>
              <TableCell align="end" className="px-4 py-2">
                {age}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableElement>
    </Table>
  ),
}

/**
 * Some examples of Table with Bootstrap classes: `table`, `table-striped`, `table-hover` and `caption-top`.
 * Bootstrap has no state for a selected row, so the story marks it with `table-active`.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Table aria-label="People" className="table-responsive" variant="unstyled">
  <TableElement className="table table-striped table-hover caption-top">
    <TableCaption>People of the team</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Role</TableHead>
        <TableHead align="end">Age</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>Ada Lovelace</TableCell>
        <TableCell>Mathematician</TableCell>
        <TableCell align="end">36</TableCell>
      </TableRow>
      <TableRow className="table-active">
        <TableCell>Grace Hopper</TableCell>
        <TableCell>Rear admiral</TableCell>
        <TableCell align="end">45</TableCell>
      </TableRow>
    </TableBody>
  </TableElement>
</Table>`,
      },
    },
  },
  render: () => (
    <Table
      aria-label="People"
      className="table-responsive"
      style={{ maxWidth: '100%', width: '28rem' }}
      variant="unstyled"
    >
      <TableElement className="table table-striped table-hover caption-top">
        <TableCaption>People of the team</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead align="end">Age</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {people.map(({ age, name, role }) => (
            <TableRow className={name === 'Grace Hopper' ? 'table-active' : undefined} key={name}>
              <TableCell>{name}</TableCell>
              <TableCell>{role}</TableCell>
              <TableCell align="end">{age}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableElement>
    </Table>
  ),
}
