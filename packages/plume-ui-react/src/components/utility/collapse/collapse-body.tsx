import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'

type CollapseBodyRootAttributes = Pick<HTMLAttributes<HTMLDivElement>, 'children' | 'title'>

export type CollapseBodyProps = Omit<ComponentProps, 'index'> & CollapseBodyRootAttributes

/**
 * The box that holds the content and takes the variant, the color scheme and the size. Without
 * it, the Collapse wraps its content in one.
 */
export const CollapseBody = forwardRef<HTMLDivElement, CollapseBodyProps>(
  (
    { children, className, style, ...rest }: CollapseBodyProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => (
    <div className={className} data-plume-collapse-body="" ref={ref} style={style} {...rest}>
      {children}
    </div>
  ),
)

CollapseBody.displayName = 'CollapseBody'
