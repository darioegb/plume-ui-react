'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'
import { ProgressBar } from '../progressbar'
import { useFileUploadContext, useFileUploadItemContext } from './fileupload-context'

type FileUploadProgressRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'aria-label' | 'children'
>

export type FileUploadProgressProps = Omit<ComponentProps, 'index'> &
  FileUploadProgressRootAttributes

/**
 * The `ProgressBar` of the file, from `progress`. The `className` goes to its outermost element
 * and the `ref` to the bar. Its children, such as a `ProgressBarIndicator`, go inside the bar.
 * It is not there when `progress` gives `undefined`.
 */
export const FileUploadProgress = forwardRef<HTMLDivElement, FileUploadProgressProps>(
  (
    { 'aria-label': ariaLabel, children, className, style }: FileUploadProgressProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { colorScheme, isStyled, labels, progress } = useFileUploadContext('FileUploadProgress')
    const { file } = useFileUploadItemContext('FileUploadProgress')
    const value = progress?.(file)
    if (value === undefined) return null

    return (
      <ProgressBar
        aria-label={ariaLabel ?? labels.progress(file)}
        className={className}
        colorScheme={value >= 100 ? 'success' : colorScheme}
        ref={ref}
        showValue
        size="sm"
        style={style}
        value={value}
        variant={isStyled ? 'solid' : 'unstyled'}
      >
        {children}
      </ProgressBar>
    )
  },
)

FileUploadProgress.displayName = 'FileUploadProgress'
