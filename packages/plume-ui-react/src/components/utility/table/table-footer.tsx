import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'

type TableFooterRootAttributes = Pick<
  HTMLAttributes<HTMLTableSectionElement>,
  'children' | 'hidden' | 'id' | 'title'
>

export type TableFooterProps = Omit<ComponentProps, 'index'> & TableFooterRootAttributes

export const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(
  (
    { children, className, style, ...rest }: TableFooterProps,
    ref: ForwardedRef<HTMLTableSectionElement>,
  ): ReactNode => (
    <tfoot className={className} data-plume-table-footer="" ref={ref} style={style} {...rest}>
      {children}
    </tfoot>
  ),
)

TableFooter.displayName = 'TableFooter'
