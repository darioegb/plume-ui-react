import type { SliderMark } from './slider-context'

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max)

const decimals = (value: number): number => {
  const text = String(value)
  const exponent = /e-(\d+)$/.exec(text)
  if (exponent) return Number(exponent[1])
  return text.split('.')[1]?.length ?? 0
}

export const snap = (value: number, min: number, max: number, step: number): number => {
  if (step <= 0) return clamp(value, min, max)
  const steps = Math.min(Math.round((value - min) / step), Math.floor((max - min) / step))
  const precision = Math.max(decimals(step), decimals(min))
  return clamp(Number((min + steps * step).toFixed(precision)), min, max)
}

export const fractionOf = (value: number, min: number, max: number): number =>
  max > min ? (clamp(value, min, max) - min) / (max - min) : 0

export const toValues = (value: number | readonly number[]): number[] =>
  typeof value === 'number' ? [value] : [...value]

export const resolveMarks = (
  marks: boolean | number[] | SliderMark[] | undefined,
  min: number,
  max: number,
  step: number,
): SliderMark[] => {
  if (!marks) return []
  if (marks === true) {
    const count = step > 0 ? Math.floor((max - min) / step) : 0
    return Array.from({ length: count + 1 }, (_, index) => ({ value: min + index * step }))
  }
  return marks.map((mark) => (typeof mark === 'number' ? { value: mark } : mark))
}
