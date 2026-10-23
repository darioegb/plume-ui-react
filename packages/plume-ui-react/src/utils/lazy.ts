import type { LazyExoticComponent, ReactNode } from 'react'
import { lazy } from 'react'

export interface LazyLoadedComponent {
  default: () => ReactNode
}

export function lazyLoadContent(content: ReactNode): LazyExoticComponent<() => ReactNode> {
  return lazy(() => Promise.resolve<LazyLoadedComponent>({ default: () => content }))
}
