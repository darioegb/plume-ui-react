'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useMemo } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { hasPart } from '../../../overlay/has-part'
import { RatingEmpty } from './rating-empty'
import { RatingFilled } from './rating-filled'
import { RatingRadio } from './rating-radio'
import { itemState, RatingItemContext, useRatingContext } from './rating-context'
import type { RatingItemContextValue } from './rating-context'
import styles from './rating.module.css'

export interface RatingItemOwnProps {
  position: number
}

type RatingItemRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

export type RatingItemProps = Omit<ComponentProps, 'index'> &
  RatingItemRootAttributes &
  RatingItemOwnProps

export const RatingItem = forwardRef<HTMLSpanElement, RatingItemProps>(
  (
    { children, className, position, style }: RatingItemProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { allowHalf, isStyled, preview, readOnly, value } = useRatingContext('RatingItem')
    const state = itemState(position, readOnly ? value : preview)
    const context: RatingItemContextValue = useMemo(() => ({ position, state }), [position, state])
    const options = allowHalf ? [position - 0.5, position] : [position]

    return (
      <RatingItemContext.Provider value={context}>
        <span
          className={joinClasses(isStyled && styles.item, className)}
          data-plume-rating-item=""
          data-state={state}
          ref={ref}
          style={style}
        >
          {hasPart(children, [RatingEmpty, RatingFilled, RatingRadio]) ? (
            children
          ) : (
            <>
              <RatingEmpty />
              <RatingFilled />
              {options.map((option) => (
                <RatingRadio key={option} value={option} />
              ))}
            </>
          )}
        </span>
      </RatingItemContext.Provider>
    )
  },
)

RatingItem.displayName = 'RatingItem'
