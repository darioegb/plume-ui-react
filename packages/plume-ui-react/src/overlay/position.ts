export type Side = 'top' | 'bottom' | 'left' | 'right'
export type Align = 'start' | 'center' | 'end'
export type Placement = Side | `${Side}-${Align}`

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export interface Size {
  width: number
  height: number
}

export interface ComputePositionOptions {
  anchor: Rect
  floating: Size
  viewport: Size
  placement?: Placement
  offset?: number
  padding?: number
  flip?: boolean
  shift?: boolean
}

export interface PositionResult {
  x: number
  y: number
  placement: Placement
  side: Side
  maxHeight: number
  maxWidth: number
}

const opposites: Record<Side, Side> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }

export function parsePlacement(placement: Placement): { side: Side; align: Align } {
  const [side, align = 'center'] = placement.split('-') as [Side, Align?]
  return { side, align }
}

function coordinates(
  side: Side,
  align: Align,
  anchor: Rect,
  floating: Size,
  offset: number,
): { x: number; y: number } {
  const horizontal = side === 'top' || side === 'bottom'
  const alongX = (): number => {
    if (align === 'start') return anchor.x
    if (align === 'end') return anchor.x + anchor.width - floating.width
    return anchor.x + (anchor.width - floating.width) / 2
  }
  const alongY = (): number => {
    if (align === 'start') return anchor.y
    if (align === 'end') return anchor.y + anchor.height - floating.height
    return anchor.y + (anchor.height - floating.height) / 2
  }
  if (horizontal) {
    return {
      x: alongX(),
      y: side === 'top' ? anchor.y - floating.height - offset : anchor.y + anchor.height + offset,
    }
  }
  return {
    x: side === 'left' ? anchor.x - floating.width - offset : anchor.x + anchor.width + offset,
    y: alongY(),
  }
}

function overflow(
  side: Side,
  point: { x: number; y: number },
  floating: Size,
  viewport: Size,
  padding: number,
): number {
  if (side === 'top') return Math.max(0, padding - point.y)
  if (side === 'bottom') return Math.max(0, point.y + floating.height - (viewport.height - padding))
  if (side === 'left') return Math.max(0, padding - point.x)
  return Math.max(0, point.x + floating.width - (viewport.width - padding))
}

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(value, max))

function availableSpace(
  side: Side,
  anchor: Rect,
  viewport: Size,
  offset: number,
  padding: number,
): Size {
  const across = { height: viewport.height - padding * 2, width: viewport.width - padding * 2 }
  const space = (value: number): number => Math.max(0, value - offset - padding)
  if (side === 'top') return { ...across, height: space(anchor.y) }
  if (side === 'bottom') {
    return { ...across, height: space(viewport.height - anchor.y - anchor.height) }
  }
  if (side === 'left') return { ...across, width: space(anchor.x) }
  return { ...across, width: space(viewport.width - anchor.x - anchor.width) }
}

function chooseSide(
  preferred: Side,
  align: Align,
  anchor: Rect,
  floating: Size,
  viewport: Size,
  offset: number,
  padding: number,
): Side {
  const point = coordinates(preferred, align, anchor, floating, offset)
  const preferredOverflow = overflow(preferred, point, floating, viewport, padding)
  if (preferredOverflow <= 0) return preferred
  const opposite = opposites[preferred]
  const oppositePoint = coordinates(opposite, align, anchor, floating, offset)
  const oppositeOverflow = overflow(opposite, oppositePoint, floating, viewport, padding)
  return oppositeOverflow < preferredOverflow ? opposite : preferred
}

export function computePosition({
  anchor,
  floating,
  viewport,
  placement = 'bottom',
  offset = 8,
  padding = 8,
  flip = true,
  shift = true,
}: ComputePositionOptions): PositionResult {
  const { side: preferred, align } = parsePlacement(placement)
  const side = flip
    ? chooseSide(preferred, align, anchor, floating, viewport, offset, padding)
    : preferred

  const available = availableSpace(side, anchor, viewport, offset, padding)
  const size = {
    height: Math.min(floating.height, available.height),
    width: Math.min(floating.width, available.width),
  }
  let point = coordinates(side, align, anchor, size, offset)

  if (shift) {
    const horizontal = side === 'top' || side === 'bottom'
    point = horizontal
      ? { x: clamp(point.x, padding, viewport.width - padding - size.width), y: point.y }
      : { x: point.x, y: clamp(point.y, padding, viewport.height - padding - size.height) }
  }

  return {
    x: point.x,
    y: point.y,
    maxHeight: available.height,
    maxWidth: available.width,
    side,
    placement: align === 'center' && !placement.includes('-') ? side : `${side}-${align}`,
  }
}
