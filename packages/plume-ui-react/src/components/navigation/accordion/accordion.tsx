'use client'

import type { CSSProperties, ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef, useCallback, useMemo } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { useSelectionState } from '../../../overlay/use-selection-state'
import type { ColorScheme, ComponentProps, Size } from '../../../theme'
import { AccordionContext, type AccordionVariant } from './accordion-context'
import styles from './accordion.module.css'

interface AccordionBaseProps {
  collapsible?: boolean
  colorScheme?: ColorScheme
  disabled?: boolean
  size?: Size
  variant?: AccordionVariant
}

interface AccordionSingleProps {
  defaultValue?: string
  onValueChange?: (value: string) => void
  type?: 'single'
  value?: string
}

interface AccordionMultipleProps {
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  type: 'multiple'
  value?: string[]
}

export type AccordionOwnProps = AccordionBaseProps & (AccordionMultipleProps | AccordionSingleProps)

type AccordionRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'aria-label' | 'aria-labelledby' | 'children' | 'hidden' | 'id' | 'title'
>

export type AccordionProps = Omit<ComponentProps, 'index'> &
  AccordionRootAttributes &
  AccordionOwnProps

const accordionColorVars = (colorScheme: ColorScheme, style?: CSSProperties): CSSProperties =>
  ({
    '--accordion-solid': `var(--plume-color-${colorScheme}-solid)`,
    '--accordion-text': `var(--plume-color-${colorScheme}-text)`,
    '--accordion-tint': `var(--plume-color-${colorScheme}-tint)`,
    '--accordion-tint-text': `var(--plume-color-${colorScheme}-tint-text)`,
    ...style,
  }) as CSSProperties

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      children,
      className,
      collapsible = true,
      colorScheme = 'primary',
      defaultValue,
      disabled = false,
      onValueChange,
      size = 'md',
      style,
      type = 'single',
      value,
      variant = 'outline',
      ...rest
    }: AccordionProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const multiple = type === 'multiple'
    const isStyled = variant !== 'unstyled'
    const { commit, selected } = useSelectionState({
      defaultValue,
      multiple,
      onValueChange,
      value,
    })

    const toggle = useCallback(
      (item: string): void => {
        if (selected.includes(item)) {
          if (multiple) commit(selected.filter((current) => current !== item))
          else if (collapsible) commit([])
        } else {
          commit(multiple ? [...selected, item] : [item])
        }
      },
      [collapsible, commit, multiple, selected],
    )

    const isOpen = useCallback((item: string): boolean => selected.includes(item), [selected])

    const context = useMemo(
      () => ({ disabled, isOpen, isStyled, size, toggle, variant }),
      [disabled, isOpen, isStyled, size, toggle, variant],
    )

    const classes = joinClasses(
      isStyled && styles.accordion,
      isStyled && styles[variant],
      isStyled && styles[size],
      className,
    )

    return (
      <AccordionContext.Provider value={context}>
        <div
          className={classes}
          data-plume-accordion=""
          ref={ref}
          style={accordionColorVars(colorScheme, style)}
          {...rest}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    )
  },
)

Accordion.displayName = 'Accordion'
