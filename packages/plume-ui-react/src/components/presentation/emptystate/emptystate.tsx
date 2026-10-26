import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps, Size } from '../../../theme'
import { EmptyStateAction } from './emptystate-action'
import { EmptyStateDescription } from './emptystate-description'
import { EmptyStateIcon } from './emptystate-icon'
import { EmptyStateTitle, type EmptyStateTitleTag } from './emptystate-title'
import styles from './emptystate.module.css'

export type EmptyStateVariant = 'filled' | 'outline' | 'plain' | 'unstyled'

export interface EmptyStateOwnProps {
  /** What the user can do: usually a `Button` or a link. */
  action?: ReactNode
  /**
   * The parts to render (`EmptyStateIcon`, `EmptyStateTitle`, `EmptyStateDescription`,
   * `EmptyStateAction`). When given, the `icon`, `title`, `description` and `action` props are
   * ignored.
   */
  children?: ReactNode
  /** Why it is empty, or what the user can do about it. */
  description?: ReactNode
  /** An SVG shown above the title. It is decorative and takes the size of the EmptyState. */
  icon?: ReactNode
  /**
   * Size of the EmptyState: its padding, its text and the size of the icon.
   *
   * @default 'md'
   */
  size?: Size
  /** What is empty, in a few words. */
  title?: ReactNode
  /**
   * Element of the title: a `div` or a heading level.
   *
   * @default 'div'
   */
  titleAs?: EmptyStateTitleTag
  /**
   * Visual variant. `plain` has no box, `outline` draws a dashed border and `filled` gives it a
   * muted background. `unstyled` drops the Plume styles so you can bring your own.
   *
   * @default 'plain'
   */
  variant?: EmptyStateVariant
}

type EmptyStateRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'aria-label' | 'aria-labelledby' | 'aria-live' | 'hidden' | 'id' | 'role' | 'title'
>

export type EmptyStateProps = Omit<ComponentProps, 'index'> &
  Omit<EmptyStateRootAttributes, 'title'> &
  EmptyStateOwnProps

export type { EmptyStateTitleTag }

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      action,
      children,
      className,
      description,
      icon,
      size = 'md',
      style,
      title,
      titleAs = 'div',
      variant = 'plain',
      ...rest
    }: EmptyStateProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const isStyled = variant !== 'unstyled'

    return (
      <div
        className={joinClasses(
          isStyled && styles.emptystate,
          isStyled && styles[size],
          isStyled && styles[variant],
          className,
        )}
        data-plume-emptystate=""
        ref={ref}
        style={style}
        {...rest}
      >
        {children ?? (
          <>
            {icon ? <EmptyStateIcon>{icon}</EmptyStateIcon> : null}
            {title ? <EmptyStateTitle as={titleAs}>{title}</EmptyStateTitle> : null}
            {description ? <EmptyStateDescription>{description}</EmptyStateDescription> : null}
            {action ? <EmptyStateAction>{action}</EmptyStateAction> : null}
          </>
        )}
      </div>
    )
  },
)

EmptyState.displayName = 'EmptyState'
