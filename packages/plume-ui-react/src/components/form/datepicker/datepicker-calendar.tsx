'use client'

import type { CSSProperties, ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useMemo } from 'react'
import type { ComponentProps } from '../../../theme'
import { joinClasses } from '../../../overlay/class-names'
import { Portal } from '../../../overlay'
import { mergeRefs } from '../../../overlay/trigger'
import { pickerPanelClasses } from '../shared/picker-panel'
import { DatePickerFooter } from './datepicker-footer'
import { DatePickerPages } from './datepicker-pages'
import { useDatePickerContext } from './datepicker-context'
import styles from './datepicker.module.css'

export type DatePickerCalendarProps = Omit<ComponentProps, 'index'> &
  Pick<HTMLAttributes<HTMLDivElement>, 'aria-label' | 'children'>

const dialogRole = 'dialog'

const VARIANT_CLASS = {
  filled: 'variantFilled',
  outline: 'variantOutline',
  underline: 'variantUnderline',
} as const

/**
 * The popup that opens under the input, or the content of the page when the `DatePicker` is `panel`. Its accessible name is `labels.calendar`.
 */
export const DatePickerCalendar = forwardRef<HTMLDivElement, DatePickerCalendarProps>(
  (
    { 'aria-label': ariaLabel, children, className, style }: DatePickerCalendarProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const {
      calendarId,
      isPanel,
      labels,
      panelVars,
      position,
      setPanel,
      shape,
      showFooter,
      size,
      state,
      variant,
    } = useDatePickerContext('DatePickerCalendar')
    const setRef = useMemo(() => mergeRefs(setPanel, ref), [ref, setPanel])
    const isStyled = variant !== 'unstyled'

    if (!isPanel && !state.modalOpen) return null

    const floatingStyle: CSSProperties | undefined = isPanel
      ? undefined
      : {
          ...panelVars,
          ...position.style,
          margin: 0,
          opacity: position.isPositioned ? undefined : 0,
        }

    const calendar = (
      <div
        aria-label={ariaLabel ?? labels.calendar}
        aria-modal={isPanel ? undefined : true}
        className={joinClasses(
          isStyled && styles.datePickerModal,
          pickerPanelClasses(variant, size, shape),
          isStyled && styles[VARIANT_CLASS[variant]],
          isStyled && isPanel && styles.inline,
          isStyled && size === 'sm' && styles.daySm,
          isStyled && size === 'lg' && styles.dayLg,
          className,
        )}
        data-inline={isPanel ? '' : undefined}
        data-open={state.modalOpen ? '' : undefined}
        data-plume-datepicker-calendar=""
        id={isPanel ? undefined : calendarId}
        ref={setRef}
        role={dialogRole}
        style={{ ...floatingStyle, ...style }}
      >
        {children ?? (
          <>
            <DatePickerPages />
            {showFooter ? <DatePickerFooter /> : null}
          </>
        )}
      </div>
    )

    return isPanel ? calendar : <Portal>{calendar}</Portal>
  },
)

DatePickerCalendar.displayName = 'DatePickerCalendar'
