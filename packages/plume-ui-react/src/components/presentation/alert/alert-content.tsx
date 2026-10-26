'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'
import { useAlertContext } from './alert-context'

type AlertContentRootAttributes = Pick<HTMLAttributes<HTMLDivElement>, 'children'>

export type AlertContentProps = Omit<ComponentProps, 'index'> & AlertContentRootAttributes

/** The block that holds the title and the description. */
export const AlertContent = forwardRef<HTMLDivElement, AlertContentProps>(
  (
    { children, className, style }: AlertContentProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    useAlertContext('AlertContent')

    return (
      <div className={className} data-plume-alert-content="" ref={ref} style={style}>
        {children}
      </div>
    )
  },
)

AlertContent.displayName = 'AlertContent'
