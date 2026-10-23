import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef } from 'react'
import { Alert, AlertDescription, AlertTitle } from '..'

describe('Alert component', () => {
  it('renders its content', () => {
    render(
      <Alert>
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>Your plan ends tomorrow.</AlertDescription>
      </Alert>,
    )
    expect(screen.getByText('Heads up')).toBeInTheDocument()
    expect(screen.getByText('Your plan ends tomorrow.')).toBeInTheDocument()
  })

  it('is an info status in a subtle medium alert by default', () => {
    const { container } = render(<Alert>Text</Alert>)
    expect(container.firstChild).toHaveClass('alert', 'md', 'subtle')
    expect(container.firstChild).toHaveAttribute('data-status', 'info')
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it.each(['info', 'success', 'warning'] as const)('announces %s politely', (status) => {
    render(<Alert status={status}>Text</Alert>)
    expect(screen.getByRole('status')).toHaveAttribute('data-status', status)
  })

  it('announces an error as an alert', () => {
    render(<Alert status="error">Text</Alert>)
    expect(screen.getByRole('alert')).toHaveAttribute('data-status', 'error')
  })

  it('takes another role', () => {
    render(
      <Alert role="note" status="error">
        Text
      </Alert>,
    )
    expect(screen.getByRole('note')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('sets the color variables from the status', () => {
    const { container } = render(<Alert status="success">Text</Alert>)
    expect(container.firstChild).toHaveStyle('--alert-solid: var(--plume-color-success-solid)')
  })

  it.each(['outline', 'solid', 'subtle'] as const)('supports the %s variant', (variant) => {
    const { container } = render(<Alert variant={variant}>Text</Alert>)
    expect(container.firstChild).toHaveClass('alert', variant)
  })

  it.each(['sm', 'md', 'lg'] as const)('supports the %s size', (size) => {
    const { container } = render(<Alert size={size}>Text</Alert>)
    expect(container.firstChild).toHaveClass(size)
  })

  it('shows the icon of the status, hidden from assistive technology', () => {
    const { container } = render(<Alert>Text</Alert>)
    const icon = container.querySelector('[data-plume-alert-icon]')
    expect(icon).toHaveAttribute('aria-hidden', 'true')
    expect(icon?.querySelector('svg')).toBeInTheDocument()
  })

  it('takes another icon or none', () => {
    const { container, rerender } = render(<Alert icon={<i data-testid="mine" />}>Text</Alert>)
    expect(screen.getByTestId('mine')).toBeInTheDocument()
    rerender(<Alert icon={false}>Text</Alert>)
    expect(container.querySelector('[data-plume-alert-icon]')).toBeNull()
  })

  it('renders an action', () => {
    render(<Alert action={<button type="button">Renew</button>}>Text</Alert>)
    expect(screen.getByRole('button', { name: 'Renew' })).toBeInTheDocument()
  })

  it('has no dismiss button by default', () => {
    render(<Alert>Text</Alert>)
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('goes away when it is dismissed and tells it', async () => {
    const onDismiss = vi.fn()
    render(
      <Alert dismissible onDismiss={onDismiss}>
        Text
      </Alert>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }))
    expect(onDismiss).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('status')).toBeNull()
  })

  it('takes another name for the dismiss button', () => {
    render(
      <Alert dismissible labels={{ dismiss: 'Cerrar aviso' }}>
        Text
      </Alert>,
    )
    expect(screen.getByRole('button', { name: 'Cerrar aviso' })).toBeInTheDocument()
  })

  it('dismisses without a callback', async () => {
    render(<Alert dismissible>Text</Alert>)
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }))
    expect(screen.queryByText('Text')).toBeNull()
  })

  it('keeps the custom className and style', () => {
    const { container } = render(
      <Alert className="custom" style={{ width: '300px' }}>
        Text
      </Alert>,
    )
    expect(container.firstChild).toHaveClass('alert', 'custom')
    expect(container.firstChild).toHaveStyle({ width: '300px' })
  })

  it('applies the classes of each part', () => {
    const { container } = render(
      <Alert
        action="Go"
        classNames={{ action: 'a-class', content: 'c-class', dismiss: 'd-class', icon: 'i-class' }}
        dismissible
      >
        Text
      </Alert>,
    )
    expect(container.querySelector('[data-plume-alert-action]')).toHaveClass('action', 'a-class')
    expect(container.querySelector('[data-plume-alert-content]')).toHaveClass('content', 'c-class')
    expect(container.querySelector('[data-plume-alert-dismiss]')).toHaveClass('dismiss', 'd-class')
    expect(container.querySelector('[data-plume-alert-icon]')).toHaveClass('icon', 'i-class')
  })

  it('drops the Plume classes when unstyled', () => {
    const { container } = render(
      <Alert
        action="Go"
        className="custom"
        classNames={{ content: 'c-class' }}
        dismissible
        variant="unstyled"
      >
        Text
      </Alert>,
    )
    expect(container.firstChild).toHaveAttribute('class', 'custom')
    expect(container.querySelector('[data-plume-alert-content]')).toHaveAttribute(
      'class',
      'c-class',
    )
    expect(container.querySelector('[data-plume-alert-icon]')).not.toHaveAttribute('class')
    expect(container.querySelector('[data-plume-alert-action]')).not.toHaveAttribute('class')
    expect(container.querySelector('[data-plume-alert-dismiss]')).not.toHaveAttribute('class')
  })

  it('forwards the ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Alert ref={ref}>Text</Alert>)
    expect(ref.current).toHaveAttribute('data-plume-alert')
  })
})

describe('AlertTitle and AlertDescription', () => {
  it('render a div by default and the heading it is given', () => {
    const { rerender } = render(<AlertTitle>Title</AlertTitle>)
    expect(screen.queryByRole('heading')).toBeNull()
    rerender(<AlertTitle as="h3">Title</AlertTitle>)
    expect(screen.getByRole('heading', { level: 3, name: 'Title' })).toBeInTheDocument()
  })

  it('keep their className, style, id and ref', () => {
    const title = createRef<HTMLElement>()
    const description = createRef<HTMLDivElement>()
    render(
      <>
        <AlertTitle className="t" id="title" ref={title} style={{ color: 'red' }}>
          Title
        </AlertTitle>
        <AlertDescription
          className="d"
          id="description"
          ref={description}
          style={{ color: 'blue' }}
        >
          Description
        </AlertDescription>
      </>,
    )
    expect(title.current).toHaveClass('t')
    expect(title.current).toHaveAttribute('id', 'title')
    expect(title.current).toHaveStyle({ color: 'rgb(255, 0, 0)' })
    expect(description.current).toHaveClass('d')
    expect(description.current).toHaveAttribute('id', 'description')
    expect(description.current).toHaveStyle({ color: 'rgb(0, 0, 255)' })
  })
})
