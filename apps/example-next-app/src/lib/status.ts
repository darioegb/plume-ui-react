import type { ProjectStatus } from '@/lib/data'

export const statusColor = {
  'At risk': 'warning',
  Delayed: 'error',
  Done: 'success',
  'On track': 'primary',
} as const satisfies Record<ProjectStatus, string>
