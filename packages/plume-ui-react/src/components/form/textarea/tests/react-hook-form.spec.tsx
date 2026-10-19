import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { Textarea } from '..'

interface Values {
  bio: string
}

function BioForm({ onSubmit }: { onSubmit: (values: Values) => void }): React.ReactNode {
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
      <Textarea
        aria-describedby="bio-error"
        aria-invalid={Boolean(errors.bio)}
        aria-label="Bio"
        {...register('bio', { minLength: { value: 10, message: 'At least 10 characters' } })}
      />
      {errors.bio ? <p id="bio-error">{errors.bio.message}</p> : null}
      <button type="submit">Submit</button>
    </form>
  )
}

const submit = (): void => {
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
}

describe('Textarea with react-hook-form', () => {
  it('shows the error and focuses the textarea when a rule fails', async () => {
    const onSubmit = vi.fn()
    render(<BioForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByRole('textbox', { name: 'Bio' }), { target: { value: 'short' } })
    submit()

    const textarea = screen.getByRole('textbox', { name: 'Bio' })
    await waitFor(() => {
      expect(textarea).toHaveAccessibleDescription('At least 10 characters')
    })
    expect(onSubmit).not.toHaveBeenCalled()
    expect(textarea).toHaveFocus()
    expect(textarea).toHaveAttribute('aria-invalid', 'true')
  })

  it('submits the typed value', async () => {
    const onSubmit = vi.fn()
    render(<BioForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByRole('textbox', { name: 'Bio' }), {
      target: { value: 'A long enough biography' },
    })
    submit()

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1)
    })
    expect(onSubmit.mock.calls[0]?.[0]).toEqual({ bio: 'A long enough biography' })
  })
})
