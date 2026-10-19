import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { Input } from '..'

interface Values {
  email: string
}

function SignupForm({ onSubmit }: { onSubmit: (values: Values) => void }): React.ReactNode {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>()

  return (
    <form
      noValidate
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event)
      }}
    >
      <Input
        aria-describedby="email-error"
        aria-invalid={Boolean(errors.email)}
        placeholder="Email"
        type="email"
        {...register('email', { required: 'Email is required' })}
      />
      {errors.email ? <p id="email-error">{errors.email.message}</p> : null}
      <button type="submit">Submit</button>
    </form>
  )
}

const submit = (): void => {
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
}

describe('Input with react-hook-form', () => {
  it('shows the error and focuses the input when a rule fails', async () => {
    const onSubmit = jest.fn()
    render(<SignupForm onSubmit={onSubmit} />)

    submit()

    const input = screen.getByPlaceholderText('Email')
    await waitFor(() => {
      expect(input).toHaveAccessibleDescription('Email is required')
    })
    expect(onSubmit).not.toHaveBeenCalled()
    expect(input).toHaveFocus()
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('submits the typed value', async () => {
    const onSubmit = jest.fn()
    render(<SignupForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'ada@example.com' } })
    submit()

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ email: 'ada@example.com' }, expect.anything())
    })
  })
})
