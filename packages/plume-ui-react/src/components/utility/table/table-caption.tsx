import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'

export interface TableCaptionOwnProps {
  side?: 'top' | 'bottom'
}

type TableCaptionRootAttributes = Pick<HTMLAttributes<HTMLElement>, 'children' | 'id' | 'title'>

export type TableCaptionProps = Omit<ComponentProps, 'index'> &
  TableCaptionRootAttributes &
  TableCaptionOwnProps

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
