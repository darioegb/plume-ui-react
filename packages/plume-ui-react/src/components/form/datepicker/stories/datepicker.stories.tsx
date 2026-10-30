import type { StoryObj, Meta } from '@storybook/react-vite'
import type { CSSProperties, ReactElement } from 'react'
import { useState } from 'react'
import { defaultTheme } from '../../../../theme'
import {
  DatePicker,
  DatePickerApply,
  DatePickerCalendar,
  DatePickerCancel,
  DatePickerField,
  DatePickerFooter,
  DatePickerHeader,
  DatePickerInput,
  DatePickerMonthButton,
  DatePickerNav,
  DatePickerNext,
  DatePickerPage,
  DatePickerPages,
  DatePickerPrevious,
  DatePickerTrigger,
  DatePickerView,
} from '..'
import { InputControl, InputElement } from '../../input'
import type { DatePickerProps, DateRange } from '../datepicker'

const defaultDateRangeValue = { startDate: null, endDate: null }
const colorSchemes = Object.keys(defaultTheme.colors)
const toDate = (value?: Date): Date | undefined => (value === undefined ? undefined : new Date(value))

const ControlledDatePicker = (props: Partial<DatePickerProps>): ReactElement => {
  const [value, setValue] = useState<DateRange>(defaultDateRangeValue)
  return <DatePicker {...props} onValueChange={setValue} value={value} />
}

const StatefulDatePicker = ({ maxDate, minDate, ...args }: DatePickerProps): ReactElement => (
  <ControlledDatePicker
    aria-label='Date'
    {...args}
    maxDate={toDate(maxDate)}
    minDate={toDate(minDate)}
  />
)

/**
 * DatePicker Component allows users to select dates from a calendar interface.
 * It supports single and range selection modes, configurable color schemes, and localization options.
 *
 * On its own it shows an input with a button that opens the calendar. To change what it shows or the order, give
 * it its parts as children: `DatePickerInput` is the field with the button, and `DatePickerCalendar` the calendar
 * (a popup under the input, or always visible with `panel`). The `DatePicker` keeps the value and the state
 * and shares them with its parts. All the props of the `DatePicker` keep working when it has no children; with
 * children, the props of the field (`placeholder`, `disabled`, `readOnly`, `onBlur`, `id`, `name`,
 * `required` and `className`) go on the `DatePickerInput`. The look (`variant`, `size` and `shape`) always goes on the
 * `DatePicker`, because it styles the input and the calendar together.
 *
 * Every element is a part with its own `className`, `style` and `ref`, and with `data-plume-datepicker-<part>`
 * attributes (the days also carry `data-selected`, `data-today`, `data-outside`, `data-in-range`, `data-disabled`,
 * and `data-hovered` and `data-preview` while the pointer or the focus is over the calendar). The `ref` of the
 * `DatePicker` and of the `DatePickerInput` goes to the native `<input>`, so a form library can focus it.
 * `DatePickerFormatHint` is the visually hidden text that describes the expected format, and `DatePickerDayNumber`
 * the number inside a `DatePickerDay`. The cells that
 * repeat (weekdays, days, months and years) take a function as children, like
 * `<DatePickerGrid>{(day) => <DatePickerDay day={day} />}</DatePickerGrid>`, to render each one yourself.
 *
 * ### Closing
 *
 * The popup closes with <kbd>Esc</kbd> (the focus goes back to the input), with a press outside of the
 * DatePicker and when the focus leaves it.
 *
 * ### Keyboard
 *
 * Opening the calendar moves focus to the selected day, or to today.
 * <kbd>←</kbd> <kbd>→</kbd> move one day, <kbd>↑</kbd> <kbd>↓</kbd> one week,
 * <kbd>Home</kbd> / <kbd>End</kbd> to the start or end of the week and <kbd>PageUp</kbd> / <kbd>PageDown</kbd> one month.
 * <kbd>Enter</kbd> picks the day and <kbd>Escape</kbd> closes the calendar; both return focus to the input.
 */
