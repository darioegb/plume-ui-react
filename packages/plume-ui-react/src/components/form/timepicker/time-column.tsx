'use client'

import type { CSSProperties, KeyboardEvent, ReactNode, Ref } from 'react'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { mergeRefs } from '../../../overlay/trigger'
import { TimeColumnContext, type TimeColumnContextValue } from './time-column-context'
import { TimePickerOption, type TimePickerOptionData } from './timepicker-option'
import { useTimePickerContext } from './timepicker-context'
import styles from './timepicker.module.css'

export type TimeColumnKind = 'hours' | 'minutes' | 'period'

export interface TimeColumnProps<T extends number | string> {
  children?: (option: TimePickerOptionData<T>) => ReactNode
  className?: string
  columnRef?: Ref<HTMLDivElement>
  kind: TimeColumnKind
  label: string
  onSelect: (value: T) => void
  options: TimePickerOptionData<T>[]
  selected?: T
  style?: CSSProperties
}

const KEY_TARGETS: Record<string, (index: number, last: number) => number> = {
  ArrowDown: (index, last) => Math.min(index + 1, last),
  ArrowUp: (index) => Math.max(index - 1, 0),
  End: (_, last) => last,
  Home: () => 0,
}

const focusOption = (event: KeyboardEvent<HTMLButtonElement>): void => {
  const move = KEY_TARGETS[event.key]
  const list = event.currentTarget.closest('[role="listbox"]')
  if (!move || !list) return
  const buttons = Array.from(list.querySelectorAll<HTMLButtonElement>('[role="option"]'))
  event.preventDefault()
  buttons[move(buttons.indexOf(event.currentTarget), buttons.length - 1)].focus()
}

export function TimeColumn<T extends number | string>({
  children,
  className,
  columnRef,
  kind,
  label,
  onSelect,
  options,
  selected,
  style,
}: Readonly<TimeColumnProps<T>>): ReactNode {
  const { variant } = useTimePickerContext('TimePickerColumn')
  const list = useRef<HTMLDivElement>(null)
  const [focused, setFocused] = useState<T | undefined>(undefined)
  const defaultStop = options.some((option) => option.value === selected)
    ? selected
    : options[0]?.value
  const tabStop = options.some((option) => option.value === focused) ? focused : defaultStop

  useEffect(() => {
    const container = list.current
    const current = container?.querySelector<HTMLElement>('[aria-selected="true"]')
    if (container && current) {
      container.scrollTop = current.offsetTop - (container.clientHeight - current.offsetHeight) / 2
    }
  }, [])

  const context = useMemo<TimeColumnContextValue>(
    () => ({
      isSelected: (value) => value === selected,
      isTabStop: (value) => value === tabStop,
      onFocus: (value) => {
        setFocused(value as T)
      },
      onKeyDown: focusOption,
      select: (value) => {
        onSelect(value as T)
      },
    }),
    [onSelect, selected, tabStop],
  )

  return (
    <TimeColumnContext.Provider value={context}>
      <div
        aria-label={label}
        className={joinClasses(variant !== 'unstyled' && styles.column, className)}
        data-plume-timepicker-column=""
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setFocused(undefined)
        }}
        ref={mergeRefs<HTMLDivElement>(list, columnRef)}
        role="listbox"
        style={style}
        {...{ [`data-plume-timepicker-${kind}`]: '' }}
      >
        {options.map((option) =>
          children ? (
            <Fragment key={option.value}>{children(option)}</Fragment>
          ) : (
            <TimePickerOption key={option.value} option={option} />
          ),
        )}
      </div>
    </TimeColumnContext.Provider>
  )
}

TimeColumn.displayName = 'TimeColumn'
