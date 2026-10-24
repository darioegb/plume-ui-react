'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useCallback, useMemo, useState } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { useLabels } from '../../../locale/locale-provider'
import { StatusIcon } from '../../../overlay/status-icon'
import type { ComponentProps, Size } from '../../../theme'
import { tagColorVars } from '../shared/tag-vars'
import tag from '../shared/tag.module.css'
import styles from './alert.module.css'
import { AlertAction } from './alert-action'
import { AlertContent } from './alert-content'
import { AlertContext } from './alert-context'
import { AlertDismiss } from './alert-dismiss'
import { AlertIcon } from './alert-icon'
import { hasPart } from '../../../overlay/has-part'

export type AlertStatus = 'error' | 'info' | 'success' | 'warning'

export type AlertVariant = 'outline' | 'solid' | 'subtle' | 'unstyled'

export interface AlertLabels {
  dismiss: string
}

export interface AlertOwnProps {
  action?: ReactNode
  dismissible?: boolean
  icon?: ReactNode | false
  labels?: Partial<AlertLabels>
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

const DEFAULT_LABELS: AlertLabels = { dismiss: 'Dismiss' }

const ALERT_PARTS = [AlertAction, AlertContent, AlertDismiss, AlertIcon]

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      action,
      children,
      className,
      dismissible = false,
      icon,
      labels,
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
    const text = useLabels('alert', DEFAULT_LABELS, labels)
    const [dismissed, setDismissed] = useState(false)
    const isStyled = variant !== 'unstyled'
    const dismiss = useCallback((): void => {
      setDismissed(true)
      onDismiss?.()
    }, [onDismiss])
    const context = useMemo(
      () => ({
        dismiss,
        icon: icon === undefined ? <StatusIcon status={status} /> : icon,
        isStyled,
        labels: text,
        status,
      }),
      [dismiss, icon, isStyled, text, status],
    )

    if (dismissed) return null

    return (
      <AlertContext.Provider value={context}>
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
          {hasPart(children, ALERT_PARTS) ? (
            children
          ) : (
            <>
              <AlertIcon />
              <AlertContent>{children}</AlertContent>
              {action ? <AlertAction>{action}</AlertAction> : null}
              {dismissible ? <AlertDismiss /> : null}
            </>
          )}
        </div>
      </AlertContext.Provider>
    )
  },
)

Alert.displayName = 'Alert'
