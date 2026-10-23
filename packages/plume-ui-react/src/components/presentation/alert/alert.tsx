'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useState } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { CloseIcon } from '../../../overlay/icons'
import { StatusIcon } from '../../../overlay/status-icon'
import type { ComponentProps, Size } from '../../../theme'
import { tagColorVars } from '../shared/tag-vars'
import tag from '../shared/tag.module.css'
import styles from './alert.module.css'

export type AlertStatus = 'error' | 'info' | 'success' | 'warning'

export type AlertVariant = 'outline' | 'solid' | 'subtle' | 'unstyled'

export type AlertPart = 'action' | 'content' | 'dismiss' | 'icon'

export interface AlertOwnProps {
  action?: ReactNode
  classNames?: Partial<Record<AlertPart, string>>
  dismissLabel?: string
  dismissible?: boolean
  icon?: ReactNode | false
  onDismiss?: () => void
  size?: Size
  status?: AlertStatus
  variant?: AlertVariant
}

type AlertRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'aria-label' | 'aria-labelledby' | 'children' | 'hidden' | 'id' | 'role' | 'title'
>

export type AlertProps = Omit<ComponentProps, 'index'> & AlertRootAttributes & AlertOwnProps

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      action,
      children,
      className,
      classNames,
      dismissLabel = 'Dismiss',
      dismissible = false,
      icon,
      onDismiss,
      role,
      size = 'md',
      status = 'info',
      style,
      variant = 'subtle',
      ...rest
    }: AlertProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const [dismissed, setDismissed] = useState(false)
    const isStyled = variant !== 'unstyled'
    const resolvedIcon = icon === undefined ? <StatusIcon status={status} /> : icon

    if (dismissed) return null

    const dismiss = (): void => {
      setDismissed(true)
      onDismiss?.()
    }

    return (
      <div
        className={joinClasses(
          isStyled && styles.alert,
          isStyled && styles[size],
          isStyled && tag[variant],
          className,
        )}
        data-plume-alert=""
        data-status={status}
        ref={ref}
        role={role ?? (status === 'error' ? 'alert' : 'status')}
        style={tagColorVars('alert', status, style)}
        {...rest}
      >
        {resolvedIcon ? (
          <span
            aria-hidden="true"
            className={joinClasses(isStyled && styles.icon, classNames?.icon)}
            data-plume-alert-icon=""
          >
            {resolvedIcon}
          </span>
        ) : null}
        <div
          className={joinClasses(isStyled && styles.content, classNames?.content)}
          data-plume-alert-content=""
        >
          {children}
        </div>
        {action ? (
          <div
            className={joinClasses(isStyled && styles.action, classNames?.action)}
            data-plume-alert-action=""
          >
            {action}
          </div>
        ) : null}
        {dismissible ? (
          <button
            aria-label={dismissLabel}
            className={joinClasses(isStyled && styles.dismiss, classNames?.dismiss)}
            data-plume-alert-dismiss=""
            onClick={dismiss}
            type="button"
          >
            <CloseIcon />
          </button>
        ) : null}
      </div>
    )
  },
)

Alert.displayName = 'Alert'
