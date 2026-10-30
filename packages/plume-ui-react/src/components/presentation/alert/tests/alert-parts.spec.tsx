import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef } from 'react'
import {
  Alert,
  AlertAction,
  AlertContent,
  AlertDescription,
  AlertDismiss,
  AlertIcon,
  AlertTitle,
} from '..'

describe('Alert parts', () => {
  it('renders the parts as written, in the order given', () => {
    const { container } = render(
      <Alert>
        <AlertContent>
          <AlertTitle>Heads up</AlertTitle>
        </AlertContent>
        <AlertIcon />
        <AlertDismiss />
      </Alert>,
    )
    const names = Array.from(container.firstElementChild?.children ?? []).map(
      (element) =>
        Array.from(element.attributes).find((attribute) => attribute.name.startsWith('data-plume'))
          ?.name,
    )
    expect(names).toEqual([
      'data-plume-alert-content',
      'data-plume-alert-icon',
      'data-plume-alert-dismiss',
    ])
  })

  it('omits what is not composed, even with the props that build the default', () => {
    const { container } = render(
      <Alert action="Go" dismissible>
        <AlertContent>Text</AlertContent>
      </Alert>,
    )
    expect(container.querySelector('[data-plume-alert-icon]')).toBeNull()
    expect(container.querySelector('[data-plume-alert-action]')).toBeNull()
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('replaces the icon and the dismiss content', () => {
    render(
      <Alert>
        <AlertIcon>
          <b>!</b>
        </AlertIcon>
        <AlertContent>Text</AlertContent>
        <AlertDismiss>x</AlertDismiss>
      </Alert>,
    )
    expect(screen.getByText('!')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Dismiss' })).toHaveTextContent('x')
  })

  it('takes the status icon, or the one given to the Alert, and nothing when it is false', () => {
    const { container, rerender } = render(
      <Alert>
        <AlertIcon />
      </Alert>,
    )
    expect(container.querySelector('[data-plume-alert-icon] svg')).not.toBeNull()
    rerender(
      <Alert icon={<b>custom</b>}>
        <AlertIcon />
      </Alert>,
    )
    expect(screen.getByText('custom')).toBeInTheDocument()
    rerender(
      <Alert icon={false}>
        <AlertIcon />
        <AlertContent>Text</AlertContent>
      </Alert>,
    )
    expect(container.querySelector('[data-plume-alert-icon]')).toBeNull()
  })

  it('dismisses from a composed AlertDismiss, tells it and uses the labels', async () => {
    const onDismiss = vi.fn()
    render(
      <Alert labels={{ dismiss: 'Cerrar' }} onDismiss={onDismiss}>
        <AlertContent>Text</AlertContent>
        <AlertDismiss />
      </Alert>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar' }))
    expect(onDismiss).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('Text')).toBeNull()
  })

  it('lets AlertDismiss take its own name', () => {
    render(
      <Alert>
        <AlertDismiss label="Close it" />
      </Alert>,
    )
    expect(screen.getByRole('button', { name: 'Close it' })).toBeInTheDocument()
  })

  it('turns an element given to AlertDismiss into the button', async () => {
    const onDismiss = vi.fn()
    render(
      <Alert onDismiss={onDismiss}>
        <AlertContent>Text</AlertContent>
        <AlertDismiss>
          <button type="button">Got it</button>
        </AlertDismiss>
      </Alert>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Got it' }))
    expect(onDismiss).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('Text')).toBeNull()
  })

  it('adds className and style to each part and forwards the refs', () => {
    const icon = createRef<HTMLSpanElement>()
    const content = createRef<HTMLDivElement>()
    const action = createRef<HTMLDivElement>()
    const dismiss = createRef<HTMLButtonElement>()
    render(
      <Alert>
        <AlertIcon className="i-class" ref={icon} style={{ opacity: '0.5' }} />
        <AlertContent className="c-class" ref={content} style={{ margin: '1px' }}>
          Text
        </AlertContent>
        <AlertAction className="a-class" ref={action} style={{ margin: '2px' }}>
          Go
        </AlertAction>
        <AlertDismiss className="d-class" ref={dismiss} style={{ margin: '3px' }} />
      </Alert>,
    )
    expect(icon.current).toHaveClass('icon', 'i-class')
    expect(icon.current).toHaveStyle({ opacity: '0.5' })
    expect(content.current).toHaveClass('c-class')
    expect(content.current).toHaveStyle({ margin: '1px' })
    expect(action.current).toHaveClass('action', 'a-class')
    expect(dismiss.current).toHaveClass('dismiss', 'd-class')
    expect(dismiss.current).toHaveStyle({ margin: '3px' })
  })

  it('drops the Plume classes of every part when the Alert is unstyled', () => {
    const { container } = render(
      <Alert variant="unstyled">
        <AlertIcon className="i-class" />
        <AlertContent>Text</AlertContent>
        <AlertAction>Go</AlertAction>
        <AlertDismiss className="d-class" />
      </Alert>,
    )
    expect(container.querySelector('[data-plume-alert-icon]')).toHaveAttribute('class', 'i-class')
    expect(container.querySelector('[data-plume-alert-action]')).not.toHaveAttribute('class')
    expect(container.querySelector('[data-plume-alert-dismiss]')).toHaveAttribute(
      'class',
      'd-class',
    )
  })

  it('keeps AlertTitle and AlertDescription working next to the parts', () => {
    render(
      <Alert>
        <AlertContent>
          <AlertTitle as="h3">Heads up</AlertTitle>
          <AlertDescription>Details</AlertDescription>
        </AlertContent>
      </Alert>,
    )
    expect(screen.getByRole('heading', { level: 3, name: 'Heads up' })).toBeInTheDocument()
    expect(screen.getByText('Details')).toBeInTheDocument()
  })

  it.each([
    ['AlertIcon', <AlertIcon key="icon" />],
    ['AlertContent', <AlertContent key="content" />],
    ['AlertAction', <AlertAction key="action" />],
    ['AlertDismiss', <AlertDismiss key="dismiss" />],
  ])('throws when %s is outside an Alert', (name, part) => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => render(part)).toThrow(`${name} must be used within an <Alert>`)
    error.mockRestore()
  })
})
