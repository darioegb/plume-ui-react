import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@plume-ui-react/lib'
import '@plume-ui-react/lib/styles.css'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultColorMode="light">
      <App />
    </ThemeProvider>
  </StrictMode>,
)
