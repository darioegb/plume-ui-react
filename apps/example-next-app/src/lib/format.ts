// The date is a calendar day, so it is formatted in UTC to avoid shifting it with the time zone.
export function formatDue(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(
    new Date(`${iso}T00:00:00Z`),
  )
}

export const formatNumber = (value: number, locale: string): string =>
  new Intl.NumberFormat(locale).format(value)

export function toIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}
