'use client'

import type { ChangeEvent, ForwardedRef, InputHTMLAttributes, MouseEvent, ReactNode } from 'react'
import { forwardRef, useMemo } from 'react'
import { mergeRefs } from '../../../overlay/trigger'
import type { ComponentProps } from '../../../theme'
import { useFileUploadContext } from './fileupload-context'

type FileUploadInputRootAttributes = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  'aria-describedby' | 'aria-label' | 'aria-labelledby' | 'id' | 'name' | 'title'
>

export type FileUploadInputProps = Omit<ComponentProps, 'index'> & FileUploadInputRootAttributes

export const FileUploadInput = forwardRef<HTMLInputElement, FileUploadInputProps>(
  (
    { 'aria-describedby': describedBy, className, style, ...own }: FileUploadInputProps,
    ref: ForwardedRef<HTMLInputElement>,
  ): ReactNode => {
    const { disabled, inputProps, inputRef, invalid, promptId, readOnly, receive } =
      useFileUploadContext('FileUploadInput')
    const setRef = useMemo(() => mergeRefs(inputRef, ref), [inputRef, ref])

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
      receive(Array.from(event.target.files ?? []))
    }

    const handleClick = (event: MouseEvent<HTMLInputElement>): void => {
      if (readOnly) event.preventDefault()
    }

    return (
      <input
        {...inputProps}
        {...own}
        aria-describedby={[promptId, describedBy ?? inputProps['aria-describedby']]
          .filter(Boolean)
          .join(' ')}
        aria-invalid={invalid || undefined}
        className={className}
        data-disabled={disabled ? '' : undefined}
        data-invalid={invalid ? '' : undefined}
        data-plume-fileupload-input=""
        disabled={disabled}
        onChange={handleChange}
        onClick={handleClick}
        ref={setRef}
        style={style}
        type="file"
      />
    )
  },
)

FileUploadInput.displayName = 'FileUploadInput'
