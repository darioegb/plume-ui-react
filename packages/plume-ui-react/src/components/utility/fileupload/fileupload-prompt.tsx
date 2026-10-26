'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'
import { useFileUploadContext } from './fileupload-context'

type FileUploadPromptRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

export type FileUploadPromptProps = Omit<ComponentProps, 'index'> & FileUploadPromptRootAttributes

/**
 * The instructions. They describe the input, and without children they come from
 * `labels.prompt`.
 */
export const FileUploadPrompt = forwardRef<HTMLSpanElement, FileUploadPromptProps>(
  (
    { children, className, style }: FileUploadPromptProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { labels, promptId } = useFileUploadContext('FileUploadPrompt')

    return (
      <span
        className={className}
        data-plume-fileupload-prompt=""
        id={promptId}
        ref={ref}
        style={style}
      >
        {children ?? labels.prompt}
      </span>
    )
  },
)

FileUploadPrompt.displayName = 'FileUploadPrompt'
