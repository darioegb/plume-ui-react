import type { StoryObj, Meta } from '@storybook/react-vite'
import type { CSSProperties } from 'react'
import { useState } from 'react'
import { DatePicker } from '..'
import type { DateRange } from '../datepicker'

const defaultDateRangeValue = { startDate: null, endDate: null }

/**
 * DatePicker Component allows users to select dates from a calendar interface.
 * It supports single and range selection modes, configurable color schemes, and localization options.
 */
export default {
  title: 'Components/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  decorators: [(Story) => <div className='pb-[22rem]'>{Story()}</div>],
  parameters: {
    docs: {
      toc: {
        title: 'On this page',
        disable: false,
      },
    },
    layout: 'centered',
  },
  argTypes: {
    value: {
      control: 'object',
      description: 'The DatePicker value.',
      table: {
        type: { summary: 'DateRange' },
      },
    },
    isCalendar: {
      control: 'boolean',
      description: "Indicates whether the DatePicker it's just a  static calendar.",
      table: {
        type: { summary: 'boolean' },
      },
    },
    isRange: {
      control: 'boolean',
      description: 'Indicates whether the DatePicker allows selecting a range of dates.',
      table: {
        type: { summary: 'boolean' },
      },
    },
    colorScheme: {
      control: 'select',
      description: 'Custom color scheme for the DatePicker.',
      options: ['primary', 'secondary', 'info', 'warning', 'error', 'success', 'dark', 'light'],
      table: {
        type: { summary: 'string' },
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
      description: 'The display format date.',
    },
    maxDate: {
      control: 'date',
      description: 'The maximum selectable date.',
      table: {
        type: { summary: 'Date' },
      },
    },
    minDate: {
      control: 'date',
      description: 'The minimum selectable date.',
      table: {
        type: { summary: 'Date' },
      },
    },
    showFooter: {
      control: 'boolean',
      description: 'Indicates whether to display the footer with actions.',
      table: {
        type: { summary: 'boolean' },
      },
    },
    config: {
      control: 'object',
      description: 'Additional configuration options for the DatePicker.',
      table: {
        type: { summary: 'DatePickerConfig' },
      },
    },
    readOnly: {
      control: 'boolean',
      description: 'Indicates whether the DatePicker is readOnly.',
      table: {
        defaultValue: { summary: false },
        type: { summary: 'boolean' },
      },
    },
    shape: {
      control: 'inline-radio',
      description: 'Shape style of the DatePicker.',
      options: ['pill', 'rounded'],
      if: { arg: 'variant', eq: 'outline' },
      table: {
        type: { summary: `"pill" | "rounded"` },
      },
    },
    size: {
      control: 'radio',
      description: 'Size of the DatePicker.',
      options: ['sm', 'md', 'lg'],
      table: {
        type: { summary: `"sm" | "md" | "lg"` },
      },
    },
    variant: {
      control: 'select',
      description: 'Visual style variant of the DatePicker.',
      options: ['outline', 'underline', 'filled', 'unstyled'],
      table: {
        type: { summary: `"outline" | "underline" | "filled" | "unstyled"` },
      },
    },
    onChange: {
      action: 'changed',
      description: 'Function triggered when the selected date(s) change.',
    },
  },
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
 * DatePicker with custom configuration.
 */
export const CustomConfiguration: Story = {
  args: {
    ...Default.args,
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
 * Some examples of DatePicker with custom classes from tailwind.
 * Set **variant="unstyled"** so Plume styles don't override your utility classes.
 *
 * Note: `variant` and `className` only restyle the **input trigger**. The calendar
 * popup keeps its structural styles and is themed through `colorScheme` and the
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
