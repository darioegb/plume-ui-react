import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { Controller, useForm } from 'react-hook-form'
import { Field } from '../../field'
import { Select, SelectContent, SelectOption, SelectTrigger } from '..'

interface Values {
  room: string
  extras: string[]
}

const defaultValues: Values = { extras: [], room: '' }

function BookingForm({
  onSubmit,
  values = defaultValues,
}: {
  onSubmit: (values: Values) => void
  values?: Values
}): React.ReactNode {
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<Values>({ defaultValues: values })

  return (
    <form
      noValidate
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event)
      }}
    >
      <Controller
        control={control}
        name="room"
        render={({ field }) => (
          <Field errorText={errors.room?.message} label="Room" required>
            <Select name={field.name} onValueChange={field.onChange} value={field.value}>
              <SelectTrigger placeholder="Pick a room" ref={field.ref} />
              <SelectContent>
                <SelectOption value="single">Single</SelectOption>
                <SelectOption value="double">Double</SelectOption>
              </SelectContent>
            </Select>
          </Field>
        )}
        rules={{ required: 'Pick a room.' }}
      />
      <Controller
        control={control}
        name="extras"
        render={({ field }) => (
          <Field label="Extras">
            <Select multiple name={field.name} onValueChange={field.onChange} value={field.value}>
              <SelectTrigger placeholder="Add extras" />
              <SelectContent>
                <SelectOption value="breakfast">Breakfast</SelectOption>
                <SelectOption value="parking">Parking</SelectOption>
              </SelectContent>
            </Select>
          </Field>
        )}
      />
      <button type="submit">Book</button>
      <button
        onClick={() => {
          reset()
        }}
        type="button"
      >
        Clear form
      </button>
    </form>
  )
}

describe('Select with react-hook-form', () => {
  it('shows the error, links it to the select and focuses it when a rule fails', async () => {
    const onSubmit = vi.fn()
    render(<BookingForm onSubmit={onSubmit} />)

    await userEvent.click(screen.getByRole('button', { name: 'Book' }))

    const room = screen.getByRole('combobox', { name: /Room/ })
    await waitFor(() => {
      expect(room).toHaveAccessibleDescription('Pick a room.')
    })
    expect(onSubmit).not.toHaveBeenCalled()
    expect(room).toHaveFocus()
    expect(room).toHaveAttribute('aria-invalid', 'true')
  })

  it('submits the chosen value and clears the error', async () => {
    const onSubmit = vi.fn()
    render(<BookingForm onSubmit={onSubmit} />)

    await userEvent.click(screen.getByRole('button', { name: 'Book' }))
    await userEvent.click(screen.getByRole('combobox', { name: /Room/ }))
    await userEvent.click(screen.getByRole('option', { name: 'Double' }))
    await userEvent.click(screen.getByRole('button', { name: 'Book' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1)
    })
    expect(onSubmit.mock.calls[0]?.[0]).toEqual({ extras: [], room: 'double' })
    expect(screen.getByRole('combobox', { name: /Room/ })).not.toHaveAttribute('aria-invalid')
  })

  it('submits every value of a multiple select as an array', async () => {
    const onSubmit = vi.fn()
    render(<BookingForm onSubmit={onSubmit} values={{ extras: [], room: 'single' }} />)

    await userEvent.click(screen.getByRole('combobox', { name: /Extras/ }))
    await userEvent.click(screen.getByRole('option', { name: 'Breakfast' }))
    await userEvent.click(screen.getByRole('option', { name: 'Parking' }))
    await userEvent.keyboard('{Escape}')
    await userEvent.click(screen.getByRole('button', { name: 'Book' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1)
    })
    expect(onSubmit.mock.calls[0]?.[0]).toEqual({ extras: ['breakfast', 'parking'], room: 'single' })
  })

  it('shows the value of the form and follows its reset', async () => {
    render(<BookingForm onSubmit={vi.fn()} values={{ extras: ['parking'], room: 'double' }} />)

    const room = screen.getByRole('combobox', { name: /Room/ })
    expect(room).toHaveTextContent('Double')

    await userEvent.click(room)
    await userEvent.click(screen.getByRole('option', { name: 'Single' }))
    expect(room).toHaveTextContent('Single')

    await userEvent.click(screen.getByRole('button', { name: 'Clear form' }))
    expect(room).toHaveTextContent('Double')
  })
})
