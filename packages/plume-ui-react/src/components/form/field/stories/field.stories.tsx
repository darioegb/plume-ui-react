import type { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '../../../interaction/button'
import { DatePicker, type DateRange } from '../../datepicker'
import { Checkbox } from '../../checkbox'
import { Input } from '../../input'
import { NumberInput } from '../../numberinput'
import { PinInput } from '../../pininput'
import { Radio, RadioGroup } from '../../radio'
import { Rating } from '../../rating'
import { Select, SelectContent, SelectOption, SelectTrigger } from '../../select'
import { Slider } from '../../slider'
import { Textarea } from '../../textarea'
import { TimePicker } from '../../timepicker'
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
  decorators: [
    (Story, { parameters }) => (
      <div className={parameters.wide ? 'w-[42rem] max-w-full' : 'w-72 max-w-full'}>{Story()}</div>
    ),
  ],
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
  <DatePicker onValueChange={setValue} value={value} />
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
        <DatePicker onValueChange={setValue} value={value} />
      </Field>
    )
  },
}

interface BookingValues {
  name: string
  email: string
  guests: number | null
  room: string
  extras: string[]
  bed: string
  stay: DateRange
  arrival: string
  budget: number
  stars: number
  notes: string
  pin: string
  offers: boolean
  terms: boolean
}

const bookingDefaults: BookingValues = {
  name: '',
  email: '',
  guests: null,
  room: '',
  extras: [],
  bed: 'queen',
  stay: { startDate: null, endDate: null },
  arrival: '',
  budget: 200,
  stars: 3,
  notes: '',
  pin: '',
  offers: false,
  terms: false,
}

/**
 * A form with <a href="https://react-hook-form.com/" target="_blank" rel="noopener noreferrer">react-hook-form</a> that uses every form control of the library.
 * The controls that are a single native element (`Input`, `Textarea`, `Checkbox`, `Toggle`) take `register`
 * as it is. The ones that are not go through `Controller` with `value` and `onValueChange`: `Select` (also with
 * `multiple`), `RadioGroup`, `NumberInput`, `Slider`, `Rating`, `PinInput`, `DatePicker` and `TimePicker`.
 * Where the control has an input to focus, give it the `ref`: on the `SelectTrigger`, on `NumberInput` or on
 * the pickers, so the form can focus the first invalid field.
 * Pass each error message to **errorText** and Field marks the control and links the message.
 * Submit the empty form to see the errors.
 */
