export const decimalsOf = (value: number): number => {
  if (!Number.isFinite(value)) return 0
  const [mantissa, exponent] = value.toString().split('e')
  const fraction = mantissa.split('.')[1]?.length ?? 0
  return Math.max(0, fraction - Number(exponent ?? 0))
}

export const roundTo = (value: number, precision: number): number =>
  Number(value.toFixed(Math.min(Math.max(precision, 0), 100)))

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max)

export const defaultParse = (text: string): number | null => {
  const clean = text.trim().replace(',', '.')
  if (clean === '' || clean === '-' || clean === '+' || clean === '.') return null
  const parsed = Number(clean)
  return Number.isFinite(parsed) ? parsed : null
}

export const isPartialNumber = (text: string, precision: number | undefined): boolean => {
  const pattern = precision === 0 ? /^[+-]?\d*$/ : /^[+-]?\d*[.,]?\d*$/
  return pattern.test(text)
}

export const sameNumber = (a: number | null, b: number | null): boolean => Object.is(a, b)
