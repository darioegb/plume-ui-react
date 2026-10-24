'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { UserIcon } from '../../../overlay/icons'
import type { ComponentProps } from '../../../theme'
import tag from '../shared/tag.module.css'
import { useAvatarContext } from './avatar-context'
import { getInitials } from './avatar-initials'
import styles from './avatar.module.css'

type AvatarFallbackRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

export type AvatarFallbackProps = Omit<ComponentProps, 'index'> & AvatarFallbackRootAttributes

export const AvatarFallback = forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  (
    { children, className, style }: AvatarFallbackProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { fallback, isStyled, name, showImage, variant } = useAvatarContext('AvatarFallback')

    if (showImage) return null

    return (
      <span
        aria-hidden="true"
        className={joinClasses(isStyled && styles.fallback, isStyled && tag[variant], className)}
        data-plume-avatar-fallback=""
        ref={ref}
        style={style}
      >
        {children ?? fallback ?? (getInitials(name) || <UserIcon />)}
      </span>
    )
  },
)

AvatarFallback.displayName = 'AvatarFallback'
