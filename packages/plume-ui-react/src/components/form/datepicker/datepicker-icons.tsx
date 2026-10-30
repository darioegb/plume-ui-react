import type { ReactNode } from 'react'

const PATHS = {
  next: 'M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z',
  nextYears:
    'M141.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L124.69,128,50.34,53.66A8,8,0,0,1,61.66,42.34l80,80A8,8,0,0,1,141.66,133.66Zm80-11.32-80-80a8,8,0,0,0-11.32,11.32L204.69,128l-74.35,74.34a8,8,0,0,0,11.32,11.32l80-80A8,8,0,0,0,221.66,122.34Z',
  previous:
    'M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z',
  previousYears:
    'M205.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L131.31,128ZM51.31,128l74.35-74.34a8,8,0,0,0-11.32-11.32l-80,80a8,8,0,0,0,0,11.32l80,80a8,8,0,0,0,11.32-11.32Z',
} as const

export type DatePickerIconName = keyof typeof PATHS

export function DatePickerIcon({ name }: Readonly<{ name: DatePickerIconName }>): ReactNode {
  return (
    <svg
      aria-hidden="true"
      data-icon={name}
      data-plume-datepicker-icon=""
      fill="currentColor"
      height="16"
      stroke="currentColor"
      strokeWidth="10"
      viewBox="0 0 256 256"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={PATHS[name]} />
    </svg>
  )
}

DatePickerIcon.displayName = 'DatePickerIcon'
