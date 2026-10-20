import { cloneElement, version } from 'react'
import type { ReactElement, Ref } from 'react'

type Props = Record<string, unknown>
type Handler = (...args: unknown[]) => void

export function mergeRefs<T>(...refs: (Ref<T> | undefined)[]): (node: T | null) => void {
  return (node) => {
    for (const ref of refs) {
      if (typeof ref === 'function') ref(node)
      else if (ref) (ref as { current: T | null }).current = node
    }
  }
}

export function getElementRef<T>(element: ReactElement): Ref<T> | undefined {
  if (Number.parseInt(version, 10) >= 19) return (element.props as { ref?: Ref<T> }).ref
  return (element as unknown as { ref?: Ref<T> }).ref
}

function mergeProps(childProps: Props, injected: Props): Props {
  const merged: Props = { ...childProps, ...injected }
  for (const key of Object.keys(injected)) {
    const own = childProps[key] as Handler | undefined
    const added = injected[key] as Handler | undefined
    if (/^on[A-Z]/.test(key) && typeof own === 'function' && typeof added === 'function') {
      merged[key] = (...args: unknown[]) => {
        own(...args)
        if (!(args[0] as { defaultPrevented?: boolean } | undefined)?.defaultPrevented)
          added(...args)
      }
    }
  }
  return merged
}

export function cloneWithProps(
  element: ReactElement,
  injected: Props,
  ...refs: (Ref<HTMLElement> | undefined)[]
): ReactElement {
  return cloneElement(element, {
    ...mergeProps(element.props as Props, injected),
    ref: mergeRefs(getElementRef<HTMLElement>(element), ...refs),
  } as Props)
}
