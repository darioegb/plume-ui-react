'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useMemo, useState } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { useLabels } from '../../../locale/locale-provider'
import type { ColorScheme, ComponentProps, Shape, Size } from '../../../theme'
import { tagColorVars } from '../shared/tag-vars'
import tag from '../shared/tag.module.css'
import { AvatarContext, useAvatarGroup } from './avatar-context'
import { AvatarFallback } from './avatar-fallback'
import { AvatarImage } from './avatar-image'
import { hasPart } from '../../../overlay/has-part'
import { AvatarStatusDot } from './avatar-status-dot'
import styles from './avatar.module.css'

export type AvatarStatus = 'away' | 'busy' | 'offline' | 'online'

export type AvatarVariant = 'outline' | 'solid' | 'subtle' | 'unstyled'

export interface AvatarLabels {
  away: string
  busy: string
  offline: string
  online: string
}

export interface AvatarOwnProps {
  /** Accessible name of the image, when the name is not enough. It replaces the name. */
  alt?: string
  /**
   * Color scheme of the fallback, from the theme palette, including custom schemes added to it.
   *
   * @default 'secondary'
   */
  colorScheme?: ColorScheme
  /**
   * What to show when there is no image: a text, an icon... By default, the initials of the name,
   * or an icon of a person.
   */
  fallback?: ReactNode
  /**
   * The texts of the status for assistive technology, to translate them: `online`, `busy`, `away`
   * and `offline`.
   */
  labels?: Partial<AvatarLabels>
  /**
   * Name of the person. Its initials are the fallback, and it names the avatar for assistive
   * technology.
   */
  name?: string
  /**
   * Corners of the Avatar: `pill` is a circle and `rounded` a rounded square.
   *
   * @default 'pill'
   */
  shape?: Shape
  /**
   * Size of the Avatar.
   *
   * @default 'md'
   */
  size?: Size
  /** URL of the image. If it fails to load, the fallback is shown. */
  src?: string
  /** Adds a dot with the presence of the person. */
  status?: AvatarStatus
  /**
   * Visual variant of the fallback. `subtle` tints it, `solid` fills it and `outline` draws its
   * border. `unstyled` drops the Plume styles so you can bring your own.
   *
   * @default 'subtle'
   */
  variant?: AvatarVariant
}

type AvatarRootAttributes = Pick<
  HTMLAttributes<HTMLSpanElement>,
  'aria-label' | 'aria-labelledby' | 'children' | 'hidden' | 'id' | 'title'
>

export type AvatarProps = Omit<ComponentProps, 'index'> & AvatarRootAttributes & AvatarOwnProps

const AVATAR_PARTS = [AvatarFallback, AvatarImage, AvatarStatusDot]

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
      children,
      className,
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
    const text = useLabels('avatar', DEFAULT_LABELS, { ...group?.labels, ...labels })
    const statusText = status ? text[status] : undefined
    const label = [alt ?? name, statusText].filter(Boolean).join(', ')
    const isNamed = Boolean(rest['aria-label'] ?? rest['aria-labelledby'] ?? label)
    const role = isNamed ? 'img' : undefined
    const context = useMemo(
      () => ({
        fallback,
        isStyled,
        name,
        setFailedSrc,
        showImage,
        src,
        status,
        variant: resolvedVariant,
      }),
      [fallback, isStyled, name, resolvedVariant, showImage, src, status],
    )

    return (
      <AvatarContext.Provider value={context}>
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
          {hasPart(children, AVATAR_PARTS) ? (
            children
          ) : (
            <>
              <AvatarImage />
              <AvatarFallback />
              <AvatarStatusDot />
            </>
          )}
        </span>
      </AvatarContext.Provider>
    )
  },
)

Avatar.displayName = 'Avatar'
