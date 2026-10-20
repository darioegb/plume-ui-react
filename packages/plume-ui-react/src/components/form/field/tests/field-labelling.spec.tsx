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
      <Field label="Terms">
        <Control>I accept</Control>
      </Field>,
    )
    expect(input().labels).toHaveLength(1)
  })

  it('is named by the Field label and its own text', () => {
    render(
      <Field label="Terms">
        <Control>I accept</Control>
      </Field>,
    )
    expect(screen.getByRole(role, { name: 'Terms I accept' })).toBeInTheDocument()
  })

  it('is named by the Field label when it has no text of its own', () => {
    render(
      <Field label="Terms">
        <Control />
      </Field>,
    )
    expect(input().labels).toHaveLength(1)
    expect(screen.getByRole(role, { name: 'Terms' })).toBeInTheDocument()
  })

  it('does not wrap itself in a label when it has no text', () => {
    render(
      <Field label="Terms">
        <Control />
      </Field>,
    )
    expect(input().closest('label')).toBeNull()
  })

  it('keeps an aria-labelledby that is set', () => {
    render(
      <>
        <span id="custom">Custom name</span>
        <Field label="Terms">
          <Control aria-labelledby="custom">I accept</Control>
        </Field>
      </>,
    )
    expect(screen.getByRole(role, { name: 'Custom name' })).toBeInTheDocument()
  })

  it('is named by its own text when the Field has no label', () => {
    render(
      <Field helperText="Read them first">
        <Control>I accept</Control>
      </Field>,
    )
    expect(input().labels).toHaveLength(1)
    expect(screen.getByRole(role, { name: 'I accept' })).toBeInTheDocument()
  })
})

describe.each(controls)('%s on its own', (_name, Control, role) => {
  it('is labelled by its text', () => {
    render(<Control>I accept</Control>)
    const input = screen.getByRole<HTMLInputElement>(role, { name: 'I accept' })
    expect(input.labels).toHaveLength(1)
    expect(input.closest('label')).not.toBeNull()
  })

  it('takes a name from aria-label when it has no text', () => {
    render(<Control aria-label="Accept" />)
    expect(screen.getByRole(role, { name: 'Accept' }).closest('label')).toBeNull()
  })
})
