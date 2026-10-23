'use client'

import { formatTime, fromTwelveHour, parseTime, toTwelveHour, type Period } from './time-utils'

interface UseTimePicksOptions {
  hour12: boolean
  onMinutesPicked: () => void
  setValue: (value: string) => void
  value: string
}

interface UseTimePicksResult {
  pickHours: (hours: number) => void
  pickMinutes: (minutes: number) => void
  pickPeriod: (period: Period) => void
}

export function useTimePicks({
  hour12,
  onMinutesPicked,
  setValue,
  value,
}: Readonly<UseTimePicksOptions>): UseTimePicksResult {
  const current = parseTime(value) ?? { hours: 0, minutes: 0 }
  const { hour, period } = toTwelveHour(current.hours)

  const setHours = (hours: number): void => {
    setValue(formatTime({ ...current, hours }))
  }

  return {
    pickHours: (picked) => {
      setHours(hour12 ? fromTwelveHour(picked, period) : picked)
    },
    pickMinutes: (minutes) => {
      setValue(formatTime({ ...current, minutes }))
      onMinutesPicked()
    },
    pickPeriod: (next) => {
      setHours(fromTwelveHour(hour, next))
    },
  }
}
