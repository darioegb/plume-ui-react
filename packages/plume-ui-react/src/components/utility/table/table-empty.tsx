import type { ForwardedRef, ReactNode, TdHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'

export interface TableEmptyOwnProps {
  colSpan?: number
}

type TableEmptyRootAttributes = Pick<
  TdHTMLAttributes<HTMLTableCellElement>,
  'children' | 'hidden' | 'id' | 'title'
>

export type TableEmptyProps = Omit<ComponentProps, 'index'> &
  TableEmptyRootAttributes &
  TableEmptyOwnProps

export const TableEmpty = forwardRef<HTMLTableCellElement, TableEmptyProps>(
  (
    { children, className, colSpan = 100, style, ...rest }: TableEmptyProps,
    ref: ForwardedRef<HTMLTableCellElement>,
  ): ReactNode => (
    <tr data-plume-table-empty="">
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
    </tr>
  ),
)

TableEmpty.displayName = 'TableEmpty'
