import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps, Size } from '../../../theme'
import styles from './emptystate.module.css'

export type EmptyStateVariant = 'filled' | 'outline' | 'plain' | 'unstyled'

export type EmptyStatePart = 'action' | 'description' | 'icon' | 'title'

export type EmptyStateTitleTag = 'div' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export interface EmptyStateOwnProps {
  action?: ReactNode
  classNames?: Partial<Record<EmptyStatePart, string>>
  description?: ReactNode
  icon?: ReactNode
  size?: Size
  title?: ReactNode
  titleAs?: EmptyStateTitleTag
  variant?: EmptyStateVariant
}

type EmptyStateRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'aria-label' | 'aria-labelledby' | 'aria-live' | 'hidden' | 'id' | 'role' | 'title'
>

export type EmptyStateProps = Omit<ComponentProps, 'index'> &
  Omit<EmptyStateRootAttributes, 'title'> &
  EmptyStateOwnProps

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      action,
      className,
      classNames,
      description,
      icon,
      size = 'md',
      style,
      title,
      titleAs: Title = 'div',
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
        {icon ? (
          <span
            aria-hidden="true"
            className={joinClasses(isStyled && styles.icon, classNames?.icon)}
            data-plume-emptystate-icon=""
          >
            {icon}
          </span>
        ) : null}
        {title ? (
          <Title
            className={joinClasses(isStyled && styles.title, classNames?.title)}
            data-plume-emptystate-title=""
          >
            {title}
          </Title>
        ) : null}
        {description ? (
          <p
            className={joinClasses(isStyled && styles.description, classNames?.description)}
            data-plume-emptystate-description=""
          >
            {description}
          </p>
        ) : null}
        {action ? (
          <div
            className={joinClasses(isStyled && styles.action, classNames?.action)}
            data-plume-emptystate-action=""
          >
            {action}
          </div>
        ) : null}
      </div>
    )
  },
)

EmptyState.displayName = 'EmptyState'
