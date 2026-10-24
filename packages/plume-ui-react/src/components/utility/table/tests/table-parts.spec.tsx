import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableElement,
  TableEmpty,
  TableEmptyCell,
  TableHead,
  TableHeadSort,
  TableHeadSortIcon,
  TableHeader,
  TableLoading,
  TableRow,
} from '..'

describe('Table parts', () => {
  describe('TableElement', () => {
    it('renders the content in a composed table and takes the name of the root', () => {
      render(
        <Table aria-label="Users" hoverable size="lg" stickyHeader>
          <TableElement className="grid" style={{ width: '50%' }}>
            <TableBody>
              <TableRow>
                <TableCell>Ada</TableCell>
              </TableRow>
            </TableBody>
          </TableElement>
        </Table>,
      )
      const table = screen.getByRole('table', { name: 'Users' })
      expect(table).toHaveClass('table', 'plain', 'lg', 'grid')
      expect(table).toHaveStyle({ width: '50%' })
      expect(table).toHaveAttribute('data-plume-table-element')
      expect(table).toHaveAttribute('data-hoverable')
      expect(table).toHaveAttribute('data-sticky')
    })

    it('can be named on its own', () => {
      render(
        <Table aria-label="Root">
          <TableElement aria-label="Own" id="t" />
        </Table>,
      )
      expect(screen.getByRole('table', { name: 'Own' })).toHaveAttribute('id', 't')
    })

    it('can be named by another element', () => {
      render(
        <>
          <h2 id="title">People</h2>
          <Table aria-labelledby="title">
            <TableElement />
          </Table>
        </>,
      )
      expect(screen.getByRole('table', { name: 'People' })).toBeInTheDocument()
    })

    it('sends the ref of the root and its own to the table', () => {
      const root = createRef<HTMLTableElement>()
      const own = createRef<HTMLTableElement>()
      render(
        <Table aria-label="t" ref={root}>
          <TableElement ref={own} />
        </Table>,
      )
      expect(root.current).toBe(screen.getByRole('table'))
      expect(own.current).toBe(screen.getByRole('table'))
    })

    it('drops the Plume classes when the table is unstyled', () => {
      render(
        <Table aria-label="t" variant="unstyled">
          <TableElement className="mine" />
        </Table>,
      )
      expect(screen.getByRole('table')).toHaveAttribute('class', 'mine')
    })

    it('is busy while loading', () => {
      render(
        <Table aria-label="t" loading>
          <TableElement />
        </Table>,
      )
      expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true')
      expect(screen.getByRole('table')).toHaveAttribute('data-loading')
    })

    it('throws outside a Table', () => {
      vi.spyOn(console, 'error').mockImplementation(() => undefined)
      expect(() => render(<TableElement />)).toThrow('TableElement must be used within a <Table>')
      vi.restoreAllMocks()
    })
  })

  describe('TableLoading', () => {
    it('renders nothing while the table is not loading', () => {
      const { container } = render(
        <Table aria-label="t">
          <TableLoading />
          <TableElement />
        </Table>,
      )
      expect(container.querySelector('[data-plume-table-loading]')).toBeNull()
    })

    it('shows the spinner named by the labels of the table', () => {
      render(
        <Table aria-label="t" labels={{ loading: 'Cargando' }} loading>
          <TableLoading className="veil" style={{ opacity: 0.5 }} />
          <TableElement />
        </Table>,
      )
      expect(screen.getByLabelText('Cargando')).toBeInTheDocument()
      const veil = document.querySelector('[data-plume-table-loading]')
      expect(veil).toHaveClass('loading', 'veil')
      expect(veil).toHaveStyle({ opacity: 0.5 })
    })

    it('takes its own label', () => {
      render(
        <Table aria-label="t" loading>
          <TableLoading label="Wait" />
          <TableElement />
        </Table>,
      )
      expect(screen.getByLabelText('Wait')).toBeInTheDocument()
    })

    it('renders its children instead of the spinner', () => {
      const ref = createRef<HTMLDivElement>()
      render(
        <Table aria-label="t" loading>
          <TableLoading ref={ref}>Please wait</TableLoading>
          <TableElement />
        </Table>,
      )
      expect(screen.getByText('Please wait')).toBe(ref.current)
      expect(screen.queryByLabelText('Loading')).toBeNull()
    })

    it('drops the Plume classes when the table is unstyled', () => {
      render(
        <Table aria-label="t" loading variant="unstyled">
          <TableLoading className="veil" />
          <TableElement />
        </Table>,
      )
      expect(document.querySelector('[data-plume-table-loading]')).toHaveAttribute('class', 'veil')
    })

    it('is not rendered when the composition leaves it out', () => {
      render(
        <Table aria-label="t" loading>
          <TableElement />
        </Table>,
      )
      expect(screen.queryByLabelText('Loading')).toBeNull()
    })

    it('throws outside a Table', () => {
      vi.spyOn(console, 'error').mockImplementation(() => undefined)
      expect(() => render(<TableLoading />)).toThrow('TableLoading must be used within a <Table>')
      vi.restoreAllMocks()
    })
  })

  describe('TableHeadSort', () => {
    it('is a button that sorts', async () => {
      const onClick = vi.fn()
      const ref = createRef<HTMLButtonElement>()
      render(
        <Table aria-label="t">
          <TableHeader>
            <TableRow>
              <TableHead sort="ascending">
                <TableHeadSort className="mine" onClick={onClick} ref={ref}>
                  Name
                  <TableHeadSortIcon className="arrow" />
                </TableHeadSort>
              </TableHead>
            </TableRow>
          </TableHeader>
        </Table>,
      )
      const button = screen.getByRole('button', { name: 'Name' })
      expect(button).toHaveClass('mine')
      expect(button).toHaveAttribute('type', 'button')
      expect(ref.current).toBe(button)
      await userEvent.click(button)
      expect(onClick).toHaveBeenCalledTimes(1)
      expect(button.querySelector('[data-plume-table-sort-icon]')).toHaveClass('arrow')
      expect(screen.getByRole('columnheader')).toHaveAttribute('aria-sort', 'ascending')
    })

    it('ignores onSort when the head is composed', async () => {
      const onSort = vi.fn()
      const onClick = vi.fn()
      render(
        <Table aria-label="t">
          <TableHeader>
            <TableRow>
              <TableHead onSort={onSort}>
                <TableHeadSort onClick={onClick}>Name</TableHeadSort>
              </TableHead>
            </TableRow>
          </TableHeader>
        </Table>,
      )
      expect(screen.getAllByRole('button')).toHaveLength(1)
      await userEvent.click(screen.getByRole('button'))
      expect(onClick).toHaveBeenCalledTimes(1)
      expect(onSort).not.toHaveBeenCalled()
    })

    it('renders a custom icon', () => {
      const ref = createRef<HTMLSpanElement>()
      render(
        <Table aria-label="t">
          <TableHeader>
            <TableRow>
              <TableHead>
                <TableHeadSort>
                  Name
                  <TableHeadSortIcon ref={ref} style={{ opacity: 0.5 }}>
                    <b>v</b>
                  </TableHeadSortIcon>
                </TableHeadSort>
              </TableHead>
            </TableRow>
          </TableHeader>
        </Table>,
      )
      expect(ref.current).toHaveAttribute('aria-hidden', 'true')
      expect(ref.current).toHaveStyle({ opacity: 0.5 })
      expect(ref.current).toContainHTML('<b>v</b>')
    })

    it('renders the default sort button with the icon from the same parts', () => {
      render(
        <Table aria-label="t">
          <TableHeader>
            <TableRow>
              <TableHead onSort={() => undefined}>Name</TableHead>
            </TableRow>
          </TableHeader>
        </Table>,
      )
      const button = screen.getByRole('button', { name: 'Name' })
      expect(button).toHaveAttribute('data-plume-table-sort')
      expect(button.querySelector('[data-plume-table-sort-icon] svg')).not.toBeNull()
    })
  })

  describe('TableEmptyCell', () => {
    it('is rendered by TableEmpty, and the row takes className, style and ref', () => {
      const ref = createRef<HTMLTableRowElement>()
      render(
        <Table aria-label="t">
          <TableBody>
            <TableEmpty className="row" colSpan={4} ref={ref} style={{ opacity: 0.5 }}>
              Nobody here
            </TableEmpty>
          </TableBody>
        </Table>,
      )
      const cell = screen.getByRole('cell')
      expect(cell).toHaveAttribute('colspan', '4')
      expect(cell).toHaveAttribute('data-plume-table-empty-cell')
      expect(ref.current).toBe(cell.parentElement)
      expect(ref.current).toHaveClass('row')
      expect(ref.current).toHaveStyle({ opacity: 0.5 })
    })

    it('renders the composition of the user', () => {
      const ref = createRef<HTMLTableCellElement>()
      render(
        <Table aria-label="t">
          <TableBody>
            <TableEmpty>
              <TableEmptyCell className="cell" colSpan={2} ref={ref} style={{ padding: 4 }}>
                Nothing yet
              </TableEmptyCell>
            </TableEmpty>
          </TableBody>
        </Table>,
      )
      const cell = screen.getByRole('cell', { name: 'Nothing yet' })
      expect(ref.current).toBe(cell)
      expect(cell).toHaveClass('cell')
      expect(cell).toHaveAttribute('colspan', '2')
      expect(screen.queryByRole('status')).toBeNull()
    })

    it('spans a hundred columns by default', () => {
      render(
        <Table aria-label="t">
          <TableBody>
            <TableEmpty>
              <TableEmptyCell>Empty</TableEmptyCell>
            </TableEmpty>
          </TableBody>
        </Table>,
      )
      expect(screen.getByRole('cell')).toHaveAttribute('colspan', '100')
    })
  })
})
