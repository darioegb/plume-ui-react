import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, type ReactNode } from 'react'
import { defaultTheme } from '../../../../theme'
import { DatePicker, type DateRange } from '../../datepicker'
import { InputControl, InputElement, InputField } from '../../input'
import {
  TimePicker,
  TimePickerHours,
  TimePickerInput,
  TimePickerMinutes,
  TimePickerOption,
  TimePickerPanel,
  TimePickerTrigger,
} from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

function StyledTimePicker({
  fieldClassName,
  ...props
}: Readonly<{ defaultValue: string; fieldClassName: string; hour12?: boolean }>): ReactNode {
  return (
    <TimePicker {...props} variant="unstyled">
      <TimePickerInput aria-label="Time">
        <InputControl>
          <InputField className={fieldClassName} />
          <InputElement position="after">
            <TimePickerTrigger />
          </InputElement>
        </InputControl>
      </TimePickerInput>
      <TimePickerPanel />
    </TimePicker>
  )
}

/**
 * TimePicker lets users type a time or pick it from lists of hours and minutes.
 *
 * Its value is a string in 24-hour `HH:mm` format (for example `"14:30"`, or `""` when empty), the same shape
 * a native `<input type="time">` has, so it fits forms and APIs directly. With `hour12` the field shows and
 * accepts `hh:mm AM/PM`, but the value stays in 24 hours.
 *
 * It is a separate component from the `DatePicker` because a time is not always tied to a date. To pick both,
 * use one next to the other and join their values.
 *
 * The `variant`, `size` and `shape` style the input and the popup together, like in the `DatePicker`.
 *
 * On its own it shows an input with a button that opens the popup. Every element it renders is a part you can
 * import, with its own `className`, `style` and `ref`, so you can reorder, omit or replace it: `TimePickerInput` is
 * the field with the button, and `TimePickerPanel` the lists of hours and minutes (a popup under the input, or
 * always visible with `panel`). The `TimePicker` keeps the value and shares it with its parts. With children,
 * the props of the field (`placeholder`, `disabled`, `readOnly`, `inputRef`, `onBlur`, `id`, `name`, `required`
 * and `className`) go on the `TimePickerInput`, and the look (`variant`, `size` and `shape`) always on the
 * `TimePicker`.
 *
 * The options of a list are rendered with a function as children, which receives each `option` (`{ label, value }`):
 * `<TimePickerHours>{(option) => <TimePickerOption key={option.value} option={option} />}</TimePickerHours>`. The
 * function can render something else than a `TimePickerOption`, but then that element has no selection or keyboard
 * of its own.
 *
 * The parts expose their state as `data-*` attributes (`data-open` in the root, the trigger and the popup,
 * `data-selected` in the options) and carry `data-plume-timepicker-<part>`, so they can be targeted from CSS.
 *
 * ### Keyboard
 *
 * Opening the popup moves the focus to the selected hour. <kbd>↑</kbd> <kbd>↓</kbd> move through the options of
 * a list, <kbd>Home</kbd> / <kbd>End</kbd> go to its first and last, <kbd>Tab</kbd> goes to the next list and
 * <kbd>Enter</kbd> picks the option. Picking a minute closes the popup; <kbd>Esc</kbd> closes it too, giving the
 * focus back to the input.
 */
