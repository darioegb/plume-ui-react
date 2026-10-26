import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'

export interface TableRowOwnProps {
  /**
   * Marks the row as selected: it sets `aria-selected` and `data-selected`.
   * @default false
   */
  selected?: boolean
}

type TableRowRootAttributes = Pick<
  HTMLAttributes<HTMLTableRowElement>,
  'children' | 'hidden' | 'id' | 'title'
>

export type TableRowProps = Omit<ComponentProps, 'index'> &
  TableRowRootAttributes &
  TableRowOwnProps

/** A `<tr>`. */
export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  (
    { children, className, selected = false, style, ...rest }: TableRowProps,
    ref: ForwardedRef<HTMLTableRowElement>,
  ): ReactNode => (
    <tr
      aria-selected={selected ? true : undefined}
      className={className}
      data-plume-table-row=""
      data-selected={selected ? '' : undefined}
      ref={ref}
      style={style}
      {...rest}
    >
      {children}
    </tr>
  ),
)

TableRow.displayName = 'TableRow'
