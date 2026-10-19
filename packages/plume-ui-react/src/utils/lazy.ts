import type { LazyExoticComponent, ReactNode } from 'react'
import { lazy } from 'react'

export interface LazyLoadedComponent {
  default: () => ReactNode
}

export function lazyLoadContent(content: ReactNode): LazyExoticComponent<() => ReactNode> {
  return lazy(
    () =>
      new Promise<LazyLoadedComponent>((resolve) => {
        resolve({ default: () => content })
      }),
  )
}
