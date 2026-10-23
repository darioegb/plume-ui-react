import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'

type AlertDescriptionRootAttributes = Pick<HTMLAttributes<HTMLDivElement>, 'children' | 'id'>

export type AlertDescriptionProps = Omit<ComponentProps, 'index'> & AlertDescriptionRootAttributes

export const AlertDescription = forwardRef<HTMLDivElement, AlertDescriptionProps>(
  (
    { children, className, style, ...rest }: AlertDescriptionProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => (
    <div className={className} data-plume-alert-description="" ref={ref} style={style} {...rest}>
      {children}
    </div>
  ),
)

AlertDescription.displayName = 'AlertDescription'
