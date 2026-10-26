import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'

type TableBodyRootAttributes = Pick<
  HTMLAttributes<HTMLTableSectionElement>,
  'children' | 'hidden' | 'id' | 'title'
>

export type TableBodyProps = Omit<ComponentProps, 'index'> & TableBodyRootAttributes

/** The `<tbody>`. */
export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  (
    { children, className, style, ...rest }: TableBodyProps,
    ref: ForwardedRef<HTMLTableSectionElement>,
  ): ReactNode => (
    <tbody className={className} data-plume-table-body="" ref={ref} style={style} {...rest}>
      {children}
    </tbody>
  ),
)

TableBody.displayName = 'TableBody'
