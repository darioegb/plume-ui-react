import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { Radio } from '..'

interface Values {
  plan: string
}

function PlanForm({ onSubmit }: { onSubmit: (values: Values) => void }): React.ReactNode {
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
      {['free', 'pro'].map((plan) => (
        <Radio
          aria-invalid={Boolean(errors.plan)}
          key={plan}
          value={plan}
          {...register('plan', { required: 'Pick a plan' })}
        >
          {plan}
        </Radio>
      ))}
      {errors.plan ? <p role="alert">{errors.plan.message}</p> : null}
      <button type="submit">Submit</button>
    </form>
  )
}

const submit = (): void => {
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
}

describe('Radio with react-hook-form', () => {
  it('shows the error and focuses the first radio when none is selected', async () => {
    const onSubmit = vi.fn()
    render(<PlanForm onSubmit={onSubmit} />)

    submit()

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Pick a plan')
    })
    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.getByRole('radio', { name: 'free' })).toHaveFocus()
  })

  it('submits the value of the selected radio', async () => {
    const onSubmit = vi.fn()
    render(<PlanForm onSubmit={onSubmit} />)

    fireEvent.click(screen.getByRole('radio', { name: 'pro' }))
    submit()

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1)
    })
    expect(onSubmit.mock.calls[0]?.[0]).toEqual({ plan: 'pro' })
  })
})
