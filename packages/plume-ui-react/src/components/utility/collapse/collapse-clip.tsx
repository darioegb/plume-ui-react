import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'

type CollapseClipRootAttributes = Pick<HTMLAttributes<HTMLDivElement>, 'children' | 'title'>

export type CollapseClipProps = Omit<ComponentProps, 'index'> & CollapseClipRootAttributes

/**
 * The element that clips the content while the height animates. Without it, the Collapse wraps
 * its content in one.
 */
export const CollapseClip = forwardRef<HTMLDivElement, CollapseClipProps>(
  (
    { children, className, style, ...rest }: CollapseClipProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => (
    <div className={className} data-plume-collapse-clip="" ref={ref} style={style} {...rest}>
      {children}
    </div>
  ),
)

CollapseClip.displayName = 'CollapseClip'
