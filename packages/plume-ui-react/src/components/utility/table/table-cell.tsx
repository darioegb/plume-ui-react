import type { ForwardedRef, TdHTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'

export interface TableCellOwnProps {
  align?: 'start' | 'center' | 'end'
}

type TableCellRootAttributes = Pick<
  TdHTMLAttributes<HTMLTableCellElement>,
  'children' | 'colSpan' | 'headers' | 'hidden' | 'id' | 'rowSpan' | 'title'
>

export type TableCellProps = Omit<ComponentProps, 'index'> &
  TableCellRootAttributes &
  TableCellOwnProps

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  (
    { align, children, className, style, ...rest }: TableCellProps,
    ref: ForwardedRef<HTMLTableCellElement>,
  ): ReactNode => (
    <td
      className={className}
      data-align={align}
      data-plume-table-cell=""
      ref={ref}
      style={style}
      {...rest}
    >
      {children}
    </td>
  ),
)

TableCell.displayName = 'TableCell'