export default {
  title: 'Components/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  decorators: [(Story) => <div className='w-72 max-w-full pb-[22rem]'>{Story()}</div>],
  parameters: {
    docs: {
      importNames: ['DatePicker', 'DatePickerInput', 'DatePickerCalendar'],
      toc: {
        title: 'On this page',
        disable: false,
      },
    },
    layout: 'centered',
  },
  argTypes: {
    className: { control: 'text' },
    value: { control: false },
    panel: { control: 'boolean' },
    range: { control: 'boolean' },
    colorScheme: { control: 'select', options: colorSchemes },
    disabled: { control: 'boolean' },
    displayFormat: { control: 'text' },
    maxDate: { control: 'date' },
    minDate: { control: 'date' },
    showFooter: { control: 'boolean' },
    labels: { control: false },
    readOnly: { control: 'boolean' },
    shape: { control: 'inline-radio', options: ['pill', 'rounded'] },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['outline', 'underline', 'filled', 'unstyled'] },
    placeholder: { control: 'text' },
    style: { control: false },
    id: { control: false },
    name: { control: false },
    required: { control: 'boolean' },
  },
  render: (args) => <StatefulDatePicker {...args} />,
  args: {
    disabled: false,
    range: false,
    readOnly: false,
    showFooter: false,
  },
} as Meta<typeof DatePicker>

type Story = StoryObj<typeof DatePicker>

/**
 * This is the default DatePicker.
 */
export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `const [value, setValue] = useState<DateRange>({ startDate: null, endDate: null })

<DatePicker aria-label="Date" onValueChange={setValue} value={value} />`,
      },
    },
  },
}

/**
 * This is a list of DatePicker with different variants.
 * Just adding the **variant** prop in one of these values **outline**, **underline**, **filled** and **unstyled**.
 * The **variant**, **size** and **shape** go on the `DatePicker` and style the input and the calendar together, so open them to see the calendar of each one.
 */
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<DatePicker aria-label="Outline DatePicker" placeholder="Outline DatePicker" variant="outline" value={value} onValueChange={handleValueChange} />
<DatePicker aria-label="Underline DatePicker" placeholder="Underline DatePicker" variant="underline" value={value} onValueChange={handleValueChange} />
<DatePicker aria-label="Filled DatePicker" placeholder="Filled DatePicker" variant="filled" value={value} onValueChange={handleValueChange} />
<DatePicker aria-label="Unstyled DatePicker" placeholder="Unstyled DatePicker" variant="unstyled" value={value} onValueChange={handleValueChange} />
          `,
      },
    },
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Render is valid storybook function
    const [value, setValue] = useState<DateRange>({
      startDate: null,
      endDate: null,
    })

    const handleValueChange = (newValue: DateRange): void => {
      setValue(newValue)
    }
    return (
      <div className='grid w-full gap-4 grid-cols-[repeat(auto-fill,minmax(18rem,1fr))]'>
        <DatePicker
          aria-label='Outline DatePicker'
          onValueChange={handleValueChange}
          placeholder='Outline DatePicker'
          value={value}
          variant='outline'
        />
        <DatePicker
          aria-label='Underline DatePicker'
          onValueChange={handleValueChange}
          placeholder='Underline DatePicker'
          value={value}
          variant='underline'
        />
        <DatePicker
          aria-label='Filled DatePicker'
          onValueChange={handleValueChange}
          placeholder='Filled DatePicker'
          value={value}
          variant='filled'
        />
        <DatePicker
          aria-label='Unstyled DatePicker'
          onValueChange={handleValueChange}
          placeholder='Unstyled DatePicker'
          value={value}
          variant='unstyled'
        />
      </div>
    )
  },
}

/**
 * This is a list of DatePicker with different sizes.
 * Just adding the **size** prop.
 */
export const Sizes: Story = {
  parameters: {
    docs: {
      source: {
        code: `<DatePicker aria-label="Small DatePicker" size="sm" placeholder="Small DatePicker" value={value} onValueChange={handleValueChange} />
