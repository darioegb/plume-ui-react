'use client'

import type {
  ChangeEvent,
  CSSProperties,
  DragEvent,
  ForwardedRef,
  InputHTMLAttributes,
  ReactNode,
} from 'react'
import { forwardRef, useEffect, useId, useRef, useState } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { CloseIcon } from '../../../overlay/icons'
import { mergeRefs } from '../../../overlay/trigger'
import { useControllableState } from '../../../overlay/use-controllable-state'
import { visuallyHidden } from '../../../overlay/visually-hidden'
import type { ColorScheme, ComponentProps, Size } from '../../../theme'
import {
  type FileRejection,
  type FileRejectionReason,
  formatBytes,
  selectFiles,
} from './file-utils'
import styles from './fileupload.module.css'

export type FileUploadVariant = 'outline' | 'filled' | 'unstyled'

export type FileUploadPart = 'dropzone' | 'error' | 'file' | 'list' | 'remove'

export interface FileUploadOwnProps {
  accept?: string
  classNames?: Partial<Record<FileUploadPart, string>>
  colorScheme?: ColorScheme
  defaultValue?: File[]
  formatRejection?: (rejection: FileRejection) => string
  maxFiles?: number
  maxSize?: number
  multiple?: boolean
  name?: string
  onReject?: (rejections: FileRejection[]) => void
  onValueChange?: (files: File[]) => void
  removeLabel?: (file: File) => string
  size?: Size
  value?: File[]
  variant?: FileUploadVariant
}

type FileUploadRootAttributes = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  | 'aria-describedby'
  | 'aria-invalid'
  | 'aria-label'
  | 'aria-labelledby'
  | 'children'
  | 'disabled'
  | 'hidden'
  | 'id'
  | 'readOnly'
  | 'required'
  | 'title'
>

export type FileUploadProps = Omit<ComponentProps, 'index'> &
  FileUploadRootAttributes &
  FileUploadOwnProps

const rejectionTexts: Record<FileRejectionReason, string> = {
  count: 'too many files',
  size: 'file is too large',
  type: 'file type is not accepted',
}

const defaultFormatRejection = ({ file, reason }: FileRejection): string =>
  `${file.name}: ${rejectionTexts[reason]}`

const defaultRemoveLabel = (file: File): string => `Remove ${file.name}`

const fileUploadColorVars = (colorScheme: ColorScheme, style?: CSSProperties): CSSProperties =>
  ({
    '--fileupload-solid': `var(--plume-color-${colorScheme}-solid)`,
    '--fileupload-text': `var(--plume-color-${colorScheme}-text)`,
    '--fileupload-tint': `var(--plume-color-${colorScheme}-tint)`,
    ...style,
  }) as CSSProperties

function syncInput(input: HTMLInputElement | null, files: File[]): void {
  if (!input || typeof DataTransfer === 'undefined') return
  try {
    const transfer = new DataTransfer()
    for (const file of files) transfer.items.add(file)
    input.files = transfer.files
  } catch {
    return
  }
}

export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      'aria-describedby': describedBy,
      'aria-invalid': ariaInvalid,
      accept,
      children,
      className,
      classNames,
      colorScheme = 'primary',
      defaultValue = [],
      disabled = false,
      formatRejection = defaultFormatRejection,
      maxFiles,
      maxSize,
      multiple = false,
      onReject,
      onValueChange,
      readOnly = false,
      removeLabel = defaultRemoveLabel,
      required = false,
      size = 'md',
      style,
      value,
      variant = 'outline',
      ...rest
    }: FileUploadProps,
    ref: ForwardedRef<HTMLInputElement>,
  ): ReactNode => {
    const promptId = useId()
    const input = useRef<HTMLInputElement | null>(null)
    const [files, setFiles] = useControllableState({
      defaultValue,
      onChange: onValueChange,
      value,
    })
    const [rejections, setRejections] = useState<FileRejection[]>([])
    const [dragging, setDragging] = useState(false)
    const isStyled = variant !== 'unstyled'
    const inactive = disabled || readOnly
    const invalid = ariaInvalid === true || ariaInvalid === 'true'

    useEffect(() => syncInput(input.current, files), [files])

    const receive = (incoming: File[]): void => {
      const result = selectFiles({ accept, current: files, incoming, maxFiles, maxSize, multiple })
      setRejections(result.rejections)
      if (result.rejections.length > 0) onReject?.(result.rejections)
      if (incoming.length > 0 && result.files.length > 0) setFiles(result.files)
      syncInput(input.current, result.files.length > 0 ? result.files : files)
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
      receive(Array.from(event.target.files ?? []))
    }

    const handleDrop = (event: DragEvent<HTMLDivElement>): void => {
      event.preventDefault()
      setDragging(false)
      if (inactive) return
      receive(Array.from(event.dataTransfer.files))
    }

    const handleDragOver = (event: DragEvent<HTMLDivElement>): void => {
      event.preventDefault()
      if (!inactive) setDragging(true)
    }

    const handleDragLeave = (event: DragEvent<HTMLDivElement>): void => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false)
    }

    const remove = (file: File): void => {
      setFiles(files.filter((current) => current !== file))
      setRejections([])
      input.current?.focus()
    }

    return (
      <div
        className={joinClasses(
          isStyled && styles.fileupload,
          isStyled && styles[variant],
          isStyled && styles[size],
          isStyled && invalid && styles.invalid,
          className,
        )}
        data-disabled={disabled ? '' : undefined}
        data-dragging={dragging ? '' : undefined}
        data-plume-fileupload=""
        style={fileUploadColorVars(colorScheme, style)}
      >
        <div
          className={joinClasses(isStyled && styles.dropzone, classNames?.dropzone)}
          data-plume-fileupload-dropzone=""
          onClick={() => {
            if (!inactive) input.current?.click()
          }}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          role="presentation"
        >
          <input
            {...rest}
            accept={accept}
            aria-describedby={[promptId, describedBy].filter(Boolean).join(' ')}
            aria-invalid={invalid || undefined}
            disabled={disabled}
            multiple={multiple}
            onChange={handleChange}
            onClick={(event) => {
              event.stopPropagation()
              if (readOnly) event.preventDefault()
            }}
            ref={mergeRefs(ref, input)}
            required={required}
            style={visuallyHidden}
            type="file"
          />
          <span id={promptId}>{children ?? 'Drag files here, or press to choose them'}</span>
        </div>
        {files.length > 0 ? (
          <ul
            className={joinClasses(isStyled && styles.list, classNames?.list)}
            data-plume-fileupload-list=""
          >
            {files.map((file, position) => (
              <li
                className={joinClasses(isStyled && styles.file, classNames?.file)}
                data-plume-fileupload-file=""
                key={`${file.name}-${file.size}-${position}`}
              >
                <span data-plume-fileupload-name="">{file.name}</span>
                <span data-plume-fileupload-size="">{formatBytes(file.size)}</span>
                {inactive ? null : (
                  <button
                    aria-label={removeLabel(file)}
                    className={joinClasses(isStyled && styles.remove, classNames?.remove)}
                    data-plume-fileupload-remove=""
                    onClick={() => remove(file)}
                    type="button"
                  >
                    <CloseIcon />
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : null}
        {rejections.length > 0 ? (
          <ul
            className={joinClasses(isStyled && styles.errors, classNames?.error)}
            data-plume-fileupload-errors=""
            role="alert"
          >
            {rejections.map((rejection, position) => (
              <li key={`${rejection.file.name}-${position}`}>{formatRejection(rejection)}</li>
            ))}
          </ul>
        ) : null}
      </div>
    )
  },
)

FileUpload.displayName = 'FileUpload'
