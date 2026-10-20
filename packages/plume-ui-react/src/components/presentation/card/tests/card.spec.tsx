import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Card, CardBody, CardFooter, CardHeader } from '..'

describe('Card component', () => {
  it('renders its parts', () => {
    render(
      <Card>
        <CardHeader>Title</CardHeader>
        <CardBody>Content</CardBody>
        <CardFooter>Actions</CardFooter>
      </Card>,
    )
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
    expect(screen.getByText('Actions')).toBeInTheDocument()
  })

  it('is an elevated medium card by default', () => {
    render(<Card data-testid="card">Content</Card>)
    expect(screen.getByText('Content')).toHaveClass('card', 'md', 'elevated')
  })

  it.each(['elevated', 'outline', 'filled'] as const)('supports the %s variant', (variant) => {
    render(<Card variant={variant}>Content</Card>)
    expect(screen.getByText('Content')).toHaveClass('card', variant)
  })

  it.each(['sm', 'md', 'lg'] as const)('supports the %s size', (size) => {
    render(<Card size={size}>Content</Card>)
    expect(screen.getByText('Content')).toHaveClass(size)
  })

  it('keeps the custom className and style', () => {
    render(
      <Card className="custom" style={{ width: '160px' }}>
        Content
      </Card>,
    )
    const card = screen.getByText('Content')
    expect(card).toHaveClass('card', 'custom')
    expect(card).toHaveStyle({ width: '160px' })
  })

  it('drops the Plume classes when unstyled', () => {
    render(
      <Card className="custom" variant="unstyled">
        Content
      </Card>,
    )
    const card = screen.getByText('Content')
    expect(card).toHaveClass('custom')
    expect(card).not.toHaveClass('card')
  })

  it('has no role of its own and takes one with a name', () => {
    const { rerender } = render(<Card>Content</Card>)
    expect(screen.getByText('Content')).not.toHaveAttribute('role')

    rerender(
      <Card aria-label="Weekly report" role="region">
        Content
      </Card>,
    )
    expect(screen.getByRole('region', { name: 'Weekly report' })).toBeInTheDocument()
  })

  it('forwards the ref to the root element', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Card ref={ref}>Content</Card>)
    expect(ref.current).toBe(screen.getByText('Content'))
  })

  it.each([
    ['CardHeader', CardHeader, 'header'],
    ['CardBody', CardBody, 'body'],
    ['CardFooter', CardFooter, 'footer'],
  ] as const)('%s takes className, style and a ref', (_name, Part, className) => {
    const ref = createRef<HTMLDivElement>()
    render(
      <Card>
        <Part className="custom" ref={ref} style={{ width: '80px' }}>
          Part
        </Part>
      </Card>,
    )
    const part = screen.getByText('Part')
    expect(part).toHaveClass(className, 'custom')
    expect(part).toHaveStyle({ width: '80px' })
    expect(ref.current).toBe(part)
  })
})
