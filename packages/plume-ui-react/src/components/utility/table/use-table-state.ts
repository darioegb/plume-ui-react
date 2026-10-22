'use client'

import { useCallback, useMemo, useState } from 'react'
import type { TableHeadProps } from './table-head'
import type { TableFilterFn, TableFilters, TableSort, TableValueGetter } from './table-state'
import { filterRows, isEmptyFilter, nextSort, sortRows } from './table-state'

export interface TableParams {
  filters: TableFilters
  page: number
  pageSize: number
  sort: TableSort | null
}

export interface UseTableStateOptions<Row> {
  defaultFilters?: TableFilters
  defaultPage?: number
  defaultPageSize?: number
  defaultSort?: TableSort | null
  filterFns?: Record<string, TableFilterFn<Row>>
  getRowId?: (row: Row) => string
  getValue?: TableValueGetter<Row>
  manual?: boolean
  rows?: readonly Row[]
  sortFns?: Record<string, (first: Row, second: Row) => number>
  total?: number
}

export interface UseTableStateResult<Row> {
  allSelected: boolean
  clearSelection: () => void
  filters: TableFilters
  getSortProps: (column: string) => Pick<TableHeadProps, 'onSort' | 'sort'>
  hasFilters: boolean
  isSelected: (row: Row) => boolean
  page: number
  pageCount: number
  pageSize: number
  params: TableParams
  resetFilters: () => void
  rows: Row[]
  selected: string[]
  setFilter: (column: string, value: unknown) => void
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  setSort: (sort: TableSort | null) => void
  someSelected: boolean
  sort: TableSort | null
  toggleAll: () => void
  toggleRow: (row: Row) => void
  toggleSort: (column: string) => void
  total: number
}

const NO_RESULTS: never[] = []
const NO_FUNCTIONS = {}

const defaultGetValue = <Row>(row: Row, column: string): unknown =>
  (row as Record<string, unknown>)[column]

const defaultGetRowId = <Row>(row: Row): string => String((row as { id?: unknown }).id)

export function useTableState<Row>({
  defaultFilters,
  defaultPage = 1,
  defaultPageSize = 10,
  defaultSort = null,
  filterFns = NO_FUNCTIONS,
  getRowId = defaultGetRowId,
  getValue = defaultGetValue,
  manual = false,
  rows = NO_RESULTS,
  sortFns = NO_FUNCTIONS,
  total: manualTotal,
}: UseTableStateOptions<Row> = {}): UseTableStateResult<Row> {
  const [filters, setFilters] = useState<TableFilters>(defaultFilters ?? NO_FUNCTIONS)
  const [requestedPage, setRequestedPage] = useState(defaultPage)
  const [currentPageSize, setCurrentPageSize] = useState(defaultPageSize)
  const pageSize = currentPageSize
  const [currentSort, setCurrentSort] = useState<TableSort | null>(defaultSort)
  const sort = currentSort
  const [selected, setSelected] = useState<string[]>([])

  const processed = useMemo(
    () =>
      manual
        ? rows
        : sortRows(filterRows(rows, filters, getValue, filterFns), sort, getValue, sortFns),
    [filterFns, filters, getValue, manual, rows, sort, sortFns],
  )
  const total = manual ? (manualTotal ?? rows.length) : processed.length
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const page = Math.min(Math.max(1, requestedPage), pageCount)
  const pageRows = useMemo(
    () => (manual ? [...rows] : processed.slice((page - 1) * pageSize, page * pageSize)),
    [manual, page, pageSize, processed, rows],
  )

  const setPage = useCallback((next: number) => setRequestedPage(Math.max(1, next)), [])
  const setPageSize = useCallback((next: number) => {
    setCurrentPageSize(Math.max(1, next))
    setRequestedPage(1)
  }, [])
  const setSort = useCallback((next: TableSort | null) => {
    setCurrentSort(next)
    setRequestedPage(1)
  }, [])
  const toggleSort = useCallback(
    (column: string) => {
      setSort(nextSort(sort, column))
    },
    [setSort, sort],
  )
  const getSortProps = useCallback(
    (column: string): Pick<TableHeadProps, 'onSort' | 'sort'> => ({
      onSort: () => toggleSort(column),
      sort: sort?.column === column ? sort.direction : 'none',
    }),
    [sort, toggleSort],
  )

  const setFilter = useCallback((column: string, value: unknown) => {
    setFilters((current) => ({ ...current, [column]: value }))
    setRequestedPage(1)
  }, [])
  const resetFilters = useCallback(() => {
    setFilters(defaultFilters ?? NO_FUNCTIONS)
    setRequestedPage(1)
  }, [defaultFilters])
  const hasFilters = useMemo(
    () => Object.values(filters).some((value) => !isEmptyFilter(value)),
    [filters],
  )

  const pageIds = useMemo(() => pageRows.map(getRowId), [getRowId, pageRows])
  const selectedOnPage = pageIds.filter((id) => selected.includes(id)).length
  const allSelected = pageIds.length > 0 && selectedOnPage === pageIds.length
  const isSelected = useCallback(
    (row: Row) => selected.includes(getRowId(row)),
    [getRowId, selected],
  )
  const toggleRow = useCallback(
    (row: Row) => {
      const id = getRowId(row)
      setSelected((current) =>
        current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
      )
    },
    [getRowId],
  )
  const toggleAll = useCallback(() => {
    setSelected((current) =>
      allSelected
        ? current.filter((id) => !pageIds.includes(id))
        : [...current, ...pageIds.filter((id) => !current.includes(id))],
    )
  }, [allSelected, pageIds])
  const clearSelection = useCallback(() => setSelected([]), [])

  const params = useMemo(() => ({ filters, page, pageSize, sort }), [filters, page, pageSize, sort])

  return {
    allSelected,
    clearSelection,
    filters,
    getSortProps,
    hasFilters,
    isSelected,
    page,
    pageCount,
    pageSize,
    params,
    resetFilters,
    rows: pageRows,
    selected,
    setFilter,
    setPage,
    setPageSize,
    setSort,
    someSelected: selectedOnPage > 0 && !allSelected,
    sort,
    toggleAll,
    toggleRow,
    toggleSort,
    total,
  }
}
