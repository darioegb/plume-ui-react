'use client'

import type { CSSProperties, ForwardedRef, InputHTMLAttributes, ReactNode } from 'react'
import { forwardRef, useId, useMemo } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { hasPart } from '../../../overlay/has-part'
import { useLabels } from '../../../locale/locale-provider'
import { mergeRefs } from '../../../overlay/trigger'
import type { ColorScheme, ComponentProps, Size } from '../../../theme'
import { type FileRejection, type FileRejectionReason, formatBytes } from './file-utils'
import { FileUploadContext } from './fileupload-context'
import { FileUploadDropzone } from './fileupload-dropzone'
import { FileUploadErrors } from './fileupload-errors'
import { FileUploadInput } from './fileupload-input'
import { FileUploadList } from './fileupload-list'
import { FileUploadPrompt } from './fileupload-prompt'
import { useFileUploadState } from './use-fileupload-state'
import styles from './fileupload.module.css'

export type FileUploadVariant = 'bordered' | 'filled' | 'outline' | 'unstyled'

export interface FileUploadLabels {
  fileSize: (bytes: number) => string
  progress: (file: File) => string
  prompt: string
  rejection: (rejection: FileRejection) => string
  remove: (file: File) => string
}

export interface FileUploadOwnProps {
  accept?: string
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

const FILE_UPLOAD_PARTS = [
  FileUploadDropzone,
  FileUploadErrors,
  FileUploadInput,
  FileUploadList,
  FileUploadPrompt,
]

const fileUploadColorVars = (colorScheme: ColorScheme, style?: CSSProperties): CSSProperties =>
  ({
    '--fileupload-solid': `var(--plume-color-${colorScheme}-solid)`,
    '--fileupload-text': `var(--plume-color-${colorScheme}-text)`,
    '--fileupload-tint': `var(--plume-color-${colorScheme}-tint)`,
    ...style,
  }) as CSSProperties

export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      'aria-describedby': describedBy,
      'aria-invalid': ariaInvalid,
      accept,
      children,
      className,
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
    const { dragging, files, input, receive, rejections, remove, setDragging } = useFileUploadState(
      {
        accept,
        defaultValue,
        maxFiles,
        maxSize,
        multiple,
        onReject,
        onValueChange,
        value,
      },
    )
    const isStyled = variant !== 'unstyled'
    const invalid = ariaInvalid === true || ariaInvalid === 'true'
    const inputRef = useMemo(() => mergeRefs(ref, input), [input, ref])
    const context = useMemo(
      () => ({
        colorScheme,
        disabled,
        dragging,
        files,
        inactive: disabled || readOnly,
        inputProps: {
          ...rest,
          accept,
          'aria-describedby': describedBy,
          multiple,
          required,
        },
        inputRef,
        invalid,
        isStyled,
        labels: text,
        progress,
        promptId,
        readOnly,
        receive,
        rejections,
        remove,
        setDragging,
      }),
      [
        accept,
        colorScheme,
        describedBy,
        disabled,
        dragging,
        files,
        inputRef,
        invalid,
        isStyled,
        multiple,
        progress,
        promptId,
        readOnly,
        receive,
        rejections,
        remove,
        required,
        rest,
        setDragging,
        text,
      ],
    )

    return (
      <FileUploadContext.Provider value={context}>
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
          {hasPart(children, FILE_UPLOAD_PARTS) ? (
            children
          ) : (
            <>
              <FileUploadDropzone>
                <FileUploadInput />
                <FileUploadPrompt>{children}</FileUploadPrompt>
              </FileUploadDropzone>
              <FileUploadList />
              <FileUploadErrors />
            </>
          )}
        </div>
      </FileUploadContext.Provider>
    )
  },
)

FileUpload.displayName = 'FileUpload'
