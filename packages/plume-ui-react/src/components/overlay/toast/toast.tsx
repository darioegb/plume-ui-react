'use client'

import type { CSSProperties, ForwardedRef, HTMLAttributes, KeyboardEvent, ReactNode } from 'react'
import { Children, forwardRef, useCallback, useMemo } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { StatusIcon } from '../../../overlay/status-icon'
import type { ComponentProps } from '../../../theme'
import type { ToastData, ToastIcons, ToastStatus } from './toast-context'
import { ToastActionButton } from './toast-action-button'
import { ToastBody } from './toast-body'
import { ToastDescription } from './toast-description'
import { ToastDismiss } from './toast-dismiss'
import { ToastIcon } from './toast-icon'
import { ToastItemContext } from './toast-item-context'
import { useToastRegion } from './toast-region-context'
import { ToastTitle } from './toast-title'
import { useToastTimer } from './use-toast-timer'
import styles from './toast.module.css'

export interface ToastOwnProps {
  /** The data of the toast, which is what `render` of the `ToastProvider` receives. */
  toast: ToastData
}

type ToastRootAttributes = Pick<HTMLAttributes<HTMLDivElement>, 'children'>

export type ToastProps = Omit<ComponentProps, 'index'> & ToastRootAttributes & ToastOwnProps

const colors: Record<ToastStatus, string> = {
  error: 'error',
  info: 'info',
  neutral: 'secondary',
  success: 'success',
  warning: 'warning',
}

function resolveIcon(toast: ToastData, icons: false | ToastIcons | undefined): ReactNode {
  if (toast.icon !== undefined) return toast.icon
  if (icons === false) return null
  const custom = icons?.[toast.status]
  if (custom !== undefined) return custom
  return toast.status === 'neutral' ? null : <StatusIcon status={toast.status} />
}

export function toastColorVars(status: ToastStatus, style?: CSSProperties): CSSProperties {
  const scheme = colors[status]
  return {
    '--toast-contrast': `var(--plume-color-${scheme}-solid-contrast)`,
    '--toast-solid': `var(--plume-color-${scheme}-solid)`,
    '--toast-tint': `var(--plume-color-${scheme}-tint)`,
    '--toast-tint-text': `var(--plume-color-${scheme}-tint-text)`,
    ...style,
  } as CSSProperties
}

/**
 * One toast: the element that holds its parts and shows its status. Without `children` it renders
 * the default composition; with `children` it renders them as written, whether they are parts or
 * not.
 */
export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  (
    { children, className, style, toast }: ToastProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { dismiss: dismissById, dismissLabel, icons, isStyled } = useToastRegion('Toast')
    const { duration, id } = toast
    const dismiss = useCallback(() => dismissById(id), [dismissById, id])
    const timerHandlers = useToastTimer(duration, dismiss)
    const icon = resolveIcon(toast, icons)
    const onAction = useCallback((): void => {
      toast.action?.onClick?.()
      dismiss()
    }, [dismiss, toast.action])
    const context = useMemo(
      () => ({ dismiss, dismissLabel, icon, isStyled, onAction, toast }),
      [dismiss, dismissLabel, icon, isStyled, onAction, toast],
    )

    const handleKeyDown = (event: KeyboardEvent<HTMLElement>): void => {
      if (event.key === 'Escape' && toast.dismissible) dismiss()
    }

    return (
      <ToastItemContext.Provider value={context}>
        <div
          className={joinClasses(
            isStyled && styles.toast,
            isStyled && styles[toast.status],
            className,
          )}
          data-plume-toast=""
          data-status={toast.status}
          {...timerHandlers}
          onKeyDown={handleKeyDown}
          ref={ref}
          role={toast.status === 'error' ? 'alert' : 'status'}
          style={toastColorVars(toast.status, style)}
        >
          {Children.count(children) > 0 ? (
            children
          ) : (
            <>
              <ToastIcon />
              <ToastBody>
                <ToastTitle />
                <ToastDescription />
                <ToastActionButton />
              </ToastBody>
              {toast.dismissible ? <ToastDismiss /> : null}
            </>
          )}
        </div>
      </ToastItemContext.Provider>
    )
  },
)

Toast.displayName = 'Toast'
