import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { ChevronDownIcon } from '../../../overlay/icons'
import type { ComponentProps } from '../../../theme'

type TableHeadSortIconRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

export type TableHeadSortIconProps = Omit<ComponentProps, 'index'> & TableHeadSortIconRootAttributes

/** The arrow of a sortable head, which turns with `aria-sort`. `children` replace it. */
export const TableHeadSortIcon = forwardRef<HTMLSpanElement, TableHeadSortIconProps>(
  (
    { children, className, style }: TableHeadSortIconProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => (
    <span
      aria-hidden="true"
      className={className}
      data-plume-table-sort-icon=""
      ref={ref}
      style={style}
    >
      {children ?? <ChevronDownIcon />}
    </span>
  ),
)

TableHeadSortIcon.displayName = 'TableHeadSortIcon'
