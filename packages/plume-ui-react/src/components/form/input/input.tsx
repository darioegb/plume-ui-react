'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef, useMemo } from 'react'
import type { ColorScheme, ComponentProps, Shape, Size } from '../../../theme'
import { useMask } from '../../../hooks/use-mask'
import { useLabels } from '../../../locale/locale-provider'
import { useShallowStable } from '../shared/use-shallow-stable'
import { InputAddon } from './input-addon'
import { InputContext, inputColorVars } from './input-context'
import type { InputContextValue, InputLabels, InputVariant } from './input-context'
import { InputControl } from './input-control'
import { InputElement } from './input-element'
import { InputField } from './input-field'
import type { InputFieldAttributes } from './input-field'
import { InputGroup } from './input-group'
import { InputReveal, usePasswordReveal } from './input-reveal'

export type { InputLabels, InputVariant } from './input-context'

const DEFAULT_LABELS: InputLabels = { reveal: 'Show password' }

export interface InputOwnProps {
  /** Content attached before the Input, outside its border (e.g. a URL prefix). */
  addonBefore?: ReactNode
  /** Content attached after the Input, outside its border (e.g. a domain suffix). */
  addonAfter?: ReactNode
  /**
   * The parts of the input, to change what it shows or their order. Without them it renders the field, wrapped in a group when it has addons, elements or the reveal button.
   */
  children?: ReactNode
  /** Element rendered inside the Input, before the text (e.g. an icon). */
  elementBefore?: ReactNode
  /** Element rendered inside the Input, after the text (e.g. an icon). */
  elementAfter?: ReactNode
  /**
   * Color scheme for the focus border and ring, from the theme palette (custom schemes included).
   *
   * @default 'secondary'
   */
  colorScheme?: ColorScheme
  /**
   * Optional input mask. `#` accepts a digit, `A` a letter and `*` a letter or digit; characters that do not fit are rejected. Any other character is a literal auto-inserted as the user types, and `\` escapes the next character (e.g. `##/##/####`, `(###) ###-####`, `AA-####`).
   */
  mask?: string
  /**
   * The texts of the Input, for other languages: `reveal` is the accessible name of the reveal button (`Show password` by default). It stays the same while the password is shown, `aria-pressed` tells the state, so use a label that makes sense for both.
   */
  labels?: Partial<InputLabels>
  /**
   * With `type="password"`, adds a button that shows or hides the password. It is a toggle button (`aria-pressed`) inside the Input, in the place of `elementAfter`; an `elementAfter` goes to its left. It has no effect with another type.
   *
   * @default false
   */
  revealable?: boolean
  /**
   * Shape style of the Input. `pill` only applies to the `outline` variant.
   *
   * @default 'rounded'
   */
  shape?: Shape
  /**
   * Size of the Input.
   *
   * @default 'md'
   */
  size?: Size
  /**
   * Visual style variant of the Input.
   *
   * @default 'outline'
   */
  variant?: InputVariant
}

export type InputProps = Omit<ComponentProps, 'index'> & InputFieldAttributes & InputOwnProps

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      addonBefore,
      addonAfter,
      children,
      elementBefore,
      elementAfter,
      style,
      className,
      colorScheme = 'secondary',
      disabled = false,
      readOnly = false,
      labels,
      revealable = false,
      shape = 'rounded',
      size = 'md',
      type = 'text',
      variant = 'outline',
      mask,
      value,
      defaultValue,
      onChange,
      ...rest
    }: InputProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const text = useLabels('input', DEFAULT_LABELS, labels)
    const { canReveal, revealed, toggle } = usePasswordReveal(type, revealable)
    const fieldAttributes = useShallowStable(rest)
    const isInvalid =
      fieldAttributes['aria-invalid'] === true || fieldAttributes['aria-invalid'] === 'true'
    const { value: maskedValue, onChange: maskedOnChange } = useMask({
      mask,
      value: typeof value === 'string' ? value : undefined,
      defaultValue: typeof defaultValue === 'string' ? defaultValue : undefined,
      onChange,
    })
    const context: InputContextValue = useMemo(
      () => ({
        colorScheme,
        disabled,
        fieldProps: {
          ...fieldAttributes,
          defaultValue: mask ? undefined : defaultValue,
          onChange: maskedOnChange,
          type,
          value: mask ? maskedValue : value,
        },
        fieldRef: ref,
        invalid: isInvalid,
        isStyled: variant !== 'unstyled',
        labels: text,
        readOnly,
        revealed,
        shape,
        size,
        toggleReveal: toggle,
        variant,
      }),
      [
        colorScheme,
        defaultValue,
        disabled,
        fieldAttributes,
        isInvalid,
        mask,
        maskedOnChange,
        maskedValue,
        readOnly,
        ref,
        revealed,
        shape,
        size,
        text,
        toggle,
        type,
        value,
        variant,
      ],
    )
    const colorVars = {
      ...inputColorVars(isInvalid ? 'error' : colorScheme),
      ...style,
    }
    const hasGroup =
      children !== undefined ||
      Boolean(addonBefore || addonAfter || elementBefore || elementAfter || canReveal)

    if (!hasGroup) {
      return (
        <InputContext.Provider value={context}>
          <InputField className={className} style={colorVars} />
        </InputContext.Provider>
      )
    }

    return (
      <InputContext.Provider value={context}>
        <InputGroup className={className} style={colorVars}>
          {children ?? (
            <>
              {addonBefore ? <InputAddon position="before">{addonBefore}</InputAddon> : null}
              <InputControl>
                {elementBefore ? (
                  <InputElement position="before">{elementBefore}</InputElement>
                ) : null}
                <InputField />
                {elementAfter ? <InputElement position="after">{elementAfter}</InputElement> : null}
                {canReveal ? <InputReveal /> : null}
              </InputControl>
              {addonAfter ? <InputAddon position="after">{addonAfter}</InputAddon> : null}
            </>
          )}
        </InputGroup>
      </InputContext.Provider>
    )
  },
)

Input.displayName = 'Input'
