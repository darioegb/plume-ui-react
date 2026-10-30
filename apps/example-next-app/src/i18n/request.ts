import { cookies, headers } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'
import { LOCALE_COOKIE, isLocale, negotiateLocale } from './config'

// There is no locale in the URL: the cookie wins, then the browser's languages, then English.
export default getRequestConfig(async () => {
  const saved = (await cookies()).get(LOCALE_COOKIE)?.value
  const locale = isLocale(saved) ? saved : negotiateLocale((await headers()).get('accept-language'))

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    // The dates of the app are calendar days, so they are formatted in UTC on the server and the client.
    timeZone: 'UTC',
  }
})
