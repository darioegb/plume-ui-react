import type { ReactNode } from 'react'
import { Demo } from './demo'

// Server Component: the interactive pieces live in the client <Demo /> boundary,
// while <ThemeProvider> (in layout) is server-rendered so there is no theme flash.
export default function Page(): ReactNode {
  return <Demo />
}
