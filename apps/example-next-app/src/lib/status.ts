import type { ProjectStatus } from '@/lib/data'

export const statusColor = {
  atRisk: 'warning',
  delayed: 'error',
  done: 'success',
  onTrack: 'primary',
} as const satisfies Record<ProjectStatus, string>
