export function getContrastColor(colorSchema: string): string {
  const hexMatch =
    /^#?(?<red>[a-f\d]{2})(?<green>[a-f\d]{2})(?<blue>[a-f\d]{2})$/i.exec(
      colorSchema,
    )
  const rgbMatch = colorSchema.match(/\d+/g)

  if (!rgbMatch) return '#000000'

  const [r, g, b] = hexMatch?.groups
    ? [
        parseInt(hexMatch.groups.red, 16),
        parseInt(hexMatch.groups.green, 16),
        parseInt(hexMatch.groups.blue, 16),
      ]
    : rgbMatch.map(Number)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000

  return brightness > 128 ? '#000000' : '#ffffff'
}
