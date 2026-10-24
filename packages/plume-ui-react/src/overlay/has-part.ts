import type { ElementType, ReactNode } from 'react'
import { Children, isValidElement } from 'react'

export const hasPart = (children: ReactNode, parts: readonly ElementType[]): boolean =>
  Children.toArray(children).some(
    (child) => isValidElement(child) && parts.includes(child.type as ElementType),
  )