export default {
  title: 'Components/TimePicker',
  component: TimePicker,
  tags: ['autodocs'],
  decorators: [(Story) => <div className="w-72 max-w-full pb-[18rem]">{Story()}</div>],
  parameters: {
    docs: {
      importNames: [
        'TimePicker',
        'TimePickerHours',
        'TimePickerInput',
        'TimePickerMinutes',
        'TimePickerOption',
        'TimePickerPanel',
        'TimePickerPeriod',
        'TimePickerTrigger',
      ],
      toc: {
        title: 'On this page',
        disable: false,
      },
    },
    layout: 'centered',
  },
  argTypes: {
    className: {
      control: 'text',
    },
    value: {
      control: 'text',
    },
    defaultValue: {
      control: 'text',
    },
    panel: {
      control: 'boolean',
    },
    hour12: {
      control: 'boolean',
    },
    minuteStep: {
      control: 'number',
    },
    colorScheme: {
      control: 'select',
      options: colorSchemes,
    },
    variant: {
      control: 'select',
      options: ['outline', 'underline', 'filled', 'unstyled'],
    },
    shape: {
      control: 'inline-radio',
      options: ['pill', 'rounded'],
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
    placeholder: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
    readOnly: {
      control: 'boolean',
    },
    labels: {
      control: false,
    },
    style: {
      control: false,
    },
    id: {
      control: false,
    },
    name: {
      control: false,
    },
    required: {
      control: 'boolean',
    },
    inputRef: {
      control: false,
    },
  },
  args: {
    'aria-label': 'Time',
    disabled: false,
    hour12: false,
    readOnly: false,
  },
} as Meta<typeof TimePicker>

type Story = StoryObj<typeof TimePicker>

/**
 * This is the default TimePicker.
 */
export const Default: Story = {
  args: { defaultValue: '09:30' },
}

/**
 * With **hour12** the field shows the time as `hh:mm AM/PM` and the popup adds a list for the period.
 * The value is still in 24 hours.
 */
export const Hour12: Story = {
  args: { defaultValue: '15:30', hour12: true },
}

/**
 * The **minuteStep** prop sets the distance between the minutes of the list, here every 15 minutes.
 */
export const MinuteStep: Story = {
  args: { defaultValue: '08:15', minuteStep: 15 },
}

/**
 * This is a list of TimePicker with different variants.
 * Just adding the **variant** prop in one of these values **outline**, **underline**, **filled** and **unstyled**.
 * Open them to see how the popup follows the variant.
 */
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<TimePicker aria-label="Time" variant="outline" defaultValue="09:30" />
<TimePicker aria-label="Time" variant="underline" defaultValue="09:30" />
<TimePicker aria-label="Time" variant="filled" defaultValue="09:30" />
<TimePicker aria-label="Time" variant="unstyled" defaultValue="09:30" />`,
      },
    },
  },
  render: () => (
    <div className="grid w-full gap-4 grid-cols-[repeat(auto-fill,minmax(14rem,1fr))]">
      <TimePicker aria-label="Time" defaultValue="09:30" variant="outline" />
      <TimePicker aria-label="Time" defaultValue="09:30" variant="underline" />
      <TimePicker aria-label="Time" defaultValue="09:30" variant="filled" />
      <TimePicker aria-label="Time" defaultValue="09:30" variant="unstyled" />
    </div>
  ),
}

/**
 * This is a list of TimePicker with different sizes.
 * Just adding the **size** prop.
 */
export const Sizes: Story = {
  parameters: {
    docs: {
      source: {
        code: `<TimePicker aria-label="Time" size="sm" defaultValue="09:30" />
<TimePicker aria-label="Time" size="md" defaultValue="09:30" />
<TimePicker aria-label="Time" size="lg" defaultValue="09:30" />`,
      },
    },
  },
  render: () => (
    <div className="grid w-full gap-4 grid-cols-[repeat(auto-fill,minmax(14rem,1fr))]">
      <TimePicker aria-label="Time" defaultValue="09:30" size="sm" />
      <TimePicker aria-label="Time" defaultValue="09:30" size="md" />
      <TimePicker aria-label="Time" defaultValue="09:30" size="lg" />
    </div>
  ),
}

/**
 * This is a list of TimePicker with different colors.
 * Just adding the **colorScheme** prop. The color marks the selected option and the focus.
 */
export const Colors: Story = {
  parameters: {
    docs: {
      source: {
        code: `<TimePicker aria-label="Time" colorScheme="primary" defaultValue="09:30" />
<TimePicker aria-label="Time" colorScheme="success" defaultValue="09:30" />
<TimePicker aria-label="Time" colorScheme="error" defaultValue="09:30" />`,
      },
    },
  },
  render: () => (
    <div className="grid w-full gap-4 grid-cols-[repeat(auto-fill,minmax(14rem,1fr))]">
      {colorSchemes.map((colorScheme) => (
        <TimePicker
          aria-label="Time"
          colorScheme={colorScheme as keyof typeof defaultTheme.colors}
          defaultValue="09:30"
          key={colorScheme}
        />
      ))}
    </div>
  ),
}

/**
 * Every text can be changed with `labels`, here in Spanish with a 12-hour clock.
 */
export const CustomLabels: Story = {
  args: {
    labels: {
      am: 'a. m.',
      hours: 'Horas',
      minutes: 'Minutos',
      openTimePicker: 'Abrir selector de hora',
      period: 'Periodo',
      pm: 'p. m.',
      timePicker: 'Selector de hora',
    },
    defaultValue: '16:45',
    hour12: true,
  },
}

/**
 * With **panel** only the lists of hours and minutes are shown, always visible, to put them in the page
 * (a booking form, a side panel). Picking a minute doesn't hide them.
 */
export const Panel: Story = {
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [value, setValue] = useState('09:30')
  return (
    <div className="flex flex-col gap-2">
      <TimePicker aria-label="Time" panel onValueChange={setValue} value={value} />
      <span className="text-sm">Value: {value}</span>
    </div>
  )
}`,
      },
    },
  },
  decorators: [(Story) => <div className='w-72 max-w-full'>{Story()}</div>],
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Render is valid storybook function
    const [value, setValue] = useState('09:30')
    return (
      <div className='flex flex-col gap-2'>
        <TimePicker aria-label="Time" panel onValueChange={setValue} value={value} />
        <span className='text-sm'>Value: {value}</span>
      </div>
    )
  },
}

/**
 * A controlled TimePicker, with the value shown below it.
 */
export const Controlled: Story = {
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [value, setValue] = useState('')
  return (
    <div className="flex flex-col gap-2">
      <TimePicker aria-label="Time" onValueChange={setValue} value={value} />
      <span className="text-sm">Value: {value ? \`"\${value}"\` : '(empty)'}</span>
    </div>
  )
}`,
      },
    },
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Render is valid storybook function
    const [value, setValue] = useState('')
    return (
      <div className="flex flex-col gap-2">
        <TimePicker aria-label="Time" onValueChange={setValue} value={value} />
        <span className="text-sm">Value: {value ? `"${value}"` : '(empty)'}</span>
      </div>
    )
  },
}

