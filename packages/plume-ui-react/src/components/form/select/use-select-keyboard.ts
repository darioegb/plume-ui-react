'use client'

import type { KeyboardEvent } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { isTypeaheadKey, matchTypeahead, useTypeahead } from '../../../overlay/use-typeahead'
import type { SelectOptionRecord } from './select-context'
import { getEnabledOptions, scrollOptionIntoView, stepOption } from './select-dom'

const openKeys = new Set(['ArrowDown', 'ArrowUp', 'Enter', ' '])
const removeKeys = new Set(['Backspace', 'Delete'])
const steps: Record<string, number> = {
  ArrowDown: 1,
  ArrowUp: -1,
  PageDown: 10,
  PageUp: -10,
}

interface UseSelectKeyboardOptions {
  canEdit: boolean
  canRemove: boolean
  clearLast: () => void
  close: (returnFocus: boolean) => void
  commit: (value: string) => void
  listbox: HTMLElement | null
  multiple: boolean
  open: boolean
  openList: () => void
  options: readonly SelectOptionRecord[]
  searchable: boolean
  select: (value: string) => void
  selected: readonly string[]
}

interface SelectKeyboard {
  activeId: string | undefined
  onListKeyDown: (event: KeyboardEvent, isTextInput: boolean) => void
  query: string
  setActiveId: (id: string | undefined) => void
  setQuery: (query: string) => void
}

export function useSelectKeyboard(options: UseSelectKeyboardOptions): SelectKeyboard {
  const { listbox, open } = options
  const [activeId, setActiveId] = useState<string | undefined>(undefined)
  const [query, setQuery] = useState('')
  const type = useTypeahead()
  const latest = useRef(options)
  latest.current = options

  useEffect(() => {
    if (!open) {
      setActiveId(undefined)
      setQuery('')
      return
    }
    const enabled = getEnabledOptions(listbox)
    const chosen = enabled.find((option) =>
      latest.current.selected.includes(option.dataset.value ?? ''),
    )
    const target = chosen ?? enabled[0]
    setActiveId(target?.id)
    scrollOptionIntoView(target)
  }, [open, listbox, query])

  const focusOption = (option: HTMLElement | undefined): void => {
    if (!option) return
    setActiveId(option.id)
    scrollOptionIntoView(option)
  }

  const typeaheadOpen = (key: string): void => {
    const enabled = getEnabledOptions(listbox)
    const labels = enabled.map((option) => option.dataset.label ?? '')
    const current = enabled.findIndex((option) => option.id === activeId)
    focusOption(enabled[matchTypeahead(labels, type(key), current)])
  }

  const typeaheadClosed = (key: string): void => {
    const records = latest.current.options
    const labels = records.map((record) => record.label)
    const current = records.findIndex((record) => latest.current.selected.includes(record.value))
    const match = matchTypeahead(labels, type(key), current, (index) => records[index].disabled)
    if (match >= 0) latest.current.commit(records[match].value)
  }

  const handleOpenKey = (event: KeyboardEvent, isTextInput: boolean): void => {
    const enabled = getEnabledOptions(listbox)
    if (event.key in steps) {
      event.preventDefault()
      focusOption(stepOption(enabled, activeId, steps[event.key]))
    } else if (!isTextInput && (event.key === 'Home' || event.key === 'End')) {
      event.preventDefault()
      focusOption(event.key === 'Home' ? enabled[0] : enabled[enabled.length - 1])
    } else if (event.key === 'Enter' || (event.key === ' ' && !isTextInput)) {
      event.preventDefault()
      const active = enabled.find((option) => option.id === activeId)
      if (active?.dataset.value !== undefined) latest.current.select(active.dataset.value)
    } else if (event.key === 'Tab') {
      latest.current.close(isTextInput)
    } else if (!isTextInput && isTypeaheadKey(event)) {
      typeaheadOpen(event.key)
    }
  }

  const handleClosedKey = (event: KeyboardEvent): void => {
    const { canEdit, canRemove, clearLast, multiple, openList, searchable } = latest.current
    if (openKeys.has(event.key)) {
      event.preventDefault()
      openList()
    } else if (removeKeys.has(event.key) && canRemove) {
      event.preventDefault()
      clearLast()
    } else if (isTypeaheadKey(event) && searchable) {
      event.preventDefault()
      setQuery(event.key)
      openList()
    } else if (isTypeaheadKey(event) && !multiple && canEdit) {
      typeaheadClosed(event.key)
    }
  }

  const handleKey = (event: KeyboardEvent, isTextInput: boolean): void => {
    if (open) handleOpenKey(event, isTextInput)
    else handleClosedKey(event)
  }
  const handler = useRef(handleKey)
  handler.current = handleKey
  const onListKeyDown = useCallback(
    (event: KeyboardEvent, isTextInput: boolean): void => handler.current(event, isTextInput),
    [],
  )

  return { activeId, onListKeyDown, query, setActiveId, setQuery }
}
