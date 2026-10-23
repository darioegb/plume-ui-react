'use client'

import type { CSSProperties, ReactNode } from 'react'
import type { ComponentProps } from '../../../theme'
import { joinClasses } from '../../../overlay/class-names'
import { Button } from '../../interaction/button'
import { Calendar } from './calendar'
import { useDatePicker } from './use-datepicker'
import styles from './datepicker.module.css'

export type DatePickerCalendarProps = Omit<ComponentProps, 'index'> & {
  'aria-label'?: string
}

const dialogRole = 'dialog'

function FooterActions(): ReactNode {
  const {
    closeAndRestoreFocus,
    colorScheme,
    footerLabels: { apply, cancel },
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
    position,
    setPanel,
    showFooter,
    state,
  } = useDatePicker('DatePickerCalendar')

  if (!isCalendar && !state.modalOpen) return null

  const floatingStyle: CSSProperties | undefined = isCalendar
    ? undefined
    : { ...position.style, margin: 0, opacity: position.isPositioned ? undefined : 0 }

  return (
    <div
      aria-label={ariaLabel ?? labels.calendar}
      className={joinClasses(styles.datePickerModal, className)}
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
}
