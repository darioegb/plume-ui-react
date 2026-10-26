'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useAlertContext } from './alert-context'
import styles from './alert.module.css'

type AlertActionRootAttributes = Pick<HTMLAttributes<HTMLDivElement>, 'children'>

export type AlertActionProps = Omit<ComponentProps, 'index'> & AlertActionRootAttributes

/** Where an action, such as a button or a link, goes. */
export const AlertAction = forwardRef<HTMLDivElement, AlertActionProps>(
  (
    { children, className, style }: AlertActionProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { isStyled } = useAlertContext('AlertAction')

    return (
      <div
        className={joinClasses(isStyled && styles.action, className)}
        data-plume-alert-action=""
        ref={ref}
        style={style}
      >
        {children}
      </div>
    )
  },
)

AlertAction.displayName = 'AlertAction'
