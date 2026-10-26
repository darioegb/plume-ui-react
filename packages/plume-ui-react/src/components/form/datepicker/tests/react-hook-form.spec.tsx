import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Controller, useForm } from 'react-hook-form'
import { DatePicker } from '..'
import type { DateRange } from '../datepicker'

interface Values {
  date: DateRange
}

const emptyRange = { startDate: null, endDate: null }

function BookingForm({
  isRange = false,
  onSubmit,
}: {
  isRange?: boolean
  onSubmit: (values: Values) => void
}): React.ReactNode {
  const { control, handleSubmit } = useForm<Values>({ defaultValues: { date: emptyRange } })

  return (
    <form
      noValidate
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event)
      }}
    >
      <Controller
        control={control}
        name="date"
        render={({ field, fieldState }) => (
          <>
            <DatePicker
              aria-describedby="date-error"
              aria-invalid={fieldState.invalid}
              inputRef={field.ref}
              isRange={isRange}
              name={field.name}
              onBlur={field.onBlur}
              onChange={field.onChange}
              value={field.value}
            />
            {fieldState.error ? <p id="date-error">{fieldState.error.message}</p> : null}
          </>
        )}
        rules={{
          validate: ({ startDate, endDate }) =>
            (startDate !== null && (!isRange || endDate !== null)) || 'Pick a date',
        }}
      />
      <button type="submit">Submit</button>
    </form>
  )
}

const submit = (): void => {
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
}

const pickDay = (day: number): void => {
  const button = Array.from(
    document.querySelectorAll<HTMLElement>('[data-date]:not([aria-hidden])'),
  ).find((element) => Number(element.dataset.date?.split('-')[2]) === day) as HTMLElement
  fireEvent.click(button)
}

describe('DatePicker with react-hook-form', () => {
  it('shows the error and focuses the input when the rule fails', async () => {
    const onSubmit = vi.fn()
    render(<BookingForm onSubmit={onSubmit} />)

    submit()

    const input = screen.getByRole('textbox')
    await waitFor(() => {
      expect(input).toHaveAccessibleDescription(/^Pick a date/)
    })
    expect(onSubmit).not.toHaveBeenCalled()
    expect(input).toHaveFocus()
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAttribute('name', 'date')
  })

  it('submits the picked date', async () => {
    const onSubmit = vi.fn()
    render(<BookingForm onSubmit={onSubmit} />)

    fireEvent.click(screen.getByRole('button', { name: 'Open calendar' }))
    pickDay(15)
    submit()
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled()
    })

    const { date } = onSubmit.mock.calls[0][0] as Values
    expect(date.startDate?.getDate()).toBe(15)
    expect(date.endDate).toBeNull()
  })

  it('submits a picked range', async () => {
    const onSubmit = vi.fn()
    render(<BookingForm isRange onSubmit={onSubmit} />)

    fireEvent.click(screen.getByRole('button', { name: 'Open calendar' }))
    pickDay(10)
    pickDay(12)
    submit()
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled()
    })

    const { date } = onSubmit.mock.calls[0][0] as Values
    expect(date.startDate?.getDate()).toBe(10)
    expect(date.endDate?.getDate()).toBe(12)
    expect(screen.queryByText('Pick a date')).not.toBeInTheDocument()
  })
})
