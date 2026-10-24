import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Controller, useForm } from 'react-hook-form'
import { Radio, RadioGroup } from '..'

interface Values {
  plan: string
}

function PlanForm({ onSubmit }: { onSubmit: (values: Values) => void }): React.ReactNode {
  const { control, handleSubmit } = useForm<Values>({ defaultValues: { plan: 'free' } })

  return (
    <form
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event)
      }}
    >
      <Controller
        control={control}
        name="plan"
        render={({ field }) => (
          <RadioGroup
            aria-label="Plan"
            name={field.name}
            onChange={field.onChange}
            value={field.value}
          >
            <Radio aria-label="free" value="free" />
            <Radio aria-label="pro" value="pro" />
          </RadioGroup>
        )}
      />
      <button type="submit">Submit</button>
    </form>
  )
}

describe('RadioGroup with react-hook-form', () => {
  it('starts with the default value of the form', () => {
    render(<PlanForm onSubmit={vi.fn()} />)
    expect(screen.getByRole('radio', { name: 'free' })).toBeChecked()
  })

  it('submits the value of the selected radio', async () => {
    const onSubmit = vi.fn()
    render(<PlanForm onSubmit={onSubmit} />)

    fireEvent.click(screen.getByRole('radio', { name: 'pro' }))
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1)
    })
    expect(onSubmit.mock.calls[0]?.[0]).toEqual({ plan: 'pro' })
  })
})
