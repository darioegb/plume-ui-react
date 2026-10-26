import type { ForwardedRef, ReactNode, TdHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'

type TableEmptyCellRootAttributes = Pick<
  TdHTMLAttributes<HTMLTableCellElement>,
  'children' | 'colSpan' | 'hidden' | 'id'
>

export type TableEmptyCellProps = Omit<ComponentProps, 'index'> & TableEmptyCellRootAttributes

/** The `<td>` of a `TableEmpty`, 100 columns wide by default. */
export const TableEmptyCell = forwardRef<HTMLTableCellElement, TableEmptyCellProps>(
  (
    { children, className, colSpan = 100, style, ...rest }: TableEmptyCellProps,
    ref: ForwardedRef<HTMLTableCellElement>,
  ): ReactNode => (
    <td
      className={className}
      colSpan={colSpan}
      data-plume-table-empty-cell=""
      ref={ref}
      style={style}
      {...rest}
    >
      {children}
    </td>
  ),
)

TableEmptyCell.displayName = 'TableEmptyCell'
