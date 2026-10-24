'use client'

import type { ForwardedRef, KeyboardEvent, MouseEvent, ReactNode, RefObject } from 'react'
import { forwardRef, useEffect, useId, useMemo, useRef, useState } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useSelectContext, type SelectOptionRecord } from './select-context'
import { SelectOptionBody } from './select-option-body'
import { SelectOptionCheck } from './select-option-check'
import { SelectOptionContext } from './select-option-context'
import { SelectOptionDescription } from './select-option-description'
import { SelectOptionIcon } from './select-option-icon'
import { SelectOptionText } from './select-option-text'
import { hasPart } from '../../../overlay/has-part'
import styles from './select.module.css'

const OPTION_PARTS = [
  SelectOptionBody,
  SelectOptionCheck,
  SelectOptionDescription,
  SelectOptionIcon,
  SelectOptionText,
]

export interface SelectOptionOwnProps {
  children?: ReactNode
  description?: ReactNode
  disabled?: boolean
  icon?: ReactNode
  label?: string
  value: string
}

export type SelectOptionProps = Omit<ComponentProps, 'index'> & SelectOptionOwnProps

const matchesQuery = (label: string, query: string): boolean =>
  label.toLowerCase().includes(query.toLowerCase())

const isActivationKey = (key: string): boolean => key === 'Enter' || key === ' '

function useOptionRecord(
  {
    children,
    disabled,
    icon,
    label,
    value,
  }: Pick<SelectOptionProps, 'children' | 'disabled' | 'icon' | 'label' | 'value'>,
  register: (record: SelectOptionRecord) => () => void,
): { resolved: string; textRef: RefObject<HTMLSpanElement | null> } {
  const textRef = useRef<HTMLSpanElement>(null)
  const iconRef = useRef(icon)
  const [text, setText] = useState(label ?? '')
  const resolved = label ?? text
  iconRef.current = icon

  useEffect(() => {
    if (label === undefined) setText(textRef.current?.textContent ?? '')
  }, [children, label])

  useEffect(() => {
    const record: SelectOptionRecord = {
      disabled: Boolean(disabled),
      get icon() {
        return iconRef.current
      },
      label: resolved,
      value,
    }
    return register(record)
  }, [disabled, register, resolved, value])

  return { resolved, textRef }
}

export const SelectOption = forwardRef<HTMLDivElement, SelectOptionProps>(
  (
    {
      children,
      className,
      description,
      disabled = false,
      icon,
      label,
      style,
      value,
    }: SelectOptionProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const context = useSelectContext('SelectOption')
    const id = useId()
    const descriptionId = useId()
    const textId = useId()
    const { isStyled, query, register, select, setActiveId } = context
    const { resolved, textRef } = useOptionRecord(
      { children, disabled, icon, label, value },
      register,
    )

    const selected = context.isSelected(value)
    const matches = matchesQuery(resolved, query)
    const [described, setDescribed] = useState(Boolean(description))
    const optionContext = useMemo(
      () => ({ description, descriptionId, icon, selected, setDescribed, textId, textRef }),
      [description, descriptionId, icon, selected, textId, textRef],
    )

    const handlePointerMove = (): void => {
      if (!disabled && context.activeId !== id) setActiveId(id)
    }

    const handleClick = (event: MouseEvent<HTMLDivElement>): void => {
      event.preventDefault()
      if (!disabled) select(value)
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
      if (!isActivationKey(event.key)) return
      event.preventDefault()
      if (!disabled) select(value)
    }

    return (
      <SelectOptionContext.Provider value={optionContext}>
        <div
          aria-disabled={disabled || undefined}
          aria-labelledby={described ? `${textId} ${descriptionId}` : undefined}
          aria-selected={selected}
          className={joinClasses(isStyled && styles.option, className)}
          data-active={context.activeId === id ? '' : undefined}
          data-label={resolved}
          data-plume-select-option=""
          data-value={value}
          hidden={!matches}
          id={id}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onMouseDown={(event) => event.preventDefault()}
          onPointerMove={handlePointerMove}
          ref={ref}
          role="option"
          style={style}
          tabIndex={-1}
        >
          {hasPart(children, OPTION_PARTS) ? (
            children
          ) : (
            <>
              <SelectOptionIcon />
              <SelectOptionBody>
                <SelectOptionText>{children ?? label}</SelectOptionText>
                <SelectOptionDescription />
              </SelectOptionBody>
              <SelectOptionCheck />
            </>
          )}
        </div>
      </SelectOptionContext.Provider>
    )
  },
)

SelectOption.displayName = 'SelectOption'