<DatePicker aria-label="Medium DatePicker" size="md" placeholder="Medium DatePicker" value={value} onValueChange={handleValueChange} />
<DatePicker aria-label="Large DatePicker" size="lg" placeholder="Large DatePicker" value={value} onValueChange={handleValueChange} />
          `,
      },
    },
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Render is valid storybook function
    const [value, setValue] = useState<DateRange>({
      startDate: null,
      endDate: null,
    })

    const handleValueChange = (newValue: DateRange): void => {
      setValue(newValue)
    }
    return (
      <div className='grid w-full gap-4 grid-cols-[repeat(auto-fill,minmax(18rem,1fr))]'>
        <DatePicker
          aria-label='Small DatePicker'
          onValueChange={handleValueChange}
          placeholder='Small DatePicker'
          size='sm'
          value={value}
        />
        <DatePicker
          aria-label='Medium DatePicker'
          onValueChange={handleValueChange}
          placeholder='Medium DatePicker'
          size='md'
          value={value}
        />
        <DatePicker
          aria-label='Large DatePicker'
          onValueChange={handleValueChange}
          placeholder='Large DatePicker'
          size='lg'
          value={value}
        />
      </div>
    )
  },
}

/**
 * This is a list of DatePicker with different colors.
 * Just adding the **colorScheme** prop. The color marks the selected day, today and the focus; the in-range days and
 * the hover use its tints.
 */
export const Colors: Story = {
  parameters: {
    docs: {
      source: {
        code: `<DatePicker aria-label="Primary DatePicker" colorScheme="primary" onValueChange={handleValueChange} value={value} />
<DatePicker aria-label="Success DatePicker" colorScheme="success" onValueChange={handleValueChange} value={value} />
<DatePicker aria-label="Error DatePicker" colorScheme="error" onValueChange={handleValueChange} value={value} />`,
      },
    },
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Render is valid storybook function
    const [value, setValue] = useState<DateRange>({
      startDate: null,
      endDate: null,
    })

    const handleValueChange = (newValue: DateRange): void => {
      setValue(newValue)
    }
    return (
      <div className='grid w-full gap-4 grid-cols-[repeat(auto-fill,minmax(18rem,1fr))]'>
        {colorSchemes.map((colorScheme) => (
          <DatePicker
            aria-label={`${colorScheme} DatePicker`}
            colorScheme={colorScheme as keyof typeof defaultTheme.colors}
            key={colorScheme}
            onValueChange={handleValueChange}
            placeholder={`${colorScheme} DatePicker`}
            value={value}
          />
        ))}
      </div>
    )
  },
}

/**
 * DatePicker configured for selecting a range of dates.
 */
export const RangeSelection: Story = {
  parameters: {
    docs: {
      source: {
        code: `<DatePicker aria-label="Date" range />`,
      },
    },
  },
  args: {
    range: true,
  },
}

/**
 * DatePicker with minimum and maximum selectable dates.
 */
export const WithMinMaxDates: Story = {
  parameters: {
    docs: {
      source: {
        code: `<DatePicker
  aria-label="Date"
  maxDate={new Date(new Date().getFullYear(), new Date().getMonth() + 1, 15)}
  minDate={new Date()}
/>`,
      },
    },
  },
  args: {
    minDate: new Date(),
    maxDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 15),
  },
}

/**
 * DatePicker with footer actions.
 */
export const WithFooterActions: Story = {
  parameters: {
    docs: {
      source: {
        code: `<DatePicker aria-label="Date" showFooter />`,
      },
    },
  },
  args: {
    showFooter: true,
  },
  decorators: [(Story) => <div className='pb-[10rem]'>{Story()}</div>],
}

/**
 * DatePicker localized to Spanish through **locale** and **labels**.
 * Every key is optional: `locale` alone localizes the month and weekday names and the date format,
 * and `labels` only needs the texts you want to change.
 */
export const CustomConfiguration: Story = {
  parameters: {
    docs: {
      source: {
        code: `<DatePicker
  aria-label="Fecha"
  labels={{
    apply: 'Aplicar',
    calendar: 'Calendario',
    cancel: 'Cancelar',
    nextMonth: 'Mes siguiente',
    nextYears: 'Años siguientes',
    openCalendar: 'Abrir calendario',
    previousMonth: 'Mes anterior',
    previousYears: 'Años anteriores',
  }}
  locale="es"
  showFooter
