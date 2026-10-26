'use client'

import type { ForwardedRef, MouseEventHandler, ReactNode, ThHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { hasPart } from '../../../overlay/has-part'
import type { ComponentProps } from '../../../theme'
import { TableHeadSort } from './table-head-sort'
import { TableHeadSortIcon } from './table-head-sort-icon'

export type TableSortDirection = 'ascending' | 'descending' | 'none'

export interface TableHeadOwnProps {
  /** The alignment of the text of the cell. */
  align?: 'start' | 'center' | 'end'
  /**
   * Makes the head sortable: its content becomes a `TableHeadSort` button that calls this on
   * click.
   */
  onSort?: MouseEventHandler<HTMLButtonElement>
  /**
   * The sort direction of the column, which sets `aria-sort` and turns the icon.
   * @default 'none'
   */
  sort?: TableSortDirection
}

type TableHeadRootAttributes = Pick<
  ThHTMLAttributes<HTMLTableCellElement>,
  'abbr' | 'children' | 'colSpan' | 'headers' | 'hidden' | 'id' | 'rowSpan' | 'scope' | 'title'
>

export type TableHeadProps = Omit<ComponentProps, 'index'> &
  TableHeadRootAttributes &
  TableHeadOwnProps

const HEAD_PARTS = [TableHeadSort, TableHeadSortIcon]

/**
 * A `<th>`. With `onSort` its content is a `TableHeadSort` with a `TableHeadSortIcon`; with a
 * `TableHeadSort` as child it renders it as written.
 */
export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  (
    { align, children, className, onSort, scope = 'col', sort, style, ...rest }: TableHeadProps,
    ref: ForwardedRef<HTMLTableCellElement>,
  ): ReactNode => (
    <th
      aria-sort={sort}
      className={className}
      data-align={align}
      data-plume-table-head=""
      data-sort={sort}
      ref={ref}
      scope={scope}
      style={style}
      {...rest}
    >
      {onSort && !hasPart(children, HEAD_PARTS) ? (
        <TableHeadSort onClick={onSort}>
          {children}
          <TableHeadSortIcon />
        </TableHeadSort>
      ) : (
        children
      )}
    </th>
  ),
)

TableHead.displayName = 'TableHead'
