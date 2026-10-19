import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { DatePicker } from '@plume-ui-react/datepicker'
import { Input } from '@plume-ui-react/input'
import { Field } from '..'

describe('Field component', () => {
  it('labels the control', () => {
    render(
      <Field label="Email">
        <Input />
      </Field>,
    )
    expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument()
  })

  it('keeps the id of the control', () => {
    render(
      <Field label="Email">
        <Input id="email" />
      </Field>,
    )
    expect(screen.getByLabelText('Email')).toHaveAttribute('id', 'email')
  })

  it('describes the control with the helper text', () => {
    render(
      <Field helperText="We never share it." label="Email">
        <Input />
      </Field>,
    )
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('We never share it.')
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid')
  })

  it('shows the error, marks the control invalid and describes it with both texts', () => {
    render(
      <Field errorText="Email is required" helperText="We never share it." label="Email">
        <Input aria-describedby="external" />
      </Field>,
    )
    const input = screen.getByRole('textbox')
    expect(screen.getByText('Email is required')).toBeInTheDocument()
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input.getAttribute('aria-describedby')?.split(' ')).toHaveLength(3)
    expect(input).toHaveAccessibleDescription('Email is required We never share it.')
    expect(input.className).toMatch(/invalid/)
  })

  it('hides the error text when invalid is false', () => {
    render(
      <Field errorText="Email is required" invalid={false} label="Email">
        <Input />
      </Field>,
    )
    expect(screen.queryByText('Email is required')).not.toBeInTheDocument()
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid')
  })

  it('marks required fields and passes required to the control', () => {
    render(
      <Field label="Email" optionalText="(optional)" required>
        <Input />
      </Field>,
    )
    expect(screen.getByRole('textbox')).toBeRequired()
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.queryByText('(optional)')).not.toBeInTheDocument()
  })

  it('shows the optional text when the field is not required', () => {
    render(
      <Field label="Nickname" optionalText="(optional)">
        <Input />
      </Field>,
    )
    expect(screen.getByText('(optional)')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).not.toBeRequired()
  })

  it('passes disabled and readOnly to the control', () => {
    render(
      <>
        <Field disabled label="Disabled">
          <Input />
        </Field>
        <Field label="Read-only" readOnly>
          <Input />
        </Field>
      </>,
    )
    expect(screen.getByLabelText('Disabled')).toBeDisabled()
    expect(screen.getByLabelText('Read-only')).toHaveAttribute('readonly')
  })

  it('applies the orientation, className and style to the root', () => {
    const { container } = render(
      <Field className="custom" label="Email" orientation="horizontal" style={{ margin: 4 }}>
        <Input />
      </Field>,
    )
    const root = container.firstChild as HTMLElement
    expect(root).toHaveClass('horizontal', 'custom')
    expect(root).toHaveStyle({ margin: '4px' })
  })

  it('wires a DatePicker the same way', () => {
    render(
      <Field errorText="Pick a date" label="Check-in" required>
        <DatePicker onChange={jest.fn()} />
      </Field>,
    )
    const input = screen.getByRole('textbox', { name: 'Check-in' })
    expect(input).toBeRequired()
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('Pick a date')
    expect(input.className).toMatch(/invalid/)
  })
})

describe('Field with react-hook-form', () => {
  interface Values {
    email: string
  }

  function SignupForm({ onSubmit }: { onSubmit: (values: Values) => void }): React.ReactNode {
    const {
      handleSubmit,
      register,
      formState: { errors },
    } = useForm<Values>()

    return (
      <form
        noValidate
        onSubmit={(event) => {
          void handleSubmit(onSubmit)(event)
        }}
      >
        <Field errorText={errors.email?.message} label="Email" required>
          <Input type="email" {...register('email', { required: 'Email is required' })} />
        </Field>
        <button type="submit">Submit</button>
      </form>
    )
  }

  it('shows the validation error and focuses the control', async () => {
    const onSubmit = jest.fn()
    render(<SignupForm onSubmit={onSubmit} />)

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    const input = screen.getByRole('textbox', { name: 'Email' })
    await waitFor(() => {
      expect(input).toHaveAccessibleDescription('Email is required')
    })
    expect(input).toHaveFocus()
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
