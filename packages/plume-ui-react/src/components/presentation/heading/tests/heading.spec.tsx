import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Heading } from '..'

describe('Heading component', () => {
  it('is a level 2 heading that looks like one by default', () => {
    render(<Heading>Title</Heading>)
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toHaveClass('heading', 'size2')
    expect(heading).toHaveAttribute('data-plume-heading')
    expect(heading).toHaveAttribute('data-size', '2')
  })

  it.each([1, 2, 3, 4, 5, 6] as const)('renders an h%s that looks like a size %s', (level) => {
    render(<Heading level={level}>Title</Heading>)
    const heading = screen.getByRole('heading', { level })
    expect(heading.tagName).toBe(`H${level}`)
    expect(heading).toHaveClass(`size${level}`)
  })

  it('keeps its level when it has the look of another one', () => {
    render(
      <Heading level={2} size={5}>
        Title
      </Heading>,
    )
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toHaveClass('size5')
    expect(heading).not.toHaveClass('size2')
    expect(heading).toHaveAttribute('data-size', '5')
  })

  it('can be truncated', () => {
    render(<Heading truncate>Title</Heading>)
    const heading = screen.getByRole('heading')
    expect(heading).toHaveClass('truncate')
    expect(heading).toHaveAttribute('data-truncate')
  })

  it('has no truncation unless it is asked for', () => {
    render(<Heading>Title</Heading>)
    expect(screen.getByRole('heading')).not.toHaveClass('truncate')
    expect(screen.getByRole('heading')).not.toHaveAttribute('data-truncate')
  })

  it('drops the Plume classes when it is unstyled and keeps the className', () => {
    render(
      <Heading className="custom" variant="unstyled">
        Title
      </Heading>,
    )
    expect(screen.getByRole('heading').className).toBe('custom')
  })

  it('applies the style, the id and the language', () => {
    render(
      <Heading id="top" lang="es" style={{ color: 'red' }}>
        Title
      </Heading>,
    )
    const heading = screen.getByRole('heading')
    expect(heading).toHaveAttribute('id', 'top')
    expect(heading).toHaveAttribute('lang', 'es')
    expect(heading).toHaveStyle({ color: 'rgb(255, 0, 0)' })
  })

  it('forwards the ref to the element', () => {
    const ref = createRef<HTMLHeadingElement>()
    render(<Heading ref={ref}>Title</Heading>)
    expect(ref.current).toBe(screen.getByRole('heading'))
  })
})
