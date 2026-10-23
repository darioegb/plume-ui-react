'use client'

import type { CSSProperties, KeyboardEvent, ReactNode } from 'react'
import { useCallback } from 'react'
import { CloseIcon } from '../../../overlay/icons'
import { StatusIcon } from '../../../overlay/status-icon'
import { joinClasses } from '../../../overlay/class-names'
import type { ToastAction, ToastIcons, ToastStatus } from './toast-context'
import type { ToastPart } from './toast-provider'
import styles from './toast.module.css'
import { useToastTimer } from './use-toast-timer'

export interface ToastData {
  action?: ToastAction
  description?: ReactNode
  dismissible: boolean
  duration: number
  icon?: ReactNode
  id: string
  onDismiss?: () => void
  revision: number
  status: ToastStatus
  title?: ReactNode
}

interface ToastItemProps {
  className: string
  classNames?: Partial<Record<ToastPart, string>>
  dismissLabel: string
  icons?: false | ToastIcons
  isStyled: boolean
  onDismiss: (id: string) => void
  toast: ToastData
}

function resolveIcon(toast: ToastData, icons: false | ToastIcons | undefined): ReactNode {
  if (toast.icon !== undefined) return toast.icon
  if (icons === false) return null
  const custom = icons?.[toast.status]
  if (custom !== undefined) return custom
  return toast.status === 'neutral' ? null : <StatusIcon status={toast.status} />
}

const colors: Record<ToastStatus, string> = {
  error: 'error',
  info: 'info',
  neutral: 'secondary',
  success: 'success',
  warning: 'warning',
}

export function toastColorVars(status: ToastStatus): CSSProperties {
  const scheme = colors[status]
  return {
    '--toast-contrast': `var(--plume-color-${scheme}-solid-contrast)`,
    '--toast-solid': `var(--plume-color-${scheme}-solid)`,
    '--toast-tint': `var(--plume-color-${scheme}-tint)`,
    '--toast-tint-text': `var(--plume-color-${scheme}-tint-text)`,
  } as CSSProperties
}

export function ToastItem({
  className,
  classNames,
  dismissLabel,
  icons,
  isStyled,
  onDismiss,
  toast,
}: Readonly<ToastItemProps>): ReactNode {
  const { duration, id } = toast
  const dismiss = useCallback(() => onDismiss(id), [id, onDismiss])
  const timerHandlers = useToastTimer(duration, dismiss)

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>): void => {
    if (event.key === 'Escape' && toast.dismissible) dismiss()
  }

  const handleAction = (): void => {
    toast.action?.onClick?.()
    dismiss()
  }

  const part = (name: ToastPart): string | undefined =>
    joinClasses(isStyled && styles[name], classNames?.[name])
  const icon = resolveIcon(toast, icons)
  const isError = toast.status === 'error'
  const classes =
    [isStyled && styles.toast, isStyled && styles[toast.status], className]
      .filter(Boolean)
      .join(' ') || undefined

  return (
    <div
      className={classes}
      {...timerHandlers}
      onKeyDown={handleKeyDown}
      role={isError ? 'alert' : 'status'}
      style={toastColorVars(toast.status)}
    >
      {icon ? (
        <span aria-hidden="true" className={part('icon')}>
          {icon}
        </span>
      ) : null}
      <div className={part('content')}>
        {toast.title ? <span className={part('title')}>{toast.title}</span> : null}
        {toast.description ? (
          <span className={part('description')}>{toast.description}</span>
        ) : null}
        {toast.action ? (
          <button className={part('action')} onClick={handleAction} type="button">
            {toast.action.label}
          </button>
        ) : null}
      </div>
      {toast.dismissible ? (
        <button
          aria-label={dismissLabel}
          className={part('dismiss')}
          onClick={dismiss}
          type="button"
        >
          <CloseIcon />
        </button>
      ) : null}
    </div>
  )
}