/>`,
      },
    },
  },
  args: {
    showFooter: true,
    locale: 'es',
    labels: {
      apply: 'Aplicar',
      calendar: 'Calendario',
      cancel: 'Cancelar',
      nextMonth: 'Mes siguiente',
      nextYears: 'Años siguientes',
      openCalendar: 'Abrir calendario',
      previousMonth: 'Mes anterior',
      previousYears: 'Años anteriores',
    },
  },
}

/**
 * Every element of the calendar is a part, so you can rebuild any piece. Here the header only has the arrows and
 * the month, the weekdays and the days keep their default content, and the footer has its own texts and an order
 * of its own.
 */
export const CustomParts: Story = {
  parameters: {
    docs: {
      source: {
        code: `<DatePicker showFooter onValueChange={onChange}>
  <DatePickerInput aria-label="Date" />
  <DatePickerCalendar>
    <DatePickerPages>
      <DatePickerPage>
        <DatePickerHeader>
          <DatePickerNav>
            <DatePickerPrevious>Back</DatePickerPrevious>
            <DatePickerMonthButton />
            <DatePickerNext>Next</DatePickerNext>
          </DatePickerNav>
        </DatePickerHeader>
        <DatePickerView />
      </DatePickerPage>
    </DatePickerPages>
    <DatePickerFooter>
      <DatePickerApply>Done</DatePickerApply>
      <DatePickerCancel>Not now</DatePickerCancel>
    </DatePickerFooter>
  </DatePickerCalendar>
</DatePicker>`,
      },
    },
  },
  render: () => (
    <ControlledDatePicker locale='en' showFooter>
      <DatePickerInput aria-label='Date' />
      <DatePickerCalendar>
        <DatePickerPages>
          <DatePickerPage>
            <DatePickerHeader>
              <DatePickerNav>
                <DatePickerPrevious>Back</DatePickerPrevious>
                <DatePickerMonthButton />
                <DatePickerNext>Next</DatePickerNext>
              </DatePickerNav>
            </DatePickerHeader>
            <DatePickerView />
          </DatePickerPage>
        </DatePickerPages>
        <DatePickerFooter>
          <DatePickerApply>Done</DatePickerApply>
          <DatePickerCancel>Not now</DatePickerCancel>
        </DatePickerFooter>
      </DatePickerCalendar>
    </ControlledDatePicker>
  ),
}

/**
 * The calendar popup is themed through CSS variables, so you can restyle it
 * independently of the input trigger — even when `variant="unstyled"`. Override any
 * of these on the `style` prop (they default to your `colorScheme`):
 *
 * - `--datepicker-solid`: selected day background.
 * - `--datepicker-scheme`: today's text and focus border.
 * - `--datepicker-contrast`: text color on the selected day.
 * - `--datepicker-hover-color`: day hover background.
 * - `--datepicker-selected-hover-color`: selected day hover background.
 * - `--datepicker-range-item-color`: in-range day background.
 * - `--datepicker-range-item-text`: in-range day text color.
 */
export const CalendarTheming: Story = {
  parameters: {
    docs: {
      source: {
        code: `<DatePicker
  aria-label="Date"
  range
  value={value}
  onValueChange={handleValueChange}
  style={{
    '--datepicker-solid': '#7c3aed',
    '--datepicker-scheme': '#6d28d9',
    '--datepicker-contrast': '#ffffff',
    '--datepicker-hover-color': '#f5f3ff',
    '--datepicker-selected-hover-color': '#6d28d9',
    '--datepicker-range-item-color': '#ede9fe',
    '--datepicker-range-item-text': '#4c1d95',
  }}
/>`,
      },
    },
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Render is valid storybook function
    const [value, setValue] = useState<DateRange>({
      startDate: null,
      endDate: null,
    })

    const handleValueChange = (newValue: DateRange): void => {
      setValue(newValue)
    }
    return (
      <DatePicker
        aria-label='Custom themed calendar'
        range
        onValueChange={handleValueChange}
        placeholder='Custom themed calendar'
        style={
          {
            '--datepicker-solid': '#7c3aed',
            '--datepicker-scheme': '#6d28d9',
            '--datepicker-contrast': '#ffffff',
            '--datepicker-hover-color': '#f5f3ff',
            '--datepicker-selected-hover-color': '#6d28d9',
            '--datepicker-range-item-color': '#ede9fe',
            '--datepicker-range-item-text': '#4c1d95',
          } as CSSProperties
        }
        value={value}
      />
    )
  },
}

/**
 * This is a disabled DatePicker.
 * Just adding the **disabled** prop in true.
 * The disabled state add **.disabled** class,
 */
export const Disabled: Story = {
  parameters: {
    docs: {
      source: {
        code: `<DatePicker aria-label="Date" disabled />`,
      },
    },
  },
  args: {
    disabled: true,
  },
}

/**
 * Give the `DatePicker` its parts to choose what it shows and in which order. The props of the field, here its
 * placeholder, go on the `DatePickerInput`, the look (here small and filled) on the `DatePicker`, and the
 * `DatePickerCalendar` opens under it. The state is shared, so picking a day in the calendar updates the field.
 */
export const Compound: Story = {
  parameters: {
    docs: {
      source: {
        code: `<DatePicker locale="en" onValueChange={handleValueChange} size="sm" value={value} variant="filled">
  <DatePickerInput aria-label="Pick a day" placeholder="Pick a day" />
  <DatePickerCalendar />
