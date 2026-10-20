'use client'

import type { CSSProperties, ForwardedRef, ReactNode } from 'react'
import { forwardRef, useEffect } from 'react'
import { ChevronDownIcon, CloseIcon } from '../../../overlay/icons'
import { mergeRefs } from '../../../overlay/trigger'
import type { ComponentProps } from '../../../theme'
import { useFieldContext } from '../field/field-context'
import { useSelectContext } from './select-context'
import { SelectValue } from './select-value'
import styles from './select.module.css'

export interface SelectTriggerOwnProps {
  'aria-label'?: string
  'aria-labelledby'?: string
  children?: ReactNode
  clearLabel?: string
  placeholder?: ReactNode
}

export type SelectTriggerProps = Omit<ComponentProps, 'index'> & SelectTriggerOwnProps

export const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  (
    {
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      children,
      className = '',
      clearLabel = 'Clear',
      placeholder,
      style,
    }: SelectTriggerProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const context = useSelectContext('SelectTrigger')
    const field = useFieldContext()
    const { colorScheme, isStyled, name, open, selected, setLabelling, variant } = context
    const fieldLabel = field?.controlId === context.controlId ? field?.labelId : undefined
    const labelledBy = ariaLabelledby ?? (ariaLabel ? undefined : fieldLabel)

    useEffect(() => {
      setLabelling({ label: ariaLabel, labelledBy })
    }, [ariaLabel, labelledBy, setLabelling])

    const classes = [
      isStyled && styles.control,
      isStyled && styles[variant],
      isStyled && styles[context.size],
      isStyled && styles[context.shape],
      isStyled && context.invalid && styles.invalid,
      isStyled && context.disabled && styles.disabled,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const colorVars = {
      '--select-color': `var(--plume-color-${colorScheme}-text)`,
      ...style,
    } as CSSProperties
    const canClear = context.canClear && selected.length > 0

    return (
      <div
        className={classes || undefined}
        data-open={open ? '' : undefined}
        ref={context.setTrigger}
        style={colorVars}
      >
        <button
          aria-activedescendant={open && !context.searchable ? context.activeId : undefined}
          aria-controls={context.listboxId}
          aria-describedby={context.describedBy}
          aria-expanded={open}
          aria-invalid={context.invalid || undefined}
          aria-label={ariaLabel}
          aria-labelledby={labelledBy}
          aria-readonly={context.readOnly || undefined}
          aria-required={context.required || undefined}
          className={isStyled ? styles.trigger : undefined}
          disabled={context.disabled}
          id={context.controlId}
          onClick={() => (open ? context.close(false) : context.setOpen(true))}
          onKeyDown={(event) => context.onListKeyDown(event, false)}
          ref={mergeRefs<HTMLButtonElement>(ref)}
          role="combobox"
          type="button"
        >
          {children ?? <SelectValue placeholder={placeholder} />}
          <span aria-hidden="true" className={isStyled ? styles.chevron : undefined}>
            <ChevronDownIcon />
          </span>
        </button>
        {canClear ? (
          <button
            aria-label={clearLabel}
            className={isStyled ? styles.clear : undefined}
            onClick={context.clear}
            type="button"
          >
            <CloseIcon />
          </button>
        ) : null}
        {name ? <HiddenInputs name={name} /> : null}
      </div>
    )
  },
)

function HiddenInputs({ name }: Readonly<{ name: string }>): ReactNode {
  const { multiple, selected } = useSelectContext('SelectTrigger')
  if (multiple) {
    return selected.map((value) => <input key={value} name={name} type="hidden" value={value} />)
  }
  return <input name={name} type="hidden" value={selected[0] ?? ''} />
}

SelectTrigger.displayName = 'SelectTrigger'
