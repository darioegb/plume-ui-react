function getLocale(language?: string): string {
  if (!language) {
    return navigator.language
  } else if (language.length === 2) {
    return `${language}-${language.toUpperCase()}`
  }
  return language
}

function formatDateRegex(displayFormat: string): RegExp {
  const formatMap: Record<string, string> = {
    dd: String.raw`\d{2}`,
    mm: String.raw`\d{2}`,
    yyyy: String.raw`\d{4}`,
  }

  const regexFormat = displayFormat
    .toLowerCase()
    .replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`)
    .replace(/dd|mm|yyyy/g, (match) => formatMap[match])

  return new RegExp(`^${regexFormat}$`)
}

export function getDateFormatByLanguage(language?: string): string {
  const locale = getLocale(language)
  const formatter = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  const parts = formatter.formatToParts(new Date())

  const order = parts.map((part) => part.type)
  const formatMap: Record<string, string> = {
    year: 'yyyy',
    month: 'MM',
    day: 'dd',
  }
  const dateFormat = order
    .map((type, index) => formatMap[type] || parts[index].value)
    .join('')
    .toLocaleLowerCase()

  return dateFormat
}

export function getDaysOfWeekByLanguage(language?: string): string[] {
  const locale = getLocale(language)
  const daysOfWeek: string[] = []
  // Format in UTC so the local timezone can't shift the weekday.
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' })

  // 2024-01-01 is a Monday; the calendar grid starts on Monday.
  for (let i = 0; i < 7; i++) {
    const day = new Date(Date.UTC(2024, 0, 1 + i))
    const dayOfWeek = formatter.format(day).replace(/^\w/, (c) => c.toUpperCase())
    daysOfWeek.push(dayOfWeek)
  }

  return daysOfWeek
}

export function getMonthsByLanguage(language?: string): string[] {
  const locale = getLocale(language)
  const formatter = new Intl.DateTimeFormat(locale, { month: 'long' })
  return Array.from({ length: 12 }, (_, index) => {
    const date = new Date()
    date.setMonth(index)
    return formatter.format(date).replace(/^\w/, (c) => c.toUpperCase())
  })
}

export function getDateStringByLanguage({
  displayFormat,
  isRange,
  startDate,
  endDate,
  language,
}: {
  displayFormat?: string
  startDate?: Date
  isRange?: boolean
  endDate?: Date
  language?: string
}): string {
  const config: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }
  if (displayFormat) {
    if (isRange && startDate && endDate) {
      return `${formatDate(startDate, displayFormat)} - ${formatDate(endDate, displayFormat)}`
    }

    return startDate ? formatDate(startDate, displayFormat) : ''
  }
  const locale = getLocale(language)
  if (isRange && startDate && endDate) {
    return `${new Intl.DateTimeFormat(locale, config).format(
      startDate,
    )} - ${new Intl.DateTimeFormat(locale, config).format(endDate)}`
  }

  return startDate ? new Intl.DateTimeFormat(locale, config).format(startDate) : ''
}

export function formatDate(date: Date, displayFormat: string): string {
  const map: Record<string, string> = {
    yyyy: String(date.getFullYear()),
    mm: String(date.getMonth() + 1).padStart(2, '0'),
    dd: String(date.getDate()).padStart(2, '0'),
  }

  return displayFormat.replace(/yyyy|mm|dd/gi, (match) => map[match.toLowerCase()])
}

export function validateFormatDate(
  dateString: string,
  language: string,
  displayFormat?: string,
): boolean {
  const format = displayFormat ?? getDateFormatByLanguage(language)
  if (!formatDateRegex(format).test(dateString)) {
    return false
  }
  const date = getDateFromDateString(dateString, format)
  return !Number.isNaN(date.getTime()) && formatDate(date, format) === dateString
}

export function getDateFromDateString(dateString: string, displayFormat = 'mm/dd/yyyy'): Date {
  const format = displayFormat.toLowerCase()
  const part = (token: string): number => {
    const index = format.indexOf(token)
    return index === -1 ? Number.NaN : Number(dateString.slice(index, index + token.length))
  }
  return new Date(part('yyyy'), part('mm') - 1, part('dd'))
}
