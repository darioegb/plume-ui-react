export function getContrastColor(colorSchema: string): string {
  const hexMatch = /^#?(?<temp3>[a-f\d]{2})(?<temp2>[a-f\d]{2})(?<temp1>[a-f\d]{2})$/i.exec(
    colorSchema,
  );
  const rgbMatch = colorSchema.match(/\d+/g);

  if (!rgbMatch) {
    return '#000000';
  }

  const [r, g, b] = hexMatch
    ? [
        parseInt(hexMatch[1], 16),
        parseInt(hexMatch[2], 16),
        parseInt(hexMatch[3], 16),
      ]
    : rgbMatch.map(Number);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 128 ? '#000000' : '#ffffff';
}
