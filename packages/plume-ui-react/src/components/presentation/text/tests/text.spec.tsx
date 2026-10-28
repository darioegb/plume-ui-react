import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Text } from '..'

describe('Text component', () => {
  it('is a paragraph with the body style by default', () => {
    render(<Text>Content</Text>)
    const text = screen.getByText('Content')
    expect(text.tagName).toBe('P')
    expect(text).toHaveClass('text', 'body')
    expect(text).toHaveAttribute('data-plume-text')
    expect(text).toHaveAttribute('data-variant', 'body')
  })

  it.each([
    ['body-sm', 'bodySm'],
    ['label', 'label'],
    ['caption', 'caption'],
  ] as const)('supports the %s style', (variant, className) => {
    render(<Text variant={variant}>Content</Text>)
    expect(screen.getByText('Content')).toHaveClass('text', className)
  })

  it.each(['div', 'label', 'p', 'small', 'span', 'strong'] as const)('renders a %s', (as) => {
    render(<Text as={as}>Content</Text>)
    expect(screen.getByText('Content').tagName).toBe(as.toUpperCase())
  })

  it('names a control when it is a label', () => {
    render(
      <>
        <Text as="label" htmlFor="name">
          Name
        </Text>
        <input id="name" />
      </>,
    )
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
  })

  it('can be muted and truncated, and says so', () => {
    render(
      <Text muted truncate>
        Content
      </Text>,
    )
    const text = screen.getByText('Content')
    expect(text).toHaveClass('muted', 'truncate')
    expect(text).toHaveAttribute('data-muted')
    expect(text).toHaveAttribute('data-truncate')
  })

  it('has neither unless it is asked for', () => {
    render(<Text>Content</Text>)
    const text = screen.getByText('Content')
    expect(text).not.toHaveClass('muted', 'truncate')
    expect(text).not.toHaveAttribute('data-muted')
    expect(text).not.toHaveAttribute('data-truncate')
  })

  it('drops the Plume classes when it is unstyled and keeps the className', () => {
    render(
      <Text className="custom" muted variant="unstyled">
        Content
      </Text>,
    )
    const text = screen.getByText('Content')
    expect(text.className).toBe('custom')
    expect(text).toHaveAttribute('data-variant', 'unstyled')
  })

  it('keeps the truncation when it is unstyled', () => {
    render(
      <Text truncate variant="unstyled">
        Content
      </Text>,
    )
    expect(screen.getByText('Content')).toHaveClass('truncate')
  })

  it('applies the style, the id and the language', () => {
    render(
      <Text id="intro" lang="es" style={{ color: 'red' }}>
        Content
      </Text>,
    )
    const text = screen.getByText('Content')
    expect(text).toHaveAttribute('id', 'intro')
    expect(text).toHaveAttribute('lang', 'es')
    expect(text).toHaveStyle({ color: 'rgb(255, 0, 0)' })
  })

  it('forwards the ref to the element', () => {
    const ref = createRef<HTMLElement>()
    render(<Text ref={ref}>Content</Text>)
    expect(ref.current).toBe(screen.getByText('Content'))
  })
})
