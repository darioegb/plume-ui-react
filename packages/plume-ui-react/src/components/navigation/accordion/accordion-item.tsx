'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useId, useMemo } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { AccordionItemContext, useAccordionContext } from './accordion-context'
import styles from './accordion.module.css'

export interface AccordionItemOwnProps {
  disabled?: boolean
  value: string
}

type AccordionItemRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'hidden' | 'id' | 'title'
>

export type AccordionItemProps = Omit<ComponentProps, 'index'> &
  AccordionItemRootAttributes &
  AccordionItemOwnProps

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  (
    { children, className, disabled = false, style, value, ...rest }: AccordionItemProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const accordion = useAccordionContext('AccordionItem')
    const id = useId()
    const open = accordion.isOpen(value)
    const isDisabled = accordion.disabled || disabled

    const context = useMemo(
      () => ({
        contentId: `${id}-content`,
        disabled: isDisabled,
        open,
        triggerId: `${id}-trigger`,
        value,
      }),
      [id, isDisabled, open, value],
    )

    return (
      <AccordionItemContext.Provider value={context}>
        <div
          className={joinClasses(accordion.isStyled && styles.item, className)}
          data-disabled={isDisabled ? '' : undefined}
          data-open={open ? '' : undefined}
          data-plume-accordion-item=""
          ref={ref}
          style={style}
          {...rest}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    )
  },
)

AccordionItem.displayName = 'AccordionItem'
