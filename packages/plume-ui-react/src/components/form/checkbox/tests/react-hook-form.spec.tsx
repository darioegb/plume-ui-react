import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { Checkbox } from '..'

interface Values {
  terms: boolean
}

function TermsForm({ onSubmit }: { onSubmit: (values: Values) => void }): React.ReactNode {
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
      <Checkbox
        aria-describedby="terms-error"
        aria-invalid={Boolean(errors.terms)}
        {...register('terms', { required: 'Accept the terms' })}
      >
        Terms
      </Checkbox>
      {errors.terms ? <p id="terms-error">{errors.terms.message}</p> : null}
      <button type="submit">Submit</button>
    </form>
  )
}

const submit = (): void => {
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
}

describe('Checkbox with react-hook-form', () => {
  it('shows the error and focuses the checkbox when a rule fails', async () => {
    const onSubmit = vi.fn()
    render(<TermsForm onSubmit={onSubmit} />)

    submit()

    const checkbox = screen.getByRole('checkbox', { name: 'Terms' })
    await waitFor(() => {
      expect(checkbox).toHaveAccessibleDescription('Accept the terms')
    })
    expect(onSubmit).not.toHaveBeenCalled()
    expect(checkbox).toHaveFocus()
    expect(checkbox).toHaveAttribute('aria-invalid', 'true')
  })

  it('submits the checked state as a boolean', async () => {
    const onSubmit = vi.fn()
    render(<TermsForm onSubmit={onSubmit} />)

    fireEvent.click(screen.getByRole('checkbox', { name: 'Terms' }))
    submit()

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1)
    })
    expect(onSubmit.mock.calls[0]?.[0]).toEqual({ terms: true })
  })
})
