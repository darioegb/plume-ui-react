import type { StoryObj, Meta } from '@storybook/react-vite'
import type { CSSProperties } from 'react'
import { useState } from 'react'
import { defaultTheme } from '../../../../theme'
import { DatePicker, DatePickerCalendar, DatePickerInput } from '..'
import type { DateRange } from '../datepicker'

const defaultDateRangeValue = { startDate: null, endDate: null }
const colorSchemes = Object.keys(defaultTheme.colors)
const toDate = (value?: Date): Date | undefined => (value === undefined ? undefined : new Date(value))

/**
 * DatePicker Component allows users to select dates from a calendar interface.
 * It supports single and range selection modes, configurable color schemes, and localization options.
 *
 * On its own it shows an input with a button that opens the calendar. To change what it shows or the order, give
 * it its parts as children: `DatePickerInput` is the field with the button, and `DatePickerCalendar` the calendar
 * (a popup under the input, or always visible with `isCalendar`). The `DatePicker` keeps the value and the state
 * and shares them with its parts. All the props of the `DatePicker` keep working when it has no children; with
 * children, the props of the field (`placeholder`, `disabled`, `readOnly`, `inputRef`, `onBlur`, `id`, `name`,
 * `required` and `className`) go on the `DatePickerInput`. The look (`variant`, `size` and `shape`) always goes on the
 * `DatePicker`, because it styles the input and the calendar together.
 *
 * ### Subcomponents
 *
 * | Component | Props |
 * | --- | --- |
 * | `DatePickerInput` | `placeholder`, `disabled`, `readOnly`, `inputRef`, `onBlur`, `id`, `name`, `required`, `aria-describedby`, `aria-invalid`, `className`. The field and the button that opens the calendar. It renders nothing when the `DatePicker` is `isCalendar`. |
 * | `DatePickerCalendar` | `aria-label` (`Calendar` by default, or `config.labels.calendar`), `className`, `style`. The calendar. It is a popup that opens under the input, or the page content when the `DatePicker` is `isCalendar`. |
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
    className: {
      control: 'text',
      description: 'Custom CSS class for the DatePicker.',
      table: {
        type: { summary: 'string' },
      },
    },
    value: {
      control: false,
      description:
        'Selected date or range as `{ startDate, endDate }`. In single mode `endDate` is `null`.',
      table: {
        type: { summary: 'DateRange' },
      },
    },
    isCalendar: {
      control: 'boolean',
      description: 'Renders only the calendar, always visible, without the input.',
      table: {
        defaultValue: { summary: false },
        type: { summary: 'boolean' },
      },
    },
    isRange: {
      control: 'boolean',
      description: 'Selects a start and an end date, showing two consecutive months.',
      table: {
        defaultValue: { summary: false },
        type: { summary: 'boolean' },
      },
    },
    colorScheme: {
      control: 'select',
      description: 'Color scheme from the theme palette, including custom schemes added to it.',
      options: colorSchemes,
      table: {
        defaultValue: { summary: 'secondary' },
        type: { summary: 'ColorScheme' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Indicates whether the DatePicker is disabled.',
      table: {
        defaultValue: { summary: false },
        type: { summary: 'boolean' },
      },
    },
    displayFormat: {
      control: 'text',
      description:
        'Format of the typed and displayed date, built from the `dd`, `mm` and `yyyy` tokens in any order and case (e.g. `dd/mm/yyyy`, `YYYY-MM-DD`). Defaults to the format of `config.language`.',
      table: {
        type: { summary: 'string' },
      },
    },
    maxDate: {
      control: 'date',
      description: 'Last selectable date. Later days are disabled.',
      table: {
        type: { summary: 'Date' },
      },
    },
    minDate: {
      control: 'date',
      description: 'First selectable date. Earlier days are disabled.',
      table: {
        type: { summary: 'Date' },
      },
    },
    showFooter: {
      control: 'boolean',
      description:
        'Shows Cancel and Apply buttons, so the selection is only applied (and `onChange` called) on Apply.',
      table: {
        defaultValue: { summary: false },
        type: { summary: 'boolean' },
      },
    },
    config: {
      control: false,
      description:
        '`language` sets the month and weekday names, the default `displayFormat` and the day labels read by screen readers; `footer` sets the labels of the Cancel and Apply buttons; `labels` sets the name of the calendar and of the button that opens it. Every key is optional and falls back to its default.',
      table: {
        defaultValue: {
          summary: 'object',
          detail:
            "{ language: 'en', footer: { cancel: 'Cancel', apply: 'Apply' }, labels: { calendar: 'Calendar', openCalendar: 'Open calendar' } }",
        },
        type: {
          summary: 'DatePickerConfig',
          detail:
            '{ language?: string; footer?: { apply?: string; cancel?: string }; labels?: { calendar?: string; openCalendar?: string } }',
        },
      },
    },
    readOnly: {
      control: 'boolean',
      description: 'Shows the value but blocks typing and the calendar button.',
      table: {
        defaultValue: { summary: false },
        type: { summary: 'boolean' },
      },
    },
    shape: {
      control: 'inline-radio',
      description:
        'Shape style of the DatePicker. `pill` rounds the `outline` input and the corners of the calendar.',
      options: ['pill', 'rounded'],
      table: {
        defaultValue: { summary: 'rounded' },
        type: { summary: `"pill" | "rounded"` },
      },
    },
    size: {
      control: 'radio',
      description: 'Size of the input and of the calendar days.',
      options: ['sm', 'md', 'lg'],
      table: {
        defaultValue: { summary: 'md' },
        type: { summary: `"sm" | "md" | "lg"` },
      },
    },
    variant: {
      control: 'select',
      description:
        'Visual style variant of the input and of the calendar. `outline` has a bordered calendar, `filled` a tinted one with an accent line, `underline` a square one with an accent line and `unstyled` none of them.',
      options: ['outline', 'underline', 'filled', 'unstyled'],
      table: {
        type: { summary: `"outline" | "underline" | "filled" | "unstyled"` },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder of the input. Defaults to the display format.',
      table: { type: { summary: 'string' } },
    },
    style: {
      control: false,
      description:
        'Inline styles. They are applied after the color variables, so they can override them (e.g. `--datepicker-solid`).',
      table: { type: { summary: 'CSSProperties' } },
    },
    id: {
      control: false,
      description: 'Id of the `<input>`, to link it with a `<label htmlFor>`.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    name: {
      control: false,
      description: 'Name of the `<input>`, submitted with the form as the formatted date.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    inputRef: {
      control: false,
      description:
        'Ref to the `<input>`. The component `ref` points to the wrapper, so pass a form library ref here (e.g. `field.ref` from react-hook-form) to let it focus the field on errors.',
      table: { category: 'HTML attributes', type: { summary: 'Ref<HTMLInputElement>' } },
    },
    required: {
      control: 'boolean',
      description: 'Marks the input as required for form validation.',
      table: { category: 'HTML attributes', type: { summary: 'boolean' } },
    },
    onChange: {
      action: 'changed',
      description:
        'Called with the new `{ startDate, endDate }` when a date is picked, when a range is complete, or on Apply when `showFooter` is set.',
      table: { category: 'Events', type: { summary: '(value: DateRange) => void' } },
    },
    onBlur: {
      action: 'blurred',
      description: 'Called with the current value when the input loses focus.',
      table: { category: 'Events', type: { summary: '(value?: DateRange) => void' } },
    },
  },
  render: ({ minDate, maxDate, ...args }) => (
    <DatePicker {...args} maxDate={toDate(maxDate)} minDate={toDate(minDate)} />
  ),
  args: {
    disabled: false,
    isRange: false,
    readOnly: false,
    showFooter: false,
  },
} as Meta<typeof DatePicker>

type Story = StoryObj<typeof DatePicker>

/**
 * This is the default DatePicker.
 */
