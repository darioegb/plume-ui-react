export interface DeepMergeOptions {
  clone?: boolean
}

export function deepMerge<T>(
  target: T,
  ...sources: (Partial<T> | undefined)[]
): T {
  const options: DeepMergeOptions = { clone: false }

  function isObject(item: unknown): item is Record<string, unknown> {
    return item !== null && typeof item === 'object' && !Array.isArray(item)
  }

  function mergeObject(
    targetObj: Record<string, unknown>,
    sourceObj: Record<string, unknown>,
  ): Record<string, unknown> {
    const merged: Record<string, unknown> = options.clone
      ? { ...targetObj }
      : targetObj

    for (const key of Object.keys(sourceObj)) {
      if (isObject(sourceObj[key])) {
        merged[key] = mergeNestedObjects(
          merged[key] as Record<string, unknown>,
          sourceObj[key] as Record<string, unknown>,
        )
      } else {
        merged[key] = sourceObj[key]
      }
    }

    return merged
  }

  function mergeNestedObjects(
    targetObj: Record<string, unknown>,
    sourceObj: Record<string, unknown>,
  ): Record<string, unknown> {
    if (!isObject(sourceObj)) return sourceObj

    for (const key of Object.keys(sourceObj)) {
      if (isObject(sourceObj[key])) {
        if (!targetObj[key]) {
          targetObj[key] = {}
        }
        targetObj[key] = mergeNestedObjects(
          targetObj[key] as Record<string, unknown>,
          sourceObj[key] as Record<string, unknown>,
        )
      } else {
        targetObj[key] = sourceObj[key]
      }
    }

    return targetObj
  }

  let result: T = target

  for (const source of sources) {
    if (source) {
      result = mergeObject(
        result as Record<string, unknown>,
        source as Record<string, unknown>,
      ) as T
    }
  }

  return result
}
