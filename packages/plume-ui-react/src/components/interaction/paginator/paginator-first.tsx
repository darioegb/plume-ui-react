import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { PaginatorEdge, type PaginatorEdgeProps } from './paginator-edge'

export type PaginatorFirstProps = PaginatorEdgeProps

/**
 * The button that goes to the first page. It is part of the default list when `showEdges` is set.
 */
export const PaginatorFirst = forwardRef<HTMLButtonElement, PaginatorFirstProps>(
  (props: PaginatorFirstProps, ref: ForwardedRef<HTMLButtonElement>): ReactNode => (
    <PaginatorEdge
      {...props}
      data-plume-paginator-first=""
      edge="first"
      part="PaginatorFirst"
      ref={ref}
    />
  ),
)

PaginatorFirst.displayName = 'PaginatorFirst'
