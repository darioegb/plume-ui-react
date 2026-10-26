import type { ForwardedRef, HTMLAttributes } from 'react'
import { createElement, forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'

export interface AlertTitleOwnProps {
  /**
   * Element of the title. Use a heading when it belongs in the outline of the page.
   *
   * @default 'div'
   */
  as?: 'div' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

type AlertTitleRootAttributes = Pick<HTMLAttributes<HTMLElement>, 'children' | 'id'>

export type AlertTitleProps = Omit<ComponentProps, 'index'> &
  AlertTitleRootAttributes &
  AlertTitleOwnProps

/** The title, in bold. Use a heading when it belongs in the outline of the page. */
export const AlertTitle = forwardRef<HTMLElement, AlertTitleProps>(
  (
    { as = 'div', children, className, style, ...rest }: AlertTitleProps,
    ref: ForwardedRef<HTMLElement>,
  ) =>
    createElement(as, { className, 'data-plume-alert-title': '', ref, style, ...rest }, children),
)

AlertTitle.displayName = 'AlertTitle'
