import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'

export interface TableCaptionOwnProps {
  /**
   * Whether the caption is above or below the table.
   * @default 'top'
   */
  side?: 'top' | 'bottom'
}

type TableCaptionRootAttributes = Pick<HTMLAttributes<HTMLElement>, 'children' | 'id' | 'title'>

export type TableCaptionProps = Omit<ComponentProps, 'index'> &
  TableCaptionRootAttributes &
  TableCaptionOwnProps

/** The name of the table. */
export const TableCaption = forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  (
    { children, className, side = 'top', style, ...rest }: TableCaptionProps,
    ref: ForwardedRef<HTMLTableCaptionElement>,
  ): ReactNode => (
    <caption
      className={className}
      data-plume-table-caption=""
      data-side={side}
      ref={ref}
      style={style}
      {...rest}
    >
      {children}
    </caption>
  ),
)

TableCaption.displayName = 'TableCaption'
