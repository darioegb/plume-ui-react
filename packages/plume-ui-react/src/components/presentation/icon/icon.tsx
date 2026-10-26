import type { CSSProperties, ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import type { ColorScheme, ComponentProps, Size } from '../../../theme'
import styles from './icon.module.css'

export interface IconOwnProps {
  /** Color scheme from the theme palette. Without it the Icon takes the current text color. */
  colorScheme?: ColorScheme
  /**
   * Accessible name, rendered as text that only screen readers get. Without it the Icon is hidden
   * from assistive technology.
   */
  label?: string
  /**
   * Size of the Icon.
   *
   * @default 'md'
   */
  size?: Size
}

type IconRootAttributes = Pick<
  HTMLAttributes<HTMLSpanElement>,
  'children' | 'hidden' | 'id' | 'title'
>

export type IconProps = Omit<ComponentProps, 'index'> & IconRootAttributes & IconOwnProps

const iconColorVars = (colorScheme?: ColorScheme, style?: CSSProperties): CSSProperties => ({
  ...(colorScheme ? { '--icon-color': `var(--plume-color-${colorScheme}-text)` } : {}),
  ...style,
})

export const Icon = forwardRef<HTMLSpanElement, IconProps>(
  (
    { children, className = '', colorScheme, label, size = 'md', style, ...rest }: IconProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ) => {
    const classes = [styles.icon, styles[size], className].filter(Boolean).join(' ')

    return (
      <span
        aria-hidden={label ? undefined : true}
        className={classes}
        ref={ref}
        style={iconColorVars(colorScheme, style)}
        {...rest}
      >
        <span aria-hidden="true" className={styles.glyph}>
          {children}
        </span>
        {label ? <span className={styles.label}>{label}</span> : null}
      </span>
    )
  },
)

Icon.displayName = 'Icon'
