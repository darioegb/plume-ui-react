/**
 * Deeply merges `sources` into `target` and returns a NEW object. Inputs are
 * never mutated, so shared/base objects (e.g. a default theme) stay pristine.
 * Later sources win; nested plain objects are merged recursively, everything
 * else (primitives, arrays) is replaced.
 */
function isObject(item: unknown): item is Record<string, unknown> {
  return item !== null && typeof item === 'object' && !Array.isArray(item)
}

export function deepMerge<T>(target: T, ...sources: (Partial<T> | undefined)[]): T {
  function merge(base: unknown, override: unknown): unknown {
    if (!isObject(base) || !isObject(override)) return override

    const result: Record<string, unknown> = { ...base }
    for (const key of Object.keys(override)) {
      result[key] = key in base ? merge(base[key], override[key]) : override[key]
    }
    return result
  }

  let result: unknown = isObject(target) ? { ...target } : target
  for (const source of sources) {
    if (source !== undefined) {
      result = merge(result, source)
    }
  }

  return result as T
}
