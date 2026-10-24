'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { ColorScheme, ComponentProps, Shape, Size } from '../../../theme'
import { useMask } from '../../../hooks/use-mask'
import { useLabels } from '../../../locale/locale-provider'
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
  addonBefore?: ReactNode
  addonAfter?: ReactNode
  children?: ReactNode
  elementBefore?: ReactNode
  elementAfter?: ReactNode
  colorScheme?: ColorScheme
  mask?: string
  labels?: Partial<InputLabels>
  revealable?: boolean
  shape?: Shape
  size?: Size
  variant?: InputVariant
}

export type InputProps = ComponentProps & InputFieldAttributes & InputOwnProps

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
    const isInvalid = rest['aria-invalid'] === true || rest['aria-invalid'] === 'true'
    const { value: maskedValue, onChange: maskedOnChange } = useMask({
      mask,
      value: typeof value === 'string' ? value : undefined,
      defaultValue: typeof defaultValue === 'string' ? defaultValue : undefined,
      onChange,
    })
    const context: InputContextValue = {
      colorScheme,
      disabled,
      fieldProps: {
        ...rest,
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
    }
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
