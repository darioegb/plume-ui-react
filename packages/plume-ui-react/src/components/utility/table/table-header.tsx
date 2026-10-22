import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'

type TableHeaderRootAttributes = Pick<
  HTMLAttributes<HTMLTableSectionElement>,
  'children' | 'hidden' | 'id' | 'title'
>

export type TableHeaderProps = Omit<ComponentProps, 'index'> & TableHeaderRootAttributes

export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  (
    { children, className, style, ...rest }: TableHeaderProps,
    ref: ForwardedRef<HTMLTableSectionElement>,
  ): ReactNode => (
    <thead className={className} data-plume-table-header="" ref={ref} style={style} {...rest}>
      {children}
    </thead>
  ),
)

TableHeader.displayName = 'TableHeader'
