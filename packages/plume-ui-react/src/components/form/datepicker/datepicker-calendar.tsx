'use client'

import type { CSSProperties, ReactNode } from 'react'
import type { ComponentProps } from '../../../theme'
import { joinClasses } from '../../../overlay/class-names'
import { Portal } from '../../../overlay'
import { Button } from '../../interaction/button'
import { pickerPanelClasses } from '../shared/picker-panel'
import { Calendar } from './calendar'
import { useDatePicker } from './use-datepicker'
import styles from './datepicker.module.css'

export type DatePickerCalendarProps = Omit<ComponentProps, 'index'> & {
  'aria-label'?: string
}

const dialogRole = 'dialog'

const VARIANT_CLASS = {
  filled: 'variantFilled',
  outline: 'variantOutline',
  underline: 'variantUnderline',
} as const

function FooterActions(): ReactNode {
  const {
    closeAndRestoreFocus,
    colorScheme,
    labels: { apply, cancel },
    onApply,
  } = useDatePicker('DatePickerCalendar')

  return (
    <div className={styles.footerActions}>
      <Button
        className={styles.footerButton}
        label={cancel}
        onClick={closeAndRestoreFocus}
        variant="ghost"
      />
      <Button
        className={styles.footerButtonApply}
        colorScheme={colorScheme}
        label={apply}
        onClick={onApply}
      />
    </div>
  )
}

export function DatePickerCalendar({
  'aria-label': ariaLabel,
  className,
  style,
}: Readonly<DatePickerCalendarProps>): ReactNode {
  const {
    isCalendar,
    isRange,
    labels,
    language,
    maxDate,
    minDate,
    onFirstMonthChange,
    onFirstYearChange,
    onSecondMonthChange,
    onSecondYearChange,
    onSelectDate,
    panelVars,
    position,
    setPanel,
    shape,
    showFooter,
    size,
    state,
    variant,
  } = useDatePicker('DatePickerCalendar')

  if (!isCalendar && !state.modalOpen) return null

  const floatingStyle: CSSProperties | undefined = isCalendar
    ? undefined
    : { ...panelVars, ...position.style, margin: 0, opacity: position.isPositioned ? undefined : 0 }

  const calendar = (
    <div
      aria-label={ariaLabel ?? labels.calendar}
      className={joinClasses(
        styles.datePickerModal,
        pickerPanelClasses(variant, size, shape),
        variant !== 'unstyled' && styles[VARIANT_CLASS[variant]],
        isCalendar && styles.inline,
        size === 'sm' && styles.daySm,
        size === 'lg' && styles.dayLg,
        className,
      )}
      ref={setPanel}
      role={dialogRole}
      style={{ ...floatingStyle, ...style }}
    >
      <div className={isRange ? styles.calendarContainerDouble : styles.calendarContainer}>
        <Calendar
          isRange={isRange}
          language={language}
          maxDate={maxDate}
          minDate={minDate}
          onMonthChange={onFirstMonthChange}
          onSelectDate={onSelectDate}
          onYearChange={onFirstYearChange}
        />
        {isRange ? (
          <Calendar
            isRange={isRange}
            isSecondCalendar
            language={language}
            maxDate={maxDate}
            minDate={minDate}
            onMonthChange={onSecondMonthChange}
            onSelectDate={onSelectDate}
            onYearChange={onSecondYearChange}
          />
        ) : null}
      </div>
      {showFooter ? <FooterActions /> : null}
    </div>
  )

  return isCalendar ? calendar : <Portal>{calendar}</Portal>
}
