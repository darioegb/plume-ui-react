import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Collapse } from '..'

describe('Collapse component', () => {
  it('renders its content', () => {
    render(<Collapse>Hidden text</Collapse>)
    expect(screen.getByText('Hidden text')).toBeInTheDocument()
  })

  it('is closed by default', () => {
    const { container } = render(<Collapse>Text</Collapse>)
    expect(container.firstChild).not.toHaveAttribute('data-open')
  })

  it('is open with open', () => {
    const { container } = render(<Collapse open>Text</Collapse>)
    expect(container.firstChild).toHaveAttribute('data-open')
  })

  it('follows the open prop', () => {
    const { container, rerender } = render(<Collapse>Text</Collapse>)
    rerender(<Collapse open>Text</Collapse>)
    expect(container.firstChild).toHaveAttribute('data-open')
    rerender(<Collapse open={false}>Text</Collapse>)
    expect(container.firstChild).not.toHaveAttribute('data-open')
  })

  it('forwards the ref to the root', () => {
    const ref = createRef<HTMLDivElement>()
    const { container } = render(<Collapse ref={ref}>Text</Collapse>)
    expect(ref.current).toBe(container.firstChild)
  })

  it('applies the base class and keeps the class of the user', () => {
    const { container } = render(<Collapse className="mine">Text</Collapse>)
    expect(container.firstChild).toHaveClass('collapse', 'mine')
  })

  it('puts bodyClassName on the box that holds the content', () => {
    render(<Collapse bodyClassName="body">Text</Collapse>)
    expect(screen.getByText('Text')).toHaveClass('body')
  })

  it('forwards the style, the id, the role and the accessible name', () => {
    render(
      <Collapse aria-label="Details" id="more" role="region" style={{ color: 'red' }}>
        Text
      </Collapse>,
    )
    const region = screen.getByRole('region', { name: 'Details' })
    expect(region).toHaveAttribute('id', 'more')
    expect(region).toHaveStyle({ color: 'rgb(255, 0, 0)' })
  })

  it('can be labelled by another element', () => {
    render(
      <>
        <h2 id="title">Title</h2>
        <Collapse aria-labelledby="title" role="region">
          Text
        </Collapse>
      </>,
    )
    expect(screen.getByRole('region', { name: 'Title' })).toBeInTheDocument()
  })
})
