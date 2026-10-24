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
import { useLabels } from '../../../locale/locale-provider'
import { mergeRefs } from '../../../overlay/trigger'
import { useControllableState } from '../../../overlay/use-controllable-state'
import type { ColorScheme, ComponentProps, Size } from '../../../theme'
import {
  type FileRejection,
  type FileRejectionReason,
  formatBytes,
  selectFiles,
} from './file-utils'
import { ProgressBar } from '../progressbar'
import styles from './fileupload.module.css'

export type FileUploadVariant = 'bordered' | 'filled' | 'outline' | 'unstyled'

export type FileUploadPart =
  'dropzone' | 'error' | 'file' | 'list' | 'progress' | 'progressIndicator' | 'remove'

export interface FileUploadLabels {
  fileSize: (bytes: number) => string
  progress: (file: File) => string
  prompt: string
  rejection: (rejection: FileRejection) => string
  remove: (file: File) => string
}

export interface FileUploadOwnProps {
  accept?: string
  classNames?: Partial<Record<FileUploadPart, string>>
  colorScheme?: ColorScheme
  defaultValue?: File[]
  labels?: Partial<FileUploadLabels>
  maxFiles?: number
  maxSize?: number
  multiple?: boolean
  name?: string
  onReject?: (rejections: FileRejection[]) => void
  onValueChange?: (files: File[]) => void
  progress?: (file: File) => number | undefined
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

const DEFAULT_LABELS: FileUploadLabels = {
  fileSize: formatBytes,
  progress: (file) => `Uploading ${file.name}`,
  prompt: 'Drag files here, or press to choose them',
  rejection: ({ file, reason }) => `${file.name}: ${rejectionTexts[reason]}`,
  remove: (file) => `Remove ${file.name}`,
}

interface FileProgressProps {
  className?: string
  colorScheme: ColorScheme
  indicatorClassName?: string
  isStyled: boolean
  label: string
  value?: number
}

function FileProgress({
  className,
  colorScheme,
  indicatorClassName,
  isStyled,
  label,
  value,
}: Readonly<FileProgressProps>): ReactNode {
  if (value === undefined) return null
  return (
    <ProgressBar
      aria-label={label}
      className={className}
      colorScheme={value >= 100 ? 'success' : colorScheme}
      classNames={{ indicator: indicatorClassName }}
      showValue
      size="sm"
      value={value}
      variant={isStyled ? 'solid' : 'unstyled'}
    />
  )
}

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
      labels,
      maxFiles,
      maxSize,
      multiple = false,
      onReject,
      onValueChange,
      progress,
      readOnly = false,
      required = false,
      size = 'md',
      style,
      value,
      variant = 'outline',
      ...rest
    }: FileUploadProps,
    ref: ForwardedRef<HTMLInputElement>,
  ): ReactNode => {
    const text = useLabels('fileUpload', DEFAULT_LABELS, labels)
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
          onDragEnter={handleDragOver}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            {...rest}
            accept={accept}
            aria-describedby={[promptId, describedBy].filter(Boolean).join(' ')}
            aria-invalid={invalid || undefined}
            disabled={disabled}
            multiple={multiple}
            onChange={handleChange}
            data-plume-fileupload-input=""
            onClick={(event) => {
              if (readOnly) event.preventDefault()
            }}
            ref={mergeRefs(ref, input)}
            required={required}
            type="file"
          />
          <span id={promptId}>{children ?? text.prompt}</span>
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
                <span data-plume-fileupload-size="">{text.fileSize(file.size)}</span>
                {inactive ? null : (
                  <button
                    aria-label={text.remove(file)}
                    className={joinClasses(isStyled && styles.remove, classNames?.remove)}
                    data-plume-fileupload-remove=""
                    onClick={() => remove(file)}
                    type="button"
                  >
                    <CloseIcon />
                  </button>
                )}
                <FileProgress
                  className={classNames?.progress}
                  colorScheme={colorScheme}
                  indicatorClassName={classNames?.progressIndicator}
                  isStyled={isStyled}
                  label={text.progress(file)}
                  value={progress?.(file)}
                />
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
              <li key={`${rejection.file.name}-${position}`}>{text.rejection(rejection)}</li>
            ))}
          </ul>
        ) : null}
      </div>
    )
  },
)

FileUpload.displayName = 'FileUpload'
