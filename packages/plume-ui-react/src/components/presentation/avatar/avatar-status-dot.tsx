'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useAvatarContext } from './avatar-context'
import styles from './avatar.module.css'

export type AvatarStatusDotProps = Omit<ComponentProps, 'index'>

export const AvatarStatusDot = forwardRef<HTMLSpanElement, AvatarStatusDotProps>(
  ({ className, style }: AvatarStatusDotProps, ref: ForwardedRef<HTMLSpanElement>): ReactNode => {
    const { isStyled, status } = useAvatarContext('AvatarStatusDot')

    if (!status) return null

    return (
      <span
        aria-hidden="true"
        className={joinClasses(isStyled && styles.status, className)}
        data-plume-avatar-status-dot=""
        data-status={status}
        ref={ref}
        style={style}
      />
    )
  },
)

AvatarStatusDot.displayName = 'AvatarStatusDot'
