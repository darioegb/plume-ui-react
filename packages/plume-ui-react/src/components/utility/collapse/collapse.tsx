import type { CSSProperties, ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { hasPart } from '../../../overlay/has-part'
import type { ColorScheme, ComponentProps, Size } from '../../../theme'
import { CollapseBody } from './collapse-body'
import { CollapseClip } from './collapse-clip'
import styles from './collapse.module.css'

export type CollapseVariant = 'accent' | 'filled' | 'outline' | 'unstyled'

export interface CollapseOwnProps {
  /**
   * The element the Collapse renders. Use `section` with a name (`aria-label` or
   * `aria-labelledby`) when the content is a landmark.
   * @default 'div'
   */
  as?: 'div' | 'section'
  /**
   * Color scheme from the theme palette, including custom schemes added to it. Without it the
   * box is neutral. It tints the background of `filled` and `accent`, and colors the border of
   * `outline` and `accent`.
   */
  colorScheme?: ColorScheme
  /**
   * Whether the content is shown.
   * @default false
   */
  open?: boolean
  /**
   * Size of the text and of the padding of the box.
   * @default 'md'
   */
  size?: Size
  /**
   * Visual variant of the box with the content. `filled` gives it a background, `outline` a
   * border and `accent` a bar at the start. `unstyled` drops the Plume styles so you can bring
   * your own; the height animation keeps working.
   * @default 'filled'
   */
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
    const content = hasPart(children, [CollapseClip]) ? (
      children
    ) : (
      <CollapseClip>
        {hasPart(children, [CollapseBody]) ? children : <CollapseBody>{children}</CollapseBody>}
      </CollapseClip>
    )

    return (
      <Root
        className={joinClasses(
          isStyled && styles.collapse,
          isStyled && styles[variant],
          isStyled && styles[size],
          className,
        )}
        data-open={open ? '' : undefined}
        data-plume-collapse=""
        ref={ref as ForwardedRef<HTMLDivElement>}
        style={collapseColorVars(colorScheme, style)}
        {...rest}
      >
        {content}
      </Root>
    )
  },
)

Collapse.displayName = 'Collapse'
