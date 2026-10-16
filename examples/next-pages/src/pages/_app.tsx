import '@/styles/globals.css'
import '@plume-ui-react/lib/styles.css'
import { ThemeProvider } from '@plume-ui-react/lib'
import type { AppProps } from 'next/app'
import { theme } from '@/theme'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider defaultColorMode="light" theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
