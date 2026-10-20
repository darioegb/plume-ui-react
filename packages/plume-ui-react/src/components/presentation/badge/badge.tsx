import type { CSSProperties, ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import type { ColorScheme, ComponentProps, Shape, Size } from '../../../theme'
import styles from './badge.module.css'

export interface BadgeOwnProps {
  colorScheme?: ColorScheme
  dot?: boolean
  shape?: Shape
  size?: Size
  variant?: BadgeVariant
}

export type BadgeVariant = 'solid' | 'outline' | 'subtle' | 'unstyled'

type BadgeRootAttributes = Pick<
  HTMLAttributes<HTMLSpanElement>,
  'aria-label' | 'aria-labelledby' | 'children' | 'hidden' | 'id' | 'role' | 'title'
>

export type BadgeProps = Omit<ComponentProps, 'index'> & BadgeRootAttributes & BadgeOwnProps

const badgeColorVars = (colorScheme: ColorScheme, style?: CSSProperties): CSSProperties =>
  ({
    '--badge-solid': `var(--plume-color-${colorScheme}-solid)`,
    '--badge-contrast': `var(--plume-color-${colorScheme}-solid-contrast)`,
    '--badge-text': `var(--plume-color-${colorScheme}-text)`,
    '--badge-tint': `var(--plume-color-${colorScheme}-tint)`,
    '--badge-tint-text': `var(--plume-color-${colorScheme}-tint-text)`,
    ...style,
  }) as CSSProperties

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
      isStyled && styles[size],
      isStyled && styles[shape],
      isStyled && styles[variant],
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
        style={badgeColorVars(colorScheme, style)}
        {...rest}
      >
        {dot && isStyled ? <span aria-hidden="true" className={styles.dot} /> : null}
        {children}
      </span>
    )
  },
)

Badge.displayName = 'Badge'
