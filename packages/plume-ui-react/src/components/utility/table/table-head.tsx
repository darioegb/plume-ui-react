'use client'

import type { ForwardedRef, MouseEventHandler, ReactNode, ThHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { ChevronDownIcon } from '../../../overlay/icons'
import type { ComponentProps } from '../../../theme'
import { joinClasses } from '../../../overlay/class-names'

export type TableHeadPart = 'sort'

export type TableSortDirection = 'ascending' | 'descending' | 'none'

export interface TableHeadOwnProps {
  align?: 'start' | 'center' | 'end'
  onSort?: MouseEventHandler<HTMLButtonElement>
  sort?: TableSortDirection
  classNames?: Partial<Record<TableHeadPart, string>>
  /** Alias of `classNames.sort`, kept until the next major. */
  sortClassName?: string
}

type TableHeadRootAttributes = Pick<
  ThHTMLAttributes<HTMLTableCellElement>,
  'abbr' | 'children' | 'colSpan' | 'headers' | 'hidden' | 'id' | 'rowSpan' | 'scope' | 'title'
>

export type TableHeadProps = Omit<ComponentProps, 'index'> &
  TableHeadRootAttributes &
  TableHeadOwnProps

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  (
    {
      align,
      children,
      className,
      onSort,
      scope = 'col',
      sort,
      classNames,
      sortClassName,
      style,
      ...rest
    }: TableHeadProps,
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
      {onSort ? (
        <button
          className={joinClasses(sortClassName, classNames?.sort)}
          data-plume-table-sort=""
          onClick={onSort}
          type="button"
        >
          {children}
          <span aria-hidden="true" data-plume-table-sort-icon="">
            <ChevronDownIcon />
          </span>
        </button>
      ) : (
        children
      )}
    </th>
  ),
)

TableHead.displayName = 'TableHead'
