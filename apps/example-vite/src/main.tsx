import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, ToastProvider } from 'plume-ui-react'
import 'plume-ui-react/styles.css'
import { App } from './App'
import { theme } from './theme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultColorMode="light" theme={theme}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
)
