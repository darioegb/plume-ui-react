import '@/styles/globals.css'
import '@plume-ui-react/lib/styles.css'
import { ThemeProvider } from '@plume-ui-react/lib'
import type { AppProps } from 'next/app'

const theme = { colors: { primary: { 500: '#2563eb' } } }

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider defaultColorMode="light" theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
