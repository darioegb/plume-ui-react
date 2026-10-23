'use client'

import type { ReactNode } from 'react'
import { isValidElement, useCallback, useId, useMemo, useRef, useState } from 'react'
import { Portal } from '../../../overlay'
import {
  ToastContext,
  type ToastApi,
  type ToastContent,
  type ToastIcons,
  type ToastOptions,
  type ToastStatus,
} from './toast-context'
import { ToastItem, type ToastData } from './toast-item'
import { joinClasses } from '../../../overlay/class-names'
import styles from './toast.module.css'

export type ToastPosition =
  | 'top-start'
  | 'top'
  | 'top-end'
  | 'center-start'
  | 'center'
  | 'center-end'
  | 'bottom-start'
  | 'bottom'
  | 'bottom-end'

export type ToastVariant = 'solid' | 'subtle' | 'outline' | 'unstyled'

export type ToastPart =
  'action' | 'content' | 'description' | 'dismiss' | 'icon' | 'title' | 'toast'

export interface ToastProviderProps {
  children: ReactNode
  className?: string
  classNames?: Partial<Record<ToastPart, string>>
  dismissLabel?: string
  duration?: number
  icons?: false | ToastIcons
  max?: number
  position?: ToastPosition
  regionLabel?: string
  /** Alias of `classNames.toast`, kept until the next major. */
  toastClassName?: string
  variant?: ToastVariant
}

const isOptions = (content: ToastContent): content is ToastOptions =>
  typeof content === 'object' &&
  content !== null &&
  !isValidElement(content) &&
  !Array.isArray(content)

export function ToastProvider({
  children,
  className = '',
  classNames,
  dismissLabel = 'Dismiss notification',
  duration = 5000,
  icons,
  max = 5,
  position = 'bottom-end',
  regionLabel = 'Notifications',
  toastClassName = '',
  variant = 'subtle',
}: Readonly<ToastProviderProps>): ReactNode {
  const baseId = useId()
  const counter = useRef(0)
  const [toasts, setToasts] = useState<ToastData[]>([])
  const isStyled = variant !== 'unstyled'
  const defaults = useRef({ duration, max })
  defaults.current = { duration, max }

  const remove = useCallback((id: string): void => {
    setToasts((current) => {
      const removed = current.find((item) => item.id === id)
      if (!removed) return current
      removed.onDismiss?.()
      return current.filter((item) => item.id !== id)
    })
  }, [])

  const show = useCallback(
    (content: ToastContent, options: ToastOptions = {}, status?: ToastStatus): string => {
      const merged: ToastOptions = isOptions(content)
        ? { ...content, ...options }
        : { title: content, ...options }
      counter.current += 1
      const id = merged.id ?? `${baseId}-${counter.current}`
      const next: Omit<ToastData, 'revision'> = {
        action: merged.action,
        description: merged.description,
        dismissible: merged.dismissible ?? true,
        duration: merged.duration ?? defaults.current.duration,
        icon: merged.icon,
        id,
        onDismiss: merged.onDismiss,
        status: merged.status ?? status ?? 'neutral',
        title: merged.title,
      }
      setToasts((current) => {
        const existing = current.find((item) => item.id === id)
        if (existing) {
          return current.map((item) =>
            item.id === id ? { ...next, revision: existing.revision + 1 } : item,
          )
        }
        return [...current, { ...next, revision: 0 }].slice(-defaults.current.max)
      })
      return id
    },
    [baseId],
  )

  const api = useMemo<ToastApi>(
    () => ({
      dismiss: remove,
      dismissAll: () => setToasts([]),
      error: (content, options) => show(content, options, 'error'),
      info: (content, options) => show(content, options, 'info'),
      success: (content, options) => show(content, options, 'success'),
      toast: (content, options) => show(content, options),
      warning: (content, options) => show(content, options, 'warning'),
    }),
    [remove, show],
  )

  const regionClasses = [
    isStyled && styles.region,
    isStyled && styles[position],
    isStyled && styles[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <ToastContext.Provider value={api}>
      {children}
      <Portal>
        <section aria-label={regionLabel} aria-live="polite" className={regionClasses || undefined}>
          {toasts.map((toast) => (
            <ToastItem
              dismissLabel={dismissLabel}
              className={joinClasses(toastClassName, classNames?.toast) ?? ''}
              classNames={classNames}
              icons={icons}
              isStyled={isStyled}
              key={`${toast.id}-${toast.revision}`}
              onDismiss={remove}
              toast={toast}
            />
          ))}
        </section>
      </Portal>
    </ToastContext.Provider>
  )
}
