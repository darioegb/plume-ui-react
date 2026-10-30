'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { Children, forwardRef, isValidElement, useMemo } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { hasPart } from '../../../overlay/has-part'
import type { ColorScheme, ComponentProps, Shape, Size } from '../../../theme'
import { tagColorVars } from '../shared/tag-vars'
import tag from '../shared/tag.module.css'
import { BadgeContext } from './badge-context'
import { BadgeDot } from './badge-dot'
import styles from './badge.module.css'

export interface BadgeOwnProps {
  /**
   * Color scheme from the theme palette, including custom schemes added to it.
   *
   * @default 'primary'
   */
  colorScheme?: ColorScheme
  /**
   * Shows a `BadgeDot` before the content, in the color of the text. With no children it is a dot
   * on its own.
   *
   * @default false
   */
  dot?: boolean
  /**
   * Corners of the Badge.
   *
   * @default 'rounded'
   */
  shape?: Shape
  /**
   * Size of the Badge.
   *
   * @default 'md'
   */
  size?: Size
  /**
   * Visual variant. `solid` fills the Badge, `subtle` tints it and `outline` only draws its
   * border. `unstyled` drops the Plume styles so you can bring your own.
   *
   * @default 'solid'
   */
  variant?: BadgeVariant
}

export type BadgeVariant = 'solid' | 'outline' | 'subtle' | 'unstyled'

type BadgeRootAttributes = Pick<
  HTMLAttributes<HTMLSpanElement>,
  'aria-label' | 'aria-labelledby' | 'children' | 'hidden' | 'id' | 'role' | 'title'
>

export type BadgeProps = Omit<ComponentProps, 'index'> & BadgeRootAttributes & BadgeOwnProps

const isDot = (child: ReactNode): boolean => isValidElement(child) && child.type === BadgeDot

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      children,
      className = '',
      colorScheme = 'primary',
      dot = false,
      role,
      shape = 'rounded',
      size = 'md',
      style,
      variant = 'solid',
      ...rest
    }: BadgeProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ) => {
    const isStyled = variant !== 'unstyled'
    const context = useMemo(() => ({ isStyled }), [isStyled])
    const parts = Children.toArray(children)
    const isDotOnly = parts.length === 0 ? dot : parts.every(isDot)
    const isNamed = Boolean(rest['aria-label'] ?? rest['aria-labelledby'])
    const resolvedRole = role ?? (isNamed ? 'img' : undefined)
    const classes = joinClasses(
      isStyled && styles.badge,
      isStyled && tag[size],
      isStyled && tag[shape],
      isStyled && tag[variant],
      isStyled && isDotOnly && styles.dotOnly,
      className,
    )

    return (
      <BadgeContext.Provider value={context}>
        <span
          className={classes}
          data-plume-badge=""
          ref={ref}
          role={resolvedRole}
          style={tagColorVars('badge', colorScheme, style)}
          {...rest}
        >
          {dot && !hasPart(children, [BadgeDot]) ? <BadgeDot /> : null}
          {children}
        </span>
      </BadgeContext.Provider>
    )
  },
)

Badge.displayName = 'Badge'
