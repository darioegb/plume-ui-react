'use client'

import type { CSSProperties, ForwardedRef, ReactNode } from 'react'
import { forwardRef, useEffect, useMemo, useRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { mergeRefs } from '../../../overlay/trigger'
import type { ComponentProps } from '../../../theme'
import { useFieldContext } from '../field/field-context'
import { SelectChevron } from './select-chevron'
import { SelectChips } from './select-chips'
import { SelectClear } from './select-clear'
import { SelectCombobox } from './select-combobox'
import { useSelectContext, type SelectContextValue } from './select-context'
import { SelectField } from './select-field'
import { SelectHidden } from './select-hidden'
import { hasPart } from '../../../overlay/has-part'
import { SelectTriggerContext, type SelectDisplay } from './select-trigger-context'
import styles from './select.module.css'

const TRIGGER_PARTS = [
  SelectChevron,
  SelectChips,
  SelectClear,
  SelectCombobox,
  SelectField,
  SelectHidden,
]

export interface SelectTriggerOwnProps {
  'aria-label'?: string
  'aria-labelledby'?: string
  children?: ReactNode
  display?: SelectDisplay
  maxDisplay?: number
  placeholder?: ReactNode
}

export type SelectTriggerProps = Omit<ComponentProps, 'index'> & SelectTriggerOwnProps

function controlClasses(
  context: SelectContextValue,
  className: string | undefined,
): string | undefined {
  const { isStyled } = context
  return joinClasses(
    isStyled && styles.control,
    isStyled && styles[context.variant],
    isStyled && styles[context.size],
    isStyled && styles[context.shape],
    isStyled && context.invalid && styles.invalid,
    isStyled && context.disabled && styles.disabled,
    className,
  )
}

function useLabelledBy(
  context: SelectContextValue,
  ariaLabel: string | undefined,
  ariaLabelledby: string | undefined,
): string | undefined {
  const field = useFieldContext()
  const { setLabelling } = context
  const fieldLabel = field?.controlId === context.controlId ? field.labelId : undefined
  const labelledBy = ariaLabelledby ?? (ariaLabel ? undefined : fieldLabel)

  useEffect(() => {
    setLabelling({ label: ariaLabel, labelledBy })
  }, [ariaLabel, labelledBy, setLabelling])

  return labelledBy
}

export const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  (
    {
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      children,
      className,
      display = 'chips',
      maxDisplay = Number.POSITIVE_INFINITY,
      placeholder,
      style,
    }: SelectTriggerProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const context = useSelectContext('SelectTrigger')
    const button = useRef<HTMLButtonElement>(null)
    const labelledBy = useLabelledBy(context, ariaLabel, ariaLabelledby)
    const { close, open, setOpen } = context
    const composed = hasPart(children, TRIGGER_PARTS)
    const showChips = context.multiple && display === 'chips' && children === undefined
    const colorVars = {
      '--select-color': `var(--plume-color-${context.colorScheme}-text)`,
      ...style,
    } as CSSProperties
    const buttonRef = useMemo(() => mergeRefs<HTMLButtonElement>(button, ref), [ref])

    const triggerContext = useMemo(() => {
      const toggle = (): void => {
        button.current?.focus()
        if (open) close(false)
        else setOpen(true)
      }
      return { ariaLabel, buttonRef, display, labelledBy, maxDisplay, placeholder, toggle }
    }, [ariaLabel, buttonRef, close, display, labelledBy, maxDisplay, open, placeholder, setOpen])

    return (
      <SelectTriggerContext.Provider value={triggerContext}>
        <div
          className={controlClasses(context, className)}
          data-disabled={context.disabled ? '' : undefined}
          data-invalid={context.invalid ? '' : undefined}
          data-open={open ? '' : undefined}
          data-plume-select-control=""
          ref={context.setTrigger}
          style={colorVars}
        >
          {composed ? (
            children
          ) : (
            <>
              <SelectField>
                {showChips ? <SelectChips /> : null}
                <SelectCombobox>{children}</SelectCombobox>
              </SelectField>
              <SelectClear />
              <SelectChevron />
              <SelectHidden />
            </>
          )}
        </div>
      </SelectTriggerContext.Provider>
    )
  },
)

SelectTrigger.displayName = 'SelectTrigger'
