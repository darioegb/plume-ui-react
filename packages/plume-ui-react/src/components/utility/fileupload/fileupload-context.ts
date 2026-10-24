'use client'

import type { InputHTMLAttributes } from 'react'
import { createContext, useContext } from 'react'
import type { ColorScheme } from '../../../theme'
import type { FileRejection } from './file-utils'
import type { FileUploadLabels } from './fileupload'

export interface FileUploadContextValue {
  colorScheme: ColorScheme
  disabled: boolean
  dragging: boolean
  files: File[]
  inactive: boolean
  inputProps: InputHTMLAttributes<HTMLInputElement>
  inputRef: (node: HTMLInputElement | null) => void
  invalid: boolean
  isStyled: boolean
  labels: FileUploadLabels
  progress?: (file: File) => number | undefined
  promptId: string
  readOnly: boolean
  receive: (incoming: File[]) => void
  rejections: FileRejection[]
  remove: (file: File) => void
  setDragging: (dragging: boolean) => void
}

export const FileUploadContext = createContext<FileUploadContextValue | undefined>(undefined)

export function useFileUploadContext(part: string): FileUploadContextValue {
  const context = useContext(FileUploadContext)
  if (!context) throw new Error(`<${part}> must be rendered inside a <FileUpload>`)
  return context
}

export interface FileUploadItemContextValue {
  file: File
}

export const FileUploadItemContext = createContext<FileUploadItemContextValue | undefined>(
  undefined,
)

export function useFileUploadItemContext(part: string): FileUploadItemContextValue {
  const context = useContext(FileUploadItemContext)
  if (!context) throw new Error(`<${part}> must be rendered inside a <FileUploadItem>`)
  return context
}
