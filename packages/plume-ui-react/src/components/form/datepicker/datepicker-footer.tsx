'use client'

import type { ButtonHTMLAttributes, ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { Button } from '../../interaction/button'
import { useDatePicker } from './use-datepicker'
import styles from './datepicker.module.css'

type PartProps = Omit<ComponentProps, 'index'>

export type DatePickerFooterProps = PartProps & Pick<HTMLAttributes<HTMLDivElement>, 'children'>
export type DatePickerCancelProps = PartProps &
  Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>
export type DatePickerApplyProps = PartProps &
  Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>

export const DatePickerCancel = forwardRef<HTMLButtonElement, DatePickerCancelProps>(
  (
    { children, className, style }: DatePickerCancelProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const { closeAndRestoreFocus, labels } = useDatePicker('DatePickerCancel')

    return (
      <Button
        className={joinClasses(styles.footerButton, className)}
        data-plume-datepicker-cancel=""
        label={children ? undefined : labels.cancel}
        onClick={closeAndRestoreFocus}
        ref={ref}
        style={style}
        variant="ghost"
      >
        {children}
      </Button>
    )
  },
)

DatePickerCancel.displayName = 'DatePickerCancel'

export const DatePickerApply = forwardRef<HTMLButtonElement, DatePickerApplyProps>(
  (
    { children, className, style }: DatePickerApplyProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const { colorScheme, labels, onApply } = useDatePicker('DatePickerApply')

    return (
      <Button
        className={joinClasses(styles.footerButtonApply, className)}
        colorScheme={colorScheme}
        data-plume-datepicker-apply=""
        label={children ? undefined : labels.apply}
        onClick={onApply}
        ref={ref}
        style={style}
      >
        {children}
      </Button>
    )
  },
)

DatePickerApply.displayName = 'DatePickerApply'

export const DatePickerFooter = forwardRef<HTMLDivElement, DatePickerFooterProps>(
  (
    { children, className, style }: DatePickerFooterProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    useDatePicker('DatePickerFooter')

    return (
      <div
        className={joinClasses(styles.footerActions, className)}
        data-plume-datepicker-footer=""
        ref={ref}
        style={style}
      >
        {children ?? (
          <>
            <DatePickerCancel />
            <DatePickerApply />
          </>
        )}
      </div>
    )
  },
)

DatePickerFooter.displayName = 'DatePickerFooter'
