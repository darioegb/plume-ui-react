'use client'

import type { KeyboardEvent, ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import styles from './timepicker.module.css'

export interface TimeOption<T extends number | string> {
  label: string
  value: T
}

export interface TimeColumnProps<T extends number | string> {
  label: string
  onSelect: (value: T) => void
  options: TimeOption<T>[]
  selected?: T
}

const KEY_TARGETS: Record<string, (index: number, last: number) => number> = {
  ArrowDown: (index, last) => Math.min(index + 1, last),
  ArrowUp: (index) => Math.max(index - 1, 0),
  End: (_, last) => last,
  Home: () => 0,
}

export function TimeColumn<T extends number | string>({
  label,
  onSelect,
  options,
  selected,
}: Readonly<TimeColumnProps<T>>): ReactNode {
  const list = useRef<HTMLDivElement>(null)
  const tabStop = options.some((option) => option.value === selected) ? selected : options[0]?.value

  useEffect(() => {
    const container = list.current
    const current = container?.querySelector<HTMLElement>('[aria-selected="true"]')
    if (container && current) {
      container.scrollTop = current.offsetTop - (container.clientHeight - current.offsetHeight) / 2
    }
  }, [])

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    const move = KEY_TARGETS[event.key]
    const list = event.currentTarget.parentElement
    if (!move || !list) return
    const buttons = Array.from(list.querySelectorAll<HTMLButtonElement>('[role="option"]'))
    event.preventDefault()
    buttons[move(buttons.indexOf(event.currentTarget), buttons.length - 1)].focus()
  }

  return (
    <div aria-label={label} className={styles.column} ref={list} role="listbox">
      {options.map((option) => (
        <button
          aria-selected={option.value === selected}
          className={
            option.value === selected ? `${styles.option} ${styles.selected}` : styles.option
          }
          key={option.value}
          onClick={() => {
            onSelect(option.value)
          }}
          onKeyDown={handleKeyDown}
          role="option"
          tabIndex={option.value === tabStop ? 0 : -1}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
