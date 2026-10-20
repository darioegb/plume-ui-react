'use client'

import type { ForwardedRef, KeyboardEvent, MouseEvent, ReactNode } from 'react'
import { forwardRef, useEffect, useId, useRef, useState } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { CheckIcon } from '../../../overlay/icons'
import type { ComponentProps } from '../../../theme'
import { useSelectContext, type SelectOptionRecord } from './select-context'
import styles from './select.module.css'

export type SelectOptionPart = 'check' | 'checkbox' | 'description' | 'icon'

export interface SelectOptionOwnProps {
  children?: ReactNode
  classNames?: Partial<Record<SelectOptionPart, string>>
  description?: ReactNode
  disabled?: boolean
  icon?: ReactNode
  label?: string
  value: string
}

export type SelectOptionProps = Omit<ComponentProps, 'index'> & SelectOptionOwnProps

export const SelectOption = forwardRef<HTMLDivElement, SelectOptionProps>(
  (
    {
      children,
      className = '',
      classNames,
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
    const textRef = useRef<HTMLSpanElement>(null)
    const iconRef = useRef(icon)
    const [text, setText] = useState(label ?? '')
    const { isStyled, multiple, query, register, select, setActiveId } = context
    const resolved = label ?? text
    iconRef.current = icon

    useEffect(() => {
      if (label === undefined) setText(textRef.current?.textContent ?? '')
    }, [children, label])

    useEffect(() => {
      const record: SelectOptionRecord = {
        disabled,
        get icon() {
          return iconRef.current
        },
        label: resolved,
        value,
      }
      return register(record)
    }, [disabled, register, resolved, value])

    const selected = context.isSelected(value)
    const matches = !query || resolved.toLowerCase().includes(query.toLowerCase())
    const classes = [isStyled && styles.option, className].filter(Boolean).join(' ')

    const handlePointerMove = (): void => {
      if (!disabled && context.activeId !== id) setActiveId(id)
    }

    const handleClick = (event: MouseEvent<HTMLDivElement>): void => {
      event.preventDefault()
      if (!disabled) select(value)
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      event.preventDefault()
      if (!disabled) select(value)
    }

    return (
      <div
        aria-disabled={disabled || undefined}
        aria-labelledby={description ? `${textId} ${descriptionId}` : undefined}
        aria-selected={selected}
        className={classes || undefined}
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
        {multiple ? (
          <span
            aria-hidden="true"
            className={joinClasses(isStyled && styles.checkbox, classNames?.checkbox)}
          >
            {selected ? <CheckIcon /> : null}
          </span>
        ) : null}
        {icon ? (
          <span
            aria-hidden="true"
            className={joinClasses(isStyled && styles.optionIcon, classNames?.icon)}
          >
            {icon}
          </span>
        ) : null}
        <span className={isStyled ? styles.optionBody : undefined} data-plume-select-option-body="">
          <span id={textId} ref={textRef}>
            {children ?? label}
          </span>
          {description ? ' ' : null}
          {description ? (
            <span
              className={joinClasses(isStyled && styles.description, classNames?.description)}
              id={descriptionId}
            >
              {description}
            </span>
          ) : null}
        </span>
        {!multiple && selected ? (
          <span
            aria-hidden="true"
            className={joinClasses(isStyled && styles.check, classNames?.check)}
          >
            <CheckIcon />
          </span>
        ) : null}
      </div>
    )
  },
)

SelectOption.displayName = 'SelectOption'
