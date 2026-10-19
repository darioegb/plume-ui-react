import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { __Name__, __Name__Content } from '..'

describe('__Name__ component', () => {
  it('renders its content', () => {
    render(
      <__Name__>
        <__Name__Content>Content</__Name__Content>
      </__Name__>,
    )
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('derives the content id from the root id', () => {
    const { container } = render(
      <__Name__ id="demo">
        <__Name__Content>Content</__Name__Content>
      </__Name__>,
    )
    expect(container.firstChild).toHaveAttribute('id', 'demo')
    expect(screen.getByText('Content')).toHaveAttribute('id', 'demo-content')
  })

  it('generates a root id when none is given', () => {
    const { container } = render(
      <__Name__>
        <__Name__Content>Content</__Name__Content>
      </__Name__>,
    )
    const rootId = (container.firstChild as HTMLElement).id
    expect(rootId).not.toBe('')
    expect(screen.getByText('Content')).toHaveAttribute('id', `${rootId}-content`)
  })

  it('lets the content override its id', () => {
    render(
      <__Name__>
        <__Name__Content id="custom">Content</__Name__Content>
      </__Name__>,
    )
    expect(screen.getByText('Content')).toHaveAttribute('id', 'custom')
  })

  it('applies the root size to the content', () => {
    render(
      <__Name__ size="lg">
        <__Name__Content>Content</__Name__Content>
      </__Name__>,
    )
    expect(screen.getByText('Content')).toHaveClass('content', 'lg')
  })

  it('applies the base and variant classes and the color variables to the root', () => {
    const { container } = render(
      <__Name__ colorScheme="success">
        <__Name__Content>Content</__Name__Content>
      </__Name__>,
    )
    expect(container.firstChild).toHaveClass('__slug__', 'solid')
    expect(container.firstChild).toHaveStyle('--__slug__-solid: var(--plume-color-success-solid)')
  })

  it('drops the Plume classes when unstyled', () => {
    const { container } = render(
      <__Name__ className="custom" variant="unstyled">
        <__Name__Content className="inner">Content</__Name__Content>
      </__Name__>,
    )
    expect(container.firstChild).toHaveClass('custom')
    expect(container.firstChild).not.toHaveClass('__slug__')
    expect(screen.getByText('Content')).toHaveClass('inner')
    expect(screen.getByText('Content')).not.toHaveClass('content')
  })

  it('forwards the refs', () => {
    const rootRef = createRef<HTMLDivElement>()
    const contentRef = createRef<HTMLDivElement>()
    render(
      <__Name__ ref={rootRef}>
        <__Name__Content ref={contentRef}>Content</__Name__Content>
      </__Name__>,
    )
    expect(rootRef.current).toHaveClass('__slug__')
    expect(contentRef.current).toBe(screen.getByText('Content'))
  })

  it('throws when the content is used outside of the root', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => render(<__Name__Content>Content</__Name__Content>)).toThrow(
      '__Name__Content must be used within a <__Name__>',
    )
    vi.restoreAllMocks()
  })
})
