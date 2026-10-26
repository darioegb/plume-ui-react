import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { PaginatorEdge, type PaginatorEdgeProps } from './paginator-edge'

export type PaginatorLastProps = PaginatorEdgeProps

/**
 * The button that goes to the last page. It is part of the default list when `showEdges` is set.
 */
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
