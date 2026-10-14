import '@/styles/globals.css'
import '@plume-ui-react/lib/styles.css'
import 'plume-ui.config'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
