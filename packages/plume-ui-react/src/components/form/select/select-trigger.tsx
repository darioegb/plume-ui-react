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
  /** Accessible name of the control, when there is no `Field` label. */
  'aria-label'?: string
  /** Id of the element that names the control. */
  'aria-labelledby'?: string
  /** The parts of the trigger, or a `SelectValue` to render the value yourself. */
  children?: ReactNode
  /**
   * How a `multiple` value shows: `chips`, each with a button to remove it, or `text`.
   * @default 'chips'
   */
  display?: SelectDisplay
  /**
   * How many chips to show before a `+N` one.
   * @default Number.POSITIVE_INFINITY
   */
  maxDisplay?: number
  /** What the control shows when nothing is chosen. */
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

/**
 * The control the user clicks. It needs a name: an `aria-label`, an `aria-labelledby` or a `Field`
 * label. Given no `children` it renders `SelectField` (with `SelectChips` for a `multiple` select
 * and `SelectCombobox`), `SelectClear`, `SelectChevron` and `SelectHidden`; given those parts it
 * renders them in the order you write them, and any other `children` (a `SelectValue`) are the
 * content of the `SelectCombobox`.
 */
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
