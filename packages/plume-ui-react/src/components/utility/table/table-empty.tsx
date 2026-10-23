import type { ForwardedRef, ReactNode, TdHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'
import { EmptyState } from '../../presentation/emptystate'
import type { EmptyStatePart, EmptyStateProps } from '../../presentation/emptystate'

export type TableEmptyPart = EmptyStatePart | 'emptyState'

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
          className={classNames?.emptyState}
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
