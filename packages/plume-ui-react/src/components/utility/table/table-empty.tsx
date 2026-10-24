import type { ForwardedRef, ReactNode, TdHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'
import {
  EmptyState,
  EmptyStateAction,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
} from '../../presentation/emptystate'
import type { EmptyStateProps } from '../../presentation/emptystate'

export type TableEmptyPart = 'action' | 'description' | 'emptyState' | 'icon' | 'title'

export interface TableEmptyOwnProps {
  classNames?: Partial<Record<TableEmptyPart, string>>
  colSpan?: number
}

type TableEmptyRootAttributes = Pick<
  TdHTMLAttributes<HTMLTableCellElement>,
  'children' | 'hidden' | 'id'
>

export type TableEmptyProps = Omit<ComponentProps, 'index'> &
  TableEmptyRootAttributes &
  Pick<
    EmptyStateProps,
    'action' | 'description' | 'icon' | 'size' | 'title' | 'titleAs' | 'variant'
  > &
  TableEmptyOwnProps

export const TableEmpty = forwardRef<HTMLTableCellElement, TableEmptyProps>(
  (
    {
      action,
      children,
      className,
      classNames,
      colSpan = 100,
      description,
      icon,
      size,
      style,
      title,
      titleAs,
      variant,
      ...rest
    }: TableEmptyProps,
    ref: ForwardedRef<HTMLTableCellElement>,
  ): ReactNode => {
    const heading = title ?? children

    return (
      <tr data-plume-table-empty="">
        <td
          className={className}
          colSpan={colSpan}
          data-plume-table-empty-cell=""
          ref={ref}
          style={style}
          {...rest}
        >
          <EmptyState
            className={classNames?.emptyState}
            role="status"
            size={size}
            variant={variant}
          >
            {icon ? <EmptyStateIcon className={classNames?.icon}>{icon}</EmptyStateIcon> : null}
            {heading ? (
              <EmptyStateTitle as={titleAs} className={classNames?.title}>
                {heading}
              </EmptyStateTitle>
            ) : null}
            {description ? (
              <EmptyStateDescription className={classNames?.description}>
                {description}
              </EmptyStateDescription>
            ) : null}
            {action ? (
              <EmptyStateAction className={classNames?.action}>{action}</EmptyStateAction>
            ) : null}
          </EmptyState>
        </td>
      </tr>
    )
  },
)

TableEmpty.displayName = 'TableEmpty'