export const Default: Story = {
  args: {
    value: defaultDateRangeValue,
  },
  parameters: {
    docs: {
      source: {
        code: `<DatePicker
  colorScheme="primary"
  onChange={() => {}}
  value={{
    endDate: null,
    startDate: null
  }}
/>`,
      },
    },
  },
}

/**
 * This is a list of DatePicker with different variants.
 * Just adding the **variant** prop in one of these values **outline**, **underline**, **filled** and **unstyled**.
 */
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<DatePicker placeholder="Outline DatePicker" variant="outline" value={value} onChange={handleValueChange} />
<DatePicker placeholder="Underline DatePicker" variant="underline" value={value} onChange={handleValueChange} />
<DatePicker placeholder="Filled DatePicker" variant="filled" value={value} onChange={handleValueChange} />
<DatePicker placeholder="Unstyled DatePicker" variant="unstyled" value={value} onChange={handleValueChange} />
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
          onChange={handleValueChange}
          placeholder='Outline DatePicker'
          value={value}
          variant='outline'
        />
        <DatePicker
          onChange={handleValueChange}
          placeholder='Underline DatePicker'
          value={value}
          variant='underline'
        />
        <DatePicker
          onChange={handleValueChange}
          placeholder='Filled DatePicker'
          value={value}
          variant='filled'
        />
        <DatePicker
          onChange={handleValueChange}
          placeholder='Unstyled DatePicker'
          value={value}
          variant='unstyled'
        />
      </div>
    )
  },
}

