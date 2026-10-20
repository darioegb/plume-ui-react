import type { AppProps } from 'next/app'
import { ThemeProvider, ToastProvider } from 'plume-ui-react'
import 'plume-ui-react/styles.css'
import { theme } from '@/theme'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider defaultColorMode="light" theme={theme}>
      <ToastProvider>
        <Component {...pageProps} />
      </ToastProvider>
    </ThemeProvider>
  )
}
