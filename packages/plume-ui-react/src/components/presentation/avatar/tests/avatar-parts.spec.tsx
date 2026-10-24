import { fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
  AvatarOverflow,
  AvatarStatusDot,
} from '..'

describe('Avatar parts', () => {
  it('renders the default composition with the same parts', () => {
    const { container } = render(<Avatar name="Ada Lovelace" status="online" />)
    const root = container.firstElementChild as HTMLElement
    expect(root.children).toHaveLength(2)
    expect(root.children[0]).toHaveAttribute('data-plume-avatar-fallback')
    expect(root.children[0]).toHaveTextContent('AL')
    expect(root.children[1]).toHaveAttribute('data-plume-avatar-status-dot')
  })

  it('composes the parts in the order they are given', () => {
    const { container } = render(
      <Avatar name="Ada" src="/ada.png" status="busy">
        <AvatarStatusDot />
        <AvatarImage />
        <AvatarFallback />
      </Avatar>,
    )
    const root = container.firstElementChild as HTMLElement
    expect(root.children[0]).toHaveAttribute('data-plume-avatar-status-dot')
    expect(root.children[1]).toHaveAttribute('data-plume-avatar-image')
    expect(root.querySelector('[data-plume-avatar-fallback]')).toBeNull()
  })

  it('omits the parts that are not given', () => {
    const { container } = render(
      <Avatar name="Ada" status="online">
        <AvatarFallback />
      </Avatar>,
    )
    expect(container.querySelector('[data-plume-avatar-fallback]')).toBeInTheDocument()
    expect(container.querySelector('[data-plume-avatar-status-dot]')).toBeNull()
  })

  it('replaces the content of the fallback', () => {
    render(
      <Avatar name="Ada">
        <AvatarFallback>?!</AvatarFallback>
      </Avatar>,
    )
    expect(screen.getByText('?!')).toBeInTheDocument()
    expect(screen.queryByText('A')).toBeNull()
  })

  it('shows the fallback when the image fails and keeps it hidden while it loads', () => {
    const { container } = render(
      <Avatar name="Ada Lovelace" src="/broken.png">
        <AvatarImage />
        <AvatarFallback />
      </Avatar>,
    )
    expect(container.querySelector('[data-plume-avatar-fallback]')).toBeNull()
    fireEvent.error(container.querySelector('img') as HTMLImageElement)
    expect(container.querySelector('img')).toBeNull()
    expect(container.querySelector('[data-plume-avatar-fallback]')).toHaveTextContent('AL')
  })

  it('shows only the fallback without a src', () => {
    const { container } = render(
      <Avatar name="Ada">
        <AvatarImage />
        <AvatarFallback />
      </Avatar>,
    )
    expect(container.querySelector('img')).toBeNull()
    expect(container.querySelector('[data-plume-avatar-fallback]')).toBeInTheDocument()
  })

  it('gives className, style and ref to each part', () => {
    const image = createRef<HTMLImageElement>()
    const fallback = createRef<HTMLSpanElement>()
    const dot = createRef<HTMLSpanElement>()
    const { rerender } = render(
      <Avatar name="Ada" src="/ada.png" status="online">
        <AvatarImage className="i-class" ref={image} style={{ opacity: 0.5 }} />
        <AvatarStatusDot className="s-class" ref={dot} style={{ opacity: 0.4 }} />
      </Avatar>,
    )
    expect(image.current).toHaveClass('image', 'i-class')
    expect(image.current).toHaveStyle({ opacity: '0.5' })
    expect(dot.current).toHaveClass('status', 's-class')
    expect(dot.current).toHaveStyle({ opacity: '0.4' })
    rerender(
      <Avatar name="Ada" status="online">
        <AvatarFallback className="f-class" ref={fallback} style={{ opacity: 0.3 }} />
      </Avatar>,
    )
    expect(fallback.current).toHaveClass('fallback', 'subtle', 'f-class')
    expect(fallback.current).toHaveStyle({ opacity: '0.3' })
  })

  it('passes the native attributes to the image', () => {
    const { container } = render(
      <Avatar name="Ada" src="/ada.png">
        <AvatarImage loading="lazy" />
      </Avatar>,
    )
    expect(container.querySelector('img')).toHaveAttribute('loading', 'lazy')
  })

  it('drops the Plume classes of every part when unstyled', () => {
    const { container } = render(
      <Avatar name="Ada" src="/ada.png" status="busy" variant="unstyled">
        <AvatarImage className="i-class" />
        <AvatarStatusDot />
      </Avatar>,
    )
    expect(container.querySelector('img')).toHaveAttribute('class', 'i-class')
    expect(container.querySelector('[data-plume-avatar-status-dot]')).not.toHaveAttribute('class')
    fireEvent.error(container.querySelector('img') as HTMLImageElement)
  })

  it('drops the Plume classes of the fallback when unstyled', () => {
    const { container } = render(
      <Avatar name="Ada" variant="unstyled">
        <AvatarFallback className="f-class" />
      </Avatar>,
    )
    expect(container.querySelector('[data-plume-avatar-fallback]')).toHaveAttribute(
      'class',
      'f-class',
    )
  })

  it('exposes the status in a data attribute and shows nothing without it', () => {
    const { container } = render(
      <Avatar name="Ada" status="away">
        <AvatarStatusDot />
      </Avatar>,
    )
    expect(container.querySelector('[data-plume-avatar-status-dot]')).toHaveAttribute(
      'data-status',
      'away',
    )
    const { container: other } = render(
      <Avatar name="Ada">
        <AvatarStatusDot />
      </Avatar>,
    )
    expect(other.querySelector('[data-plume-avatar-status-dot]')).toBeNull()
  })

  it.each([
    ['AvatarImage', <AvatarImage key="a" />],
    ['AvatarFallback', <AvatarFallback key="b" />],
    ['AvatarStatusDot', <AvatarStatusDot key="c" />],
  ])('%s throws outside an Avatar', (name, part) => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => render(part)).toThrow(`${name} must be rendered inside an <Avatar>`)
    spy.mockRestore()
  })
})

describe('AvatarOverflow', () => {
  it('shows +count and names itself with the label of the group', () => {
    render(
      <AvatarGroup labels={{ overflow: (hidden) => `${hidden} más` }}>
        <AvatarOverflow count={5} />
      </AvatarGroup>,
    )
    expect(screen.getByText('+5')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: '5 más' })).toBeInTheDocument()
  })

  it('works outside a group with the default text', () => {
    const { container } = render(<AvatarOverflow count={3} />)
    expect(screen.getByRole('img', { name: '3 more' })).toBeInTheDocument()
    expect(container.firstElementChild).toHaveAttribute('data-overflow')
  })

  it('takes another content, className and ref', () => {
    const ref = createRef<HTMLSpanElement>()
    render(
      <AvatarOverflow className="custom" count={2} ref={ref}>
        and 2 more
      </AvatarOverflow>,
    )
    expect(ref.current).toHaveClass('avatar', 'custom')
    expect(screen.getByText('and 2 more')).toBeInTheDocument()
  })

  it('is what the group renders for the hidden avatars', () => {
    const { container } = render(
      <AvatarGroup max={1}>
        <Avatar name="Ada" />
        <Avatar name="Grace" />
      </AvatarGroup>,
    )
    expect(container.querySelector('[data-overflow]')).toHaveTextContent('+1')
  })
})
