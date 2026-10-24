'use client'

import type { ReactNode } from 'react'
import { Fragment, isValidElement, useCallback, useId, useMemo, useRef, useState } from 'react'
import { Portal } from '../../../overlay'
import { useLabels } from '../../../locale/locale-provider'
import {
  ToastContext,
  type ToastApi,
  type ToastContent,
  type ToastData,
  type ToastIcons,
  type ToastOptions,
  type ToastStatus,
} from './toast-context'
import { Toast } from './toast'
import { ToastRegionContext } from './toast-region-context'
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

export interface ToastLabels {
  dismiss: string
  region: string
}

export interface ToastProviderProps {
  children: ReactNode
  className?: string
  duration?: number
  icons?: false | ToastIcons
  labels?: Partial<ToastLabels>
  max?: number
  position?: ToastPosition
  render?: (toast: ToastData) => ReactNode
  variant?: ToastVariant
}

const DEFAULT_LABELS: ToastLabels = {
  dismiss: 'Dismiss notification',
  region: 'Notifications',
}

const isOptions = (content: ToastContent): content is ToastOptions =>
  typeof content === 'object' &&
  content !== null &&
  !isValidElement(content) &&
  !Array.isArray(content)

export function ToastProvider({
  children,
  className = '',
  duration = 5000,
  icons,
  labels,
  max = 5,
  position = 'bottom-end',
  render,
  variant = 'subtle',
}: Readonly<ToastProviderProps>): ReactNode {
  const text = useLabels('toast', DEFAULT_LABELS, labels)
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

  const region = useMemo(
    () => ({ dismiss: remove, dismissLabel: text.dismiss, icons, isStyled }),
    [remove, text.dismiss, icons, isStyled],
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
        <ToastRegionContext.Provider value={region}>
          <section
            aria-label={text.region}
            aria-live="polite"
            className={regionClasses || undefined}
            data-plume-toast-region=""
          >
            {toasts.map((toast) => (
              <Fragment key={`${toast.id}-${toast.revision}`}>
                {render ? render(toast) : <Toast toast={toast} />}
              </Fragment>
            ))}
          </section>
        </ToastRegionContext.Provider>
      </Portal>
    </ToastContext.Provider>
  )
}
