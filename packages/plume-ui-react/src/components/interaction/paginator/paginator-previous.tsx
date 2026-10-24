import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { PaginatorEdge, type PaginatorEdgeProps } from './paginator-edge'

export type PaginatorPreviousProps = PaginatorEdgeProps

export const PaginatorPrevious = forwardRef<HTMLButtonElement, PaginatorPreviousProps>(
  (props: PaginatorPreviousProps, ref: ForwardedRef<HTMLButtonElement>): ReactNode => (
    <PaginatorEdge
      {...props}
      data-plume-paginator-previous=""
      edge="previous"
      part="PaginatorPrevious"
      ref={ref}
    />
  ),
)

PaginatorPrevious.displayName = 'PaginatorPrevious'
