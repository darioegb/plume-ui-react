'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useState } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { UserIcon } from '../../../overlay/icons'
import { mergeLabels } from '../../../overlay/labels'
import type { ColorScheme, ComponentProps, Shape, Size } from '../../../theme'
import { tagColorVars } from '../shared/tag-vars'
import tag from '../shared/tag.module.css'
import { useAvatarGroup } from './avatar-context'
import { getInitials } from './avatar-initials'
import styles from './avatar.module.css'

export type AvatarStatus = 'away' | 'busy' | 'offline' | 'online'

export type AvatarVariant = 'outline' | 'solid' | 'subtle' | 'unstyled'

export interface AvatarLabels {
  away: string
  busy: string
  offline: string
  online: string
}

export type AvatarPart = 'fallback' | 'image' | 'status'

export interface AvatarOwnProps {
  alt?: string
  classNames?: Partial<Record<AvatarPart, string>>
  colorScheme?: ColorScheme
  fallback?: ReactNode
  labels?: Partial<AvatarLabels>
  name?: string
  shape?: Shape
  size?: Size
  src?: string
  status?: AvatarStatus
  variant?: AvatarVariant
}

type AvatarRootAttributes = Pick<
  HTMLAttributes<HTMLSpanElement>,
  'aria-label' | 'aria-labelledby' | 'hidden' | 'id' | 'title'
>

export type AvatarProps = Omit<ComponentProps, 'index'> & AvatarRootAttributes & AvatarOwnProps

const DEFAULT_LABELS: AvatarLabels = {
  away: 'Away',
  busy: 'Busy',
  offline: 'Offline',
  online: 'Online',
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  (
    {
      alt,
      className,
      classNames,
      colorScheme,
      fallback,
      labels,
      name,
      shape,
      size,
      src,
      status,
      style,
      variant,
      ...rest
    }: AvatarProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ) => {
    const group = useAvatarGroup()
    const resolvedSize = size ?? group?.size ?? 'md'
    const resolvedShape = shape ?? group?.shape ?? 'pill'
    const resolvedScheme = colorScheme ?? group?.colorScheme ?? 'secondary'
    const resolvedVariant = variant ?? group?.variant ?? 'subtle'
    const isStyled = resolvedVariant !== 'unstyled'
    const [failedSrc, setFailedSrc] = useState<string>()
    const showImage = Boolean(src) && failedSrc !== src
    const statusText = status
      ? mergeLabels(DEFAULT_LABELS, { ...group?.labels, ...labels })[status]
      : undefined
    const label = [alt ?? name, statusText].filter(Boolean).join(', ')
    const isNamed = Boolean(rest['aria-label'] ?? rest['aria-labelledby'] ?? label)
    const role = isNamed ? 'img' : undefined
    const content = fallback ?? (getInitials(name) || <UserIcon />)

    return (
      <span
        aria-hidden={isNamed ? undefined : true}
        aria-label={label || undefined}
        className={joinClasses(
          isStyled && styles.avatar,
          isStyled && styles[resolvedSize],
          isStyled && tag[resolvedShape],
          className,
        )}
        data-plume-avatar=""
        data-status={status}
        ref={ref}
        role={role}
        style={tagColorVars('avatar', resolvedScheme, style)}
        {...rest}
      >
        {showImage ? (
          <img
            alt=""
            className={joinClasses(isStyled && styles.image, classNames?.image)}
            data-plume-avatar-image=""
            onError={() => setFailedSrc(src)}
            src={src}
          />
        ) : (
          <span
            aria-hidden="true"
            className={joinClasses(
              isStyled && styles.fallback,
              isStyled && tag[resolvedVariant],
              classNames?.fallback,
            )}
            data-plume-avatar-fallback=""
          >
            {content}
          </span>
        )}
        {status ? (
          <span
            aria-hidden="true"
            className={joinClasses(isStyled && styles.status, classNames?.status)}
            data-plume-avatar-status=""
          />
        ) : null}
      </span>
    )
  },
)

Avatar.displayName = 'Avatar'
