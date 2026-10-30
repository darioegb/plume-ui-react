import { fireEvent, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { Field } from '../../field'
import { Radio, RadioGroup, type RadioGroupProps } from '..'

const plans = ['free', 'pro', 'team']

function Plans(props: Omit<RadioGroupProps, 'children'>): React.ReactNode {
  return (
    <RadioGroup aria-label="Plan" {...props}>
      {plans.map((plan) => (
        <Radio aria-label={plan} key={plan} value={plan} />
      ))}
    </RadioGroup>
  )
}

const radio = (name: string): HTMLInputElement =>
  screen.getByRole<HTMLInputElement>('radio', { name })

describe('RadioGroup component', () => {
  it('renders a radiogroup with its radios', () => {
    render(<Plans />)
    expect(screen.getByRole('radiogroup', { name: 'Plan' })).toBeInTheDocument()
    expect(screen.getAllByRole('radio')).toHaveLength(3)
  })

  it('gives every radio the same generated name so the browser groups them', () => {
    render(<Plans />)
    const names = screen.getAllByRole('radio').map((input) => input.getAttribute('name'))
    expect(names[0]).toBeTruthy()
    expect(new Set(names).size).toBe(1)
  })

  it('shares its variant with the radios, and a radio can set its own', () => {
    render(
      <RadioGroup aria-label="Plan" variant="outline">
        <Radio aria-label="free" value="free" />
        <Radio aria-label="pro" value="pro" variant="solid" />
      </RadioGroup>,
    )
    expect(radio('free')).toHaveClass('outline')
    expect(radio('pro')).toHaveClass('solid')
    expect(radio('pro')).not.toHaveClass('outline')
  })

  it('uses the name it is given', () => {
    render(<Plans name="plan" />)
    for (const input of screen.getAllByRole('radio')) expect(input).toHaveAttribute('name', 'plan')
  })

  describe('uncontrolled', () => {
    it('selects the default value', () => {
      render(<Plans defaultValue="pro" />)
      expect(radio('pro')).toBeChecked()
      expect(radio('free')).not.toBeChecked()
    })

    it('selects nothing without a default value', () => {
      render(<Plans />)
      for (const input of screen.getAllByRole('radio')) expect(input).not.toBeChecked()
    })

    it('keeps one radio selected and reports the value with the event', () => {
      const onChange = vi.fn()
      render(<Plans onValueChange={onChange} />)

      fireEvent.click(radio('free'))
      fireEvent.click(radio('team'))

      expect(radio('free')).not.toBeChecked()
      expect(radio('team')).toBeChecked()
      expect(onChange.mock.calls.map(([value]) => value as string)).toEqual(['free', 'team'])
      expect((onChange.mock.calls[0] as [string, { target: HTMLInputElement }])[1].target).toBe(
        radio('free'),
      )
    })

    it('moves the selection with the arrow keys', async () => {
      const user = userEvent.setup()
      render(<Plans defaultValue="free" />)
      await user.tab()
      expect(radio('free')).toHaveFocus()
      await user.keyboard('{ArrowDown}')
      expect(radio('pro')).toBeChecked()
      await user.keyboard('{ArrowDown}{ArrowDown}')
      expect(radio('free')).toBeChecked()
    })
  })

  describe('controlled', () => {
    it('follows the value and asks for changes through onChange', () => {
      function Controlled(): React.ReactNode {
        const [value, setValue] = useState('free')
        return <Plans onValueChange={setValue} value={value} />
      }
      render(<Controlled />)
      fireEvent.click(radio('team'))
      expect(radio('team')).toBeChecked()
      expect(radio('free')).not.toBeChecked()
    })

    it('does not change by itself without a new value', () => {
      render(<Plans onValueChange={vi.fn()} value="free" />)
      fireEvent.click(radio('pro'))
      expect(radio('free')).toBeChecked()
      expect(radio('pro')).not.toBeChecked()
    })
  })

  it('calls the onChange of a radio as well', () => {
    const onRadioChange = vi.fn()
    const onGroupChange = vi.fn()
    render(
      <RadioGroup aria-label="Plan" onValueChange={onGroupChange}>
        <Radio aria-label="free" onChange={onRadioChange} value="free" />
      </RadioGroup>,
    )
    fireEvent.click(radio('free'))
    expect(onRadioChange).toHaveBeenCalledTimes(1)
    expect(onGroupChange).toHaveBeenCalledTimes(1)
  })

  it('treats a radio without a value as the empty value', () => {
    const onChange = vi.fn()
    render(
      <RadioGroup aria-label="Plan" onValueChange={onChange}>
        <Radio aria-label="none" />
      </RadioGroup>,
    )
    fireEvent.click(radio('none'))
    expect(onChange.mock.calls.map(([value]) => value as string)).toEqual([''])
  })

  describe('orientation', () => {
    it('is vertical by default', () => {
      render(<Plans />)
      expect(screen.getByRole('radiogroup')).toHaveClass('group', 'vertical')
    })

    it('can be horizontal', () => {
      render(<Plans orientation="horizontal" />)
      expect(screen.getByRole('radiogroup')).toHaveClass('group', 'horizontal')
      expect(screen.getByRole('radiogroup')).toHaveAttribute('data-orientation', 'horizontal')
    })

    it('drops the Plume classes when unstyled and keeps the user class', () => {
      render(<Plans className="mine" orientation="horizontal" variant="unstyled" />)
      expect(screen.getByRole('radiogroup')).toHaveAttribute('class', 'mine')
    })

    it('exposes its state as data attributes', () => {
      const { rerender } = render(<Plans />)
      const group = screen.getByRole('radiogroup')
      expect(group).toHaveAttribute('data-plume-radiogroup')
      expect(group).not.toHaveAttribute('data-disabled')
      expect(group).not.toHaveAttribute('data-invalid')
      expect(group).not.toHaveAttribute('data-readonly')

      rerender(<Plans aria-invalid disabled readOnly />)
      expect(group).toHaveAttribute('data-disabled')
      expect(group).toHaveAttribute('data-invalid')
      expect(group).toHaveAttribute('data-readonly')
    })
  })

  describe('state shared with the radios', () => {
    it('disables every radio, and a radio can be disabled on its own', () => {
      const { rerender } = render(<Plans disabled />)
      for (const input of screen.getAllByRole('radio')) expect(input).toBeDisabled()
      expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-disabled', 'true')

      rerender(
        <RadioGroup aria-label="Plan">
          <Radio aria-label="free" value="free" />
          <Radio aria-label="pro" disabled value="pro" />
        </RadioGroup>,
      )
      expect(radio('free')).toBeEnabled()
      expect(radio('pro')).toBeDisabled()
    })

    it('keeps the selection and does not call onChange when it is read only', () => {
      const onChange = vi.fn()
      render(<Plans defaultValue="free" onValueChange={onChange} readOnly />)
      fireEvent.click(radio('pro'))
      expect(radio('free')).toBeChecked()
      expect(radio('pro')).not.toBeChecked()
      expect(onChange).not.toHaveBeenCalled()
      expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-readonly', 'true')
    })

    it('marks the radios and the group as required', () => {
      render(<Plans required />)
      for (const input of screen.getAllByRole('radio')) expect(input).toBeRequired()
      expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-required', 'true')
    })

    it('marks the group invalid and shows the radios with the error scheme', () => {
      render(<Plans aria-invalid />)
      expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-invalid', 'true')
      expect(radio('free')).toHaveClass('invalid')
      expect(radio('free')).not.toHaveAttribute('aria-invalid')
      expect(radio('free')).toHaveStyle('--radio-solid: var(--plume-color-error-solid)')
    })

    it('does not set the state attributes when there is nothing to report', () => {
      render(<Plans />)
      const group = screen.getByRole('radiogroup')
      for (const attribute of ['aria-disabled', 'aria-readonly', 'aria-required', 'aria-invalid']) {
        expect(group).not.toHaveAttribute(attribute)
      }
    })

    it('passes the size and the color scheme down, and a radio can override them', () => {
      render(
        <RadioGroup aria-label="Plan" colorScheme="success" size="lg">
          <Radio aria-label="free" value="free" />
          <Radio aria-label="pro" colorScheme="info" size="sm" value="pro" />
        </RadioGroup>,
      )
      expect(radio('free')).toHaveClass('lg')
      expect(radio('free')).toHaveStyle('--radio-solid: var(--plume-color-success-solid)')
      expect(radio('pro')).toHaveClass('sm')
      expect(radio('pro')).toHaveStyle('--radio-solid: var(--plume-color-info-solid)')
    })
  })

  it('puts className, style and id on the group and forwards the ref to it', () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <RadioGroup aria-label="Plan" className="custom" id="plans" ref={ref} style={{ gap: '3px' }}>
        <Radio aria-label="free" value="free" />
      </RadioGroup>,
    )
    const group = screen.getByRole('radiogroup')
    expect(group).toHaveClass('group', 'custom')
    expect(group).toHaveAttribute('id', 'plans')
    expect(group).toHaveStyle({ gap: '3px' })
    expect(ref.current).toBe(group)
  })

  it('still works for a radio outside of a group', () => {
    render(<Radio aria-label="solo" value="solo" />)
    fireEvent.click(radio('solo'))
    expect(radio('solo')).toBeChecked()
  })

  describe('inside a Field', () => {
    it('is named by the label of the Field and described by its texts', () => {
      render(
        <Field errorText="Pick a plan" helperText="You can change it later" label="Plan">
          <Plans aria-label={undefined} />
        </Field>,
      )
      const group = screen.getByRole('radiogroup', { name: 'Plan' })
      expect(group).toHaveAccessibleDescription('Pick a plan You can change it later')
      expect(group).toHaveAttribute('aria-invalid', 'true')
    })

    it('keeps the aria-label it was given instead of the label of the Field', () => {
      render(
        <Field label="Plan">
          <Plans aria-label="Billing plan" />
        </Field>,
      )
      expect(screen.getByRole('radiogroup', { name: 'Billing plan' })).not.toHaveAttribute(
        'aria-labelledby',
      )
    })

    it('keeps the aria-labelledby it was given', () => {
      render(
        <>
          <span id="own-label">Own label</span>
          <Field label="Plan">
            <Plans aria-label={undefined} aria-labelledby="own-label" />
          </Field>
        </>,
      )
      expect(screen.getByRole('radiogroup', { name: 'Own label' })).toBeInTheDocument()
    })

    it('gets disabled, read only and required from the Field', () => {
      render(
        <Field disabled label="Plan" required>
          <Plans aria-label={undefined} />
        </Field>,
      )
      for (const input of screen.getAllByRole('radio')) {
        expect(input).toBeDisabled()
        expect(input).toBeRequired()
      }
    })

    it('names the group with the Field label and each option with its own Field', () => {
      render(
        <Field label="Plan">
          <RadioGroup>
            {plans.map((plan) => (
              <Field key={plan} label={plan} orientation="inline">
                <Radio value={plan} />
              </Field>
            ))}
          </RadioGroup>
        </Field>,
      )
      const group = screen.getByRole('radiogroup', { name: 'Plan' })
      expect(group).toHaveAttribute('aria-labelledby')
      expect(radio('pro')).not.toBeChecked()
      fireEvent.click(screen.getByText('pro'))
      expect(radio('pro')).toBeChecked()
      fireEvent.click(screen.getByText('team'))
      expect(radio('team')).toBeChecked()
      expect(radio('pro')).not.toBeChecked()
    })

    it('has no label to point to when the Field has none', () => {
      render(
        <Field helperText="Only a helper">
          <Plans />
        </Field>,
      )
      expect(screen.getByRole('radiogroup', { name: 'Plan' })).not.toHaveAttribute(
        'aria-labelledby',
      )
    })
  })
})
