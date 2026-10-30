export const locales = ['en', 'es'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export const LOCALE_COOKIE = 'plume-locale'

export const isLocale = (value: unknown): value is Locale =>
  locales.some((locale) => locale === value)

// The first supported language of the Accept-Language header, by quality.
export function negotiateLocale(header: string | null | undefined): Locale {
  const preferred = (header ?? '')
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';')
      const quality = params.find((param) => param.trim().startsWith('q='))
      return {
        language: tag.trim().toLowerCase().split('-')[0],
        quality: quality ? Number(quality.trim().slice(2)) : 1,
      }
    })
    .filter(({ quality }) => quality > 0)
    .sort((first, second) => second.quality - first.quality)

  return preferred.map(({ language }) => language).find(isLocale) ?? defaultLocale
}
