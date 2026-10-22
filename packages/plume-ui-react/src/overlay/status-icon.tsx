import type { ReactNode } from 'react'

export type StatusIconName = 'error' | 'info' | 'success' | 'warning'

const iconPaths: Record<StatusIconName, string> = {
  error: 'M15 9l-6 6M9 9l6 6M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z',
  info: 'M12 16v-4m0-4h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z',
  success: 'M22 11.1V12a10 10 0 1 1-5.9-9.1M22 4 12 14l-3-3',
  warning:
    'M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z',
}

export function StatusIcon({ status }: Readonly<{ status: StatusIconName }>): ReactNode {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1.25em"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="1.25em"
    >
      <path d={iconPaths[status]} />
    </svg>
  )
}
