import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { PaginatorEdge, type PaginatorEdgeProps } from './paginator-edge'

export type PaginatorLastProps = PaginatorEdgeProps

export const PaginatorLast = forwardRef<HTMLButtonElement, PaginatorLastProps>(
  (props: PaginatorLastProps, ref: ForwardedRef<HTMLButtonElement>): ReactNode => (
    <PaginatorEdge
      {...props}
      data-plume-paginator-last=""
      edge="last"
      part="PaginatorLast"
      ref={ref}
    />
  ),
)

PaginatorLast.displayName = 'PaginatorLast'
