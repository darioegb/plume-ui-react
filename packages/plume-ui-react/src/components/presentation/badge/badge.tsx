import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import type { ColorScheme, ComponentProps, Shape, Size } from '../../../theme'
import { tagColorVars } from '../shared/tag-vars'
import tag from '../shared/tag.module.css'
import styles from './badge.module.css'

export interface BadgeOwnProps {
  /**
   * Color scheme from the theme palette, including custom schemes added to it.
   *
   * @default 'primary'
   */
  colorScheme?: ColorScheme
  /**
   * Shows a status dot before the content, in the color of the text. With no children it is a dot
   * on its own. The `unstyled` variant ignores it.
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
    const isDotOnly = dot && !children
    const isNamed = Boolean(rest['aria-label'] ?? rest['aria-labelledby'])
    const resolvedRole = role ?? (isNamed ? 'img' : undefined)
    const classes = [
      isStyled && styles.badge,
      isStyled && tag[size],
      isStyled && tag[shape],
      isStyled && tag[variant],
      isStyled && isDotOnly && styles.dotOnly,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <span
        className={classes}
        ref={ref}
        role={resolvedRole}
        style={tagColorVars('badge', colorScheme, style)}
        {...rest}
      >
        {dot && isStyled ? <span aria-hidden="true" className={styles.dot} /> : null}
        {children}
      </span>
    )
  },
)

Badge.displayName = 'Badge'
