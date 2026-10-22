'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { Children, forwardRef, useMemo } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ColorScheme, ComponentProps, Shape, Size } from '../../../theme'
import { Avatar, type AvatarVariant } from './avatar'
import { AvatarGroupContext } from './avatar-context'
import styles from './avatar.module.css'

export interface AvatarGroupOwnProps {
  colorScheme?: ColorScheme
  max?: number
  overflowLabel?: (hidden: number) => string
  shape?: Shape
  size?: Size
  variant?: AvatarVariant
}

type AvatarGroupRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'aria-label' | 'aria-labelledby' | 'children' | 'hidden' | 'id' | 'title'
>

export type AvatarGroupProps = Omit<ComponentProps, 'index'> &
  AvatarGroupRootAttributes &
  AvatarGroupOwnProps

const defaultOverflowLabel = (hidden: number): string => `${hidden} more`

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  (
    {
      children,
      className,
      colorScheme,
      max,
      overflowLabel = defaultOverflowLabel,
      shape,
      size,
      variant,
      ...rest
    }: AvatarGroupProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const avatars = Children.toArray(children)
    const limit = max !== undefined && max < avatars.length ? Math.max(max, 0) : avatars.length
    const hidden = avatars.length - limit
    const context = useMemo(
      () => ({ colorScheme, shape, size, variant }),
      [colorScheme, shape, size, variant],
    )

    return (
      <AvatarGroupContext.Provider value={context}>
        <div
          className={joinClasses(variant !== 'unstyled' && styles.group, className)}
          data-plume-avatar-group=""
          ref={ref}
          role="group"
          {...rest}
        >
          {avatars.slice(0, limit)}
          {hidden > 0 ? (
            <Avatar alt={overflowLabel(hidden)} data-overflow="" fallback={`+${hidden}`} />
          ) : null}
        </div>
      </AvatarGroupContext.Provider>
    )
  },
)

AvatarGroup.displayName = 'AvatarGroup'
