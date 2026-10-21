import type { ReactNode } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import styles from './rating.module.css'

export type RatingItemState = 'empty' | 'full' | 'half'

export type RatingPart = 'empty' | 'filled' | 'item'

export const itemState = (position: number, value: number): RatingItemState => {
  if (value >= position) return 'full'
  return value >= position - 0.5 ? 'half' : 'empty'
}

interface RatingItemProps {
  children?: ReactNode
  classNames?: Partial<Record<RatingPart, string>>
  emptyIcon: ReactNode
  icon: ReactNode
  isStyled: boolean
  state: RatingItemState
}

export function RatingItem({
  children,
  classNames,
  emptyIcon,
  icon,
  isStyled,
  state,
}: Readonly<RatingItemProps>): ReactNode {
  return (
    <span
      className={joinClasses(isStyled && styles.item, classNames?.item)}
      data-plume-rating-item=""
      data-state={state}
    >
      <span aria-hidden="true" className={joinClasses(isStyled && styles.empty, classNames?.empty)}>
        {emptyIcon}
      </span>
      <span
        aria-hidden="true"
        className={joinClasses(isStyled && styles.filled, classNames?.filled)}
        data-plume-rating-filled=""
      >
        {icon}
      </span>
      {children}
    </span>
  )
}
