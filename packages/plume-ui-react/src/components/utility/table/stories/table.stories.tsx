import type { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  type TableSortDirection,
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
 * **Sorting.** The Table doesn't sort anything: it shows the sort and tells you when the user asks for it. Pass
 * **onSort** to a `TableHead` to make its title a button, and **sort** (`ascending`, `descending` or `none`) to
 * say how the column is sorted, which sets `aria-sort`. You keep the data and sort it.
 *
 * **Wide tables.** The table scrolls inside its own box instead of the page. When it doesn't fit, the box becomes
 * a focusable region named like the table, so the keyboard can scroll it. Set **maxHeight** to limit the height,
 * and **stickyHeader** to keep the header in view while the body scrolls.
 *
 * It has no `colorScheme`: a table is mostly neutral, and the selected row uses the primary color.
 *
 * ### Subcomponents
 *
 * | Component | Props |
 * | --- | --- |
 * | `TableCaption` | `side`, `id`, `title`, `className`, `style`, `children`. The name of the table. `side` is `top` (the default) or `bottom`. |
 * | `TableHeader`, `TableBody`, `TableFooter` | `id`, `title`, `hidden`, `className`, `style`, `children`. The `<thead>`, `<tbody>` and `<tfoot>`. |
 * | `TableRow` | `selected`, `id`, `title`, `hidden`, `className`, `style`, `children`. A `<tr>`. `selected` sets `aria-selected` and `data-selected`. |
 * | `TableHead` | `scope`, `align`, `sort`, `onSort`, `sortClassName`, `abbr`, `colSpan`, `rowSpan`, `headers`, `id`, `title`, `hidden`, `className`, `style`, `children`. A `<th>`. `align` is `start`, `center` or `end`. With `onSort` its content is a button, and `sortClassName` styles it. |
 * | `TableCell` | `align`, `colSpan`, `rowSpan`, `headers`, `id`, `title`, `hidden`, `className`, `style`, `children`. A `<td>`. |
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
      ],
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
      description: 'The caption and the row groups of the Table.',
      table: { type: { summary: 'ReactNode' } },
    },
    className: {
      control: 'text',
      description: 'Custom CSS class for the `<table>`.',
      table: { type: { summary: 'string' } },
    },
    style: {
      control: false,
      description: 'Inline styles for the `<table>`.',
      table: { type: { summary: 'CSSProperties' } },
    },
    containerClassName: {
      control: 'text',
      description: 'Custom CSS class for the box that scrolls around the `<table>`.',
      table: { type: { summary: 'string' } },
    },
    hoverable: {
      control: 'boolean',
      description: 'Highlights the row under the pointer.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    maxHeight: {
      control: 'text',
      description:
        'Maximum height of the box around the table. The body scrolls inside it. A number is in pixels.',
      table: { type: { summary: 'number | string' } },
    },
    stickyHeader: {
      control: 'boolean',
      description:
        'Keeps the header cells at the top of the box while the body scrolls. It needs `maxHeight`, or a height on the container, to have something to scroll.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    size: {
      control: 'radio',
      description: 'Density of the Table: the padding of its cells.',
      options: ['sm', 'md', 'lg'],
      table: { type: { summary: `"sm" | "md" | "lg"` }, defaultValue: { summary: 'md' } },
    },
    variant: {
      control: 'radio',
      description:
        'Visual variant. `plain` draws a line under every row, `bordered` borders every cell and `striped` alternates the background of the rows. `unstyled` drops the Plume styles so you can bring your own; the scrolling box and the sticky header keep working.',
      options: ['plain', 'bordered', 'striped', 'unstyled'],
      table: {
        type: { summary: `"plain" | "bordered" | "striped" | "unstyled"` },
        defaultValue: { summary: 'plain' },
      },
    },
    id: {
      control: false,
      description: 'Id of the `<table>`.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    title: {
      control: 'text',
      description: 'Native tooltip of the `<table>`.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    hidden: {
      control: false,
      description: 'Hides the Table.',
      table: { category: 'HTML attributes', type: { summary: 'boolean' } },
    },
    'aria-label': {
      control: 'text',
      description:
        'Accessible name of the table, for when there is no `TableCaption`. It also names the scrolling box when the table does not fit.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    'aria-labelledby': {
      control: false,
      description: 'Id of the element that names the table.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
  },
  args: {
    children: <Content />,
    style: { minWidth: '28rem' },
  },
} satisfies Meta<typeof Table>

