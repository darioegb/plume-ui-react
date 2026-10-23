import { act, fireEvent, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { renderToString } from 'react-dom/server'
import { ToastProvider, useToast, type ToastApi, type ToastProviderProps } from '..'

let api: ToastApi

function Capture(): null {
  api = useToast()
  return null
}

function setup(props: Readonly<Partial<ToastProviderProps>> = {}): ReturnType<typeof render> {
  return render(
    <ToastProvider {...props}>
      <Capture />
    </ToastProvider>,
  )
}

const run = (callback: () => void): void => {
  act(callback)
}
const advance = (ms: number): void => {
  act(() => {
    vi.advanceTimersByTime(ms)
  })
}
const region = (): HTMLElement => screen.getByRole('region', { name: 'Notifications' })

describe('ToastProvider component', () => {
  describe('region', () => {
    it('renders an empty labelled region that announces politely', () => {
      setup()
      expect(region()).toHaveAttribute('aria-live', 'polite')
      expect(region()).toBeEmptyDOMElement()
    })

    it('lets the label be set', () => {
      setup({ labels: { region: 'Avisos' } })
      expect(screen.getByRole('region', { name: 'Avisos' })).toBeInTheDocument()
    })

    it('renders nothing on the server', () => {
      const html = renderToString(
        <ToastProvider>
          <p>App</p>
        </ToastProvider>,
      )
      expect(html).toBe('<p>App</p>')
    })

    it('renders the children of the app', () => {
      render(
        <ToastProvider>
          <p>App</p>
        </ToastProvider>,
      )
      expect(screen.getByText('App')).toBeInTheDocument()
    })
  })

  describe('showing toasts', () => {
    it('shows a string as the title of a neutral toast', () => {
      setup()
      run(() => api.toast('Saved'))
      expect(screen.getByRole('status')).toHaveTextContent('Saved')
      expect(screen.getByRole('status')).toHaveClass('neutral')
    })

    it('shows a title and a description', () => {
      setup()
      run(() => api.toast({ description: 'Your changes were saved.', title: 'Saved' }))
      expect(screen.getByText('Saved')).toHaveClass('title')
      expect(screen.getByText('Your changes were saved.')).toHaveClass('description')
    })

    it('shows a node as the title', () => {
      setup()
      run(() => api.toast(<b>Bold</b>))
      expect(screen.getByText('Bold').tagName).toBe('B')
    })

    it('returns the id of the toast', () => {
      setup()
      let id = ''
      run(() => {
        id = api.toast('Saved')
      })
      expect(id).not.toBe('')
    })

    it('stacks the toasts in the order they come', () => {
      setup()
      run(() => {
        api.toast('One')
        api.toast('Two')
      })
      expect(screen.getAllByRole('status').map((toast) => toast.textContent)).toEqual([
        expect.stringContaining('One'),
        expect.stringContaining('Two'),
      ])
    })

    it('keeps only the newest ones when there are more than max', () => {
      setup({ max: 2 })
      run(() => {
        api.toast('One')
        api.toast('Two')
        api.toast('Three')
      })
      expect(screen.queryByText('One')).toBeNull()
      expect(screen.getByText('Two')).toBeInTheDocument()
      expect(screen.getByText('Three')).toBeInTheDocument()
    })
  })

  describe('status', () => {
    it.each(['success', 'info', 'warning'] as const)('announces a %s toast politely', (status) => {
      setup()
      run(() => api[status]('Message'))
      const toast = screen.getByRole('status')
      expect(toast).toHaveClass('toast', status)
      expect(toast.querySelector('span[aria-hidden="true"] svg')).not.toBeNull()
    })

    it('announces an error at once', () => {
      setup()
      run(() => api.error('Failed'))
      expect(screen.getByRole('alert')).toHaveClass('error')
      expect(screen.queryByRole('status')).toBeNull()
    })

    it('lets the status be set in the options', () => {
      setup()
      run(() => api.toast({ status: 'warning', title: 'Careful' }))
      expect(screen.getByRole('status')).toHaveClass('warning')
    })

    it('exposes the colors of the status as CSS variables', () => {
      setup()
      run(() => api.success('Saved'))
      expect(screen.getByRole('status')).toHaveStyle(
        '--toast-solid: var(--plume-color-success-solid)',
      )
      expect(screen.getByRole('status')).toHaveStyle(
        '--toast-tint-text: var(--plume-color-success-tint-text)',
      )
    })
  })

  describe('going away by itself', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('goes away after the duration of the provider', () => {
      setup()
      run(() => api.toast('Saved'))
      advance(4999)
      expect(screen.getByRole('status')).toBeInTheDocument()

      advance(1)
      expect(screen.queryByRole('status')).toBeNull()
    })

    it('uses the duration of the toast over the one of the provider', () => {
      setup({ duration: 5000 })
      run(() => api.toast('Saved', { duration: 1000 }))
      advance(1000)
      expect(screen.queryByRole('status')).toBeNull()
    })

    it.each([0, Infinity])('stays when the duration is %s', (duration) => {
      setup()
      run(() => api.toast('Saved', { duration }))
      advance(60000)
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('stops the timer while the pointer is on the toast', () => {
      setup({ duration: 1000 })
      run(() => api.toast('Saved'))
      advance(600)
      fireEvent.pointerEnter(screen.getByRole('status'))
      advance(5000)
      expect(screen.getByRole('status')).toBeInTheDocument()

      fireEvent.pointerLeave(screen.getByRole('status'))
      advance(399)
      expect(screen.getByRole('status')).toBeInTheDocument()
      advance(1)
      expect(screen.queryByRole('status')).toBeNull()
    })

    it('stops the timer while the focus is inside the toast', () => {
      setup({ duration: 1000 })
      run(() => api.toast('Saved'))
      const toast = screen.getByRole('status')
      act(() => {
        screen.getByRole('button', { name: 'Dismiss notification' }).focus()
      })
      advance(5000)
      expect(toast).toBeInTheDocument()

      act(() => {
        screen.getByRole('button', { name: 'Dismiss notification' }).blur()
      })
      advance(1000)
      expect(screen.queryByRole('status')).toBeNull()
    })

    it('waits for both the pointer and the focus to leave', () => {
      setup({ duration: 1000 })
      run(() => api.toast('Saved'))
      const toast = screen.getByRole('status')
      fireEvent.pointerEnter(toast)
      act(() => {
        screen.getByRole('button', { name: 'Dismiss notification' }).focus()
      })
      fireEvent.pointerLeave(toast)
      advance(5000)
      expect(toast).toBeInTheDocument()
    })

    it('restarts the timer when the toast is updated', () => {
      setup({ duration: 1000 })
      run(() => api.toast({ id: 'upload', title: 'Uploading' }))
      advance(800)
      run(() => api.success({ id: 'upload', title: 'Done' }))
      advance(800)
      expect(screen.getByText('Done')).toBeInTheDocument()

      advance(200)
      expect(screen.queryByRole('status')).toBeNull()
    })

    it('does not fire after the provider unmounts', () => {
      const onDismiss = vi.fn()
      const { unmount } = setup()
      run(() => api.toast('Saved', { onDismiss }))
      unmount()
      advance(10000)
      expect(onDismiss).not.toHaveBeenCalled()
    })
  })

  describe('dismissing', () => {
    it('has a dismiss button with an accessible name', async () => {
      setup()
      run(() => api.toast('Saved'))
      await userEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }))
      expect(screen.queryByRole('status')).toBeNull()
    })

    it('lets the name of the button be set', () => {
      setup({ labels: { dismiss: 'Cerrar' } })
      run(() => api.toast('Saved'))
      expect(screen.getByRole('button', { name: 'Cerrar' })).toBeInTheDocument()
    })

    it('calls onDismiss when the toast goes away', async () => {
      const onDismiss = vi.fn()
      setup()
      run(() => api.toast('Saved', { onDismiss }))
      await userEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }))
      expect(onDismiss).toHaveBeenCalledTimes(1)
    })

    it('dismisses the toast that has the focus with Escape', async () => {
      setup()
      run(() => api.toast('Saved'))
      screen.getByRole('button', { name: 'Dismiss notification' }).focus()
      await userEvent.keyboard('{Escape}')
      expect(screen.queryByRole('status')).toBeNull()
    })

    it('has no dismiss button when it is not dismissible, and Escape leaves it', () => {
      setup()
      run(() => api.toast('Saved', { dismissible: false }))
      expect(screen.queryByRole('button')).toBeNull()

      fireEvent.keyDown(screen.getByRole('status'), { key: 'Escape' })
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('ignores the other keys', () => {
      setup()
      run(() => api.toast('Saved'))
      fireEvent.keyDown(screen.getByRole('status'), { key: 'a' })
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('dismisses a toast by its id', () => {
      setup()
      let id = ''
      run(() => {
        id = api.toast('One')
        api.toast('Two')
      })
      run(() => api.dismiss(id))
      expect(screen.queryByText('One')).toBeNull()
      expect(screen.getByText('Two')).toBeInTheDocument()
    })

    it('ignores the id of a toast that is already gone', () => {
      setup()
      run(() => api.toast('One'))
      expect(() => run(() => api.dismiss('nothing'))).not.toThrow()
      expect(screen.getByText('One')).toBeInTheDocument()
    })

    it('dismisses every toast', () => {
      setup()
      run(() => {
        api.toast('One')
        api.toast('Two')
      })
      run(() => api.dismissAll())
      expect(screen.queryByRole('status')).toBeNull()
    })
  })

  describe('action', () => {
    it('renders a button that runs its handler and dismisses the toast', async () => {
      const onClick = vi.fn()
      setup()
      run(() => api.toast({ action: { label: 'Undo', onClick }, title: 'Deleted' }))
      await userEvent.click(screen.getByRole('button', { name: 'Undo' }))
      expect(onClick).toHaveBeenCalledTimes(1)
      expect(screen.queryByRole('status')).toBeNull()
    })

    it('dismisses the toast even without a handler', async () => {
      setup()
      run(() => api.toast({ action: { label: 'Got it' }, title: 'Heads up' }))
      await userEvent.click(screen.getByRole('button', { name: 'Got it' }))
      expect(screen.queryByRole('status')).toBeNull()
    })
  })

  describe('updating', () => {
    it('updates the toast with the same id instead of adding another', () => {
      setup()
      run(() => api.info({ id: 'upload', title: 'Uploading' }))
      run(() => api.success({ id: 'upload', title: 'Done' }))
      expect(screen.getAllByRole('status')).toHaveLength(1)
      expect(screen.getByRole('status')).toHaveClass('success')
      expect(screen.getByText('Done')).toBeInTheDocument()
      expect(screen.queryByText('Uploading')).toBeNull()
    })
  })

  describe('api', () => {
    it('keeps the same functions between renders', () => {
      const { rerender } = setup()
      const first = api
      rerender(
        <ToastProvider>
          <Capture />
        </ToastProvider>,
      )
      expect(api).toBe(first)
    })

    it('throws outside of a provider', () => {
      vi.spyOn(console, 'error').mockImplementation(() => undefined)
      expect(() => render(<Capture />)).toThrow('useToast must be used within a <ToastProvider>')
    })
  })

  describe('styling', () => {
    it('is a subtle toast at the bottom end by default', () => {
      setup()
      expect(region()).toHaveClass('region', 'bottom-end', 'subtle')
    })

    it.each([
      'top-start',
      'top',
      'top-end',
      'center-start',
      'center',
      'center-end',
      'bottom-start',
      'bottom',
      'bottom-end',
    ] as const)('supports the %s position', (position) => {
      setup({ position })
      expect(region()).toHaveClass(position)
    })

    it.each(['solid', 'subtle', 'outline'] as const)('supports the %s variant', (variant) => {
      setup({ variant })
      expect(region()).toHaveClass(variant)
    })

    it('drops the Plume classes when unstyled', () => {
      setup({ variant: 'unstyled' })
      run(() =>
        api.toast({
          action: { label: 'Undo' },
          description: 'More',
          status: 'info',
          title: 'Saved',
        }),
      )
      expect(region()).not.toHaveClass('region')
      const toast = screen.getByRole('status')
      expect(toast).not.toHaveClass('toast')
      expect(screen.getByText('Saved')).not.toHaveClass('title')
      expect(screen.getByText('More')).not.toHaveClass('description')
      expect(screen.getByRole('button', { name: 'Undo' })).not.toHaveClass('action')
      expect(screen.getByRole('button', { name: 'Dismiss notification' })).not.toHaveClass(
        'dismiss',
      )
      expect(toast.querySelector('span[aria-hidden="true"]')).not.toHaveClass('icon')
    })

    it('keeps the className of the region and of the toasts', () => {
      setup({ className: 'mine', classNames: { toast: 'toast-mine' } })
      run(() => api.toast('Saved'))
      expect(region()).toHaveClass('region', 'mine')
      expect(screen.getByRole('status')).toHaveClass('toast', 'toast-mine')
    })

    it('leaves the classes to the user when unstyled', () => {
      setup({ className: 'mine', classNames: { toast: 'toast-mine' }, variant: 'unstyled' })
      run(() => api.toast('Saved'))
      expect(region()).toHaveAttribute('class', 'mine')
      expect(screen.getByRole('status')).toHaveAttribute('class', 'toast-mine')
    })

    it('has no class attribute when unstyled and there is none', () => {
      setup({ variant: 'unstyled' })
      run(() => api.toast('Saved'))
      expect(region()).not.toHaveAttribute('class')
      expect(screen.getByRole('status')).not.toHaveAttribute('class')
    })

    it('styles the parts of a toast', () => {
      setup()
      run(() =>
        api.toast({
          action: { label: 'Undo' },
          description: 'More',
          status: 'info',
          title: 'Saved',
        }),
      )
      expect(screen.getByRole('button', { name: 'Undo' })).toHaveClass('action')
      expect(screen.getByRole('button', { name: 'Dismiss notification' })).toHaveClass('dismiss')
      expect(screen.getByRole('status').querySelector('span[aria-hidden="true"]')).toHaveClass(
        'icon',
      )
    })
  })

  describe('icons', () => {
    const iconOf = (): HTMLElement | null =>
      screen.getByRole('status').querySelector<HTMLElement>('span[aria-hidden="true"]')

    it('has no icon when it is neutral', () => {
      setup()
      run(() => api.toast('Neutral'))
      expect(iconOf()).toBeNull()
    })

    it('hides every icon with icons={false}', () => {
      setup({ icons: false })
      run(() => api.success('Saved'))
      expect(iconOf()).toBeNull()
    })

    it('replaces the icon of a status', () => {
      setup({ icons: { success: <b data-testid="mine">ok</b> } })
      run(() => api.success('Saved'))
      expect(iconOf()).toContainElement(screen.getByTestId('mine'))
      expect(iconOf()?.querySelector('svg')).toBeNull()
    })

    it('keeps the default icon of the statuses it does not replace', () => {
      setup({ icons: { success: <b>ok</b> } })
      run(() => api.info('Info'))
      expect(iconOf()?.querySelector('svg')).not.toBeNull()
    })

    it('adds an icon to a neutral toast', () => {
      setup({ icons: { neutral: <b data-testid="mine">n</b> } })
      run(() => api.toast('Neutral'))
      expect(iconOf()).toContainElement(screen.getByTestId('mine'))
    })

    it('hides the icon of a status with null', () => {
      setup({ icons: { error: null } })
      run(() => api.info('Info'))
      expect(iconOf()).not.toBeNull()
      act(() => {
        api.dismissAll()
        api.error('Failed')
      })
      expect(screen.getByRole('alert').querySelector('span[aria-hidden="true"]')).toBeNull()
    })

    it('sets the icon of one toast, over the provider', () => {
      setup({ icons: false })
      run(() => api.success({ icon: <b data-testid="mine">ok</b>, title: 'Saved' }))
      expect(iconOf()).toContainElement(screen.getByTestId('mine'))
    })

    it('hides the icon of one toast with icon={false}', () => {
      setup()
      run(() => api.success({ icon: false, title: 'Saved' }))
      expect(iconOf()).toBeNull()
    })

    it('hides a custom icon from screen readers', () => {
      setup()
      run(() => api.info({ icon: <b>i</b>, title: 'Info' }))
      expect(iconOf()).toHaveAttribute('aria-hidden', 'true')
    })
  })

  describe('classNames', () => {
    const classNames = {
      action: 'my-action',
      content: 'my-content',
      description: 'my-description',
      dismiss: 'my-dismiss',
      icon: 'my-icon',
      title: 'my-title',
    }

    it('adds a class to each part next to the Plume ones', () => {
      setup({ classNames })
      run(() => api.info({ action: { label: 'Undo' }, description: 'More', title: 'Saved' }))
      expect(screen.getByText('Saved')).toHaveClass('title', 'my-title')
      expect(screen.getByText('More')).toHaveClass('description', 'my-description')
      expect(screen.getByRole('button', { name: 'Undo' })).toHaveClass('action', 'my-action')
      expect(screen.getByRole('button', { name: 'Dismiss notification' })).toHaveClass(
        'dismiss',
        'my-dismiss',
      )
      expect(screen.getByText('Saved').parentElement).toHaveClass('content', 'my-content')
      expect(screen.getByRole('status').querySelector('span[aria-hidden="true"]')).toHaveClass(
        'icon',
        'my-icon',
      )
    })

    it('are the only classes of the parts when unstyled', () => {
      setup({ classNames, variant: 'unstyled' })
      run(() => api.info({ action: { label: 'Undo' }, description: 'More', title: 'Saved' }))
      expect(screen.getByText('Saved')).toHaveAttribute('class', 'my-title')
      expect(screen.getByRole('button', { name: 'Undo' })).toHaveAttribute('class', 'my-action')
      expect(screen.getByText('Saved').parentElement).toHaveAttribute('class', 'my-content')
    })
  })
})
