import type { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '../../../interaction/button'
import { DatePicker, type DateRange } from '../../datepicker'
import { Checkbox } from '../../checkbox'
import { Input } from '../../input'
import { Radio, RadioGroup } from '../../radio'
import { Select, SelectContent, SelectOption, SelectTrigger } from '../../select'
import { Toggle } from '../../toggle'
import { Field } from '..'

/**
 * Field wraps a form control with a label, a required or optional mark, helper text and an error message,
 * and wires them to the control: the label points to it, the texts describe it through `aria-describedby`,
 * and `invalid`, `required`, `disabled` and `readOnly` are passed down to it.
 *
 * It works with `Input`, `DatePicker`, `Checkbox`, `Radio`, `Toggle` and any control that accepts `id`, `aria-describedby` and `aria-invalid`.
 * `Checkbox`, `Radio` and `Toggle` have no text of their own: their label always comes from a `Field`, with `orientation="inline"`.
 * When the control already has an `id`, Field keeps it; otherwise it generates one.
 */
const meta: Meta<typeof Field> = {
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
    children: { control: false },
    label: { control: 'text' },
    helperText: { control: 'text' },
    errorText: { control: 'text' },
    invalid: { control: 'boolean' },
    required: { control: 'boolean' },
    optionalText: { control: 'text' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal', 'inline'] },
    className: { control: 'text' },
    style: { control: false },
  },
  args: {
    label: 'Email',
    children: <Input placeholder='you@example.com' type='email' />,
  },
}

export default meta

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
 * **orientation="inline"** puts the control first and the label right after it, which is how a `Checkbox`,
 * a `Radio` or a `Toggle` is read. The helper and the error texts go under the label, and a click on the
 * label activates the control.
 */
export const Inline: Story = {
  decorators: [(Story) => <div className='w-80 max-w-full'>{Story()}</div>],
  parameters: {
    docs: {
      source: {
        code: `<Field helperText="You can change this later." label="Send me updates" orientation="inline">
  <Checkbox />
</Field>
<Field errorText="You must accept the terms." label="I accept the terms" orientation="inline">
  <Checkbox />
</Field>
<Field label="Dark mode" orientation="inline">
  <Toggle />
</Field>
<Field label="Notifications" helperText="Where we reach you.">
  <RadioGroup defaultValue="email">
    <Field label="Email" orientation="inline">
      <Radio value="email" />
    </Field>
    <Field label="SMS" orientation="inline">
      <Radio value="sms" />
    </Field>
  </RadioGroup>
</Field>`,
      },
    },
  },
  render: () => (
    <div className='flex flex-col gap-4'>
      <Field helperText='You can change this later.' label='Send me updates' orientation='inline'>
        <Checkbox />
      </Field>
      <Field errorText='You must accept the terms.' label='I accept the terms' orientation='inline'>
        <Checkbox />
      </Field>
      <Field label='Dark mode' orientation='inline'>
        <Toggle />
      </Field>
      <Field helperText='Where we reach you.' label='Notifications'>
        <RadioGroup defaultValue='email'>
          <Field label='Email' orientation='inline'>
            <Radio value='email' />
          </Field>
          <Field label='SMS' orientation='inline'>
            <Radio value='sms' />
          </Field>
        </RadioGroup>
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
  room: string
  stay: DateRange
  terms: boolean
}

/**
 * A form with [react-hook-form](https://react-hook-form.com/). The controls that are a single native
 * element (`Input`, `Checkbox`) take `register` as it is. The ones that are not go through `Controller`:
 * `Select` takes `value` and `onValueChange` and the `ref` goes to its `SelectTrigger`, and `DatePicker`
 * takes `inputRef={field.ref}`, so the form can focus them.
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
  defaultValues: {
    name: '',
    email: '',
    room: '',
    stay: { startDate: null, endDate: null },
    terms: false,
  },
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
    name="room"
    render={({ field, fieldState }) => (
      <Field errorText={fieldState.error?.message} label="Room" required>
        <Select name={field.name} onValueChange={field.onChange} value={field.value}>
          <SelectTrigger placeholder="Pick a room" ref={field.ref} />
          <SelectContent>
            <SelectOption value="single">Single</SelectOption>
            <SelectOption value="double">Double</SelectOption>
          </SelectContent>
        </Select>
      </Field>
    )}
    rules={{ required: 'Pick a room.' }}
  />
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
  <Field errorText={errors.terms?.message} label="I accept the terms" orientation="inline">
    <Checkbox {...register('terms', { required: 'Accept the terms to book.' })} />
  </Field>
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
      defaultValues: {
        name: '',
        email: '',
        room: '',
        stay: { startDate: null, endDate: null },
        terms: false,
      },
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
          name='room'
          render={({ field, fieldState }) => (
            <Field errorText={fieldState.error?.message} label='Room' required>
              <Select name={field.name} onValueChange={field.onChange} value={field.value}>
                <SelectTrigger placeholder='Pick a room' ref={field.ref} />
                <SelectContent>
                  <SelectOption value='single'>Single</SelectOption>
                  <SelectOption value='double'>Double</SelectOption>
                </SelectContent>
              </Select>
            </Field>
          )}
          rules={{ required: 'Pick a room.' }}
        />
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
        <Field errorText={errors.terms?.message} label='I accept the terms' orientation='inline'>
          <Checkbox {...register('terms', { required: 'Accept the terms to book.' })} />
        </Field>
        <div>
          <Button colorScheme='primary' label='Book' type='submit' />
        </div>
        {submitted ? (
          <output className='text-sm'>
            Booked a {submitted.room} room for {submitted.name} ({submitted.email}),{' '}
            {submitted.stay.startDate?.toLocaleDateString()} to{' '}
            {submitted.stay.endDate?.toLocaleDateString()}.
          </output>
        ) : null}
      </form>
    )
  },
}
