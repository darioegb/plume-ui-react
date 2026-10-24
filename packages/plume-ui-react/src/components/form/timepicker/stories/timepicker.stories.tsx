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
      <TimePickerInput>
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
 * always visible with `isPanel`). The `TimePicker` keeps the value and shares it with its parts. With children,
 * the props of the field (`placeholder`, `disabled`, `readOnly`, `inputRef`, `onBlur`, `id`, `name`, `required`
 * and `className`) go on the `TimePickerInput`, and the look (`variant`, `size` and `shape`) always on the
 * `TimePicker`.
 *
 * ### Subcomponents
 *
 * | Component | Props |
 * | --- | --- |
 * | `TimePickerInput` | `placeholder`, `disabled`, `readOnly`, `inputRef`, `onBlur`, `id`, `name`, `required`, `aria-describedby`, `aria-invalid`, `className` (the field with its button), `children`. The field and the button that opens the panel. It is an `Input`: given children, compose `InputControl`, `InputField`, `InputElement` and `TimePickerTrigger` in any order. It renders nothing when the `TimePicker` is `isPanel`. |
 * | `TimePickerTrigger` | `aria-label` (`Open time picker` by default, or `labels.openTimePicker`), `disabled`, `className`, `style`, `children` (another icon). The button that opens and closes the panel. It is disabled with its `TimePickerInput`, or on its own. |
 * | `TimePickerPanel` | `aria-label` (`Time picker` by default, or `labels.timePicker`), `className`, `style`, `children`. The popup, or the page content when the `TimePicker` is `isPanel`. Given no children it holds the hours, the minutes and, with `hour12`, the period. |
 * | `TimePickerHours`, `TimePickerMinutes`, `TimePickerPeriod` | `aria-label`, `className`, `style`, `children`. A list of options. `TimePickerPeriod` renders nothing without `hour12`. |
 * | `TimePickerOption` | `option`, `className`, `style`, `children` (replaces the label). One option of a list; it carries the selection and the keyboard model. |
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
      description: 'Custom CSS class for the root element of the TimePicker.',
      table: { type: { summary: 'string' } },
    },
    value: {
      control: 'text',
      description:
        'Selected time in `HH:mm` (24 hours), or `""` when empty. Makes the component controlled; use `defaultValue` otherwise.',
      table: { type: { summary: 'string' } },
    },
    defaultValue: {
      control: 'text',
      description: 'Initial time of the uncontrolled component.',
      table: { defaultValue: { summary: '""' }, type: { summary: 'string' } },
    },
    isPanel: {
      control: 'boolean',
      description: 'Renders only the lists of hours and minutes, always visible, without the input.',
      table: { defaultValue: { summary: 'false' }, type: { summary: 'boolean' } },
    },
    hour12: {
      control: 'boolean',
      description:
        'Shows and accepts the time as `hh:mm AM/PM` and adds a list for the period. The value stays in 24 hours.',
      table: { defaultValue: { summary: 'false' }, type: { summary: 'boolean' } },
    },
    minuteStep: {
      control: 'number',
      description:
        'Distance between the minutes of the list (for example `15` lists 00, 15, 30 and 45).',
      table: { defaultValue: { summary: '1' }, type: { summary: 'number' } },
    },
    colorScheme: {
      control: 'select',
      description: 'Color scheme from the theme palette, including custom schemes added to it.',
      options: colorSchemes,
      table: { defaultValue: { summary: 'secondary' }, type: { summary: 'ColorScheme' } },
    },
    variant: {
      control: 'select',
      description:
        'Visual style variant of the input and of the popup. `outline` has a bordered popup, `filled` a tinted one with an accent line, `underline` a square one with an accent line and `unstyled` none of them.',
      options: ['outline', 'underline', 'filled', 'unstyled'],
      table: {
        defaultValue: { summary: 'outline' },
        type: { summary: `"outline" | "underline" | "filled" | "unstyled"` },
      },
    },
    shape: {
      control: 'inline-radio',
      description: 'Shape style. `pill` rounds the `outline` input and the corners of the popup.',
      options: ['pill', 'rounded'],
      table: { defaultValue: { summary: 'rounded' }, type: { summary: `"pill" | "rounded"` } },
    },
    size: {
      control: 'radio',
      description: 'Size of the input and of the popup text.',
      options: ['sm', 'md', 'lg'],
      table: { defaultValue: { summary: 'md' }, type: { summary: `"sm" | "md" | "lg"` } },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder of the input. Defaults to `hh:mm`, or `hh:mm AM` with `hour12`.',
      table: { type: { summary: 'string' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Indicates whether the TimePicker is disabled.',
      table: { defaultValue: { summary: 'false' }, type: { summary: 'boolean' } },
    },
    readOnly: {
      control: 'boolean',
      description: 'Shows the value but blocks typing and the button that opens the popup.',
      table: { defaultValue: { summary: 'false' }, type: { summary: 'boolean' } },
    },
    labels: {
      control: false,
      description:
        '`labels` sets every text the component shows or announces: the names of the popup (`timePicker`), of its lists (`hours`, `minutes`, `period`), of the button that opens it (`openTimePicker`) and the `am` and `pm` texts. Every key is optional and falls back to its default.',
      table: {
        defaultValue: {
          summary: 'object',
          detail:
            "{ am: 'AM', hours: 'Hours', minutes: 'Minutes', openTimePicker: 'Open time picker', period: 'Period', pm: 'PM', timePicker: 'Time picker' }",
        },
        type: {
          summary: 'Partial<TimePickerLabels>',
          detail:
            '{ am?: string; hours?: string; minutes?: string; openTimePicker?: string; period?: string; pm?: string; timePicker?: string }',
        },
      },
    },
    style: {
      control: false,
      description:
        'Inline styles of the wrapper. They are applied after the color variables, so they can override them (e.g. `--timepicker-solid`).',
      table: { type: { summary: 'CSSProperties' } },
    },
    id: {
      control: false,
      description: 'Id of the `<input>`, to link it with a `<label htmlFor>`.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    name: {
      control: false,
      description: 'Name of the `<input>`.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    required: {
      control: 'boolean',
      description: 'Marks the input as required for form validation.',
      table: { category: 'HTML attributes', type: { summary: 'boolean' } },
    },
    inputRef: {
      control: false,
      description:
        'Ref to the `<input>`. The component `ref` points to the wrapper, so pass a form library ref here (e.g. `field.ref` from react-hook-form) to let it focus the field on errors.',
      table: { category: 'HTML attributes', type: { summary: 'Ref<HTMLInputElement>' } },
    },
    onChange: {
      action: 'changed',
      description:
        'Called with the new `HH:mm` value when a complete valid time is typed, when an option is picked, or with `""` when the input is cleared.',
      table: { category: 'Events', type: { summary: '(value: string) => void' } },
    },
    onBlur: {
      action: 'blurred',
      description:
        'Called with the current value when the input loses focus, after applying the typed text.',
      table: { category: 'Events', type: { summary: '(value: string) => void' } },
    },
  },
  args: {
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
        code: `<TimePicker variant="outline" defaultValue="09:30" />
<TimePicker variant="underline" defaultValue="09:30" />
<TimePicker variant="filled" defaultValue="09:30" />
<TimePicker variant="unstyled" defaultValue="09:30" />`,
      },
    },
  },
  render: () => (
    <div className="grid w-full gap-4 grid-cols-[repeat(auto-fill,minmax(14rem,1fr))]">
      <TimePicker defaultValue="09:30" variant="outline" />
      <TimePicker defaultValue="09:30" variant="underline" />
      <TimePicker defaultValue="09:30" variant="filled" />
      <TimePicker defaultValue="09:30" variant="unstyled" />
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
        code: `<TimePicker size="sm" defaultValue="09:30" />
<TimePicker size="md" defaultValue="09:30" />
<TimePicker size="lg" defaultValue="09:30" />`,
      },
    },
  },
  render: () => (
    <div className="grid w-full gap-4 grid-cols-[repeat(auto-fill,minmax(14rem,1fr))]">
      <TimePicker defaultValue="09:30" size="sm" />
      <TimePicker defaultValue="09:30" size="md" />
      <TimePicker defaultValue="09:30" size="lg" />
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
        code: `<TimePicker colorScheme="primary" defaultValue="09:30" />
<TimePicker colorScheme="success" defaultValue="09:30" />
<TimePicker colorScheme="error" defaultValue="09:30" />`,
      },
    },
  },
  render: () => (
    <div className="grid w-full gap-4 grid-cols-[repeat(auto-fill,minmax(14rem,1fr))]">
      {colorSchemes.map((colorScheme) => (
        <TimePicker colorScheme={colorScheme} defaultValue="09:30" key={colorScheme} />
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
  <TimePickerInput placeholder="Pick a time">
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
      <TimePickerInput placeholder='Pick a time'>
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
 * With **isPanel** only the lists of hours and minutes are shown, always visible, to put them in the page
 * (a booking form, a side panel). Picking a minute doesn't hide them.
 */
export const Panel: Story = {
  decorators: [(Story) => <div className='w-72 max-w-full'>{Story()}</div>],
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Render is valid storybook function
    const [value, setValue] = useState('09:30')
    return (
      <div className='flex flex-col gap-2'>
        <TimePicker isPanel onChange={setValue} value={value} />
        <span className='text-sm'>Value: {value}</span>
      </div>
    )
  },
}

/**
 * A controlled TimePicker, with the value shown below it.
 */
export const Controlled: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Render is valid storybook function
    const [value, setValue] = useState('')
    return (
      <div className="flex flex-col gap-2">
        <TimePicker onChange={setValue} value={value} />
        <span className="text-sm">Value: {value ? `"${value}"` : '(empty)'}</span>
      </div>
    )
  },
}

/**
 * To pick a date and a time, put a `DatePicker` and a `TimePicker` together and join their values.
 */
export const WithDatePicker: Story = {
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
          <DatePicker onChange={setDate} value={date} />
          <TimePicker onChange={setTime} value={time} />
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
 * Some examples of TimePicker with custom classes from Tailwind.
 * Set **variant="unstyled"** so Plume styles don't override the Tailwind classes.
 * The `className` of the `InputField` restyles the input; the popup keeps its structure and follows `colorScheme`.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<TimePicker variant="unstyled" defaultValue="09:30">
  <TimePickerInput>
    <InputControl>
      <InputField className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
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
    <div className="flex flex-col gap-4 w-72 max-w-full">
      <StyledTimePicker
        defaultValue="09:30"
        fieldClassName="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
      />
      <StyledTimePicker
        defaultValue="15:30"
        fieldClassName="block w-full rounded-full border border-gray-200 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        hour12
      />
    </div>
  ),
}

/**
 * Some examples of TimePicker with custom classes from Bootstrap.
 * Set **variant="unstyled"** so Plume styles don't override the Bootstrap classes.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<TimePicker variant="unstyled" defaultValue="09:30">
  <TimePickerInput>
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
    <div className="d-flex flex-column gap-3" style={{ width: '18rem', maxWidth: '100%' }}>
      <StyledTimePicker defaultValue="09:30" fieldClassName="form-control" />
      <StyledTimePicker defaultValue="09:30" fieldClassName="form-control form-control-lg" />
    </div>
  ),
}
