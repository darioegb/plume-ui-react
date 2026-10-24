import { fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Avatar, AvatarGroup } from '..'
import { getInitials } from '../avatar-initials'

describe('getInitials', () => {
  it.each([
    ['Ada Lovelace', 'AL'],
    ['grace', 'G'],
    ['  Margaret   Heafield  Hamilton ', 'MH'],
    ['éric dupont', 'ÉD'],
    ['', ''],
    [undefined, ''],
  ])('turns %j into %j', (name, initials) => {
    expect(getInitials(name)).toBe(initials)
  })
})

describe('Avatar component', () => {
  it('shows the initials of the name when there is no image', () => {
    render(<Avatar name="Ada Lovelace" />)
    expect(screen.getByText('AL')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toBeInTheDocument()
  })

  it('shows an icon when it has neither an image nor a name', () => {
    const { container } = render(<Avatar />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('is hidden from assistive technology when it has no name', () => {
    const { container } = render(<Avatar />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
    expect(screen.queryByRole('img')).toBeNull()
  })

  it('shows a custom fallback', () => {
    render(<Avatar fallback="?" name="Ada" />)
    expect(screen.getByText('?')).toBeInTheDocument()
    expect(screen.queryByText('A')).toBeNull()
  })

  it('shows the image and names the avatar with the name or the alt', () => {
    const { container, rerender } = render(<Avatar name="Ada" src="/ada.png" />)
    expect(container.querySelector('img')).toHaveAttribute('src', '/ada.png')
    expect(screen.getByRole('img', { name: 'Ada' })).toBeInTheDocument()
    rerender(<Avatar alt="Photo of Ada" name="Ada" src="/ada.png" />)
    expect(screen.getByRole('img', { name: 'Photo of Ada' })).toBeInTheDocument()
  })

  it('falls back to the initials when the image fails and tries again with a new src', () => {
    const { container, rerender } = render(<Avatar name="Ada Lovelace" src="/broken.png" />)
    fireEvent.error(container.querySelector('img') as HTMLImageElement)
    expect(container.querySelector('img')).toBeNull()
    expect(screen.getByText('AL')).toBeInTheDocument()
    rerender(<Avatar name="Ada Lovelace" src="/ada.png" />)
    expect(container.querySelector('img')).toHaveAttribute('src', '/ada.png')
  })

  it('uses the label the user gives it', () => {
    render(<Avatar aria-label="Profile of Ada" name="Ada" />)
    expect(screen.getByRole('img', { name: 'Profile of Ada' })).toBeInTheDocument()
  })

  it('shows a status and includes it in the name', () => {
    const { container } = render(<Avatar name="Ada" status="online" />)
    expect(screen.getByRole('img', { name: 'Ada, Online' })).toBeInTheDocument()
    expect(container.querySelector('[data-plume-avatar-status-dot]')).toBeInTheDocument()
    expect(container.firstChild).toHaveAttribute('data-status', 'online')
  })

  it.each([
    ['away', 'Away'],
    ['busy', 'Busy'],
    ['offline', 'Offline'],
    ['online', 'Online'],
  ] as const)('names the %s status', (status, text) => {
    render(<Avatar name="Ada" status={status} />)
    expect(screen.getByRole('img', { name: `Ada, ${text}` })).toBeInTheDocument()
  })

  it('takes another text for the status', () => {
    render(<Avatar labels={{ busy: 'Ocupada' }} name="Ada" status="busy" />)
    expect(screen.getByRole('img', { name: 'Ada, Ocupada' })).toBeInTheDocument()
  })

  it('takes the texts of the status from the group', () => {
    render(
      <AvatarGroup labels={{ online: 'En línea' }}>
        <Avatar name="Ada" status="online" />
        <Avatar labels={{ online: 'Conectada' }} name="Grace" status="online" />
      </AvatarGroup>,
    )
    expect(screen.getByRole('img', { name: 'Ada, En línea' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Grace, Conectada' })).toBeInTheDocument()
  })

  it('has no status by default', () => {
    const { container } = render(<Avatar name="Ada" />)
    expect(container.querySelector('[data-plume-avatar-status-dot]')).toBeNull()
  })

  it('is a subtle, medium, round avatar by default', () => {
    const { container } = render(<Avatar name="Ada" />)
    expect(container.firstChild).toHaveClass('avatar', 'md', 'pill')
    expect(container.querySelector('[data-plume-avatar-fallback]')).toHaveClass(
      'fallback',
      'subtle',
    )
  })

  it.each(['sm', 'md', 'lg'] as const)('supports the %s size', (size) => {
    const { container } = render(<Avatar name="Ada" size={size} />)
    expect(container.firstChild).toHaveClass(size)
  })

  it.each(['rounded', 'pill'] as const)('supports the %s shape', (shape) => {
    const { container } = render(<Avatar name="Ada" shape={shape} />)
    expect(container.firstChild).toHaveClass(shape)
  })

  it.each(['outline', 'solid', 'subtle'] as const)('supports the %s variant', (variant) => {
    const { container } = render(<Avatar name="Ada" variant={variant} />)
    expect(container.querySelector('[data-plume-avatar-fallback]')).toHaveClass(variant)
  })

  it('sets the color variables', () => {
    const { container } = render(<Avatar colorScheme="success" name="Ada" />)
    expect(container.firstChild).toHaveStyle('--avatar-solid: var(--plume-color-success-solid)')
  })

  it('keeps the custom className and style', () => {
    const { container } = render(<Avatar className="custom" name="Ada" style={{ width: '60px' }} />)
    expect(container.firstChild).toHaveClass('avatar', 'custom')
    expect(container.firstChild).toHaveStyle({ width: '60px' })
  })

  it('drops the Plume classes when unstyled', () => {
    const { container } = render(
      <Avatar className="custom" name="Ada" status="busy" variant="unstyled" />,
    )
    expect(container.firstChild).toHaveAttribute('class', 'custom')
    expect(container.querySelector('[data-plume-avatar-fallback]')).not.toHaveAttribute('class')
    expect(container.querySelector('[data-plume-avatar-status-dot]')).not.toHaveAttribute('class')
  })

  it('forwards the ref', () => {
    const ref = createRef<HTMLSpanElement>()
    render(<Avatar name="Ada" ref={ref} />)
    expect(ref.current).toHaveAttribute('data-plume-avatar')
  })
})

describe('AvatarGroup component', () => {
  const people = ['Ada Lovelace', 'Grace Hopper', 'Margaret Hamilton', 'Katherine Johnson']

  const renderGroup = (props = {}) =>
    render(
      <AvatarGroup aria-label="Team" {...props}>
        {people.map((name) => (
          <Avatar key={name} name={name} />
        ))}
      </AvatarGroup>,
    )

  it('is a group with the avatars inside', () => {
    renderGroup()
    expect(screen.getByRole('group', { name: 'Team' })).toBeInTheDocument()
    expect(screen.getAllByRole('img')).toHaveLength(4)
  })

  it('shows all of them when there is no max or it is not reached', () => {
    renderGroup({ max: 10 })
    expect(screen.getAllByRole('img')).toHaveLength(4)
    expect(screen.queryByText(/^\+/)).toBeNull()
  })

  it('shows a counter with the rest when there are more than max', () => {
    renderGroup({ max: 2 })
    expect(screen.getByText('AL')).toBeInTheDocument()
    expect(screen.getByText('GH')).toBeInTheDocument()
    expect(screen.queryByText('MH')).toBeNull()
    expect(screen.getByText('+2')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: '2 more' })).toBeInTheDocument()
  })

  it('takes the text of the counter from labels.overflow', () => {
    renderGroup({ labels: { overflow: (hidden: number) => `${hidden} más` }, max: 3 })
    expect(screen.getByRole('img', { name: '1 más' })).toBeInTheDocument()
  })

  it('works with a max of zero', () => {
    renderGroup({ max: 0 })
    expect(screen.getByText('+4')).toBeInTheDocument()
    expect(screen.queryByText('AL')).toBeNull()
  })

  it('gives its size, shape, color and variant to the avatars', () => {
    const { container } = renderGroup({
      colorScheme: 'success',
      max: 1,
      shape: 'rounded',
      size: 'lg',
      variant: 'solid',
    })
    const avatars = container.querySelectorAll('[data-plume-avatar]')
    expect(avatars).toHaveLength(2)
    avatars.forEach((avatar) => {
      expect(avatar).toHaveClass('lg', 'rounded')
      expect(avatar).toHaveStyle('--avatar-solid: var(--plume-color-success-solid)')
      expect(avatar.querySelector('[data-plume-avatar-fallback]')).toHaveClass('solid')
    })
  })

  it('lets an avatar keep its own size', () => {
    const { container } = render(
      <AvatarGroup size="lg">
        <Avatar name="Ada" size="sm" />
      </AvatarGroup>,
    )
    expect(container.querySelector('[data-plume-avatar]')).toHaveClass('sm')
  })

  it('keeps the custom className and drops the Plume class when unstyled', () => {
    const { container, rerender } = render(
      <AvatarGroup className="custom">
        <Avatar name="Ada" />
      </AvatarGroup>,
    )
    expect(container.firstChild).toHaveClass('group', 'custom')
    rerender(
      <AvatarGroup className="custom" variant="unstyled">
        <Avatar name="Ada" />
      </AvatarGroup>,
    )
    expect(container.firstChild).toHaveAttribute('class', 'custom')
  })

  it('forwards the ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <AvatarGroup ref={ref}>
        <Avatar name="Ada" />
      </AvatarGroup>,
    )
    expect(ref.current).toHaveAttribute('data-plume-avatar-group')
  })
})