/**
 * The **variant**, **size** and **shape** go on the `DatePicker` and style the input and the calendar together.
 * Here the calendars are always visible (`isCalendar`) to compare them: `outline` has a bordered calendar,
 * `filled` a tinted one with an accent line, `underline` a square one with an accent line and `unstyled` keeps
 * only the structure. The **size** also scales the days of the calendar.
 */
export const CalendarVariants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<DatePicker isCalendar variant="outline" value={value} onChange={handleValueChange} />
<DatePicker isCalendar variant="filled" value={value} onChange={handleValueChange} />
<DatePicker isCalendar variant="underline" value={value} onChange={handleValueChange} />
<DatePicker isCalendar variant="unstyled" value={value} onChange={handleValueChange} />
<DatePicker isCalendar size="sm" value={value} onChange={handleValueChange} />
<DatePicker isCalendar size="lg" value={value} onChange={handleValueChange} />
          `,
      },
    },
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Render is valid storybook function
    const [value, setValue] = useState<DateRange>({ startDate: null, endDate: null })
    const variants = ['outline', 'filled', 'underline', 'unstyled'] as const
    const sizes = ['sm', 'lg'] as const

    return (
      <div className='flex flex-wrap gap-6'>
        {variants.map((variant) => (
          <DatePicker isCalendar key={variant} onChange={setValue} value={value} variant={variant} />
        ))}
        {sizes.map((size) => (
          <DatePicker isCalendar key={size} onChange={setValue} size={size} value={value} />
        ))}
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
        code: `<DatePicker size="sm" placeholder="Small DatePicker" value={value} onChange={handleValueChange} />
<DatePicker size="md" placeholder="Medium DatePicker" value={value} onChange={handleValueChange} />
<DatePicker size="lg" placeholder="Large DatePicker" value={value} onChange={handleValueChange} />
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
          onChange={handleValueChange}
          placeholder='Small DatePicker'
          size='sm'
          value={value}
        />
        <DatePicker
          onChange={handleValueChange}
          placeholder='Medium DatePicker'
          size='md'
          value={value}
        />
        <DatePicker
          onChange={handleValueChange}
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
 * Just adding the **colorScheme** prop.
 */
