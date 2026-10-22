import { act, renderHook } from '@testing-library/react'
import { useTableState } from '..'
import type { UseTableStateOptions } from '..'

interface Person {
  age: number
  id: string
  name: string
  role: string
}

const people: Person[] = Array.from({ length: 25 }, (_, index) => ({
  age: 20 + index,
  id: `p${index + 1}`,
  name: `Person ${String(index + 1).padStart(2, '0')}`,
  role: index % 5 === 0 ? 'admin' : 'viewer',
}))

const setup = (options: UseTableStateOptions<Person> = {}) =>
  renderHook((props: UseTableStateOptions<Person>) => useTableState<Person>(props), {
    initialProps: { rows: people, ...options },
  })

describe('useTableState (client)', () => {
  it('returns the first page and the totals', () => {
    const { result } = setup()
    expect(result.current.rows).toHaveLength(10)
    expect(result.current.rows[0].id).toBe('p1')
    expect(result.current.total).toBe(25)
    expect(result.current.pageCount).toBe(3)
    expect(result.current.page).toBe(1)
  })

  it('changes the page and keeps it inside the range', () => {
    const { result } = setup()
    act(() => result.current.setPage(3))
    expect(result.current.rows).toHaveLength(5)
    act(() => result.current.setPage(99))
    expect(result.current.page).toBe(3)
    act(() => result.current.setPage(-4))
    expect(result.current.page).toBe(1)
  })

  it('starts on the page and the size it is given', () => {
    const { result } = setup({ defaultPage: 2, defaultPageSize: 5 })
    expect(result.current.rows[0].id).toBe('p6')
    expect(result.current.pageCount).toBe(5)
  })

  it('goes back to the first page when the page size changes', () => {
    const { result } = setup()
    act(() => result.current.setPage(3))
    act(() => result.current.setPageSize(20))
    expect(result.current.page).toBe(1)
    expect(result.current.rows).toHaveLength(20)
    act(() => result.current.setPageSize(0))
    expect(result.current.pageSize).toBe(1)
  })

  it('filters, resets the page and exposes whether a filter is active', () => {
    const { result } = setup()
    act(() => result.current.setPage(2))
    act(() => result.current.setFilter('role', ['admin']))
    expect(result.current.page).toBe(1)
    expect(result.current.total).toBe(5)
    expect(result.current.hasFilters).toBe(true)
    act(() => result.current.resetFilters())
    expect(result.current.total).toBe(25)
    expect(result.current.hasFilters).toBe(false)
  })

  it('goes back to the default filters on reset', () => {
    const defaultFilters = { role: ['admin'] }
    const { result } = setup({ defaultFilters })
    expect(result.current.total).toBe(5)
    act(() => result.current.setFilter('role', []))
    expect(result.current.total).toBe(25)
    act(() => result.current.resetFilters())
    expect(result.current.total).toBe(5)
  })

  it('cycles the sort of a column and gives props for TableHead', () => {
    const { result } = setup()
    expect(result.current.getSortProps('name').sort).toBe('none')
    act(() => result.current.getSortProps('name').onSort?.({} as never))
    expect(result.current.getSortProps('name').sort).toBe('ascending')
    expect(result.current.getSortProps('age').sort).toBe('none')
    act(() => result.current.toggleSort('name'))
    expect(result.current.getSortProps('name').sort).toBe('descending')
    expect(result.current.rows[0].id).toBe('p25')
    act(() => result.current.toggleSort('name'))
    expect(result.current.sort).toBeNull()
    expect(result.current.rows[0].id).toBe('p1')
  })

  it('sets the sort directly', () => {
    const { result } = setup()
    act(() => result.current.setSort({ column: 'age', direction: 'descending' }))
    expect(result.current.rows[0].id).toBe('p25')
  })

  it('selects rows and the page, and keeps the selection when the page changes', () => {
    const { result } = setup()
    act(() => result.current.toggleRow(people[0]))
    expect(result.current.isSelected(people[0])).toBe(true)
    expect(result.current.someSelected).toBe(true)
    expect(result.current.allSelected).toBe(false)
    act(() => result.current.toggleAll())
    expect(result.current.allSelected).toBe(true)
    expect(result.current.selected).toHaveLength(10)
    act(() => result.current.setPage(2))
    expect(result.current.allSelected).toBe(false)
    expect(result.current.someSelected).toBe(false)
    expect(result.current.selected).toHaveLength(10)
    act(() => result.current.setPage(1))
    act(() => result.current.toggleAll())
    expect(result.current.selected).toHaveLength(0)
    act(() => result.current.toggleRow(people[1]))
    act(() => result.current.toggleRow(people[1]))
    expect(result.current.selected).toHaveLength(0)
  })

  it('clears the selection', () => {
    const { result } = setup()
    act(() => result.current.toggleAll())
    act(() => result.current.clearSelection())
    expect(result.current.selected).toEqual([])
  })

  it('uses getRowId, getValue and the sort and filter functions it is given', () => {
    const { result } = setup({
      filterFns: { adult: (row) => row.age >= 40 },
      getRowId: (row) => row.name,
      getValue: (row, column) => (column === 'label' ? row.name : (row as never)[column]),
      sortFns: { label: (first, second) => second.age - first.age },
    })
    act(() => result.current.setFilter('adult', true))
    expect(result.current.total).toBe(5)
    act(() => result.current.setSort({ column: 'label', direction: 'ascending' }))
    expect(result.current.rows[0].id).toBe('p25')
    act(() => result.current.toggleRow(result.current.rows[0]))
    expect(result.current.selected).toEqual(['Person 25'])
  })

  it('recomputes when the rows change', () => {
    const { rerender, result } = setup()
    rerender({ rows: people.slice(0, 3) })
    expect(result.current.total).toBe(3)
    expect(result.current.pageCount).toBe(1)
  })

  it('works without options', () => {
    const { result } = renderHook(() => useTableState())
    expect(result.current.rows).toEqual([])
    expect(result.current.total).toBe(0)
    expect(result.current.page).toBe(1)
  })
})

describe('useTableState (manual)', () => {
  it('returns the rows it is given as they are and the total of the server', () => {
    const { result } = setup({ manual: true, rows: people.slice(0, 10), total: 95 })
    expect(result.current.rows).toHaveLength(10)
    expect(result.current.total).toBe(95)
    expect(result.current.pageCount).toBe(10)
  })

  it('falls back to the number of rows when there is no total', () => {
    const { result } = setup({ manual: true, rows: people.slice(0, 4) })
    expect(result.current.total).toBe(4)
  })

  it('only reports the params and does not sort or filter', () => {
    const rows = people.slice(0, 10)
    const { result } = setup({ manual: true, rows, total: 95 })
    act(() => result.current.toggleSort('name'))
    act(() => result.current.setFilter('role', ['admin']))
    act(() => result.current.setPage(4))
    expect(result.current.rows.map(({ id }) => id)).toEqual(rows.map(({ id }) => id))
    expect(result.current.params).toEqual({
      filters: { role: ['admin'] },
      page: 4,
      pageSize: 10,
      sort: { column: 'name', direction: 'ascending' },
    })
  })

  it('keeps the same params object while nothing changes', () => {
    const { rerender, result } = setup({ manual: true, rows: [], total: 0 })
    const before = result.current.params
    rerender({ manual: true, rows: [], total: 0 })
    expect(result.current.params).toBe(before)
  })
})
