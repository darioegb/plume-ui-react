import type { ReactNode } from 'react'

const path = 'm12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z'

export function StarIcon({ filled }: Readonly<{ filled: boolean }>): ReactNode {
  return (
    <svg
      aria-hidden="true"
      fill={filled ? 'currentColor' : 'none'}
      focusable="false"
      height="1em"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="1.5"
      style={filled ? { stroke: 'var(--rating-edge, currentColor)' } : undefined}
      viewBox="0 0 24 24"
      width="1em"
    >
      <path d={path} />
    </svg>
  )
}

StarIcon.displayName = 'StarIcon'
