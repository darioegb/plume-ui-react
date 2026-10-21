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

export function EyeIcon(): ReactNode {
  return (
    <svg {...strokeProps} strokeWidth="2">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export function EyeOffIcon(): ReactNode {
  return (
    <svg {...strokeProps} strokeWidth="2">
      <path d="M10.7 5.1A10.4 10.4 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-2.7 3.6M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7a10 10 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2M3 3l18 18" />
    </svg>
  )
}

export function PlusIcon(): ReactNode {
  return (
    <svg {...strokeProps} strokeWidth="2">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function MinusIcon(): ReactNode {
  return (
    <svg {...strokeProps} strokeWidth="2">
      <path d="M5 12h14" />
    </svg>
  )
}

export function MenuIcon(): ReactNode {
  return (
    <svg {...strokeProps} strokeWidth="2">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}
