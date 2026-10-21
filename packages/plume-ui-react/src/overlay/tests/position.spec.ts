import { computePosition, parsePlacement } from '../position'

const viewport = { width: 1000, height: 800 }
const anchor = { x: 400, y: 300, width: 100, height: 40 }
const floating = { width: 200, height: 100 }

describe('computePosition', () => {
  it('places the floating element below and centered by default', () => {
    expect(computePosition({ anchor, floating, viewport })).toMatchObject({
      x: 350,
      y: 348,
      side: 'bottom',
      placement: 'bottom',
    })
  })

  describe('available space', () => {
    it('reports the room on the side the floating element opens to', () => {
      const below = computePosition({ anchor, floating, viewport, placement: 'bottom' })
      expect(below.maxHeight).toBe(800 - 340 - 8 - 8)
      expect(below.maxWidth).toBe(1000 - 16)
      const above = computePosition({ anchor, floating, viewport, placement: 'top' })
      expect(above.maxHeight).toBe(300 - 8 - 8)
      const left = computePosition({ anchor, floating, viewport, placement: 'left' })
      expect(left.maxWidth).toBe(400 - 8 - 8)
      expect(left.maxHeight).toBe(800 - 16)
      const right = computePosition({ anchor, floating, viewport, placement: 'right' })
      expect(right.maxWidth).toBe(1000 - 500 - 8 - 8)
    })

    it('keeps a tall element inside the screen by using the room it has', () => {
      const tall = { width: 200, height: 900 }
      const result = computePosition({ anchor, floating: tall, viewport, placement: 'bottom' })
      expect(result.maxHeight).toBe(444)
      expect(result.y).toBe(348)
      expect(result.y + result.maxHeight).toBeLessThanOrEqual(800 - 8)
    })

    it('places a tall element above the anchor next to it, not off the top of the screen', () => {
      const nearBottom = { ...anchor, y: 700 }
      const tall = { width: 200, height: 900 }
      const result = computePosition({
        anchor: nearBottom,
        floating: tall,
        viewport,
        placement: 'bottom',
      })
      expect(result.side).toBe('top')
      expect(result.maxHeight).toBe(684)
      expect(result.y).toBe(8)
    })

    it('never reports a negative room', () => {
      const edge = { ...anchor, y: 795 }
      const result = computePosition({
        anchor: edge,
        floating,
        viewport,
        placement: 'bottom',
        flip: false,
      })
      expect(result.maxHeight).toBe(0)
    })
  })

  it.each([
    ['top', 350, 192],
    ['left', 192, 270],
    ['right', 508, 270],
    ['bottom-start', 400, 348],
    ['bottom-end', 300, 348],
    ['top-start', 400, 192],
    ['top-end', 300, 192],
    ['left-start', 192, 300],
    ['left-end', 192, 240],
    ['right-start', 508, 300],
    ['right-end', 508, 240],
  ] as const)('places %s relative to the anchor', (placement, x, y) => {
    const result = computePosition({ anchor, floating, viewport, placement })
    expect(result).toMatchObject({ x, y, placement })
  })

  it('applies the offset', () => {
    expect(computePosition({ anchor, floating, viewport, placement: 'bottom', offset: 20 }).y).toBe(
      360,
    )
    expect(computePosition({ anchor, floating, viewport, placement: 'top', offset: 0 }).y).toBe(200)
  })

  describe('flip', () => {
    it('flips to the opposite side when the preferred one overflows and the other fits', () => {
      const nearBottom = { ...anchor, y: 700 }
      expect(
        computePosition({ anchor: nearBottom, floating, viewport, placement: 'bottom' }),
      ).toMatchObject({
        y: 592,
        side: 'top',
        placement: 'top',
      })
    })

    it('keeps the alignment when flipping', () => {
      const nearBottom = { ...anchor, y: 700 }
      expect(
        computePosition({ anchor: nearBottom, floating, viewport, placement: 'bottom-start' })
          .placement,
      ).toBe('top-start')
    })

    it('flips horizontally', () => {
      const nearRight = { x: 900, y: 300, width: 80, height: 40 }
      expect(
        computePosition({ anchor: nearRight, floating, viewport, placement: 'right' }),
      ).toMatchObject({
        x: 692,
        side: 'left',
      })
      const nearLeft = { x: 10, y: 300, width: 80, height: 40 }
      expect(
        computePosition({ anchor: nearLeft, floating, viewport, placement: 'left' }),
      ).toMatchObject({
        x: 98,
        side: 'right',
      })
    })

    it('flips from top to bottom', () => {
      const nearTop = { ...anchor, y: 20 }
      expect(computePosition({ anchor: nearTop, floating, viewport, placement: 'top' }).side).toBe(
        'bottom',
      )
    })

    it('keeps the preferred side when the opposite overflows more', () => {
      const small = { width: 1000, height: 150 }
      const result = computePosition({
        anchor: { x: 400, y: 40, width: 100, height: 40 },
        floating,
        viewport: small,
        placement: 'bottom',
        shift: false,
      })
      expect(result.side).toBe('bottom')
    })

    it('does not flip when disabled', () => {
      const nearBottom = { ...anchor, y: 700 }
      expect(computePosition({ anchor: nearBottom, floating, viewport, flip: false }).side).toBe(
        'bottom',
      )
    })
  })

  describe('shift', () => {
    it('keeps a top or bottom placement inside the viewport horizontally', () => {
      expect(
        computePosition({ anchor: { x: 0, y: 300, width: 100, height: 40 }, floating, viewport }).x,
      ).toBe(8)
      expect(
        computePosition({ anchor: { x: 950, y: 300, width: 40, height: 40 }, floating, viewport })
          .x,
      ).toBe(792)
    })

    it('keeps a left or right placement inside the viewport vertically', () => {
      const top = computePosition({
        anchor: { x: 400, y: 0, width: 100, height: 20 },
        floating,
        viewport,
        placement: 'right',
      })
      expect(top.y).toBe(8)
      const bottom = computePosition({
        anchor: { x: 400, y: 790, width: 100, height: 20 },
        floating,
        viewport,
        placement: 'right',
      })
      expect(bottom.y).toBe(692)
    })

    it('does not move the element when disabled', () => {
      expect(
        computePosition({
          anchor: { x: 0, y: 300, width: 100, height: 40 },
          floating,
          viewport,
          shift: false,
        }).x,
      ).toBe(-50)
    })

    it('pins an element larger than the viewport to the padding', () => {
      const result = computePosition({
        anchor,
        floating: { width: 2000, height: 100 },
        viewport,
        padding: 12,
      })
      expect(result.x).toBe(12)
    })
  })
})

describe('parsePlacement', () => {
  it('splits the side and the alignment, centered by default', () => {
    expect(parsePlacement('top')).toEqual({ side: 'top', align: 'center' })
    expect(parsePlacement('left-end')).toEqual({ side: 'left', align: 'end' })
  })
})
