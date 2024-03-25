import type { StoryObj, Meta } from '@storybook/react'
import { DatePicker } from '..'

/**
 * DatePicker Component allows users to select dates from a calendar interface.
 * It supports single and range selection modes, configurable color schemes, and localization options.
 */
export default {
  title: 'Components/Form/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  decorators: [(Story) => <div className="pb-[22rem]">{Story()}</div>],
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
    startDate: {
      control: 'date',
      description: 'The start date of the selected range.',
      table: {
        type: { summary: 'Date' },
      },
    },
    endDate: {
      control: 'date',
      description: 'The end date of the selected range.',
      table: {
        type: { summary: 'Date' },
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
    showFooter: false,
  },
} as Meta<typeof DatePicker>

type Story = StoryObj<typeof DatePicker>

/**
 * This is the default DatePicker.
 */
export const Default: Story = {}

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
/>
<DatePicker 
  colorScheme="secondary"
  placeholder="Secondary DatePicker"
/>
<DatePicker 
  colorScheme="info"
  placeholder="Info DatePicker"
/>
<DatePicker 
  colorScheme="warning"
  placeholder="Warning DatePicker"
/>
<DatePicker 
  colorScheme="error"
  placeholder="Error DatePicker"
/>
<DatePicker 
  colorScheme="success"
  placeholder="Success DatePicker"
/>
<DatePicker 
  colorScheme="dark"
  placeholder="Dark DatePicker"
/>
<DatePicker 
  colorScheme="light"
  placeholder="Light DatePicker"
/>
          `,
      },
    },
  },
  render: () => (
    <div className="grid gap-4 grid-cols-2">
      <DatePicker placeholder="Default DatePicker" />
      <DatePicker colorScheme="primary" placeholder="Primary DatePicker" />
      <DatePicker colorScheme="secondary" placeholder="Secondary DatePicker" />
      <DatePicker colorScheme="info" placeholder="Info DatePicker" />
      <DatePicker colorScheme="warning" placeholder="Warning DatePicker" />
      <DatePicker colorScheme="error" placeholder="Error DatePicker" />
      <DatePicker colorScheme="success" placeholder="Success DatePicker" />
      <DatePicker colorScheme="dark" placeholder="Dark DatePicker" />
      <DatePicker colorScheme="light" placeholder="Light DatePicker" />
    </div>
  ),
}

/**
 * DatePicker configured for selecting a range of dates.
 */
export const RangeSelection: Story = {
  args: {
    isRange: true,
  },
}

/**
 * DatePicker with minimum and maximum selectable dates.
 */
export const WithMinMaxDates: Story = {
  args: {
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
    disabled: true,
  },
}

/**
 * DatePicker with footer actions.
 */
export const WithFooterActions: Story = {
  args: {
    showFooter: true,
  },
  decorators: [(Story) => <div className="pb-[10rem]">{Story()}</div>],
}

/**
 * DatePicker with custom configuration.
 */
export const CustomConfiguration: Story = {
  args: {
    config: {
      language: 'es',
      footer: {
        cancel: 'Cancelar',
        apply: 'Aplicar',
      },
    },
  },
}
