'use client'

import type { CSSProperties, ForwardedRef, ReactNode } from 'react'
import { forwardRef, useCallback, useId, useMemo, useRef } from 'react'
import { hasPart } from '../../../overlay/has-part'
import { joinClasses } from '../../../overlay/class-names'
import { useLabels } from '../../../locale/locale-provider'
import { useControllableState } from '../../../overlay/use-controllable-state'
import type { ColorScheme, ComponentProps, Size } from '../../../theme'
import { useFieldContext } from '../field/field-context'
import { SliderBody } from './slider-body'
import {
  SliderContext,
  sliderColorVars,
  type SliderContextValue,
  type SliderLabels,
  type SliderMark,
  type SliderRootAttributes,
} from './slider-context'
import { SliderMarks } from './slider-marks'
import { clamp, fractionOf, resolveMarks, snap, toValues } from './slider-math'
import { SliderThumb } from './slider-thumb'
import { SliderTrack } from './slider-track'
import styles from './slider.module.css'
import { useTrackPress } from './use-track-press'

export type { SliderLabels, SliderMark }

export type SliderValue = number | [number, number]

export type SliderVariant = 'outline' | 'solid' | 'unstyled'

export type SliderOrientation = 'horizontal' | 'vertical'

export interface SliderOwnProps {
  /**
   * The parts of the slider, in the order they should appear. Without children it renders the
   * track, the marks and one `SliderThumb` per value.
   */
  children?: ReactNode
  /**
   * Color scheme from the theme palette, custom schemes included.
   * @default 'primary'
   */
  colorScheme?: ColorScheme
  /**
   * The value when the slider is not controlled: a number, or a pair for a range. It starts at the
   * minimum without it.
   */
  defaultValue?: SliderValue
  /**
   * Disables the slider.
   * @default false
   */
  disabled?: boolean
  /** Returns the text for a value, which screen readers read: `$40`. */
  formatValue?: (value: number) => string
  /**
   * Marks the slider as invalid: it turns to the error color.
   * @default false
   */
  invalid?: boolean
  /**
   * The texts of the slider, for other languages: `thumb(index)` is the accessible name of a thumb
   * of a range, from its index (`Minimum` and `Maximum` by default).
   */
  labels?: Partial<SliderLabels>
  /**
   * Shows marks on the track. `true` puts one on every step, a list of numbers puts them there, and
   * a list of `{ value, label }` also writes a label under each. They are hidden from assistive
   * technology.
   */
  marks?: boolean | number[] | SliderMark[]
  /**
   * The largest value.
   * @default 100
   */
  max?: number
  /**
   * The smallest value.
   * @default 0
   */
  min?: number
  /** Name of the input in a form. A range sends both values with the same name. */
  name?: string
  /** Called with the new value, a number or a pair, while the user drags or presses a key. */
  onValueChange?: (value: SliderValue) => void
  /** Called with the final value when the user lets go of a thumb or releases a key. */
  onValueCommit?: (value: SliderValue) => void
  /**
   * Direction of the track. A vertical slider is 12rem high, and its minimum is at the bottom.
   * @default 'horizontal'
   */
  orientation?: SliderOrientation
  /**
   * Shows the value without letting the user change it. It stays reachable, and has
   * `aria-readonly`.
   * @default false
   */
  readOnly?: boolean
  /**
   * Size of the thumb and the track.
   * @default 'md'
   */
  size?: Size
  /**
   * The distance between two values. The value snaps to it.
   * @default 1
   */
  step?: number
  /**
   * The value: a number, or a pair of numbers for a range. Makes the slider controlled: pass
   * `onValueChange` to update it.
   */
  value?: SliderValue
  /**
   * Visual variant. `solid` has a thick track and a filled thumb, `outline` a thin track and a
   * hollow thumb. `unstyled` renders only the native inputs, so you can bring your own styles.
   * @default 'solid'
   */
  variant?: SliderVariant
}

export type SliderProps = Omit<ComponentProps, 'index'> & SliderRootAttributes & SliderOwnProps

const DEFAULT_LABELS: SliderLabels = {
  thumb: (index) => (index === 0 ? 'Minimum' : 'Maximum'),
}

const SLIDER_PARTS = [SliderBody] as const

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      'aria-describedby': describedBy,
      'aria-invalid': ariaInvalid,
      'aria-label': ariaLabel,
      'aria-labelledby': labelledByProp,
      children,
      className,
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
    const values = useMemo(
      () => toValues(value).map((current) => clamp(current, min, max)),
      [max, min, value],
    )
    const isStyled = variant !== 'unstyled'
    const text = useLabels('slider', DEFAULT_LABELS, labels)
    const isInvalid = invalid || ariaInvalid === true || ariaInvalid === 'true'
    const firstId = id ?? generatedId
    const fieldLabelId = field?.controlId === id ? field?.labelId : undefined
    const labelledBy = labelledByProp ?? (ariaLabel ? undefined : fieldLabelId)
    const fractions = useMemo(
      () => values.map((current) => fractionOf(current, min, max)),
      [max, min, values],
    )
    const resolvedMarks = useMemo(
      () => resolveMarks(marks, min, max, step),
      [marks, max, min, step],
    )
    const Root = isRange ? 'fieldset' : 'div'

    const update = useCallback(
      (index: number, requested: number): void => {
        const next = snap(requested, min, max, step)
        const [lower, upper] = index === 0 ? [min, values[1] ?? max] : [values[0] ?? min, max]
        const bounded = isRange ? clamp(next, lower, upper) : next
        if (bounded === values[index]) return
        const result = values.map((current, position) => (position === index ? bounded : current))
        setValue(isRange ? ([result[0] ?? min, result[1] ?? max] as [number, number]) : bounded)
      },
      [isRange, max, min, setValue, step, values],
    )

    const commit = useCallback((): void => {
      if (!onValueCommit) return
      const latest = inputs.current.map((input, index) => Number(input?.value ?? values[index]))
      onValueCommit(isRange ? [latest[0] ?? min, latest[1] ?? max] : (latest[0] ?? min))
    }, [isRange, max, min, onValueCommit, values])

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

    const context: SliderContextValue = useMemo(
      () => ({
        ariaLabel,
        commit,
        describedBy,
        disabled,
        firstId,
        formatValue,
        fractions,
        inputs,
        isInvalid,
        isRange,
        isStyled,
        labelledBy,
        marks: resolvedMarks,
        max,
        min,
        name,
        readOnly,
        rootRef: ref ?? undefined,
        step,
        text,
        update,
        values,
      }),
      [
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
        ref,
        resolvedMarks,
        step,
        text,
        update,
        values,
      ],
    )

    const rootStyle = {
      '--slider-end': fractions[fractions.length - 1],
      '--slider-start': isRange ? fractions[0] : 0,
      ...sliderColorVars(colorScheme, style),
    } as CSSProperties
    const rootProps = isRange
      ? { 'aria-label': ariaLabel, 'aria-labelledby': labelledBy, disabled }
      : {}

    const defaultParts = (
      <>
        {isStyled ? (
          <>
            <SliderTrack />
            <SliderMarks />
          </>
        ) : null}
        {values.map((_, index) => (
          <SliderThumb index={index} key={index === 0 ? 'start' : 'end'} />
        ))}
      </>
    )
    const parts = children ?? defaultParts

    return (
      <SliderContext.Provider value={context}>
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
          {hasPart(children, SLIDER_PARTS) ? children : <SliderBody>{parts}</SliderBody>}
        </Root>
      </SliderContext.Provider>
    )
  },
)

Slider.displayName = 'Slider'
