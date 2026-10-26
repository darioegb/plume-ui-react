'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { ChevronDownIcon } from '../../../overlay/icons'
import type { ComponentProps } from '../../../theme'
import { useAccordionContext, useAccordionItemContext } from './accordion-context'
import styles from './accordion.module.css'

type AccordionIconRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

export type AccordionIconProps = Omit<ComponentProps, 'index'> & AccordionIconRootAttributes

/**
 * The decorative icon inside the trigger, a chevron by default. It has `data-open` while its item
 * is open.
 */
export const AccordionIcon = forwardRef<HTMLSpanElement, AccordionIconProps>(
  (
    { children, className, style, ...rest }: AccordionIconProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { isStyled } = useAccordionContext('AccordionIcon')
    const item = useAccordionItemContext('AccordionIcon')

    return (
      <span
        aria-hidden="true"
        className={joinClasses(isStyled && styles.icon, className)}
        data-open={item.open ? '' : undefined}
        data-plume-accordion-icon=""
        ref={ref}
        style={style}
        {...rest}
      >
        {children ?? <ChevronDownIcon />}
      </span>
    )
  },
)

AccordionIcon.displayName = 'AccordionIcon'
