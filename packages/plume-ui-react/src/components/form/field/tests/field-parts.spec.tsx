import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Input } from '../../input'
import {
  Field,
  FieldErrorText,
  FieldHelperText,
  FieldLabel,
  FieldOptionalText,
  FieldRequiredIndicator,
} from '..'

describe('Field parts', () => {
  it('renders the default composition from its parts', () => {
    const { container } = render(
      <Field errorText="Required" helperText="Your work email" label="Email" required>
        <Input />
      </Field>,
    )
    expect(container.querySelector('[data-plume-field]')).toHaveAttribute('data-required', '')
    expect(container.querySelector('[data-plume-field-label]')).toHaveTextContent('Email*')
    expect(container.querySelector('[data-plume-field-required-indicator]')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
    expect(container.querySelector('[data-plume-field-helper-text]')).toHaveTextContent(
      'Your work email',
    )
    expect(screen.getByRole('alert')).toHaveAttribute('data-plume-field-error-text', '')
  })

  it('wires the parts the user writes to the control', () => {
    render(
      <Field invalid>
        <FieldHelperText>Your work email</FieldHelperText>
        <Input />
        <FieldLabel className="font-bold">Email</FieldLabel>
        <FieldErrorText>Required</FieldErrorText>
      </Field>,
    )
    const input = screen.getByRole('textbox', { name: 'Email' })
    const helper = screen.getByText('Your work email')
    const error = screen.getByText('Required')
    expect(input).toHaveAttribute('aria-describedby', `${error.id} ${helper.id}`)
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Email')).toHaveClass('font-bold')
    expect(helper.nextElementSibling).toBe(input)
  })

  it('leaves out of the description the parts that are not there', () => {
    render(
      <Field>
        <FieldLabel>Email</FieldLabel>
        <Input />
        <FieldErrorText>Required</FieldErrorText>
      </Field>,
    )
    expect(screen.queryByText('Required')).not.toBeInTheDocument()
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-describedby')
  })

  it('takes the marks of the label from its children', () => {
    const { container, rerender } = render(
      <Field required>
        <FieldLabel>
          Email <FieldRequiredIndicator>(required)</FieldRequiredIndicator>
        </FieldLabel>
        <Input />
      </Field>,
    )
    expect(container.querySelectorAll('[data-plume-field-required-indicator]')).toHaveLength(1)
    expect(screen.getByText('(required)')).toBeInTheDocument()

    rerender(
      <Field optionalText="(optional)">
        <FieldLabel>Email</FieldLabel>
        <Input />
      </Field>,
    )
    expect(container.querySelector('[data-plume-field-optional-text]')).toHaveTextContent(
      '(optional)',
    )

    rerender(
      <Field>
        <FieldLabel>
          Email <FieldOptionalText className="italic">(if you want)</FieldOptionalText>
        </FieldLabel>
        <Input />
      </Field>,
    )
    expect(screen.getByText('(if you want)')).toHaveClass('italic')
  })

  it('drops the Plume classes of the root and the parts when unstyled', () => {
    const { container } = render(
      <Field
        className="grid gap-1"
        errorText="Required"
        helperText="Hint"
        label="Email"
        required
        variant="unstyled"
      >
        <Input />
      </Field>,
    )
    expect(container.querySelector('[data-plume-field]')).toHaveAttribute('class', 'grid gap-1')
    for (const part of ['label', 'required-indicator', 'helper-text', 'error-text']) {
      expect(container.querySelector(`[data-plume-field-${part}]`)).not.toHaveAttribute('class')
    }
  })

  it('forwards the refs and the attributes of the parts', () => {
    const label = createRef<HTMLLabelElement>()
    const helper = createRef<HTMLParagraphElement>()
    const root = createRef<HTMLDivElement>()
    render(
      <Field disabled id="email-field" ref={root} title="Email field">
        <FieldLabel ref={label}>Email</FieldLabel>
        <Input />
        <FieldHelperText ref={helper} title="hint">
          Hint
        </FieldHelperText>
      </Field>,
    )
    expect(root.current).toHaveAttribute('id', 'email-field')
    expect(root.current).toHaveAttribute('data-disabled', '')
    expect(label.current?.tagName).toBe('LABEL')
    expect(label.current).toHaveAttribute('data-disabled', '')
    expect(helper.current).toHaveAttribute('title', 'hint')
  })

  it('throws when a part is rendered outside a Field', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => render(<FieldLabel>Email</FieldLabel>)).toThrow(
      '<FieldLabel> must be used within a <Field>',
    )
    expect(() => render(<FieldHelperText>Hint</FieldHelperText>)).toThrow(
      '<FieldHelperText> must be used within a <Field>',
    )
    error.mockRestore()
  })
})
