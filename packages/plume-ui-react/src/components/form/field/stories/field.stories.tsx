import type { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '../../../interaction/button'
import { DatePicker, type DateRange } from '../../datepicker'
import { Input } from '../../input'
import { Field } from '..'

/**
 * Field wraps a form control with a label, a required or optional mark, helper text and an error message,
 * and wires them to the control: the label points to it, the texts describe it through `aria-describedby`,
 * and `invalid`, `required`, `disabled` and `readOnly` are passed down to it.
 *
 * It works with `Input`, `DatePicker` and any control that accepts `id`, `aria-describedby` and `aria-invalid`.
 * When the control already has an `id`, Field keeps it; otherwise it generates one.
 */
export default {
  title: 'Components/Field',
  component: Field,
  tags: ['autodocs'],
  parameters: {
    docs: {
      toc: {
        title: 'On this page',
        disable: false,
      },
    },
    layout: 'centered',
  },
  decorators: [(Story) => <div className='w-72 max-w-full'>{Story()}</div>],
  argTypes: {
    children: {
      control: false,
      description: 'The form control: a single element such as `Input` or `DatePicker`.',
      table: { type: { summary: 'ReactElement' } },
    },
    label: {
      control: 'text',
      description: 'Label rendered above the control (beside it when horizontal) and linked to it.',
      table: { type: { summary: 'ReactNode' } },
    },
    helperText: {
      control: 'text',
      description: 'Hint shown below the control and read as part of its description.',
      table: { type: { summary: 'ReactNode' } },
    },
    errorText: {
      control: 'text',
      description:
        'Error message shown below the control while the field is invalid. Setting it makes the field invalid unless `invalid` says otherwise.',
      table: { type: { summary: 'ReactNode' } },
    },
    invalid: {
      control: 'boolean',
      description:
        'Marks the field invalid: the control gets `aria-invalid` and error colors, and `errorText` is shown.',
      table: { defaultValue: { summary: 'Boolean(errorText)' }, type: { summary: 'boolean' } },
    },
    required: {
      control: 'boolean',
      description: 'Shows the required mark next to the label and passes `required` to the control.',
      table: { defaultValue: { summary: false }, type: { summary: 'boolean' } },
    },
    optionalText: {
      control: 'text',
      description: 'Text shown next to the label when the field is not required, e.g. `(optional)`.',
      table: { type: { summary: 'ReactNode' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the control and dims the label.',
      table: { defaultValue: { summary: false }, type: { summary: 'boolean' } },
    },
    readOnly: {
      control: 'boolean',
      description: 'Passes `readOnly` to the control.',
      table: { defaultValue: { summary: false }, type: { summary: 'boolean' } },
    },
    orientation: {
      control: 'inline-radio',
      options: ['vertical', 'horizontal'],
      description:
        'Places the label above the control or beside it. The horizontal label column width comes from `--field-label-width` (default `8rem`).',
      table: { defaultValue: { summary: 'vertical' }, type: { summary: '"vertical" | "horizontal"' } },
    },
    className: {
      control: 'text',
      description: 'Custom CSS class for the root element.',
      table: { type: { summary: 'string' } },
    },
    style: {
      control: false,
      description: 'Inline styles for the root element, e.g. `--field-label-width`.',
      table: { type: { summary: 'CSSProperties' } },
    },
  },
  args: {
    label: 'Email',
    children: <Input placeholder='you@example.com' type='email' />,
  },
} satisfies Meta<typeof Field>

type Story = StoryObj<typeof Field>

/**
 * A label linked to its control. Clicking the label focuses the input.
 */
export const Default: Story = {}

/**
 * **helperText** adds a hint that screen readers read after the label.
 */
export const HelperText: Story = {
  args: {
    helperText: "We'll never share your email.",
  },
}

/**
 * **errorText** shows the message, marks the control with `aria-invalid` and switches it to the error colors.
 */
export const ErrorText: Story = {
  args: {
    errorText: 'Enter a valid email address.',
    helperText: "We'll never share your email.",
  },
}

/**
 * **required** adds the mark next to the label and passes `required` to the control.
 * Use **optionalText** instead to mark the fields that are not required.
 */
export const RequiredAndOptional: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Field label="Email" required>
  <Input type="email" />
</Field>
<Field label="Nickname" optionalText="(optional)">
  <Input />
</Field>`,
      },
    },
  },
  render: () => (
    <div className='flex flex-col gap-4'>
      <Field label='Email' required>
        <Input type='email' />
      </Field>
      <Field label='Nickname' optionalText='(optional)'>
        <Input />
      </Field>
    </div>
  ),
}

/**
 * **orientation="horizontal"** puts the label beside the control.
 * Set `--field-label-width` to line up the labels of a form.
 */
export const Horizontal: Story = {
  decorators: [(Story) => <div className='w-[28rem] max-w-full'>{Story()}</div>],
  parameters: {
    docs: {
      source: {
        code: `<Field label="First name" orientation="horizontal">
  <Input />
</Field>
<Field
  errorText="Enter your last name."
  label="Last name"
  orientation="horizontal"
>
  <Input />
</Field>`,
      },
    },
  },
  render: () => (
    <div className='flex flex-col gap-4'>
      <Field label='First name' orientation='horizontal'>
        <Input />
      </Field>
      <Field errorText='Enter your last name.' label='Last name' orientation='horizontal'>
        <Input />
      </Field>
    </div>
  ),
}

/**
 * **disabled** and **readOnly** are passed to the control.
 */
export const DisabledAndReadOnly: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Field disabled label="Disabled">
  <Input defaultValue="Can't edit or focus" />
</Field>
<Field label="Read-only" readOnly>
  <Input defaultValue="Can't edit, can focus" />
</Field>`,
      },
    },
  },
  render: () => (
    <div className='flex flex-col gap-4'>
      <Field disabled label='Disabled'>
        <Input defaultValue="Can't edit or focus" />
      </Field>
      <Field label='Read-only' readOnly>
        <Input defaultValue="Can't edit, can focus" />
      </Field>
    </div>
  ),
}

