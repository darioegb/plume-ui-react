import { act, fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import {
  Toast,
  ToastActionButton,
  ToastBody,
  ToastDescription,
  ToastDismiss,
  ToastIcon,
  ToastProvider,
  ToastTitle,
  useToast,
  type ToastApi,
  type ToastData,
} from '..'

let api: ToastApi

function Capture(): null {
  api = useToast()
  return null
}

const run = (callback: () => void): void => {
  act(callback)
}

const renderWith = (
  renderToast: (toast: ToastData) => React.ReactNode,
  variant?: 'unstyled',
): void => {
  render(
    <ToastProvider render={renderToast} variant={variant}>
      <Capture />
    </ToastProvider>,
  )
}

describe('Toast parts', () => {
  it('renders the default composition from the parts', () => {
    render(
      <ToastProvider>
        <Capture />
      </ToastProvider>,
    )
    run(() => api.info({ action: { label: 'Undo' }, description: 'More', title: 'Saved' }))
    const toast = screen.getByRole('status')
    expect(toast).toHaveAttribute('data-plume-toast', '')
    expect(toast).toHaveAttribute('data-status', 'info')
    expect(toast.querySelector('[data-plume-toast-icon]')).toBeInTheDocument()
    expect(toast.querySelector('[data-plume-toast-body]')).toBeInTheDocument()
    expect(screen.getByText('Saved')).toHaveAttribute('data-plume-toast-title', '')
    expect(screen.getByText('More')).toHaveAttribute('data-plume-toast-description', '')
    expect(screen.getByRole('button', { name: 'Undo' })).toHaveAttribute(
      'data-plume-toast-action',
      '',
    )
    expect(screen.getByRole('button', { name: 'Dismiss notification' })).toHaveAttribute(
      'data-plume-toast-dismiss',
      '',
    )
  })

  it('marks the region', () => {
    render(
      <ToastProvider>
        <Capture />
      </ToastProvider>,
    )
    expect(screen.getByRole('region')).toHaveAttribute('data-plume-toast-region', '')
  })

  it('renders the toast the way render writes it', () => {
    renderWith((toast) => (
      <Toast className="mine" toast={toast}>
        <ToastBody className="body-mine">
          <ToastTitle className="title-mine" />
          <ToastDescription className="description-mine" />
        </ToastBody>
        <ToastActionButton className="action-mine" />
        <ToastIcon className="icon-mine">★</ToastIcon>
        <ToastDismiss className="dismiss-mine">x</ToastDismiss>
      </Toast>
    ))
    run(() => api.success({ action: { label: 'Undo' }, description: 'More', title: 'Saved' }))
    const toast = screen.getByRole('status')
    expect(toast).toHaveClass('toast', 'mine')
    expect(screen.getByText('Saved')).toHaveClass('title', 'title-mine')
    expect(screen.getByText('More')).toHaveClass('description', 'description-mine')
    expect(screen.getByRole('button', { name: 'Undo' })).toHaveClass('action', 'action-mine')
    expect(screen.getByText('★')).toHaveClass('icon', 'icon-mine')
    expect(screen.getByText('Saved').parentElement).toHaveClass('content', 'body-mine')
    expect(screen.getByRole('button', { name: 'Dismiss notification' })).toHaveClass(
      'dismiss',
      'dismiss-mine',
    )
    expect(Array.from(toast.children).map((child) => child.tagName)).toEqual([
      'DIV',
      'BUTTON',
      'SPAN',
      'BUTTON',
    ])
  })

  it('lets a part be omitted', () => {
    renderWith((toast) => (
      <Toast toast={toast}>
        <ToastBody>
          <ToastTitle />
        </ToastBody>
      </Toast>
    ))
    run(() => api.toast({ description: 'More', title: 'Saved' }))
    expect(screen.getByText('Saved')).toBeInTheDocument()
    expect(screen.queryByText('More')).toBeNull()
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('lets the content of a part be replaced', () => {
    renderWith((toast) => (
      <Toast toast={toast}>
        <ToastBody>
          <ToastTitle>Custom title</ToastTitle>
          <ToastActionButton>Go</ToastActionButton>
        </ToastBody>
        <ToastDismiss label="Close it" />
      </Toast>
    ))
    run(() => api.toast({ action: { label: 'Undo' }, title: 'Saved' }))
    expect(screen.getByText('Custom title')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Close it' })).toBeInTheDocument()
  })

  it('renders children that are not parts as written, instead of the default composition', () => {
    renderWith((toast) => (
      <Toast toast={toast}>
        <p>Custom {toast.title}</p>
      </Toast>
    ))
    run(() => api.toast({ title: 'Saved' }))
    expect(screen.getByText('Custom Saved')).toBeInTheDocument()
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('turns an element given to ToastDismiss into the button', () => {
    renderWith((toast) => (
      <Toast toast={toast}>
        <ToastTitle />
        <ToastDismiss>
          <button type="button">Got it</button>
        </ToastDismiss>
      </Toast>
    ))
    run(() => api.toast('Saved'))
    fireEvent.click(screen.getByRole('button', { name: 'Got it' }))
    expect(screen.queryByRole('status')).toBeNull()
  })

  it('renders nothing for the parts that have no content', () => {
    renderWith((toast) => (
      <Toast toast={toast}>
        <ToastIcon />
        <ToastBody>
          <ToastTitle />
          <ToastDescription />
          <ToastActionButton />
        </ToastBody>
      </Toast>
    ))
    run(() => api.toast({ status: 'neutral' }))
    const toast = screen.getByRole('status')
    expect(toast.querySelector('[data-plume-toast-icon]')).toBeNull()
    expect(toast.querySelector('[data-plume-toast-title]')).toBeNull()
    expect(toast.querySelector('[data-plume-toast-description]')).toBeNull()
    expect(toast.querySelector('[data-plume-toast-action]')).toBeNull()
  })

  it('keeps the behavior of the dismiss and the action in a composition', () => {
    const onClick = vi.fn()
    renderWith((toast) => (
      <Toast toast={toast}>
        <ToastTitle />
        <ToastActionButton />
        <ToastDismiss />
      </Toast>
    ))
    run(() => api.toast({ action: { label: 'Undo', onClick }, title: 'Saved' }))
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }))
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('status')).toBeNull()
    run(() => api.toast('Again'))
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }))
    expect(screen.queryByRole('status')).toBeNull()
  })

  it('still dismisses with Escape and announces an error at once', () => {
    renderWith((toast) => (
      <Toast toast={toast}>
        <ToastTitle />
      </Toast>
    ))
    run(() => api.error('Failed'))
    const toast = screen.getByRole('alert')
    fireEvent.keyDown(toast, { key: 'Escape' })
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('forwards the ref and the style of the toast and of the parts', () => {
    const toastRef = createRef<HTMLDivElement>()
    const titleRef = createRef<HTMLSpanElement>()
    renderWith((toast) => (
      <Toast ref={toastRef} style={{ margin: 3 }} toast={toast}>
        <ToastTitle ref={titleRef} style={{ margin: 4 }} />
      </Toast>
    ))
    run(() => api.toast('Saved'))
    expect(toastRef.current).toBe(screen.getByRole('status'))
    expect(titleRef.current).toBe(screen.getByText('Saved'))
    expect(screen.getByRole('status')).toHaveStyle({ margin: '3px' })
    expect(screen.getByText('Saved')).toHaveStyle({ margin: '4px' })
  })

  it('drops the Plume classes of every part when unstyled', () => {
    renderWith(
      (toast) => (
        <Toast className="mine" toast={toast}>
          <ToastIcon className="i" />
          <ToastBody className="b">
            <ToastTitle className="t" />
            <ToastDescription className="d" />
            <ToastActionButton className="a" />
          </ToastBody>
          <ToastDismiss className="x" />
        </Toast>
      ),
      'unstyled',
    )
    run(() => api.info({ action: { label: 'Undo' }, description: 'More', title: 'Saved' }))
    expect(screen.getByRole('status')).toHaveAttribute('class', 'mine')
    expect(screen.getByText('Saved')).toHaveAttribute('class', 't')
    expect(screen.getByText('More')).toHaveAttribute('class', 'd')
    expect(screen.getByRole('button', { name: 'Undo' })).toHaveAttribute('class', 'a')
    expect(screen.getByRole('button', { name: 'Dismiss notification' })).toHaveAttribute(
      'class',
      'x',
    )
    expect(screen.getByText('Saved').parentElement).toHaveAttribute('class', 'b')
  })

  it('gives each toast of render its own data', () => {
    renderWith((toast) => (
      <Toast toast={toast}>
        <ToastTitle />
        <span>{toast.id}</span>
      </Toast>
    ))
    run(() => {
      api.toast({ id: 'one', title: 'First' })
      api.toast({ id: 'two', title: 'Second' })
    })
    expect(screen.getAllByRole('status')).toHaveLength(2)
    expect(screen.getByText('two')).toBeInTheDocument()
  })

  it.each([
    [
      'Toast',
      <Toast
        key="t"
        toast={{ dismissible: true, duration: 0, id: 'x', revision: 0, status: 'info' }}
      />,
    ],
    ['ToastIcon', <ToastIcon key="i" />],
    ['ToastBody', <ToastBody key="b" />],
    ['ToastTitle', <ToastTitle key="ti" />],
    ['ToastDescription', <ToastDescription key="d" />],
    ['ToastActionButton', <ToastActionButton key="a" />],
    ['ToastDismiss', <ToastDismiss key="x" />],
  ])('throws when %s is rendered outside its root', (_name, element) => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => render(element)).toThrow(/must be used within/)
    error.mockRestore()
  })
})