export const Colors: Story = {
  parameters: {
    docs: {
      source: {
        code: `<DatePicker placeholder="Default DatePicker" />
<DatePicker 
  colorScheme="primary"
  placeholder="Primary DatePicker"
  value={value}
  onChange={handleValueChange} 
/>
<DatePicker 
  colorScheme="secondary"
  placeholder="Secondary DatePicker"
  value={value}
  onChange={handleValueChange}
/>
<DatePicker 
  colorScheme="info"
  placeholder="Info DatePicker"
  value={value}
  onChange={handleValueChange}
/>
<DatePicker 
  colorScheme="warning"
  placeholder="Warning DatePicker"
  value={value}
  onChange={handleValueChange}
/>
<DatePicker 
  colorScheme="error"
  placeholder="Error DatePicker"
  value={value}
  onChange={handleValueChange}
/>
<DatePicker 
  colorScheme="success"
  placeholder="Success DatePicker"
  value={value}
  onChange={handleValueChange}
/>
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
        <DatePicker onChange={handleValueChange} placeholder='Default DatePicker' value={value} />
        <DatePicker
          colorScheme='primary'
          onChange={handleValueChange}
          placeholder='Primary DatePicker'
          value={value}
        />
        <DatePicker
          colorScheme='secondary'
          onChange={handleValueChange}
          placeholder='Secondary DatePicker'
          value={value}
        />
        <DatePicker
          colorScheme='info'
          onChange={handleValueChange}
          placeholder='Info DatePicker'
          value={value}
        />
        <DatePicker
          colorScheme='warning'
          onChange={handleValueChange}
          placeholder='Warning DatePicker'
          value={value}
        />
        <DatePicker
          colorScheme='error'
          onChange={handleValueChange}
          placeholder='Error DatePicker'
          value={value}
        />
        <DatePicker
          colorScheme='success'
          onChange={handleValueChange}
          placeholder='Success DatePicker'
          value={value}
        />
      </div>
    )
  },
}

/**
 * DatePicker configured for selecting a range of dates.
 */
export const RangeSelection: Story = {
  args: {
    ...Default.args,
    isRange: true,
  },
}

/**
 * DatePicker with minimum and maximum selectable dates.
 */
export const WithMinMaxDates: Story = {
  args: {
    ...Default.args,
    minDate: new Date(),
    maxDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 15),
  },
}

/**
 * DatePicker with footer actions.
 */
export const WithFooterActions: Story = {
  args: {
    ...Default.args,
    showFooter: true,
  },
  decorators: [(Story) => <div className='pb-[10rem]'>{Story()}</div>],
}

/**
 * DatePicker localized to Spanish through **config**.
 * Every key is optional: `language` alone localizes the month and weekday names and the date format,
 * and `footer` only needs the labels you want to change.
 */
export const CustomConfiguration: Story = {
  args: {
    ...Default.args,
    showFooter: true,
    config: {
      language: 'es',
      footer: {
        cancel: 'Cancelar',
        apply: 'Aplicar',
      },
    },
  },
}

/**
 * Give the `DatePicker` its parts to choose what it shows and in which order. The props of the field, here its
 * placeholder, go on the `DatePickerInput`, the look (here small and filled) on the `DatePicker`, and the
 * `DatePickerCalendar` opens under it. The state is shared, so picking a day in the calendar updates the field.
 */
export const Compound: Story = {
  render: ({ onChange }) => (
    <DatePicker
      config={{ language: 'en' }}
      onChange={onChange}
      size='sm'
      value={defaultDateRangeValue}
      variant='filled'
    >
      <DatePickerInput placeholder='Pick a day' />
      <DatePickerCalendar />
    </DatePicker>
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
  isRange
  value={value}
  onChange={handleValueChange}
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
        isRange
        onChange={handleValueChange}
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
  args: {
    ...Default.args,
    disabled: true,
  },
}

/**
 * Some examples of DatePicker with custom classes from tailwind.
 * Set **variant="unstyled"** so Plume styles don't override your utility classes.
 *
 * Note: `className` only restyles the **input trigger**, and with `variant="unstyled"` the calendar
 * keeps just its structural styles. It is themed through `colorScheme` and the
 * `--datepicker-*` CSS variables (see the **Calendar Theming** story).
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<DatePicker
  variant="unstyled"
  placeholder="Pick a date"
  value={value}
  onChange={handleValueChange}
  className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
/>
<DatePicker
  variant="unstyled"
  placeholder="Pill date"
  value={value}
  onChange={handleValueChange}
  className="block w-full rounded-full border border-gray-200 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
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
      <div className='flex flex-col gap-4 w-72 max-w-full'>
        <DatePicker
          className='block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white'
          onChange={handleValueChange}
          placeholder='Pick a date'
          value={value}
          variant='unstyled'
        />
        <DatePicker
          className='block w-full rounded-full border border-gray-200 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white'
          onChange={handleValueChange}
          placeholder='Pill date'
          value={value}
          variant='unstyled'
        />
      </div>
    )
  },
}

/**
 * Some examples of DatePicker with custom classes from bootstrap.
 * Set **variant="unstyled"** so Plume styles don't override the bootstrap classes.
 *
 * Note: `variant` and `className` only restyle the **input trigger**. The calendar
 * popup keeps its structural styles and is themed through `colorScheme` and the
 * `--datepicker-*` CSS variables (see the **Calendar Theming** story).
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<DatePicker
  variant="unstyled"
  className="form-control"
  placeholder="Default date"
  value={value}
  onChange={handleValueChange}
/>
<DatePicker
  variant="unstyled"
  className="form-control form-control-lg"
  placeholder="Large date"
  value={value}
  onChange={handleValueChange}
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
      <div className='d-flex flex-column gap-3' style={{ width: '18rem', maxWidth: '100%' }}>
        <DatePicker
          className='form-control'
          onChange={handleValueChange}
          placeholder='Default date'
          value={value}
          variant='unstyled'
        />
        <DatePicker
          className='form-control form-control-lg'
          onChange={handleValueChange}
          placeholder='Large date'
          value={value}
          variant='unstyled'
        />
      </div>
    )
  },
}
