'use client'

import type { CSSProperties, KeyboardEvent, ReactNode } from 'react'
import { useCallback, useEffect, useRef } from 'react'
import type { ToastAction, ToastStatus } from './toast-context'
import styles from './toast.module.css'

export interface ToastData {
  action?: ToastAction
  description?: ReactNode
  dismissible: boolean
  duration: number
  id: string
  onDismiss?: () => void
  revision: number
  status: ToastStatus
  title?: ReactNode
}

interface ToastItemProps {
  className: string
  dismissLabel: string
  isStyled: boolean
  onDismiss: (id: string) => void
  toast: ToastData
}

const iconPaths: Record<Exclude<ToastStatus, 'neutral'>, string> = {
  error: 'M15 9l-6 6M9 9l6 6M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z',
  info: 'M12 16v-4m0-4h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z',
  success: 'M22 11.1V12a10 10 0 1 1-5.9-9.1M22 4 12 14l-3-3',
  warning:
    'M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z',
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
  dismissLabel,
  isStyled,
  onDismiss,
  toast,
}: Readonly<ToastItemProps>): ReactNode {
  const { duration, id } = toast
  const remaining = useRef(duration)
  const startedAt = useRef(0)
  const timer = useRef<number | undefined>(undefined)
  const hovered = useRef(false)
  const focused = useRef(false)
  const dismiss = useCallback(() => onDismiss(id), [id, onDismiss])

  const pause = useCallback((): void => {
    if (timer.current === undefined) return
    window.clearTimeout(timer.current)
    timer.current = undefined
    remaining.current -= Date.now() - startedAt.current
  }, [])

  const resume = useCallback((): void => {
    if (timer.current !== undefined || hovered.current || focused.current) return
    if (!Number.isFinite(duration) || duration <= 0) return
    startedAt.current = Date.now()
    timer.current = window.setTimeout(dismiss, Math.max(remaining.current, 0))
  }, [dismiss, duration])

  useEffect(() => {
    resume()
    return pause
  }, [pause, resume])

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>): void => {
    if (event.key === 'Escape' && toast.dismissible) dismiss()
  }

  const handleAction = (): void => {
    toast.action?.onClick?.()
    dismiss()
  }

  const isError = toast.status === 'error'
  const classes =
    [isStyled && styles.toast, isStyled && styles[toast.status], className]
      .filter(Boolean)
      .join(' ') || undefined

  return (
    <div
      className={classes}
      onBlur={() => {
        focused.current = false
        resume()
      }}
      onFocus={() => {
        focused.current = true
        pause()
      }}
      onKeyDown={handleKeyDown}
      onPointerEnter={() => {
        hovered.current = true
        pause()
      }}
      onPointerLeave={() => {
        hovered.current = false
        resume()
      }}
      role={isError ? 'alert' : 'status'}
      style={toastColorVars(toast.status)}
    >
      {toast.status === 'neutral' ? null : (
        <svg
          aria-hidden="true"
          className={isStyled ? styles.icon : undefined}
          fill="none"
          focusable="false"
          height="1.25em"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="1.25em"
        >
          <path d={iconPaths[toast.status]} />
        </svg>
      )}
      <div className={isStyled ? styles.content : undefined}>
        {toast.title ? (
          <span className={isStyled ? styles.title : undefined}>{toast.title}</span>
        ) : null}
        {toast.description ? (
          <span className={isStyled ? styles.description : undefined}>{toast.description}</span>
        ) : null}
        {toast.action ? (
          <button
            className={isStyled ? styles.action : undefined}
            onClick={handleAction}
            type="button"
          >
            {toast.action.label}
          </button>
        ) : null}
      </div>
      {toast.dismissible ? (
        <button
          aria-label={dismissLabel}
          className={isStyled ? styles.dismiss : undefined}
          onClick={dismiss}
          type="button"
        >
          <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height="1em"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="1em"
          >
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      ) : null}
    </div>
  )
}