/**
 * To pick a date and a time, put a `DatePicker` and a `TimePicker` together and join their values.
 */
export const WithDatePicker: Story = {
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [date, setDate] = useState<DateRange>({ startDate: null, endDate: null })
  const [time, setTime] = useState('')
  const { startDate } = date
  const label = startDate
    ? \`\${startDate.toDateString()}\${time ? \` at \${time}\` : ''}\`
    : '(no date)'
  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-3 grid-cols-[3fr_2fr]">
        <DatePicker aria-label="Date" onValueChange={setDate} value={date} />
        <TimePicker aria-label="Time" onValueChange={setTime} value={time} />
      </div>
      <span className="text-sm">Date and time: {label}</span>
    </div>
  )
}`,
      },
    },
  },
  decorators: [(Story) => <div className="w-[28rem] max-w-full pb-[24rem]">{Story()}</div>],
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Render is valid storybook function
    const [date, setDate] = useState<DateRange>({ startDate: null, endDate: null })
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Render is valid storybook function
    const [time, setTime] = useState('')
    const { startDate } = date
    const label = startDate
      ? `${startDate.toDateString()}${time ? ` at ${time}` : ''}`
      : '(no date)'
    return (
      <div className="flex flex-col gap-3">
        <div className="grid gap-3 grid-cols-[3fr_2fr]">
          <DatePicker aria-label="Date" onValueChange={setDate} value={date} />
          <TimePicker aria-label="Time" onValueChange={setTime} value={time} />
        </div>
        <span className="text-sm">Date and time: {label}</span>
      </div>
    )
  },
}

/**
 * Disabled TimePicker.
 */
export const Disabled: Story = {
  args: { defaultValue: '09:30', disabled: true },
}

/**
 * Give the `TimePicker` its parts to choose what it shows and in which order. The props of the field, here its
 * placeholder, go on the `TimePickerInput`, the look (here small and filled) on the `TimePicker`, and the
 * `TimePickerPanel` opens under it. Here the button goes before the field, the panel lists only the hours and the
 * minutes, and the hours are rendered with a class of their own.
 */
export const Compound: Story = {
  parameters: {
    docs: {
      source: {
        code: `<TimePicker defaultValue="09:30" size="sm" variant="filled">
  <TimePickerInput aria-label="Pick a time" placeholder="Pick a time">
    <InputControl>
      <InputElement>
        <TimePickerTrigger />
      </InputElement>
      <InputField />
    </InputControl>
  </TimePickerInput>
  <TimePickerPanel>
    <TimePickerHours>
      {(option) => (
        <TimePickerOption className="font-semibold" key={option.value} option={option} />
      )}
    </TimePickerHours>
    <TimePickerMinutes />
  </TimePickerPanel>
</TimePicker>`,
      },
    },
  },
  render: () => (
    <TimePicker defaultValue='09:30' size='sm' variant='filled'>
      <TimePickerInput aria-label="Pick a time" placeholder='Pick a time'>
        <InputControl>
          <InputElement>
            <TimePickerTrigger />
          </InputElement>
          <InputField />
        </InputControl>
      </TimePickerInput>
      <TimePickerPanel>
        <TimePickerHours>
          {(option) => (
            <TimePickerOption className='font-semibold' key={option.value} option={option} />
          )}
        </TimePickerHours>
        <TimePickerMinutes />
      </TimePickerPanel>
    </TimePicker>
  ),
}

/**
 * An example of TimePicker with custom classes from Tailwind.
 * Set **variant="unstyled"** so Plume styles don't override the Tailwind classes.
 * The `className` of the `InputField` restyles the input; the popup keeps its structure and follows `colorScheme`.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<TimePicker variant="unstyled" defaultValue="09:30">
  <TimePickerInput aria-label="Time">
    <InputControl>
      <InputField className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:ring-3 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
      <InputElement position="after">
        <TimePickerTrigger />
      </InputElement>
    </InputControl>
  </TimePickerInput>
  <TimePickerPanel />
</TimePicker>`,
      },
    },
  },
  render: () => (
    <div className="w-72 max-w-full">
      <StyledTimePicker
        defaultValue="09:30"
        fieldClassName="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:ring-3 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
      />
    </div>
  ),
}

/**
 * An example of TimePicker with custom classes from Bootstrap.
 * Set **variant="unstyled"** so Plume styles don't override the Bootstrap classes.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<TimePicker variant="unstyled" defaultValue="09:30">
  <TimePickerInput aria-label="Time">
    <InputControl>
      <InputField className="form-control" />
      <InputElement position="after">
        <TimePickerTrigger />
      </InputElement>
    </InputControl>
  </TimePickerInput>
  <TimePickerPanel />
</TimePicker>`,
      },
    },
  },
  render: () => (
    <div style={{ width: '18rem', maxWidth: '100%' }}>
      <StyledTimePicker defaultValue="09:30" fieldClassName="form-control" />
    </div>
  ),
}
