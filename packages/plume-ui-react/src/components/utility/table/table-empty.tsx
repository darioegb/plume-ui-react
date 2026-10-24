import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { hasPart } from '../../../overlay/has-part'
import type { ComponentProps } from '../../../theme'
import {
  EmptyState,
  EmptyStateAction,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
} from '../../presentation/emptystate'
import type { EmptyStateProps } from '../../presentation/emptystate'
import { TableEmptyCell } from './table-empty-cell'

export interface TableEmptyOwnProps {
  colSpan?: number
}

type TableEmptyRootAttributes = Pick<
  HTMLAttributes<HTMLTableRowElement>,
  'children' | 'hidden' | 'id'
>

export type TableEmptyProps = Omit<ComponentProps, 'index'> &
  TableEmptyRootAttributes &
  Pick<
    EmptyStateProps,
    'action' | 'description' | 'icon' | 'size' | 'title' | 'titleAs' | 'variant'
  > &
  TableEmptyOwnProps

const EMPTY_PARTS = [TableEmptyCell]

export const TableEmpty = forwardRef<HTMLTableRowElement, TableEmptyProps>(
  (
    {
      action,
      children,
      className,
      colSpan,
      description,
      icon,
      size,
      style,
      title,
      titleAs,
      variant,
      ...rest
    }: TableEmptyProps,
    ref: ForwardedRef<HTMLTableRowElement>,
  ): ReactNode => {
    const heading = title ?? children

    return (
      <tr className={className} data-plume-table-empty="" ref={ref} style={style} {...rest}>
        {hasPart(children, EMPTY_PARTS) ? (
          children
        ) : (
          <TableEmptyCell colSpan={colSpan}>
            <EmptyState role="status" size={size} variant={variant}>
              {icon ? <EmptyStateIcon>{icon}</EmptyStateIcon> : null}
              {heading ? <EmptyStateTitle as={titleAs}>{heading}</EmptyStateTitle> : null}
              {description ? <EmptyStateDescription>{description}</EmptyStateDescription> : null}
              {action ? <EmptyStateAction>{action}</EmptyStateAction> : null}
            </EmptyState>
          </TableEmptyCell>
        )}
      </tr>
    )
  },
)

TableEmpty.displayName = 'TableEmpty'
