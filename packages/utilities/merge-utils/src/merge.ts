export interface DeepMergeOptions {
  clone?: boolean
}

export function deepMerge<T>(
  target: T,
  ...sources: (Partial<T> | undefined)[]
): T {
  const options: DeepMergeOptions = { clone: false }

  interface DeepObject {
    [key: string]: DeepObject | unknown
  }

  function isObject(item: unknown): item is DeepObject {
    return item !== null && typeof item === 'object' && !Array.isArray(item)
  }

  function mergeObject(
    targetObj: DeepObject,
    sourceObj: DeepObject,
  ): DeepObject {
    if (!isObject(sourceObj)) return sourceObj

    let merged: DeepObject

    if (options.clone) {
      merged = { ...targetObj }
    } else {
      merged = targetObj
    }

    for (const key of Object.keys(sourceObj)) {
      if (isObject(sourceObj[key])) {
        if (!merged[key]) {
          merged[key] = {}
        }
        merged[key] = mergeObject(
          merged[key] as DeepObject,
          sourceObj[key] as DeepObject,
        )
      } else {
        merged[key] = sourceObj[key]
      }
    }

    return merged
  }

  let result: T = target

  for (const source of sources) {
    if (source) {
      result = mergeObject(result as DeepObject, source as DeepObject) as T
    }
  }

  return result
}
