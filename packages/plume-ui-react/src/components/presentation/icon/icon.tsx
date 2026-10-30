import type { CSSProperties, ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ColorScheme, ComponentProps, Size } from '../../../theme'
import styles from './icon.module.css'

export type IconVariant = 'default' | 'unstyled'

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
  /**
   * Visual variant. `unstyled` drops the Plume classes, so the size and the color are up to you:
   * it is one em wide and tall unless `--icon-size` or your classes say otherwise.
   *
   * @default 'default'
   */
  variant?: IconVariant
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
    {
      children,
      className,
      colorScheme,
      label,
      size = 'md',
      style,
      variant = 'default',
      ...rest
    }: IconProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ) => {
    const isStyled = variant !== 'unstyled'

    return (
      <span
        aria-hidden={label ? undefined : true}
        className={joinClasses(isStyled && styles.icon, isStyled && styles[size], className)}
        data-plume-icon=""
        ref={ref}
        style={iconColorVars(colorScheme, style)}
        {...rest}
      >
        <span aria-hidden="true" data-plume-icon-glyph="">
          {children}
        </span>
        {label ? <span data-plume-icon-label="">{label}</span> : null}
      </span>
    )
  },
)

Icon.displayName = 'Icon'
