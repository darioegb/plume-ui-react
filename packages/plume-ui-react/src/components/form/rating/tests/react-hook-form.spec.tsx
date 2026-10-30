import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Controller, useForm } from 'react-hook-form'
import { Field } from '../../field'
import { Rating } from '..'

interface Values {
  score: number
}

function ReviewForm({
  defaultScore = 0,
  onSubmit,
}: {
  defaultScore?: number
  onSubmit: (values: Values) => void
}): React.ReactNode {
  const { control, handleSubmit } = useForm<Values>({ defaultValues: { score: defaultScore } })

  return (
    <form
      noValidate
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event)
      }}
    >
      <Controller
        control={control}
        name="score"
        render={({ field, fieldState }) => (
          <Field errorText={fieldState.error?.message} label="Your rating" required>
            <Rating
              name={field.name}
              onValueChange={field.onChange}
              ref={field.ref}
              value={field.value}
            />
          </Field>
        )}
        rules={{ validate: (score) => score > 0 || 'Please rate it' }}
      />
      <button type="submit">Submit</button>
    </form>
  )
}

const submit = (): void => {
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
}

describe('Rating with react-hook-form', () => {
  it('starts with the default value of the form', () => {
    render(<ReviewForm defaultScore={4} onSubmit={vi.fn()} />)
    expect(screen.getByRole('radio', { name: '4 stars' })).toBeChecked()
  })

  it('shows the error on the group when the rule fails', async () => {
    const onSubmit = vi.fn()
    render(<ReviewForm onSubmit={onSubmit} />)

    submit()

    const group = screen.getByRole('radiogroup', { name: /Your rating/ })
    await waitFor(() => {
      expect(group).toHaveAttribute('aria-invalid', 'true')
    })
    expect(group).toHaveAccessibleDescription('Please rate it')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits the chosen score', async () => {
    const onSubmit = vi.fn()
    render(<ReviewForm onSubmit={onSubmit} />)

    fireEvent.click(screen.getByRole('radio', { name: '3 stars' }))
    submit()

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1)
    })
    expect(onSubmit.mock.calls[0]?.[0]).toEqual({ score: 3 })
    expect(screen.getByRole('radiogroup')).not.toHaveAttribute('aria-invalid')
  })
})