export const ReactHookForm: Story = {
  decorators: [(Story) => <div className='pb-[22rem]'>{Story()}</div>],
  parameters: {
    wide: true,
    docs: {
      source: {
        code: `const {
  control,
  formState: { errors },
  handleSubmit,
  register,
} = useForm<BookingValues>({
  defaultValues: bookingDefaults,
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
    name="guests"
    render={({ field, fieldState }) => (
      <Field errorText={fieldState.error?.message} label="Guests" required>
        <NumberInput
          max={6}
          min={1}
          onBlur={field.onBlur}
          onValueChange={field.onChange}
          ref={field.ref}
          value={field.value}
        />
      </Field>
    )}
    rules={{ required: 'Enter the number of guests.' }}
  />
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
            <SelectOption value="suite">Suite</SelectOption>
          </SelectContent>
        </Select>
      </Field>
    )}
    rules={{ required: 'Pick a room.' }}
  />
  <Controller
    control={control}
    name="extras"
    render={({ field }) => (
      <Field label="Extras">
        <Select multiple name={field.name} onValueChange={field.onChange} value={field.value}>
          <SelectTrigger placeholder="Add extras" />
          <SelectContent>
            <SelectOption value="breakfast">Breakfast</SelectOption>
            <SelectOption value="parking">Parking</SelectOption>
            <SelectOption value="spa">Spa access</SelectOption>
          </SelectContent>
        </Select>
      </Field>
    )}
  />
  <Controller
    control={control}
    name="bed"
    render={({ field }) => (
      <Field label="Bed">
        <RadioGroup name={field.name} onValueChange={field.onChange} value={field.value}>
          <Field label="Queen" orientation="inline">
            <Radio value="queen" />
          </Field>
          <Field label="Twin" orientation="inline">
            <Radio value="twin" />
          </Field>
        </RadioGroup>
      </Field>
    )}
  />
  <Controller
    control={control}
    name="stay"
    render={({ field, fieldState }) => (
      <Field errorText={fieldState.error?.message} label="Stay" required>
        <DatePicker
          ref={field.ref}
          range
          name={field.name}
          onBlur={field.onBlur}
          onValueChange={field.onChange}
          value={field.value}
        />
      </Field>
    )}
    rules={{
      validate: ({ startDate, endDate }) =>
        (startDate !== null && endDate !== null) || 'Pick your check-in and check-out dates.',
    }}
  />
  <Controller
    control={control}
    name="arrival"
    render={({ field, fieldState }) => (
      <Field errorText={fieldState.error?.message} label="Arrival time" required>
        <TimePicker
          ref={field.ref}
          minuteStep={15}
          onValueChange={field.onChange}
          value={field.value}
        />
      </Field>
    )}
    rules={{ required: 'Pick an arrival time.' }}
  />
  <Controller
    control={control}
    name="budget"
    render={({ field }) => (
      <Field helperText={<>Up to {field.value} per night.</>} label="Budget">
        <Slider
          max={500}
          min={50}
          name={field.name}
          onValueChange={field.onChange}
          step={10}
          value={field.value}
        />
      </Field>
    )}
  />
  <Controller
    control={control}
    name="stars"
    render={({ field }) => (
      <Field label="Minimum stars">
        <Rating name={field.name} onValueChange={field.onChange} value={field.value} />
      </Field>
    )}
  />
  <Field label="Notes" helperText="Anything we should know?">
    <Textarea {...register('notes')} />
  </Field>
  <Controller
    control={control}
    name="pin"
    render={({ field, fieldState }) => (
      <Field
        errorText={fieldState.error?.message}
        helperText="The 4 digits you will give at the desk."
        label="Check-in PIN"
        required
      >
        <PinInput
          length={4}
          name={field.name}
          onValueChange={field.onChange}
          value={field.value}
        />
      </Field>
    )}
    rules={{ validate: (pin) => pin.length === 4 || 'Enter the 4 digits.' }}
  />
  <Field label="Send me offers" orientation="inline">
    <Toggle {...register('offers')} />
  </Field>
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
    } = useForm<BookingValues>({ defaultValues: bookingDefaults })

    return (
      <form
        className='grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-4'
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
          name='guests'
          render={({ field, fieldState }) => (
            <Field errorText={fieldState.error?.message} label='Guests' required>
              <NumberInput
                max={6}
                min={1}
                onBlur={field.onBlur}
                onValueChange={field.onChange}
                ref={field.ref}
                value={field.value}
              />
            </Field>
          )}
          rules={{ required: 'Enter the number of guests.' }}
        />
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
                  <SelectOption value='suite'>Suite</SelectOption>
                </SelectContent>
              </Select>
            </Field>
          )}
          rules={{ required: 'Pick a room.' }}
        />
        <Controller
          control={control}
          name='extras'
          render={({ field }) => (
            <Field label='Extras'>
              <Select multiple name={field.name} onValueChange={field.onChange} value={field.value}>
                <SelectTrigger placeholder='Add extras' />
                <SelectContent>
                  <SelectOption value='breakfast'>Breakfast</SelectOption>
                  <SelectOption value='parking'>Parking</SelectOption>
                  <SelectOption value='spa'>Spa access</SelectOption>
                </SelectContent>
              </Select>
            </Field>
          )}
        />
        <Controller
          control={control}
          name='bed'
          render={({ field }) => (
            <Field label='Bed'>
              <RadioGroup name={field.name} onValueChange={field.onChange} value={field.value}>
                <Field label='Queen' orientation='inline'>
                  <Radio value='queen' />
                </Field>
                <Field label='Twin' orientation='inline'>
                  <Radio value='twin' />
                </Field>
              </RadioGroup>
            </Field>
          )}
        />
        <Controller
          control={control}
          name='stay'
          render={({ field, fieldState }) => (
            <Field errorText={fieldState.error?.message} label='Stay' required>
              <DatePicker
                ref={field.ref}
                range
                name={field.name}
                onBlur={field.onBlur}
                onValueChange={field.onChange}
                value={field.value}
              />
            </Field>
          )}
          rules={{
            validate: ({ startDate, endDate }) =>
              (startDate !== null && endDate !== null) || 'Pick your check-in and check-out dates.',
          }}
        />
        <Controller
          control={control}
          name='arrival'
          render={({ field, fieldState }) => (
            <Field errorText={fieldState.error?.message} label='Arrival time' required>
              <TimePicker
                ref={field.ref}
                minuteStep={15}
                onValueChange={field.onChange}
                value={field.value}
              />
            </Field>
          )}
          rules={{ required: 'Pick an arrival time.' }}
        />
        <Controller
          control={control}
          name='budget'
          render={({ field }) => (
            <Field helperText={<>Up to {field.value} per night.</>} label='Budget'>
              <Slider
                max={500}
                min={50}
                name={field.name}
                onValueChange={field.onChange}
                step={10}
                value={field.value}
              />
            </Field>
          )}
        />
        <Controller
          control={control}
          name='stars'
          render={({ field }) => (
            <Field label='Minimum stars'>
              <Rating name={field.name} onValueChange={field.onChange} value={field.value} />
            </Field>
          )}
        />
        <Field label='Notes' helperText='Anything we should know?'>
          <Textarea {...register('notes')} />
        </Field>
        <Controller
          control={control}
          name='pin'
          render={({ field, fieldState }) => (
            <Field
              errorText={fieldState.error?.message}
              helperText='The 4 digits you will give at the desk.'
              label='Check-in PIN'
              required
            >
              <PinInput
                length={4}
                name={field.name}
                onValueChange={field.onChange}
                value={field.value}
              />
            </Field>
          )}
          rules={{ validate: (pin) => pin.length === 4 || 'Enter the 4 digits.' }}
        />
        <Field label='Send me offers' orientation='inline'>
          <Toggle {...register('offers')} />
        </Field>
        <Field errorText={errors.terms?.message} label='I accept the terms' orientation='inline'>
          <Checkbox {...register('terms', { required: 'Accept the terms to book.' })} />
        </Field>
        <Button colorScheme='primary' label='Book' type='submit' />
        {submitted ? (
          <output className='col-span-full text-sm'>
            Booked a {submitted.room} room for {submitted.name} ({submitted.email}),{' '}
            {submitted.stay.startDate?.toLocaleDateString()} to{' '}
            {submitted.stay.endDate?.toLocaleDateString()}, arriving at {submitted.arrival}.
          </output>
        ) : null}
      </form>
    )
  },
}
