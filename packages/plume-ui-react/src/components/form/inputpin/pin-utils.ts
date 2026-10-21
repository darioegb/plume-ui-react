export type InputPinType = 'numeric' | 'alphanumeric' | 'text'

const filters: Record<InputPinType, RegExp> = {
  alphanumeric: /[^a-z0-9]/gi,
  numeric: /\D/g,
  text: /\s/g,
}

export const sanitize = (text: string, type: InputPinType): string =>
  text.replace(filters[type], '')

export const extractTyped = (previous: string, text: string): string => {
  if (previous === '' || text.length !== previous.length + 1) return text
  if (text.startsWith(previous)) return text.slice(previous.length)
  return text.slice(0, text.length - previous.length)
}

export const insertAt = (value: string, index: number, chars: string, length: number): string => {
  const position = Math.min(index, value.length)
  const replaced = chars.length === 1 ? value.slice(position + 1) : ''
  return `${value.slice(0, position)}${chars}${replaced}`.slice(0, length)
}

export const removeAt = (value: string, index: number): string => {
  if (index < 0 || index >= value.length) return value
  return `${value.slice(0, index)}${value.slice(index + 1)}`
}
