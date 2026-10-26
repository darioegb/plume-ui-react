import type { ButtonHTMLAttributes, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'

type TableHeadSortRootAttributes = Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-label' | 'children' | 'id' | 'onClick' | 'title'
>

export type TableHeadSortProps = Omit<ComponentProps, 'index'> & TableHeadSortRootAttributes

/** The button of a sortable head. */
export const TableHeadSort = forwardRef<HTMLButtonElement, TableHeadSortProps>(
  (
    { children, className, style, ...rest }: TableHeadSortProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => (
    <button
      className={className}
      data-plume-table-sort=""
      ref={ref}
      style={style}
      type="button"
      {...rest}
    >
      {children}
    </button>
  ),
)

TableHeadSort.displayName = 'TableHeadSort'
