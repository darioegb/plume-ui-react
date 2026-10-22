import type { TableSortDirection } from './table-head'

export type TableFilters = Record<string, unknown>

export interface TableSort {
  column: string
  direction: Exclude<TableSortDirection, 'none'>
}

export type TableFilterFn<Row> = (row: Row, value: unknown) => boolean

export type TableValueGetter<Row> = (row: Row, column: string) => unknown

export const isEmptyFilter = (value: unknown): boolean =>
  value === undefined ||
  value === null ||
  value === '' ||
  (Array.isArray(value) && value.length === 0)

const isNil = (value: unknown): value is null | undefined => value === null || value === undefined

export function compareValues(first: unknown, second: unknown): number {
  if (typeof first === 'number' && typeof second === 'number') return first - second
  if (first instanceof Date && second instanceof Date) return first.getTime() - second.getTime()
  return String(first).localeCompare(String(second), undefined, {
    numeric: true,
    sensitivity: 'base',
  })
}

const cellText = (cell: unknown): string => {
  if (typeof cell === 'string') return cell
  if (typeof cell === 'number' || typeof cell === 'boolean' || typeof cell === 'bigint') {
    return String(cell)
  }
  return ''
}

export function matchesFilter(cell: unknown, value: unknown): boolean {
  if (Array.isArray(value)) return value.includes(cell)
  if (typeof value === 'string')
    return cellText(cell).toLowerCase().includes(value.trim().toLowerCase())
  return cell === value
}

export function filterRows<Row>(
  rows: readonly Row[],
  filters: TableFilters,
  getValue: TableValueGetter<Row>,
  filterFns: Readonly<Record<string, TableFilterFn<Row>>>,
): Row[] {
  const active = Object.entries(filters).filter(([, value]) => !isEmptyFilter(value))
  if (active.length === 0) return [...rows]
  return rows.filter((row) =>
    active.every(([column, value]) => {
      const filter = filterFns[column]
      return filter ? filter(row, value) : matchesFilter(getValue(row, column), value)
    }),
  )
}

export function sortRows<Row>(
  rows: readonly Row[],
  sort: TableSort | null,
  getValue: TableValueGetter<Row>,
  sortFns: Readonly<Record<string, (first: Row, second: Row) => number>>,
): Row[] {
  if (!sort) return [...rows]
  const { column, direction } = sort
  const factor = direction === 'ascending' ? 1 : -1
  const custom = sortFns[column]
  return [...rows].sort((first, second) => {
    if (custom) return factor * custom(first, second)
    const firstValue = getValue(first, column)
    const secondValue = getValue(second, column)
    if (isNil(firstValue) || isNil(secondValue)) {
      return Number(isNil(firstValue)) - Number(isNil(secondValue))
    }
    return factor * compareValues(firstValue, secondValue)
  })
}

export function nextSort(current: TableSort | null, column: string): TableSort | null {
  if (current?.column !== column) return { column, direction: 'ascending' }
  return current.direction === 'ascending' ? { column, direction: 'descending' } : null
}
