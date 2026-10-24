'use client'

import type { ForwardedRef, MouseEventHandler, ReactNode, ThHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { hasPart } from '../../../overlay/has-part'
import type { ComponentProps } from '../../../theme'
import { TableHeadSort } from './table-head-sort'
import { TableHeadSortIcon } from './table-head-sort-icon'

export type TableSortDirection = 'ascending' | 'descending' | 'none'

export interface TableHeadOwnProps {
  align?: 'start' | 'center' | 'end'
  onSort?: MouseEventHandler<HTMLButtonElement>
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
