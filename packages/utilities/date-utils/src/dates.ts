function getLocale(language?: string): string {
  if (!language) {
    return navigator.language
  } else if (language.length === 2) {
    return `${language}-${language.toUpperCase()}`
  }
  return language
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
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' })
  const currentYear = new Date().getUTCFullYear()

  for (let i = 0; i < 7; i++) {
    const day = new Date(Date.UTC(currentYear, 0, 2))
    day.setUTCDate(day.getUTCDate() + i)
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
      return `${formatDate(startDate, displayFormat, language)} - ${formatDate(
        endDate,
        displayFormat,
        language,
      )}`
    }

    return startDate ? formatDate(startDate, displayFormat, language) : ''
  }
  const locale = getLocale(language)
  if (isRange && startDate && endDate) {
    return `${new Intl.DateTimeFormat(locale, config).format(
      startDate,
    )} - ${new Intl.DateTimeFormat(locale, config).format(endDate)}`
  }

  return startDate ? new Intl.DateTimeFormat(locale, config).format(startDate) : ''
}

export function formatDate(date: Date, displayFormat: string, language?: string): string {
  const monthNames: string[] = getMonthsByLanguage(language)

  const map: Record<string, string> = {
    YYYY: String(date.getFullYear()),
    YY: String(date.getFullYear()).slice(-2),
    MMMM: monthNames[date.getMonth()],
    MMM: monthNames[date.getMonth()].slice(0, 3),
    MM: String(date.getMonth() + 1).padStart(2, '0'),
    M: String(date.getMonth() + 1),
    DD: String(date.getDate()).padStart(2, '0'),
    D: String(date.getDate()),
  }

  return displayFormat.replace(/YYYY|YY|MMMM|MMM|MM|M|DD|D/g, (match) => map[match])
}
