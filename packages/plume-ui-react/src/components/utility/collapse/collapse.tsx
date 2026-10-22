import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import styles from './collapse.module.css'

export interface CollapseOwnProps {
  bodyClassName?: string
  open?: boolean
}

type CollapseRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'aria-label' | 'aria-labelledby' | 'children' | 'hidden' | 'id' | 'role' | 'title'
>

export type CollapseProps = Omit<ComponentProps, 'index'> &
  CollapseRootAttributes &
  CollapseOwnProps

export const Collapse = forwardRef<HTMLDivElement, CollapseProps>(
  (
    { bodyClassName, children, className, open = false, style, ...rest }: CollapseProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => (
    <div
      className={joinClasses(styles.collapse, className)}
      data-open={open ? '' : undefined}
      data-plume-collapse=""
      ref={ref}
      style={style}
      {...rest}
    >
      <div data-plume-collapse-clip="">
        <div className={bodyClassName}>{children}</div>
      </div>
    </div>
  ),
)

Collapse.displayName = 'Collapse'
