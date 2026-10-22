import { act, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableEmpty,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '..'
import type { TableProps } from '..'

function Demo(props: Readonly<Partial<TableProps>>) {
  return (
    <Table aria-label="Users" {...props}>
      <TableCaption>Team members</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead align="end">Age</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Ada</TableCell>
          <TableCell align="end">36</TableCell>
        </TableRow>
        <TableRow selected>
          <TableCell>Grace</TableCell>
          <TableCell align="end">45</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell>2</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

describe('Table component', () => {
  describe('rendering', () => {
    it('renders a semantic table with its caption, header, body and footer', () => {
      render(<Demo />)
      expect(screen.getByRole('table', { name: 'Users' })).toBeInTheDocument()
      expect(screen.getByText('Team members').tagName).toBe('CAPTION')
      expect(screen.getAllByRole('rowgroup')).toHaveLength(3)
      expect(screen.getAllByRole('row')).toHaveLength(4)
      expect(screen.getAllByRole('columnheader')).toHaveLength(2)
      expect(screen.getAllByRole('cell')).toHaveLength(6)
    })

    it('uses the caption as the name of the table', () => {
      render(
        <Table>
          <TableCaption>Prices</TableCaption>
          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      )
      expect(screen.getByRole('table', { name: 'Prices' })).toBeInTheDocument()
    })

    it('gives the heads a column scope, and lets it be a row scope', () => {
      render(
        <Table aria-label="t">
          <TableBody>
            <TableRow>
              <TableHead scope="row">Row</TableHead>
              <TableHead>Col</TableHead>
            </TableRow>
          </TableBody>
        </Table>,
      )
      expect(screen.getByText('Row')).toHaveAttribute('scope', 'row')
      expect(screen.getByText('Col')).toHaveAttribute('scope', 'col')
    })

    it('marks a selected row', () => {
      render(<Demo />)
      const row = screen.getByText('Grace').closest('tr')
      expect(row).toHaveAttribute('aria-selected', 'true')
      expect(row).toHaveAttribute('data-selected')
      expect(screen.getByText('Ada').closest('tr')).not.toHaveAttribute('aria-selected')
    })

    it('aligns the cells and the heads', () => {
      render(<Demo />)
      expect(screen.getByText('36')).toHaveAttribute('data-align', 'end')
      expect(screen.getByText('Age')).toHaveAttribute('data-align', 'end')
      expect(screen.getByText('Ada')).not.toHaveAttribute('data-align')
    })

    it('passes the span and header attributes of the cells', () => {
      render(
        <Table aria-label="t">
          <TableBody>
            <TableRow>
              <TableHead abbr="N" colSpan={2} id="h">
                Name
              </TableHead>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2} headers="h" rowSpan={1}>
                Cell
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      )
      expect(screen.getByText('Name')).toHaveAttribute('colspan', '2')
      expect(screen.getByText('Cell')).toHaveAttribute('headers', 'h')
    })

    it('places the caption at the bottom', () => {
      render(
        <Table aria-label="t">
          <TableCaption side="bottom">Notes</TableCaption>
        </Table>,
      )
      expect(screen.getByText('Notes')).toHaveAttribute('data-side', 'bottom')
    })

    it('forwards the refs', () => {
      const table = createRef<HTMLTableElement>()
      const header = createRef<HTMLTableSectionElement>()
      const body = createRef<HTMLTableSectionElement>()
      const footer = createRef<HTMLTableSectionElement>()
      const row = createRef<HTMLTableRowElement>()
      const head = createRef<HTMLTableCellElement>()
      const cell = createRef<HTMLTableCellElement>()
      const caption = createRef<HTMLTableCaptionElement>()
      render(
        <Table aria-label="t" ref={table}>
          <TableCaption ref={caption}>c</TableCaption>
          <TableHeader ref={header}>
            <TableRow ref={row}>
              <TableHead ref={head}>h</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody ref={body}>
            <TableRow>
              <TableCell ref={cell}>d</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter ref={footer} />
        </Table>,
      )
      expect(table.current).toBe(screen.getByRole('table'))
      expect(header.current?.tagName).toBe('THEAD')
      expect(body.current?.tagName).toBe('TBODY')
      expect(footer.current?.tagName).toBe('TFOOT')
      expect(row.current?.tagName).toBe('TR')
      expect(head.current?.tagName).toBe('TH')
      expect(cell.current?.tagName).toBe('TD')
      expect(caption.current?.tagName).toBe('CAPTION')
    })
  })

  describe('sorting', () => {
    it('shows the sort direction with aria-sort', () => {
      render(
        <Table aria-label="t">
          <TableHeader>
            <TableRow>
              <TableHead onSort={() => undefined} sort="ascending">
                A
              </TableHead>
              <TableHead onSort={() => undefined} sort="descending">
                B
              </TableHead>
              <TableHead onSort={() => undefined} sort="none">
                C
              </TableHead>
            </TableRow>
          </TableHeader>
        </Table>,
      )
      const sorts = screen.getAllByRole('columnheader').map((th) => th.getAttribute('aria-sort'))
      expect(sorts).toEqual(['ascending', 'descending', 'none'])
    })

    it('renders a button that calls onSort', async () => {
      const onSort = vi.fn()
      render(
        <Table aria-label="t">
          <TableHeader>
            <TableRow>
              <TableHead onSort={onSort} sort="none" sortClassName="mine">
                Name
              </TableHead>
            </TableRow>
          </TableHeader>
        </Table>,
      )
      const button = screen.getByRole('button', { name: 'Name' })
      expect(button).toHaveClass('mine')
      await userEvent.click(button)
      expect(onSort).toHaveBeenCalledTimes(1)
    })

    it('renders plain text when it is not sortable', () => {
      render(
        <Table aria-label="t">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
            </TableRow>
          </TableHeader>
        </Table>,
      )
      expect(screen.queryByRole('button')).toBeNull()
      expect(screen.getByRole('columnheader')).not.toHaveAttribute('aria-sort')
    })
  })

  describe('appearance', () => {
    it('applies the base, variant and size classes', () => {
      render(<Demo size="lg" variant="striped" />)
      expect(screen.getByRole('table')).toHaveClass('table', 'striped', 'lg')
    })

    it('defaults to a plain, medium table', () => {
      render(<Demo />)
      expect(screen.getByRole('table')).toHaveClass('table', 'plain', 'md')
    })

    it('applies the bordered variant', () => {
      render(<Demo variant="bordered" />)
      expect(screen.getByRole('table')).toHaveClass('bordered')
    })

    it('exposes the hoverable and sticky states', () => {
      const { rerender } = render(<Demo />)
      expect(screen.getByRole('table')).not.toHaveAttribute('data-hoverable')
      expect(screen.getByRole('table')).not.toHaveAttribute('data-sticky')
      rerender(<Demo hoverable stickyHeader />)
      expect(screen.getByRole('table')).toHaveAttribute('data-hoverable')
      expect(screen.getByRole('table')).toHaveAttribute('data-sticky')
    })

    it('limits the height of the container', () => {
      const { container } = render(<Demo maxHeight="10rem" />)
      expect((container.firstChild as HTMLElement).getAttribute('style')).toContain(
        'max-height: 10rem',
      )
    })

    it('lets style override on the table', () => {
      render(<Demo style={{ width: '50%' }} />)
      expect(screen.getByRole('table')).toHaveStyle({ width: '50%' })
    })

    it('drops the Plume classes when it is unstyled and keeps the user classes', () => {
      const { container } = render(
        <Demo className="root" containerClassName="box" variant="unstyled" />,
      )
      expect(screen.getByRole('table')).toHaveAttribute('class', 'root')
      expect(container.firstChild).toHaveAttribute('class', 'box')
    })

    it('styles the container', () => {
      const { container } = render(<Demo containerClassName="box" />)
      expect(container.firstChild).toHaveClass('container', 'box')
    })
  })

  describe('overflow', () => {
    let observe: (() => void) | undefined
    let width = 100

    beforeEach(() => {
      observe = undefined
      width = 100
      vi.stubGlobal(
        'ResizeObserver',
        class {
          constructor(callback: () => void) {
            observe = callback
          }
          observe = vi.fn()
          disconnect = vi.fn()
        },
      )
      vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockImplementation(() => width)
      vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(100)
    })

    afterEach(() => {
      vi.unstubAllGlobals()
      vi.restoreAllMocks()
    })

    it('is not a tab stop while everything fits', () => {
      const { container } = render(<Demo />)
      expect(container.firstChild).not.toHaveAttribute('tabindex')
    })

    it('becomes a focusable, named region when the table does not fit', () => {
      width = 300
      const { container } = render(<Demo />)
      expect(container.firstChild).toHaveAttribute('tabindex', '0')
      expect(screen.getByRole('region', { name: 'Users' })).toBe(container.firstChild)
    })

    it('can be named by another element', () => {
      width = 300
      render(
        <>
          <h2 id="title">People</h2>
          <Demo aria-label={undefined} aria-labelledby="title" />
        </>,
      )
      expect(screen.getByRole('region', { name: 'People' })).toBeInTheDocument()
    })

    it('follows the size of the container', () => {
      const { container } = render(<Demo />)
      expect(container.firstChild).not.toHaveAttribute('tabindex')
      width = 300
      act(() => observe?.())
      expect(container.firstChild).toHaveAttribute('tabindex', '0')
      width = 100
      act(() => observe?.())
      expect(container.firstChild).not.toHaveAttribute('tabindex')
    })
  })

  describe('loading', () => {
    it('is not busy by default', () => {
      render(<Demo />)
      expect(screen.getByRole('table')).not.toHaveAttribute('aria-busy')
      expect(screen.getByRole('table')).not.toHaveAttribute('data-loading')
    })

    it('marks the table as busy', () => {
      render(<Demo loading />)
      expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true')
      expect(screen.getByRole('table')).toHaveAttribute('data-loading')
    })
  })

  describe('TableEmpty', () => {
    it('renders a row with one cell as wide as asked', () => {
      const ref = createRef<HTMLTableCellElement>()
      render(
        <Table aria-label="Empty">
          <TableBody>
            <TableEmpty className="custom" colSpan={3} ref={ref}>
              Nobody here
            </TableEmpty>
          </TableBody>
        </Table>,
      )
      const cell = screen.getByRole('cell', { name: 'Nobody here' })
      expect(cell).toHaveAttribute('colspan', '3')
      expect(cell).toHaveClass('custom')
      expect(ref.current).toBe(cell)
    })

    it('shows an icon, a description and an action', () => {
      render(
        <Table aria-label="Empty">
          <TableBody>
            <TableEmpty
              action={<button type="button">Clear filters</button>}
              description="Try other filters."
              icon={<svg data-testid="icon" />}
              title="No results"
            />
          </TableBody>
        </Table>,
      )
      expect(screen.getByText('No results')).toBeInTheDocument()
      expect(screen.getByText('Try other filters.')).toBeInTheDocument()
      expect(screen.getByTestId('icon')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Clear filters' })).toBeInTheDocument()
    })

    it('announces its message as a status', () => {
      render(
        <Table aria-label="Empty">
          <TableBody>
            <TableEmpty>Nobody here</TableEmpty>
          </TableBody>
        </Table>,
      )
      expect(screen.getByRole('status')).toHaveTextContent('Nobody here')
    })

    it('spans every column by default', () => {
      render(
        <Table aria-label="Empty">
          <TableBody>
            <TableEmpty>Nobody here</TableEmpty>
          </TableBody>
        </Table>,
      )
      expect(screen.getByRole('cell')).toHaveAttribute('colspan', '100')
    })
  })

  describe('without ResizeObserver', () => {
    it('still renders', () => {
      vi.stubGlobal('ResizeObserver', undefined)
      render(<Demo />)
      expect(screen.getByRole('table')).toBeInTheDocument()
      vi.unstubAllGlobals()
    })
  })
})
