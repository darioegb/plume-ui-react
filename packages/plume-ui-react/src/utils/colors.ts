function getRgbFromColor(color: string): number[] {
  const hexMatch = getHexMatch(color)?.groups
  return color.startsWith('#') && hexMatch
    ? [
        Number.parseInt(hexMatch.red, 16),
        Number.parseInt(hexMatch.green, 16),
        Number.parseInt(hexMatch.blue, 16),
      ]
    : getRgbMatch(color)?.map(Number) || []
}

function getRgbMatch(rgbColor: string): RegExpMatchArray | null {
  return rgbColor.match(/\d+(?:\.\d+)?/g)
}

function getHexMatch(hexColor: string): RegExpExecArray | null {
  return /^#?(?<red>[a-f\d]{2})(?<green>[a-f\d]{2})(?<blue>[a-f\d]{2})$/i.exec(hexColor)
}

export function getContrastColor(inputColor: string): string {
  const originalRgb = getRgbFromColor(inputColor)

  if (originalRgb.length < 3) return '#000000'

  const [r, g, b] = originalRgb
  const brightness = (r * 299 + g * 587 + b * 114) / 1000

  return brightness > 140 ? '#000000' : '#ffffff'
}

function getRelativeLuminance(color: string): number {
  const rgb = getRgbFromColor(color)

  if (rgb.length < 3) return 0

  const [r, g, b] = rgb.map((channel) => {
    const sRgb = channel / 255
    return sRgb <= 0.03928 ? sRgb / 12.92 : ((sRgb + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

// WCAG 2.1 contrast ratio (1 to 21); AA requires >= 4.5 for normal text.
export function getContrastRatio(foreground: string, background: string): number {
  const l1 = getRelativeLuminance(foreground)
  const l2 = getRelativeLuminance(background)
  const [lighter, darker] = l1 >= l2 ? [l1, l2] : [l2, l1]
  return (lighter + 0.05) / (darker + 0.05)
}

export function getLightenColor(inputColor: string, lightness = 10): string {
  const originalRgb = getRgbFromColor(inputColor)

  if (originalRgb.length < 3) return inputColor

  const adjustedRgb = originalRgb.map((channel) =>
    Math.min(255, channel + (255 - channel) * (lightness / 100)),
  )
  return `rgb(${adjustedRgb.join(', ')})`
}

export function getDarkenColor(inputColor: string, darkness = 10): string {
  const originalRgb = getRgbFromColor(inputColor)

  if (originalRgb.length < 3) return inputColor

  const adjustedRgb = originalRgb.map((channel) =>
    Math.max(0, channel - (channel * darkness) / 100),
  )

  return `rgb(${adjustedRgb.join(', ')})`
}
