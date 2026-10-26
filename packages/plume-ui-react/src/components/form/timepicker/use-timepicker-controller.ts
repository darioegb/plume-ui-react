'use client'

import type { CSSProperties, FocusEvent } from 'react'
import { useCallback, useId, useMemo, useState } from 'react'
import type { ColorScheme, Shape, Size } from '../../../theme'
import { useLabels } from '../../../locale/locale-provider'
import { useControllableState } from '../../../overlay/use-controllable-state'
import { useFloatingPanel } from '../../../overlay/use-floating-panel'
import { useFocusTrap } from '../../../overlay/use-focus-trap'
import { customProperties, type PickerVariant } from '../shared/picker-panel'
import type { TimePickerContextProps } from './use-timepicker'
import { useTimePicks } from './use-time-picks'
import type { TimePickerLabels } from './timepicker-types'

const DEFAULT_LABELS: TimePickerLabels = {
  am: 'AM',
  format: (format) => `Format: ${format}`,
  hours: 'Hours',
  minutes: 'Minutes',
  openTimePicker: 'Open time picker',
  period: 'Period',
  pm: 'PM',
  timePicker: 'Time picker',
}

interface TimePickerControllerOptions {
  colorScheme: ColorScheme
  defaultValue: string
  hour12: boolean
  isPanel: boolean
  labels?: Partial<TimePickerLabels>
  minuteStep: number
  onChange?: (value: string) => void
  root: HTMLDivElement | null
  shape?: Shape
  size?: Size
  style?: CSSProperties
  value?: string
  variant: PickerVariant
}

interface TimePickerController {
  context: TimePickerContextProps
  handleBlur: (event: FocusEvent<HTMLDivElement>) => void
}

export const timePickerColorVars = (colorScheme: ColorScheme): CSSProperties =>
  ({
    '--picker-scheme': `var(--plume-color-${colorScheme}-text)`,
    '--timepicker-solid': `var(--plume-color-${colorScheme}-solid)`,
    '--timepicker-contrast': `var(--plume-color-${colorScheme}-solid-contrast)`,
    '--timepicker-hover': `color-mix(in srgb, var(--plume-color-${colorScheme}-solid) 18%, transparent)`,
    '--timepicker-selected-hover': `var(--plume-color-${colorScheme}-solid-hover)`,
  }) as CSSProperties

export function useTimePickerController({
  colorScheme,
  defaultValue,
  hour12,
  isPanel,
  labels: labelsProp,
  minuteStep,
  onChange,
  root,
  shape,
  size,
  style,
  value: valueProp,
  variant,
}: Readonly<TimePickerControllerOptions>): TimePickerController {
  const labels = useLabels('timePicker', DEFAULT_LABELS, labelsProp)
  const [value, setValue] = useControllableState({ defaultValue, onChange, value: valueProp })
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState<HTMLInputElement | null>(null)
  const popupOpen = !isPanel && open
  const panelId = useId()

  const { isTopmost, panel, position, setPanel } = useFloatingPanel({
    anchor: root,
    enabled: popupOpen,
    offset: 8,
    onDismiss: (reason) => {
      setOpen(false)
      if (reason === 'escape') input?.focus()
    },
    placement: 'bottom-start',
  })

  const initialOption = popupOpen
    ? (panel?.querySelector<HTMLElement>('[role="option"][tabindex="0"]') ?? null)
    : null
  useFocusTrap(panel, {
    active: popupOpen,
    initialFocus: initialOption,
    isTopmost,
    restoreFocus: false,
  })

  const { pickHours, pickMinutes, pickPeriod } = useTimePicks({
    hour12,
    onMinutesPicked: () => {
      if (isPanel) return
      setOpen(false)
      input?.focus()
    },
    setValue,
    value,
  })

  const toggle = useCallback((): void => setOpen((isOpen) => !isOpen), [])

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLDivElement>): void => {
      const next = event.relatedTarget as Node | null
      if (next && !event.currentTarget.contains(next) && !panel?.contains(next)) setOpen(false)
    },
    [panel],
  )

  const panelVars = useMemo(
    () => ({ ...timePickerColorVars(colorScheme), ...customProperties(style) }),
    [colorScheme, style],
  )
  const panelStyle = useMemo<CSSProperties>(
    () =>
      isPanel
        ? panelVars
        : { ...panelVars, ...position.style, opacity: position.isPositioned ? undefined : 0 },
    [isPanel, panelVars, position.isPositioned, position.style],
  )

  const context = useMemo<TimePickerContextProps>(
    () => ({
      colorScheme,
      hour12,
      isPanel,
      labels,
      minuteStep,
      open,
      panelId,
      panelStyle,
      pickHours,
      pickMinutes,
      pickPeriod,
      setInput,
      setPanel,
      setValue,
      shape,
      size,
      toggle,
      value,
      variant,
    }),
    [
      colorScheme,
      hour12,
      isPanel,
      labels,
      minuteStep,
      open,
      panelId,
      panelStyle,
      pickHours,
      pickMinutes,
      pickPeriod,
      setPanel,
      setValue,
      shape,
      size,
      toggle,
      value,
      variant,
    ],
  )

  return { context, handleBlur }
}
