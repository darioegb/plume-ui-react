import type { CSSProperties, ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import type { ColorScheme, ComponentProps, Size } from '../../../theme'
import styles from './icon.module.css'

export interface IconOwnProps {
  colorScheme?: ColorScheme
  label?: string
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
      <span // NOSONAR: the wrapper of an inline svg can't be an <img>
        aria-hidden={label ? undefined : true}
        aria-label={label}
        className={classes}
        ref={ref}
        role={label ? 'img' : undefined}
        style={iconColorVars(colorScheme, style)}
        {...rest}
      >
        {children}
      </span>
    )
  },
)

Icon.displayName = 'Icon'
