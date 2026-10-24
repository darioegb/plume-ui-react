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
  action?: ReactNode
  children?: ReactNode
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
