import { render, screen } from '@testing-library/react'
import { Checkbox } from '../../checkbox'
import { Radio } from '../../radio'
import { Toggle } from '../../toggle'
import { Field } from '..'

const controls = [
  ['Checkbox', Checkbox, 'checkbox'],
  ['Radio', Radio, 'radio'],
  ['Toggle', Toggle, 'switch'],
] as const

describe.each(controls)('%s inside a Field', (_name, Control, role) => {
  const input = (): HTMLInputElement => screen.getByRole<HTMLInputElement>(role)

  it('has a single label element, so assistive technology reads one name', () => {
    render(
      <Field label="I accept" orientation="inline">
        <Control />
      </Field>,
    )
    expect(input().labels).toHaveLength(1)
    expect(screen.getByRole(role, { name: 'I accept' })).toBeInTheDocument()
  })

  it('points the label to the control, in any orientation', () => {
    render(
      <Field label="Terms">
        <Control />
      </Field>,
    )
    const label = screen.getByText('Terms')
    expect(label).toHaveAttribute('for', input().id)
    expect(input().closest('label')).toBeNull()
  })

  it('keeps an aria-labelledby that is set', () => {
    render(
      <>
        <span id="custom">Custom name</span>
        <Field label="Terms" orientation="inline">
          <Control aria-labelledby="custom" />
        </Field>
      </>,
    )
    expect(screen.getByRole(role, { name: 'Custom name' })).toBeInTheDocument()
  })

  it('applies the inline layout to the root', () => {
    const { container } = render(
      <Field label="I accept" orientation="inline">
        <Control />
      </Field>,
    )
    expect(container.firstElementChild).toHaveClass('inline')
    expect(screen.getByText('I accept')).toHaveAttribute('for', input().id)
  })

  it('describes the control with the helper and the error when it is inline', () => {
    render(
      <Field
        errorText="You must accept"
        helperText="Read them first"
        label="I accept"
        orientation="inline"
      >
        <Control />
      </Field>,
    )
    const describedBy = input().getAttribute('aria-describedby') ?? ''
    expect(describedBy.split(' ')).toHaveLength(2)
    expect(screen.getByText('You must accept')).toHaveAttribute('id', describedBy.split(' ')[0])
    expect(screen.getByText('Read them first')).toHaveAttribute('id', describedBy.split(' ')[1])
    expect(input()).toHaveAttribute('aria-invalid', 'true')
  })

  it('passes disabled, readOnly and required to the control when it is inline', () => {
    render(
      <Field disabled label="I accept" orientation="inline" required>
        <Control />
      </Field>,
    )
    expect(input()).toBeDisabled()
    expect(input()).toBeRequired()
  })
})

describe.each(controls)('%s on its own', (_name, Control, role) => {
  it('takes its name from aria-label', () => {
    render(<Control aria-label="Accept" />)
    const input = screen.getByRole<HTMLInputElement>(role, { name: 'Accept' })
    expect(input.closest('label')).toBeNull()
    expect(input.labels).toHaveLength(0)
  })

  it('is a single input with no wrapper', () => {
    const { container } = render(<Control aria-label="Accept" className="mine" />)
    expect(container.firstElementChild).toBe(screen.getByRole(role))
    expect(container.firstElementChild).toHaveClass('mine')
  })
})
