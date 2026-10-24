import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { PaginatorEdge, type PaginatorEdgeProps } from './paginator-edge'

export type PaginatorNextProps = PaginatorEdgeProps

export const PaginatorNext = forwardRef<HTMLButtonElement, PaginatorNextProps>(
  (props: PaginatorNextProps, ref: ForwardedRef<HTMLButtonElement>): ReactNode => (
    <PaginatorEdge
      {...props}
      data-plume-paginator-next=""
      edge="next"
      part="PaginatorNext"
      ref={ref}
    />
  ),
)

PaginatorNext.displayName = 'PaginatorNext'