</DatePicker>`,
      },
    },
  },
  render: () => (
    <ControlledDatePicker locale='en' size='sm' variant='filled'>
      <DatePickerInput aria-label='Pick a day' placeholder='Pick a day' />
      <DatePickerCalendar />
    </ControlledDatePicker>
  ),
}

/**
 * An example of DatePicker with custom classes from tailwind.
 * Set **variant="unstyled"** so Plume styles don't override your utility classes.
 *
 * Note: the `className` of the `DatePickerField` only restyles the **input**, and with `variant="unstyled"` the
 * calendar keeps just its structural styles. It is themed through `colorScheme` and the
 * `--datepicker-*` CSS variables (see the **Calendar Theming** story).
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<DatePicker onValueChange={handleValueChange} value={value} variant="unstyled">
  <DatePickerInput aria-label="Pick a date" placeholder="Pick a date">
    <InputControl>
      <DatePickerField className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:ring-3 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
      <InputElement position="after">
        <DatePickerTrigger />
      </InputElement>
    </InputControl>
  </DatePickerInput>
  <DatePickerCalendar />
</DatePicker>`,
      },
    },
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Render is valid storybook function
    const [value, setValue] = useState<DateRange>({
      startDate: null,
      endDate: null,
    })

    const handleValueChange = (newValue: DateRange): void => {
      setValue(newValue)
    }
    return (
      <div className='w-72 max-w-full'>
        <DatePicker onValueChange={handleValueChange} value={value} variant='unstyled'>
          <DatePickerInput aria-label='Pick a date' placeholder='Pick a date'>
            <InputControl>
              <DatePickerField className='block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:ring-3 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white' />
              <InputElement position='after'>
                <DatePickerTrigger />
              </InputElement>
            </InputControl>
          </DatePickerInput>
          <DatePickerCalendar />
        </DatePicker>
      </div>
    )
  },
}

/**
 * An example of DatePicker with custom classes from bootstrap.
 * Set **variant="unstyled"** so Plume styles don't override the bootstrap classes.
 *
 * Note: `variant` and the `className` of the `DatePickerField` only restyle the **input**. The calendar
 * popup keeps its structural styles and is themed through `colorScheme` and the
 * `--datepicker-*` CSS variables (see the **Calendar Theming** story).
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<DatePicker onValueChange={handleValueChange} value={value} variant="unstyled">
  <DatePickerInput aria-label="Default date" placeholder="Default date">
    <InputControl>
      <DatePickerField className="form-control" />
      <InputElement position="after">
        <DatePickerTrigger />
      </InputElement>
    </InputControl>
  </DatePickerInput>
  <DatePickerCalendar />
</DatePicker>`,
      },
    },
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Render is valid storybook function
    const [value, setValue] = useState<DateRange>({
      startDate: null,
      endDate: null,
    })

    const handleValueChange = (newValue: DateRange): void => {
      setValue(newValue)
    }
    return (
      <div style={{ width: '18rem', maxWidth: '100%' }}>
        <DatePicker onValueChange={handleValueChange} value={value} variant='unstyled'>
          <DatePickerInput aria-label='Default date' placeholder='Default date'>
            <InputControl>
              <DatePickerField className='form-control' />
              <InputElement position='after'>
                <DatePickerTrigger />
              </InputElement>
            </InputControl>
          </DatePickerInput>
          <DatePickerCalendar />
        </DatePicker>
      </div>
    )
  },
}
