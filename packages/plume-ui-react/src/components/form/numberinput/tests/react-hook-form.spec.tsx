import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Controller, useForm } from 'react-hook-form'
import { NumberInput, NumberInputDecrement, NumberInputField, NumberInputIncrement } from '..'

interface Values {
  quantity: number | null
}

function OrderForm({
  compound,
  onSubmit,
}: {
  compound: boolean
  onSubmit: (values: Values) => void
}): React.ReactNode {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ defaultValues: { quantity: null } })

  return (
    <form
      noValidate
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event)
      }}
    >
      <Controller
        control={control}
        name="quantity"
        render={({ field }) => {
          const props = {
            'aria-describedby': 'quantity-error',
            'aria-invalid': Boolean(errors.quantity),
            'aria-label': 'Quantity',
            onBlur: field.onBlur,
            onValueChange: field.onChange,
            ref: field.ref,
            value: field.value,
          }
          return compound ? (
            <NumberInput {...props}>
              <NumberInputDecrement />
              <NumberInputField />
              <NumberInputIncrement />
            </NumberInput>
          ) : (
            <NumberInput {...props} />
          )
        }}
        rules={{ required: 'Quantity is required' }}
      />
      {errors.quantity ? <p id="quantity-error">{errors.quantity.message}</p> : null}
      <button type="submit">Submit</button>
    </form>
  )
}

const submit = (): void => {
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
}

describe.each([false, true])('NumberInput with react-hook-form (compound: %s)', (compound) => {
  it('shows the error and focuses the field when a rule fails', async () => {
    const onSubmit = vi.fn()
    render(<OrderForm compound={compound} onSubmit={onSubmit} />)

    submit()

    const field = screen.getByRole('spinbutton')
    await waitFor(() => {
      expect(field).toHaveAccessibleDescription('Quantity is required')
    })
    expect(field).toHaveFocus()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits the number after a step', async () => {
    const onSubmit = vi.fn()
    render(<OrderForm compound={compound} onSubmit={onSubmit} />)

    fireEvent.click(screen.getByRole('button', { name: 'Increase' }))
    submit()

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ quantity: 1 }, expect.anything())
    })
  })
})
