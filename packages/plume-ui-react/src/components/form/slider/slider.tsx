'use client'

import type { ChangeEvent, CSSProperties, ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useId, useRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { useLabels } from '../../../locale/locale-provider'
import { mergeRefs } from '../../../overlay/trigger'
import { useControllableState } from '../../../overlay/use-controllable-state'
import type { ColorScheme, ComponentProps, Size } from '../../../theme'
import { useFieldContext } from '../field/field-context'
import { SliderMarks, type SliderMark } from './slider-marks'
import { clamp, fractionOf, snap, toValues } from './slider-math'
import styles from './slider.module.css'
import { useTrackPress } from './use-track-press'

export type { SliderMark }

export type SliderValue = number | [number, number]

export type SliderVariant = 'outline' | 'solid' | 'unstyled'

export type SliderOrientation = 'horizontal' | 'vertical'

export type SliderPart = 'mark' | 'markLabel' | 'range' | 'thumb' | 'track'

export interface SliderLabels {
  thumb: (index: number) => string
}

export interface SliderOwnProps {
  classNames?: Partial<Record<SliderPart, string>>
  colorScheme?: ColorScheme
  defaultValue?: SliderValue
  disabled?: boolean
  formatValue?: (value: number) => string
  invalid?: boolean
  labels?: Partial<SliderLabels>
  marks?: boolean | number[] | SliderMark[]
  max?: number
  min?: number
  name?: string
  onValueChange?: (value: SliderValue) => void
  onValueCommit?: (value: SliderValue) => void
  orientation?: SliderOrientation
  readOnly?: boolean
  size?: Size
  step?: number
  value?: SliderValue
  variant?: SliderVariant
}

type SliderRootAttributes = Pick<
  HTMLAttributes<HTMLElement>,
  'aria-describedby' | 'aria-invalid' | 'aria-label' | 'aria-labelledby' | 'hidden' | 'id' | 'title'
>

export type SliderProps = Omit<ComponentProps, 'children' | 'index'> &
  SliderRootAttributes &
  SliderOwnProps

const DEFAULT_LABELS: SliderLabels = {
  thumb: (index) => (index === 0 ? 'Minimum' : 'Maximum'),
}

const sliderColorVars = (colorScheme: ColorScheme, style?: CSSProperties): CSSProperties =>
  ({
    '--slider-solid': `var(--plume-color-${colorScheme}-solid)`,
    '--slider-text': `var(--plume-color-${colorScheme}-text)`,
    '--slider-tint': `var(--plume-color-${colorScheme}-tint)`,
    ...style,
  }) as CSSProperties

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      'aria-describedby': describedBy,
      'aria-invalid': ariaInvalid,
      'aria-label': ariaLabel,
      'aria-labelledby': labelledByProp,
      className,
      classNames,
      colorScheme = 'primary',
      defaultValue,
      disabled = false,
      formatValue,
      id,
      invalid = false,
      labels,
      marks,
      max = 100,
      min = 0,
      name,
      onValueChange,
      onValueCommit,
      orientation = 'horizontal',
      readOnly = false,
      size = 'md',
      step = 1,
      style,
      value: valueProp,
      variant = 'solid',
      ...rest
    }: SliderProps,
    ref: ForwardedRef<HTMLInputElement>,
  ): ReactNode => {
    const field = useFieldContext()
    const generatedId = useId()
    const inputs = useRef<(HTMLInputElement | null)[]>([])
    const [value, setValue] = useControllableState<SliderValue>({
      defaultValue: defaultValue ?? min,
      onChange: onValueChange,
      value: valueProp,
    })
    const isRange = Array.isArray(value)
    const values = toValues(value).map((current) => clamp(current, min, max))
    const isStyled = variant !== 'unstyled'
    const text = useLabels('slider', DEFAULT_LABELS, labels)
    const isInvalid = invalid || ariaInvalid === true || ariaInvalid === 'true'
    const firstId = id ?? generatedId
    const fieldLabelId = field?.controlId === id ? field?.labelId : undefined
    const labelledBy = labelledByProp ?? (ariaLabel ? undefined : fieldLabelId)
    const fractions = values.map((current) => fractionOf(current, min, max))
    const Root = isRange ? 'fieldset' : 'div'

    const limitsOf = (index: number): [number, number] =>
      index === 0 ? [min, values[1] ?? max] : [values[0] ?? min, max]

    const update = (index: number, requested: number): void => {
      const next = snap(requested, min, max, step)
      const bounded = isRange ? clamp(next, ...limitsOf(index)) : next
      if (bounded === values[index]) return
      const result = values.map((current, position) => (position === index ? bounded : current))
      setValue(isRange ? ([result[0] ?? min, result[1] ?? max] as [number, number]) : bounded)
    }

    const register = (index: number) =>
      mergeRefs<HTMLInputElement>(index === 0 ? (ref ?? undefined) : undefined, (node) => {
        inputs.current[index] = node
      })

    const commit = (): void => {
      if (!onValueCommit) return
      const latest = inputs.current.map((input, index) => Number(input?.value ?? values[index]))
      onValueCommit(isRange ? [latest[0] ?? min, latest[1] ?? max] : (latest[0] ?? min))
    }

    const track = useTrackPress({
      commit,
      disabled,
      inputs,
      isRange,
      max,
      min,
      orientation,
      readOnly,
      update,
      values,
    })

    const rootStyle = {
      '--slider-end': fractions[fractions.length - 1],
      '--slider-start': isRange ? fractions[0] : 0,
      ...sliderColorVars(colorScheme, style),
    } as CSSProperties
    const rootProps = isRange
      ? { 'aria-label': ariaLabel, 'aria-labelledby': labelledBy, disabled }
      : {}

    return (
      <Root
        {...rest}
        {...rootProps}
        className={joinClasses(
          isStyled && styles.slider,
          isStyled && styles[variant],
          isStyled && styles[size],
          isStyled && styles[orientation],
          isStyled && isInvalid && styles.invalid,
          isStyled && disabled && styles.disabled,
          className,
        )}
        data-disabled={disabled ? '' : undefined}
        data-orientation={orientation}
        data-plume-slider=""
        data-range={isRange ? '' : undefined}
        {...track}
        style={rootStyle}
      >
        <div className={joinClasses(isStyled && styles.body)} data-plume-slider-body="">
          {isStyled ? (
            <>
              <span
                className={joinClasses(styles.track, classNames?.track)}
                data-plume-slider-track=""
              >
                <span
                  className={joinClasses(styles.range, classNames?.range)}
                  data-plume-slider-range=""
                />
              </span>
              <SliderMarks
                classNames={classNames}
                marks={marks}
                max={max}
                min={min}
                step={step}
                values={values}
              />
            </>
          ) : null}
          {values.map((current, index) => (
            <input
              aria-describedby={describedBy}
              aria-invalid={isInvalid || undefined}
              aria-label={isRange ? text.thumb(index) : ariaLabel}
              aria-labelledby={isRange ? undefined : labelledBy}
              aria-readonly={readOnly || undefined}
              aria-valuetext={formatValue?.(current)}
              className={joinClasses(isStyled && styles.thumb, classNames?.thumb)}
              data-front={
                index === 0 && fractions[0] !== undefined && fractions[0] > 0.5 ? '' : undefined
              }
              data-plume-slider-thumb=""
              disabled={disabled}
              id={index === 0 ? firstId : `${firstId}-${index}`}
              key={index === 0 ? 'start' : 'end'}
              max={max}
              min={min}
              name={name}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                if (!readOnly) update(index, Number(event.target.value))
              }}
              onKeyUp={commit}
              onPointerUp={commit}
              ref={register(index)}
              step={step}
              type="range"
              value={current}
            />
          ))}
        </div>
      </Root>
    )
  },
)

Slider.displayName = 'Slider'
