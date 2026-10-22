import type { CSSProperties, ReactNode } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { fractionOf } from './slider-math'
import styles from './slider.module.css'

export interface SliderMark {
  label?: ReactNode
  value: number
}

interface SliderMarksProps {
  classNames?: { mark?: string; markLabel?: string }
  marks?: boolean | number[] | SliderMark[]
  max: number
  min: number
  step: number
  values: number[]
}

const resolveMarks = (
  marks: SliderMarksProps['marks'],
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

export function SliderMarks({
  classNames,
  marks,
  max,
  min,
  step,
  values,
}: Readonly<SliderMarksProps>): ReactNode {
  const items = resolveMarks(marks, min, max, step)
  if (items.length === 0) return null
  const lower = values.length > 1 ? Math.min(...values) : min
  const upper = Math.max(...values)

  return (
    <span aria-hidden="true" className={styles.marks} data-plume-slider-marks="">
      {items.map((mark) => (
        <span
          className={joinClasses(styles.mark, classNames?.mark)}
          data-active={mark.value > lower && mark.value < upper ? '' : undefined}
          data-plume-slider-mark=""
          key={mark.value}
          style={{ '--slider-mark': fractionOf(mark.value, min, max) } as CSSProperties}
        >
          {mark.label === undefined ? null : (
            <span className={joinClasses(styles.markLabel, classNames?.markLabel)}>
              {mark.label}
            </span>
          )}
        </span>
      ))}
    </span>
  )
}
