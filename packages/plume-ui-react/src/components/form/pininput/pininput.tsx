'use client'

import type { CSSProperties, ForwardedRef, InputHTMLAttributes, ReactNode } from 'react'
import { forwardRef, useEffect, useMemo } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { useLabels } from '../../../locale/locale-provider'
import type { ColorScheme, ComponentProps, Shape, Size } from '../../../theme'
import { useFieldContext } from '../field/field-context'
import { PinInputCell } from './pininput-cell'
import { PinInputContext } from './pininput-context'
import { PinInputHidden } from './pininput-hidden'
import type { PinInputType } from './pin-utils'
import styles from './pininput.module.css'
import { usePinInput } from './use-pin-input'

export interface PinInputLabels {
  input: (index: number, length: number) => string
}

export type PinInputVariant = 'outline' | 'filled' | 'underline' | 'unstyled'

export interface PinInputOwnProps {
  /**
   * Native `autocomplete` of the boxes. `one-time-code` lets a phone suggest the code from an SMS; use `off` for a PIN.
   *
   * @default 'one-time-code'
   */
  autoComplete?: string
  /**
   * The parts of the PinInput: `PinInputCell` for each box and `PinInputHidden` for the hidden input of a `name`. Without children it renders the boxes.
   */
  children?: ReactNode
  /**
   * Gives the focus to the first box when the component mounts. It is `autoFocus` with another name: moving the focus on its own is only right on a screen that exists to enter the code.
   *
   * @default false
   */
  focusOnMount?: boolean
  /**
   * Color scheme for the focus ring, from the theme palette (custom schemes included).
   *
   * @default 'secondary'
   */
  colorScheme?: ColorScheme
  /** The code the boxes start with, when it is not controlled. */
  defaultValue?: string
  /**
   * The texts of the PinInput, for other languages: `input(index, length)` is the accessible name of a box, from its position (counting from 1) and the length. The default says `Digit 1 of 6`, or `Character` when the type is not numeric.
   */
  labels?: Partial<PinInputLabels>
  /**
   * How many boxes, that is, how many characters the code has.
   *
   * @default 6
   */
  length?: number
  /**
   * Hides what is typed, as a password does. Use it for a PIN, not for a code that is sent to the user.
   *
   * @default false
   */
  mask?: boolean
  /** Name of the code in a form. It is submitted in a hidden input; the boxes have no name. */
  name?: string
  /** Called with the code when the last box is filled. */
  onComplete?: (value: string) => void
  /** Called with the code every time it changes, complete or not. */
  onValueChange?: (value: string) => void
  /** A character shown in the empty boxes, like `○`. */
  placeholder?: string
  /**
   * Corners of the boxes.
   *
   * @default 'rounded'
   */
  shape?: Shape
  /**
   * Size of the boxes.
   *
   * @default 'md'
   */
  size?: Size
  /**
   * What the boxes accept: `numeric` digits (and asks the phone for the numeric keyboard), `alphanumeric` letters and digits, or `text` anything but spaces.
   *
   * @default 'numeric'
   */
  type?: PinInputType
  /**
   * The code. Makes the PinInput controlled: pass `onValueChange` to update it. The characters are always one after another, with no empty box in between.
   */
  value?: string
  /**
   * Visual variant of the boxes, the same as the `Input`. `unstyled` drops the Plume styles so you can bring your own; the row stays.
   *
   * @default 'outline'
   */
  variant?: PinInputVariant
}

type PinInputRootAttributes = Pick<
  InputHTMLAttributes<HTMLFieldSetElement>,
  | 'aria-describedby'
  | 'aria-invalid'
  | 'aria-label'
  | 'aria-labelledby'
  | 'disabled'
  | 'hidden'
  | 'id'
  | 'readOnly'
  | 'required'
  | 'title'
>

export type PinInputProps = Omit<ComponentProps, 'index'> &
  PinInputRootAttributes &
  PinInputOwnProps

const defaultLabels = (type: PinInputType): PinInputLabels => ({
  input: (index, length) => `${type === 'numeric' ? 'Digit' : 'Character'} ${index} of ${length}`,
})

export const PinInput = forwardRef<HTMLFieldSetElement, PinInputProps>(
  (
    {
      'aria-describedby': describedBy,
      'aria-invalid': ariaInvalid,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      autoComplete = 'one-time-code',
      children,
      focusOnMount = false,
      className,
      colorScheme = 'secondary',
      defaultValue,
      disabled = false,
      labels,
      id,
      length = 6,
      mask = false,
      name,
      onComplete,
      onValueChange,
      placeholder,
      readOnly = false,
      required = false,
      shape = 'rounded',
      size = 'md',
      style,
      type = 'numeric',
      value,
      variant = 'outline',
      ...rest
    }: PinInputProps,
    ref: ForwardedRef<HTMLFieldSetElement>,
  ): ReactNode => {
    const field = useFieldContext()
    const pin = usePinInput({
      focusOnMount,
      defaultValue,
      length,
      onComplete,
      onValueChange,
      readOnly,
      type,
      value,
    })
    const isStyled = variant !== 'unstyled'
    const invalid = ariaInvalid === true || ariaInvalid === 'true'
    const fieldLabel = field?.controlId === id ? field?.labelId : undefined
    const labelledBy = ariaLabelledby ?? (ariaLabel ? undefined : fieldLabel)
    const { cells, tabbable } = pin
    const defaults = useMemo(() => defaultLabels(type), [type])
    const text = useLabels('pinInput', defaults, labels)
    const colorVars = {
      '--pininput-color': `var(--plume-color-${invalid ? 'error' : colorScheme}-text)`,
      ...style,
    } as CSSProperties
    const classes = joinClasses(
      isStyled && styles.pin,
      isStyled && styles[variant],
      isStyled && styles[size],
      isStyled && styles[shape],
      isStyled && invalid && styles.invalid,
      className,
    )
    useEffect(() => {
      const label = fieldLabel ? document.getElementById(fieldLabel) : null
      if (!label) return undefined
      const focus = (): void => cells.current[tabbable]?.focus()
      label.addEventListener('click', focus)
      return () => label.removeEventListener('click', focus)
    }, [cells, fieldLabel, tabbable])
    const context = useMemo(
      () => ({
        autoComplete,
        disabled,
        invalid,
        isStyled,
        labels: text,
        length,
        mask,
        name,
        pin,
        placeholder,
        readOnly,
        required,
        type,
      }),
      [
        autoComplete,
        disabled,
        invalid,
        isStyled,
        length,
        mask,
        name,
        pin,
        placeholder,
        readOnly,
        required,
        text,
        type,
      ],
    )

    return (
      <PinInputContext.Provider value={context}>
        <fieldset
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          aria-label={ariaLabel}
          aria-labelledby={labelledBy}
          className={classes}
          data-disabled={disabled ? '' : undefined}
          data-invalid={invalid ? '' : undefined}
          data-plume-pininput=""
          data-readonly={readOnly ? '' : undefined}
          disabled={disabled}
          id={id}
          ref={ref}
          style={colorVars}
          {...rest}
        >
          {children ?? (
            <>
              {[...new Array(length).keys()].map((index) => (
                <PinInputCell index={index} key={index} />
              ))}
              {name ? <PinInputHidden /> : null}
            </>
          )}
        </fieldset>
      </PinInputContext.Provider>
    )
  },
)

PinInput.displayName = 'PinInput'
