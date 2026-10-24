import { render, screen } from '@testing-library/react'
import { createRef, type CSSProperties } from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '..'

describe('Breadcrumb parts', () => {
  it('wraps the items in a BreadcrumbList by default', () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>,
    )
    const nav = container.querySelector('nav')
    expect(nav?.firstElementChild).toHaveAttribute('data-plume-breadcrumb-list')
    expect(screen.getByRole('list').tagName).toBe('OL')
  })

  it('renders a composed BreadcrumbList as written, without wrapping it again', () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbList className="mine">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    )
    expect(container.querySelectorAll('ol')).toHaveLength(1)
    expect(screen.getByRole('list')).toHaveClass('mine')
  })

  it('forwards the ref and the style, and drops the Plume class when unstyled', () => {
    const ref = createRef<HTMLOListElement>()
    const { rerender } = render(
      <Breadcrumb>
        <BreadcrumbList ref={ref} style={{ '--probe': 'red' } as CSSProperties}>
          <BreadcrumbItem>x</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    )
    expect(ref.current).toHaveStyle('--probe: red')
    expect(ref.current).toHaveAttribute('class')
    rerender(
      <Breadcrumb variant="unstyled">
        <BreadcrumbList ref={ref}>
          <BreadcrumbItem>x</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    )
    expect(ref.current).not.toHaveAttribute('class')
  })

  it('styles each separator through its own part', () => {
    render(
      <Breadcrumb>
        <BreadcrumbItem separator={null}>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
          <BreadcrumbSeparator className="sep">›</BreadcrumbSeparator>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink current>Now</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>,
    )
    expect(screen.getByText('›')).toHaveClass('sep')
  })
})
