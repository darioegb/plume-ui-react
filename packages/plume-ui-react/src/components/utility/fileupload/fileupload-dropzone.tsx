'use client'

import type { DragEvent, ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useFileUploadContext } from './fileupload-context'
import { FileUploadInput } from './fileupload-input'
import { FileUploadPrompt } from './fileupload-prompt'
import styles from './fileupload.module.css'

type FileUploadDropzoneRootAttributes = Pick<HTMLAttributes<HTMLDivElement>, 'children'>

export type FileUploadDropzoneProps = Omit<ComponentProps, 'index'> &
  FileUploadDropzoneRootAttributes

export const FileUploadDropzone = forwardRef<HTMLDivElement, FileUploadDropzoneProps>(
  (
    { children, className, style }: FileUploadDropzoneProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { disabled, dragging, inactive, invalid, isStyled, receive, setDragging } =
      useFileUploadContext('FileUploadDropzone')

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

    return (
      <div
        className={joinClasses(isStyled && styles.dropzone, className)}
        data-disabled={disabled ? '' : undefined}
        data-dragging={dragging ? '' : undefined}
        data-invalid={invalid ? '' : undefined}
        data-plume-fileupload-dropzone=""
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        ref={ref}
        style={style}
      >
        {children ?? (
          <>
            <FileUploadInput />
            <FileUploadPrompt />
          </>
        )}
      </div>
    )
  },
)

FileUploadDropzone.displayName = 'FileUploadDropzone'
