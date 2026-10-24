import { render } from '@testing-library/react'
import { createRef } from 'react'
import { Skeleton, SkeletonLine } from '..'

describe('SkeletonLine', () => {
  it('composes the lines of a skeleton as written', () => {
    const { container } = render(
      <Skeleton>
        <SkeletonLine />
        <SkeletonLine width="40%" />
      </Skeleton>,
    )
    const lines = container.querySelectorAll('[data-plume-skeleton-line]')
    expect(lines).toHaveLength(2)
    expect(container.firstChild).toHaveClass('lines', 'linesPulse')
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
    expect(lines[1]).toHaveStyle({ width: '40%' })
  })

  it('takes a width and a height in pixels or in any unit', () => {
    const { container } = render(
      <Skeleton>
        <SkeletonLine height={12} width={80} />
        <SkeletonLine height="50%" />
      </Skeleton>,
    )
    const lines = container.querySelectorAll('[data-plume-skeleton-line]')
    expect(lines[0]).toHaveStyle({ height: '12px', width: '80px' })
    expect(lines[1]).toHaveStyle({ height: '50%' })
  })

  it('takes the class, the style and the ref', () => {
    const ref = createRef<HTMLSpanElement>()
    const { container } = render(
      <Skeleton>
        <SkeletonLine className="mine" ref={ref} style={{ margin: '2px' }} />
      </Skeleton>,
    )
    const line = container.querySelector('[data-plume-skeleton-line]')
    expect(line).toHaveClass('line', 'mine')
    expect(line).toHaveStyle({ margin: '2px' })
    expect(ref.current).toBe(line)
  })

  it('uses the wave animation class of the container', () => {
    const { container } = render(
      <Skeleton variant="wave">
        <SkeletonLine />
      </Skeleton>,
    )
    expect(container.firstChild).toHaveClass('linesWave')
  })

  it('keeps the container bare when unstyled', () => {
    const { container } = render(
      <Skeleton className="mine" variant="unstyled">
        <SkeletonLine />
      </Skeleton>,
    )
    expect(container.firstChild).toHaveAttribute('class', 'mine')
  })
})
