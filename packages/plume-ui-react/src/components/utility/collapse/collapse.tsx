import type { CSSProperties, ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ColorScheme, ComponentProps, Size } from '../../../theme'
import styles from './collapse.module.css'

export type CollapsePart = 'body'

export type CollapseVariant = 'accent' | 'filled' | 'outline' | 'unstyled'

export interface CollapseOwnProps {
  as?: 'div' | 'section'
  classNames?: Partial<Record<CollapsePart, string>>
  /** @deprecated Use `classNames.body`. */
  bodyClassName?: string
  colorScheme?: ColorScheme
  open?: boolean
  size?: Size
  variant?: CollapseVariant
}

type CollapseRootAttributes = Pick<
  HTMLAttributes<HTMLElement>,
  'aria-label' | 'aria-labelledby' | 'children' | 'hidden' | 'id' | 'role' | 'title'
>

export type CollapseProps = Omit<ComponentProps, 'index'> &
  CollapseRootAttributes &
  CollapseOwnProps

const collapseColorVars = (
  colorScheme?: ColorScheme,
  style?: CSSProperties,
): CSSProperties | undefined =>
  colorScheme
    ? ({
        '--collapse-solid': `var(--plume-color-${colorScheme}-solid)`,
        '--collapse-tint': `var(--plume-color-${colorScheme}-tint)`,
        '--collapse-tint-text': `var(--plume-color-${colorScheme}-tint-text)`,
        ...style,
      } as CSSProperties)
    : style

export const Collapse = forwardRef<HTMLElement, CollapseProps>(
  (
    {
      as: tag = 'div',
      classNames,
      bodyClassName,
      children,
      className,
      colorScheme,
      open = false,
      size = 'md',
      style,
      variant = 'filled',
      ...rest
    }: CollapseProps,
    ref: ForwardedRef<HTMLElement>,
  ) => {
    const Root = tag as 'div'
    const isStyled = variant !== 'unstyled'
    return (
      <Root
        className={className}
        data-open={open ? '' : undefined}
        data-plume-collapse=""
        ref={ref as ForwardedRef<HTMLDivElement>}
        style={collapseColorVars(colorScheme, style)}
        {...rest}
      >
        <div data-plume-collapse-clip="">
          <div
            className={joinClasses(
              isStyled && styles.body,
              isStyled && styles[variant],
              isStyled && styles[size],
              bodyClassName,
              classNames?.body,
            )}
          >
            {children}
          </div>
        </div>
      </Root>
    )
  },
)

Collapse.displayName = 'Collapse'
