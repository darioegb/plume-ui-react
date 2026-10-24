'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useControllableState } from '../../../overlay/use-controllable-state'
import { type FileRejection, selectFiles } from './file-utils'

export interface FileUploadStateOptions {
  accept?: string
  defaultValue: File[]
  maxFiles?: number
  maxSize?: number
  multiple: boolean
  onReject?: (rejections: FileRejection[]) => void
  onValueChange?: (files: File[]) => void
  value?: File[]
}

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

export function useFileUploadState({
  accept,
  defaultValue,
  maxFiles,
  maxSize,
  multiple,
  onReject,
  onValueChange,
  value,
}: FileUploadStateOptions) {
  const input = useRef<HTMLInputElement | null>(null)
  const [files, setFiles] = useControllableState({
    defaultValue,
    onChange: onValueChange,
    value,
  })
  const [rejections, setRejections] = useState<FileRejection[]>([])
  const [dragging, setDragging] = useState(false)

  useEffect(() => syncInput(input.current, files), [files])

  const receive = useCallback(
    (incoming: File[]): void => {
      const result = selectFiles({ accept, current: files, incoming, maxFiles, maxSize, multiple })
      setRejections(result.rejections)
      if (result.rejections.length > 0) onReject?.(result.rejections)
      if (incoming.length > 0 && result.files.length > 0) setFiles(result.files)
      syncInput(input.current, result.files.length > 0 ? result.files : files)
    },
    [accept, files, maxFiles, maxSize, multiple, onReject, setFiles],
  )

  const remove = useCallback(
    (file: File): void => {
      setFiles(files.filter((current) => current !== file))
      setRejections([])
      input.current?.focus()
    },
    [files, setFiles],
  )

  return { dragging, files, input, receive, rejections, remove, setDragging }
}
