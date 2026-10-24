'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { useIsomorphicLayoutEffect } from '../../../overlay/use-isomorphic-layout-effect'
import type { ComponentProps } from '../../../theme'
import { useTextarea } from './textarea-context'
import styles from './textarea.module.css'

export type TextareaCountProps = Omit<ComponentProps, 'index'> & { children?: ReactNode }

export const TextareaCount = forwardRef<HTMLSpanElement, TextareaCountProps>(
  (
    { children, className, style }: TextareaCountProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const context = useTextarea('TextareaCount')
    const { registerCount } = context

    useIsomorphicLayoutEffect(() => {
      registerCount(true)
      return () => registerCount(false)
    }, [registerCount])

    return (
      <span
        className={joinClasses(context.variant !== 'unstyled' && styles.count, className)}
        data-disabled={context.disabled ? '' : undefined}
        data-invalid={context.invalid ? '' : undefined}
        data-limit={context.remaining !== undefined && context.remaining <= 0 ? '' : undefined}
        data-plume-textarea-count=""
        id={context.countId}
        ref={ref}
        style={style}
      >
        {children ?? context.labels.count(context.count, context.maxLength)}
      </span>
    )
  },
)

TextareaCount.displayName = 'TextareaCount'
