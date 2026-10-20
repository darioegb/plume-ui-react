export const joinClasses = (...names: (string | false | null | undefined)[]): string | undefined =>
  names.filter(Boolean).join(' ') || undefined
