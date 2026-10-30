'use client'

import { forwardRef, isValidElement } from 'react'
import type { ForwardedRef, HTMLAttributes, LabelHTMLAttributes, ReactNode } from 'react'
import { hasPart } from '../../../overlay/has-part'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { Text } from '../../presentation/text'
import { useFieldPartContext } from './field-context'
import styles from './field.module.css'

type SpanPartProps = Omit<ComponentProps, 'index'> &
  Pick<HTMLAttributes<HTMLSpanElement>, 'children' | 'id' | 'title'>

type TextPartProps = Omit<ComponentProps, 'index'> &
  Pick<HTMLAttributes<HTMLParagraphElement>, 'children' | 'title'>

export type FieldRequiredIndicatorProps = SpanPartProps

/** The mark after the label of a required field, hidden from screen readers: `required` is on the control. */
export const FieldRequiredIndicator = forwardRef<HTMLSpanElement, FieldRequiredIndicatorProps>(
  ({ children = '*', className, ...rest }, ref: ForwardedRef<HTMLSpanElement>) => {
    const { isStyled } = useFieldPartContext('FieldRequiredIndicator')
    return (
      <span
        aria-hidden="true"
        className={joinClasses(isStyled && styles.requiredIndicator, className)}
        data-plume-field-required-indicator=""
        ref={ref}
        {...rest}
      >
        {children}
      </span>
    )
  },
)

FieldRequiredIndicator.displayName = 'FieldRequiredIndicator'

export type FieldOptionalTextProps = SpanPartProps

/** The text after the label of a field that is not required, like `(optional)`. */
export const FieldOptionalText = forwardRef<HTMLSpanElement, FieldOptionalTextProps>(
  ({ className, ...rest }, ref: ForwardedRef<HTMLSpanElement>) => {
    const { isStyled } = useFieldPartContext('FieldOptionalText')
    return (
      <span
        className={joinClasses(isStyled && styles.optionalText, className)}
        data-plume-field-optional-text=""
        ref={ref}
        {...rest}
      />
    )
  },
)

FieldOptionalText.displayName = 'FieldOptionalText'

const LABEL_PARTS = [FieldRequiredIndicator, FieldOptionalText]

export type FieldLabelProps = Omit<ComponentProps, 'index'> &
  Pick<LabelHTMLAttributes<HTMLLabelElement>, 'children' | 'title'>

/**
 * The label of the control. It adds the required mark or the optional text by itself, unless it has a
 * `FieldRequiredIndicator` or a `FieldOptionalText` among its children.
 */
export const FieldLabel = forwardRef<HTMLLabelElement, FieldLabelProps>(
  ({ children, className, ...rest }, ref: ForwardedRef<HTMLLabelElement>) => {
    const { controlId, disabled, isStyled, labelId, optionalText, required } =
      useFieldPartContext('FieldLabel')
    const composed = hasPart(children, LABEL_PARTS)
    return (
      <Text
        as="label"
        className={joinClasses(isStyled && styles.label, className)}
        data-disabled={disabled ? '' : undefined}
        data-plume-field-label=""
        htmlFor={controlId}
        id={labelId}
        ref={ref}
        variant={isStyled ? 'label' : 'unstyled'}
        {...rest}
      >
        {children}
        {!composed && required ? <FieldRequiredIndicator /> : null}
        {!composed && !required && optionalText ? (
          <>
            {' '}
            <FieldOptionalText>{optionalText}</FieldOptionalText>
          </>
        ) : null}
      </Text>
    )
  },
)

FieldLabel.displayName = 'FieldLabel'

export type FieldHelperTextProps = TextPartProps

/** A hint under the control, read as part of its description. */
export const FieldHelperText = forwardRef<HTMLParagraphElement, FieldHelperTextProps>(
  ({ className, ...rest }, ref: ForwardedRef<HTMLParagraphElement>) => {
    const { helperId, isStyled } = useFieldPartContext('FieldHelperText')
    return (
      <Text
        className={joinClasses(isStyled && styles.helperText, className)}
        data-plume-field-helper-text=""
        id={helperId}
        muted={isStyled}
        ref={ref}
        variant={isStyled ? 'body-sm' : 'unstyled'}
        {...rest}
      />
    )
  },
)

FieldHelperText.displayName = 'FieldHelperText'

export type FieldErrorTextProps = TextPartProps

/** The error message under the control. It renders only while the field is invalid, and is announced. */
export const FieldErrorText = forwardRef<HTMLParagraphElement, FieldErrorTextProps>(
  ({ className, ...rest }, ref: ForwardedRef<HTMLParagraphElement>) => {
    const { errorId, invalid, isStyled } = useFieldPartContext('FieldErrorText')
    if (!invalid) return null
    return (
      <Text
        className={joinClasses(isStyled && styles.errorText, className)}
        data-plume-field-error-text=""
        id={errorId}
        ref={ref}
        role="alert"
        variant={isStyled ? 'body-sm' : 'unstyled'}
        {...rest}
      />
    )
  },
)

FieldErrorText.displayName = 'FieldErrorText'

export const FIELD_PARTS = [FieldLabel, FieldHelperText, FieldErrorText]

export const isFieldPart = (node: ReactNode): boolean =>
  isValidElement(node) && (FIELD_PARTS as unknown[]).includes(node.type)
