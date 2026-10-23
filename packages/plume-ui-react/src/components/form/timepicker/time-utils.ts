export interface TimeParts {
  hours: number
  minutes: number
}

export interface PeriodLabels {
  am: string
  pm: string
}

export type Period = 'am' | 'pm'

const TIME_PATTERN = /^(\d{1,2}):(\d{2})$/

const pad = (value: number): string => String(value).padStart(2, '0')

export const parseTime = (value: string): TimeParts | null => {
  const match = TIME_PATTERN.exec(value.trim())
  if (!match) return null
  const hours = Number(match[1])
  const minutes = Number(match[2])
  return hours < 24 && minutes < 60 ? { hours, minutes } : null
}

export const formatTime = ({ hours, minutes }: TimeParts): string => `${pad(hours)}:${pad(minutes)}`

export const toTwelveHour = (hours: number): { hour: number; period: Period } => ({
  hour: hours % 12 || 12,
  period: hours < 12 ? 'am' : 'pm',
})

export const fromTwelveHour = (hour: number, period: Period): number =>
  (hour % 12) + (period === 'pm' ? 12 : 0)

export const displayTime = (value: string, hour12: boolean, labels: PeriodLabels): string => {
  const parts = parseTime(value)
  if (!parts) return ''
  if (!hour12) return formatTime(parts)
  const { hour, period } = toTwelveHour(parts.hours)
  return `${pad(hour)}:${pad(parts.minutes)} ${labels[period]}`
}

const escapeRegExp = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`)

export const parseDisplayTime = (
  text: string,
  hour12: boolean,
  labels: PeriodLabels,
): string | null => {
  if (!hour12) {
    const parts = parseTime(text)
    return parts ? formatTime(parts) : null
  }
  const pattern = new RegExp(
    String.raw`^(\d{1,2}):(\d{2})\s*(${escapeRegExp(labels.am)}|${escapeRegExp(labels.pm)})$`,
    'i',
  )
  const match = pattern.exec(text.trim())
  if (!match) return null
  const hour = Number(match[1])
  const minutes = Number(match[2])
  if (hour < 1 || hour > 12 || minutes > 59) return null
  const period: Period = match[3].toLowerCase() === labels.am.toLowerCase() ? 'am' : 'pm'
  return formatTime({ hours: fromTwelveHour(hour, period), minutes })
}

export const range = (count: number, step = 1, start = 0): number[] =>
  Array.from({ length: Math.ceil(count / step) }, (_, index) => start + index * step)
