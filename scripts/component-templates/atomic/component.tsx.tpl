import type { CSSProperties, ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import type { ColorScheme, ComponentProps, Size } from '../../../theme'
import styles from './__slug__.module.css'

export interface __Name__OwnProps {
  colorScheme?: ColorScheme
  size?: Size
  variant?: __Name__Variant
}

export type __Name__Variant = 'solid' | 'unstyled'

type __Name__RootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'aria-label' | 'aria-labelledby' | 'children' | 'hidden' | 'id' | 'title'
>

export type __Name__Props = Omit<ComponentProps, 'index'> & __Name__RootAttributes & __Name__OwnProps

const __camel__ColorVars = (colorScheme: ColorScheme, style?: CSSProperties): CSSProperties =>
  ({
    '--__slug__-solid': `var(--plume-color-${colorScheme}-solid)`,
    '--__slug__-contrast': `var(--plume-color-${colorScheme}-solid-contrast)`,
    ...style,
  }) as CSSProperties

export const __Name__ = forwardRef<HTMLDivElement, __Name__Props>(
  (
    {
      children,
      className = '',
      colorScheme = 'primary',
      size = 'md',
      style,
      variant = 'solid',
      ...rest
    }: __Name__Props,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const isStyled = variant !== 'unstyled'
    const classes = [
      isStyled && styles.__slug__,
      isStyled && styles[size],
      isStyled && styles[variant],
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div className={classes} ref={ref} style={__camel__ColorVars(colorScheme, style)} {...rest}>
        {children}
      </div>
    )
  },
)

__Name__.displayName = '__Name__'
