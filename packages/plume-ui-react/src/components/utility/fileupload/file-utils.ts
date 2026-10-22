export type FileRejectionReason = 'type' | 'size' | 'count'

export interface FileRejection {
  file: File
  reason: FileRejectionReason
}

export interface SelectionOptions {
  accept?: string
  current: File[]
  incoming: File[]
  maxFiles?: number
  maxSize?: number
  multiple: boolean
}

export interface Selection {
  files: File[]
  rejections: FileRejection[]
}

export function matchesAccept(file: File, accept: string | undefined): boolean {
  if (!accept) return true
  const name = file.name.toLowerCase()
  const type = file.type.toLowerCase()
  return accept
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean)
    .some((token) => {
      if (token.startsWith('.')) return name.endsWith(token)
      if (token.endsWith('/*')) return type.startsWith(token.slice(0, -1))
      return type === token
    })
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB']
  let value = bytes / 1024
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit += 1
  }
  return `${value >= 10 ? Math.round(value) : Math.round(value * 10) / 10} ${units[unit]}`
}

export function selectFiles({
  accept,
  current,
  incoming,
  maxFiles,
  maxSize,
  multiple,
}: SelectionOptions): Selection {
  const rejections: FileRejection[] = []
  const accepted: File[] = []
  for (const file of incoming) {
    if (!matchesAccept(file, accept)) rejections.push({ file, reason: 'type' })
    else if (maxSize !== undefined && file.size > maxSize) rejections.push({ file, reason: 'size' })
    else accepted.push(file)
  }

  const room = multiple ? (maxFiles ?? Number.POSITIVE_INFINITY) - current.length : 1
  const kept = accepted.slice(0, Math.max(0, room))
  for (const file of accepted.slice(kept.length)) rejections.push({ file, reason: 'count' })

  return { files: multiple ? [...current, ...kept] : kept, rejections }
}
