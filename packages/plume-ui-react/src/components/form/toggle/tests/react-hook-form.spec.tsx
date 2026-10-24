import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { Toggle } from '..'

interface Values {
  notify: boolean
}

function SettingsForm({ onSubmit }: { onSubmit: (values: Values) => void }): React.ReactNode {
  const { register, handleSubmit } = useForm<Values>({ defaultValues: { notify: true } })

  return (
    <form
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event)
      }}
    >
      <Toggle aria-label="Notifications" {...register('notify')} />
      <button type="submit">Save</button>
    </form>
  )
}

const save = (): void => {
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))
}

describe('Toggle with react-hook-form', () => {
  it('starts with the default value of the form', () => {
    render(<SettingsForm onSubmit={vi.fn()} />)
    expect(screen.getByRole('switch', { name: 'Notifications' })).toBeChecked()
  })

  it('submits the state as a boolean', async () => {
    const onSubmit = vi.fn()
    render(<SettingsForm onSubmit={onSubmit} />)

    fireEvent.click(screen.getByRole('switch', { name: 'Notifications' }))
    save()

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1)
    })
    expect(onSubmit.mock.calls[0]?.[0]).toEqual({ notify: false })
  })
})
