import type { ForwardedRef, ReactNode, TdHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'
import { EmptyState } from '../../presentation/emptystate'
import type { EmptyStateProps } from '../../presentation/emptystate'

export interface TableEmptyOwnProps {
  colSpan?: number
  emptyStateClassName?: string
}

type TableEmptyRootAttributes = Pick<
  TdHTMLAttributes<HTMLTableCellElement>,
  'children' | 'hidden' | 'id'
>

export type TableEmptyProps = Omit<ComponentProps, 'index'> &
  TableEmptyRootAttributes &
  Pick<
    EmptyStateProps,
    'action' | 'classNames' | 'description' | 'icon' | 'size' | 'title' | 'titleAs' | 'variant'
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
      emptyStateClassName,
      icon,
      size,
      style,
      title,
      titleAs,
      variant,
      ...rest
    }: TableEmptyProps,
    ref: ForwardedRef<HTMLTableCellElement>,
  ): ReactNode => (
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
          action={action}
          className={emptyStateClassName}
          classNames={classNames}
          description={description}
          icon={icon}
          role="status"
          size={size}
          title={title ?? children}
          titleAs={titleAs}
          variant={variant}
        />
      </td>
    </tr>
  ),
)

TableEmpty.displayName = 'TableEmpty'
