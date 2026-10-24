'use client'

import type { ForwardedRef, HTMLAttributes, KeyboardEvent, ReactNode } from 'react'
import { forwardRef, useContext } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { hasPart } from '../../../overlay/has-part'
import type { ComponentProps } from '../../../theme'
import {
  AccordionHeadingContext,
  useAccordionContext,
  useAccordionItemContext,
} from './accordion-context'
import { AccordionHeading } from './accordion-heading'
import { AccordionIcon } from './accordion-icon'
import { AccordionTitle } from './accordion-title'
import styles from './accordion.module.css'

const TRIGGER_PARTS = [AccordionTitle, AccordionIcon]

export interface AccordionTriggerOwnProps {
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  icon?: ReactNode
}

type AccordionTriggerRootAttributes = Pick<HTMLAttributes<HTMLButtonElement>, 'children' | 'title'>

export type AccordionTriggerProps = Omit<ComponentProps, 'index'> &
  AccordionTriggerRootAttributes &
  AccordionTriggerOwnProps

const stepKeys: Record<string, number> = { ArrowDown: 1, ArrowUp: -1 }

function ownTriggers(current: HTMLElement): HTMLButtonElement[] {
  const root = current.closest('[data-plume-accordion]')
  if (!root) return []
  return Array.from(
    root.querySelectorAll<HTMLButtonElement>('[data-plume-accordion-trigger]:enabled'),
  ).filter((trigger) => trigger.closest('[data-plume-accordion]') === root)
}

function nextTrigger(triggers: HTMLButtonElement[], current: HTMLElement, key: string) {
  if (key === 'Home') return triggers[0]
  if (key === 'End') return triggers[triggers.length - 1]
  const step = stepKeys[key]
  if (step === undefined) return undefined
  const index = triggers.indexOf(current as HTMLButtonElement)
  return triggers[(index + step + triggers.length) % triggers.length]
}

export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  (
    { children, className, headingLevel = 3, icon, style, ...rest }: AccordionTriggerProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const accordion = useAccordionContext('AccordionTrigger')
    const item = useAccordionItemContext('AccordionTrigger')
    const insideHeading = useContext(AccordionHeadingContext)
    const { isStyled } = accordion

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
      const target = nextTrigger(ownTriggers(event.currentTarget), event.currentTarget, event.key)
      if (!target) return
      event.preventDefault()
      target.focus()
    }

    const button = (
      <button
        aria-controls={item.contentId}
        aria-expanded={item.open}
        className={joinClasses(isStyled && styles.trigger, className)}
        data-open={item.open ? '' : undefined}
        data-plume-accordion-trigger=""
        disabled={item.disabled}
        id={item.triggerId}
        onClick={() => accordion.toggle(item.value)}
        onKeyDown={handleKeyDown}
        ref={ref}
        style={style}
        type="button"
        {...rest}
      >
        {hasPart(children, TRIGGER_PARTS) ? (
          children
        ) : (
          <>
            <AccordionTitle>{children}</AccordionTitle>
            {icon === null ? null : <AccordionIcon>{icon}</AccordionIcon>}
          </>
        )}
      </button>
    )

    return insideHeading ? (
      button
    ) : (
      <AccordionHeading level={headingLevel}>{button}</AccordionHeading>
    )
  },
)

AccordionTrigger.displayName = 'AccordionTrigger'