/**
 * Field wires a **DatePicker** the same way: the label, texts and states reach its input.
 */
export const WithDatePicker: Story = {
  decorators: [(Story) => <div className='pb-[22rem]'>{Story()}</div>],
  parameters: {
    docs: {
      source: {
        code: `<Field
  errorText="Pick your check-in date."
  helperText="Check-in is from 3 pm."
  label="Check-in"
  required
>
  <DatePicker onChange={setValue} value={value} />
</Field>`,
      },
    },
  },
  render: function Render() {
    const [value, setValue] = useState<DateRange>({ startDate: null, endDate: null })
    return (
      <Field
        errorText={value.startDate ? undefined : 'Pick your check-in date.'}
        helperText='Check-in is from 3 pm.'
        label='Check-in'
        required
      >
        <DatePicker onChange={setValue} value={value} />
      </Field>
    )
  },
}

interface BookingValues {
  name: string
  email: string
  stay: DateRange
}

/**
 * A form with [react-hook-form](https://react-hook-form.com/). `register` spreads straight onto `Input`;
 * `DatePicker` goes through `Controller`, with `inputRef={field.ref}` so the form can focus it.
 * Pass each error message to **errorText** and Field marks the control and links the message.
 * Submit the empty form to see the errors and the focus moving to the first invalid field.
 */
export const ReactHookForm: Story = {
  decorators: [(Story) => <div className='w-[24rem] max-w-full pb-[22rem]'>{Story()}</div>],
  parameters: {
    docs: {
      source: {
        code: `const {
  control,
  formState: { errors },
  handleSubmit,
  register,
} = useForm<BookingValues>({
  defaultValues: { name: '', email: '', stay: { startDate: null, endDate: null } },
})

<form noValidate onSubmit={handleSubmit(onSubmit)}>
  <Field errorText={errors.name?.message} label="Name" required>
    <Input {...register('name', { required: 'Enter your name.' })} />
  </Field>
  <Field
    errorText={errors.email?.message}
    helperText="We'll send the confirmation here."
    label="Email"
    required
  >
    <Input
      type="email"
      {...register('email', {
        required: 'Enter your email.',
        pattern: { value: /^\\S+@\\S+\\.\\S+$/, message: 'Enter a valid email address.' },
      })}
    />
  </Field>
  <Controller
    control={control}
    name="stay"
    render={({ field, fieldState }) => (
      <Field errorText={fieldState.error?.message} label="Stay" required>
        <DatePicker
          inputRef={field.ref}
          isRange
          name={field.name}
          onBlur={field.onBlur}
          onChange={field.onChange}
          value={field.value}
        />
      </Field>
    )}
    rules={{
      validate: ({ startDate, endDate }) =>
        (startDate !== null && endDate !== null) || 'Pick your check-in and check-out dates.',
    }}
  />
  <Button colorScheme="primary" label="Book" type="submit" />
</form>`,
      },
    },
  },
  render: function Render() {
    const [submitted, setSubmitted] = useState<BookingValues | null>(null)
    const {
      control,
      formState: { errors },
      handleSubmit,
      register,
    } = useForm<BookingValues>({
      defaultValues: { name: '', email: '', stay: { startDate: null, endDate: null } },
    })

    return (
      <form
        className='flex flex-col gap-4'
        noValidate
        onSubmit={(event) => {
          void handleSubmit(setSubmitted)(event)
        }}
      >
        <Field errorText={errors.name?.message} label='Name' required>
          <Input {...register('name', { required: 'Enter your name.' })} />
        </Field>
        <Field
          errorText={errors.email?.message}
          helperText="We'll send the confirmation here."
          label='Email'
          required
        >
          <Input
            type='email'
            {...register('email', {
              required: 'Enter your email.',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address.' },
            })}
          />
        </Field>
        <Controller
          control={control}
          name='stay'
          render={({ field, fieldState }) => (
            <Field errorText={fieldState.error?.message} label='Stay' required>
              <DatePicker
                inputRef={field.ref}
                isRange
                name={field.name}
                onBlur={field.onBlur}
                onChange={field.onChange}
                value={field.value}
              />
            </Field>
          )}
          rules={{
            validate: ({ startDate, endDate }) =>
              (startDate !== null && endDate !== null) || 'Pick your check-in and check-out dates.',
          }}
        />
        <div>
          <Button colorScheme='primary' label='Book' type='submit' />
        </div>
        {submitted ? (
          <output className='text-sm'>
            Booked for {submitted.name} ({submitted.email}),{' '}
            {submitted.stay.startDate?.toLocaleDateString()} to{' '}
            {submitted.stay.endDate?.toLocaleDateString()}.
          </output>
        ) : null}
      </form>
    )
  },
}
