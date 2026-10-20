import type { ReactNode } from 'react'

const strokeProps = {
  'aria-hidden': true,
  fill: 'none',
  focusable: 'false',
  height: '1em',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
  width: '1em',
} as const

export function CloseIcon(): ReactNode {
  return (
    <svg {...strokeProps} strokeWidth="2">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  )
}

export function ChevronDownIcon(): ReactNode {
  return (
    <svg {...strokeProps} strokeWidth="2">
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export function CheckIcon(): ReactNode {
  return (
    <svg {...strokeProps} strokeWidth="3">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}
