'use client'

import type { ChangeEvent, ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useMemo } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { mergeRefs } from '../../../overlay/trigger'
import type { ComponentProps } from '../../../theme'
import { useSliderContext } from './slider-context'
import styles from './slider.module.css'

export interface SliderThumbOwnProps {
  index?: number
}

export type SliderThumbProps = Omit<ComponentProps, 'index'> &
  Pick<HTMLAttributes<HTMLInputElement>, 'aria-label' | 'title'> &
  SliderThumbOwnProps

export const SliderThumb = forwardRef<HTMLInputElement, SliderThumbProps>(
  (
    { 'aria-label': ariaLabelProp, className, index = 0, style, title }: SliderThumbProps,
    ref: ForwardedRef<HTMLInputElement>,
  ): ReactNode => {
    const context = useSliderContext('SliderThumb')
    const { inputs, rootRef } = context
    const setRef = useMemo(
      () =>
        mergeRefs<HTMLInputElement>(
          index === 0 ? rootRef : undefined,
          (node) => {
            inputs.current[index] = node
          },
          ref,
        ),
      [index, inputs, ref, rootRef],
    )
    const current = context.values[index]
    if (current === undefined) return null

    const {
      ariaLabel,
      commit,
      describedBy,
      disabled,
      firstId,
      formatValue,
      fractions,
      isInvalid,
      isRange,
      isStyled,
      labelledBy,
      max,
      min,
      name,
      readOnly,
      step,
      text,
      update,
    } = context

    return (
      <input
        aria-describedby={describedBy}
        aria-invalid={isInvalid || undefined}
        aria-label={ariaLabelProp ?? (isRange ? text.thumb(index) : ariaLabel)}
        aria-labelledby={isRange ? undefined : labelledBy}
        aria-readonly={readOnly || undefined}
        aria-valuetext={formatValue?.(current)}
        className={joinClasses(isStyled && styles.thumb, className)}
        data-front={index === 0 && (fractions[0] ?? 0) > 0.5 ? '' : undefined}
        data-plume-slider-thumb=""
        disabled={disabled}
        id={index === 0 ? firstId : `${firstId}-${index}`}
        max={max}
        min={min}
        name={name}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          if (!readOnly) update(index, Number(event.target.value))
        }}
        onKeyUp={commit}
        onPointerUp={commit}
        ref={setRef}
        step={step}
        style={style}
        title={title}
        type="range"
        value={current}
      />
    )
  },
)

SliderThumb.displayName = 'SliderThumb'
