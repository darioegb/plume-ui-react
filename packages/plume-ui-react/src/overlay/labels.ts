export const mergeLabels = <T extends object>(defaults: T, labels?: Partial<T>): T => {
  const merged = { ...defaults }
  if (labels) {
    for (const key of Object.keys(labels) as (keyof T)[]) {
      const value = labels[key]
      if (value !== undefined) merged[key] = value
    }
  }
  return merged
}
