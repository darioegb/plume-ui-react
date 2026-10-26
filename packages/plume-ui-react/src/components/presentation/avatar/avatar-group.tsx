'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { Children, forwardRef, useMemo } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ColorScheme, ComponentProps, Shape, Size } from '../../../theme'
import type { AvatarLabels, AvatarVariant } from './avatar'
import { AvatarGroupContext } from './avatar-context'
import { AvatarOverflow } from './avatar-overflow'
import styles from './avatar.module.css'

export interface AvatarGroupLabels extends AvatarLabels {
  overflow: (hidden: number) => string
}

export interface AvatarGroupOwnProps {
  /**
   * Color scheme of the fallback, from the theme palette, including custom schemes added to it.
   *
   * @default 'secondary'
   */
  colorScheme?: ColorScheme
  /**
   * The texts of the status for assistive technology, to translate them: `online`, `busy`, `away`
   * and `offline`.
   */
  labels?: Partial<AvatarGroupLabels>
  /** Most avatars shown. The rest collapse into an overflow counter. */
  max?: number
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
  /**
   * Visual variant of the fallback. `subtle` tints it, `solid` fills it and `outline` draws its
   * border. `unstyled` drops the Plume styles so you can bring your own.
   *
   * @default 'subtle'
   */
  variant?: AvatarVariant
}

type AvatarGroupRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'aria-label' | 'aria-labelledby' | 'children' | 'hidden' | 'id' | 'title'
>

export type AvatarGroupProps = Omit<ComponentProps, 'index'> &
  AvatarGroupRootAttributes &
  AvatarGroupOwnProps

const groupRole = 'group'

/** A `role="group"` that stacks the avatars. Name it with `aria-label` (`Team members`). */
export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  (
    {
      children,
      className,
      colorScheme,
      labels,
      max,
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
      () => ({ colorScheme, labels, shape, size, variant }),
      [colorScheme, labels, shape, size, variant],
    )

    return (
      <AvatarGroupContext.Provider value={context}>
        <div
          className={joinClasses(variant !== 'unstyled' && styles.group, className)}
          data-plume-avatar-group=""
          ref={ref}
          role={groupRole}
          {...rest}
        >
          {avatars.slice(0, limit)}
          {hidden > 0 ? <AvatarOverflow count={hidden} /> : null}
        </div>
      </AvatarGroupContext.Provider>
    )
  },
)

AvatarGroup.displayName = 'AvatarGroup'