type Story = StoryObj<typeof Table>

/**
 * This is the default Table: a line under every row and a thicker one under the header.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick how the Table looks. `unstyled` drops the Plume styles so you can style it
 * yourself.
 */
export const Variants: Story = {
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
    <Table aria-label="Invoice" style={{ minWidth: '24rem' }}>
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
  const [sort, setSort] = useState<{ column: 'age' | 'name'; direction: TableSortDirection }>({
    column: 'name',
    direction: 'ascending',
  })
  const sorted = [...people].sort((a, b) => {
    const order = sort.column === 'age' ? a.age - b.age : a.name.localeCompare(b.name)
    return sort.direction === 'ascending' ? order : -order
  })
  const toggle = (column: 'age' | 'name') => () =>
    setSort({
      column,
      direction:
        sort.column === column && sort.direction === 'ascending' ? 'descending' : 'ascending',
    })
  const direction = (column: 'age' | 'name'): TableSortDirection =>
    sort.column === column ? sort.direction : 'none'

  return (
    <Table aria-label="Sortable people" hoverable style={{ minWidth: '28rem' }}>
      <TableCaption>Click a header to sort</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead onSort={toggle('name')} sort={direction('name')}>
            Name
          </TableHead>
          <TableHead>Role</TableHead>
          <TableHead align="end" onSort={toggle('age')} sort={direction('age')}>
            Age
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map(({ age, name, role }) => (
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
 * Pass **onSort** to a head to make it a button and **sort** to show the direction, which sets `aria-sort`. The
 * Table doesn't sort the rows: keep the sort in your state, as this example does.
 */
export const Sortable: Story = {
  render: () => <SortableTable />,
}

/**
 * With **stickyHeader** and **maxHeight** the header stays in view while the body scrolls inside the box. Because
 * the box scrolls, it can be focused to scroll it with the keyboard.
 */
export const StickyHeader: Story = {
  render: () => (
    <Table aria-label="Long list" maxHeight="12rem" stickyHeader style={{ minWidth: '28rem' }}>
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
  render: () => (
    <div style={{ maxWidth: '20rem' }}>
      <Table aria-label="Wide table" style={{ minWidth: '40rem' }}>
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
      </Table>
    </div>
  ),
}

/**
 * Some examples of Table with Tailwind classes. With `variant="unstyled"` the Plume classes are gone and the
 * structure stays: the box that scrolls and the sticky header. Style every part with its own classes, and use
 * `data-[selected]:` on the rows.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Table aria-label="People" className="w-full text-left text-sm text-foreground" containerClassName="overflow-hidden rounded-lg border border-border" variant="unstyled">
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
</Table>`,
      },
    },
  },
  render: () => (
    <Table
      aria-label="People"
      className="w-full text-left text-sm text-foreground"
      containerClassName="overflow-hidden rounded-lg border border-border"
      style={{ minWidth: '28rem' }}
      variant="unstyled"
    >
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
        code: `<Table aria-label="People" className="table table-striped table-hover caption-top" containerClassName="table-responsive" variant="unstyled">
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
</Table>`,
      },
    },
  },
  render: () => (
    <Table
      aria-label="People"
      className="table table-striped table-hover caption-top"
      containerClassName="table-responsive"
      style={{ minWidth: '28rem' }}
      variant="unstyled"
    >
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
    </Table>
  ),
}
