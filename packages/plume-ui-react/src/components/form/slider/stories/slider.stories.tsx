import type { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { defaultTheme } from '../../../../theme'
import { Field } from '../../field'
import { Slider, type SliderValue } from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

const frame = { maxWidth: '100%', width: '22rem' }

const stack = (gap: string): React.CSSProperties => ({
  display: 'flex',
  flexDirection: 'column',
  gap,
  ...frame,
})

/**
 * A control to pick a number, or a range of two, by dragging a thumb along a track. Use it for a value where the
 * exact number matters less than the position, like a volume, a price range or a zoom.
 *
 * Every thumb is a native `<input type="range">`, so the browser brings the keyboard (<kbd>←</kbd> <kbd>→</kbd>
 * <kbd>↑</kbd> <kbd>↓</kbd>, <kbd>Home</kbd>, <kbd>End</kbd>, <kbd>PageUp</kbd> and <kbd>PageDown</kbd>), the
 * touch support, the role `slider` with `aria-valuenow`, `aria-valuemin` and `aria-valuemax`, and the value in a
 * form. Plume draws the track, the filled part and the marks around it. Name it with an `aria-label`, or with a
 * `Field` label, which also gives it its description, disabled and invalid state like any other control; the `ref`
 * goes to the input, so it works with `register` of react-hook-form. Use **formatValue** when the number is not the
 * best way to say the value ("$40"): screen readers read it as the value text.
 *
 * **Range.** Pass an array of two numbers in **value** or **defaultValue** and the slider has two thumbs, named
 * "Minimum" and "Maximum" inside a group that takes the name you give it. The thumbs can't cross. Pressing on the
 * track moves the nearest thumb. **onValueChange** then gets a pair too. In a form both thumbs are sent with the
 * same **name**.
 *
 * **onValueChange** is called while the user drags; use **onValueCommit** to act only on the final value, for
 * example to fetch results.
 *
 * With `variant="unstyled"` only the native inputs are rendered, with the classes you give them in
 * `classNames.thumb`: the track, the filled part and the marks are Plume's, and they go away. A range then shows
 * two stacked inputs, so style them as one control or use the `solid` and `outline` variants.
 */
export default {
  title: 'Components/Slider',
  component: Slider,
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
  argTypes: {
    className: {
      control: 'text',
      description: 'Custom CSS class for the root.',
      table: { type: { summary: 'string' } },
    },
    classNames: {
      control: false,
      description:
        'Custom CSS classes for the parts: `track`, `range` (the filled part), `thumb` (the native input), `mark` and `markLabel`.',
      table: { type: { summary: 'Partial<Record<SliderPart, string>>' } },
    },
    style: {
      control: false,
      description:
        'Inline styles for the root. They are applied after the color variables, so they can override them (e.g. `--slider-solid`).',
      table: { type: { summary: 'CSSProperties' } },
    },
    value: {
      control: false,
      description:
        'The value: a number, or a pair of numbers for a range. Makes the Slider controlled: pass `onValueChange` to update it.',
      table: { type: { summary: 'number | [number, number]' } },
    },
    defaultValue: {
      control: 'number',
      description:
        'The value when the Slider is not controlled: a number, or a pair for a range. It starts at the minimum without it.',
      table: { type: { summary: 'number | [number, number]' } },
    },
    onValueChange: {
      control: false,
      description:
        'Called with the new value, a number or a pair, while the user drags or presses a key.',
      table: { category: 'Events', type: { summary: '(value: SliderValue) => void' } },
    },
    onValueCommit: {
      control: false,
      description:
        'Called with the final value when the user lets go of a thumb or releases a key.',
      table: { category: 'Events', type: { summary: '(value: SliderValue) => void' } },
    },
    min: {
      control: 'number',
      description: 'The smallest value.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '0' } },
    },
    max: {
      control: 'number',
      description: 'The largest value.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '100' } },
    },
    step: {
      control: 'number',
      description: 'The distance between two values. The value snaps to it.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '1' } },
    },
    marks: {
      control: false,
      description:
        'Shows marks on the track. `true` puts one on every step, a list of numbers puts them there, and a list of `{ value, label }` also writes a label under each. They are hidden from assistive technology.',
      table: { type: { summary: 'boolean | number[] | { value: number; label?: ReactNode }[]' } },
    },
    orientation: {
      control: 'radio',
      description:
        'Direction of the track. A vertical slider is 12rem high, and its minimum is at the bottom.',
      options: ['horizontal', 'vertical'],
      table: {
        type: { summary: `"horizontal" | "vertical"` },
        defaultValue: { summary: 'horizontal' },
      },
    },
    formatValue: {
      control: false,
      description: 'Returns the text for a value, which screen readers read: `$40`.',
      table: { type: { summary: '(value: number) => string' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the slider.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    readOnly: {
      control: 'boolean',
      description:
        'Shows the value without letting the user change it. It stays reachable, and has `aria-readonly`.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    invalid: {
      control: 'boolean',
      description: 'Marks the slider as invalid: it turns to the error color.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    colorScheme: {
      control: 'select',
      description: 'Color scheme from the theme palette, including custom schemes added to it.',
      options: colorSchemes,
      table: { type: { summary: 'ColorScheme' }, defaultValue: { summary: 'primary' } },
    },
    size: {
      control: 'radio',
      description: 'Size of the thumb and the track.',
      options: ['sm', 'md', 'lg'],
      table: { type: { summary: `"sm" | "md" | "lg"` }, defaultValue: { summary: 'md' } },
    },
    variant: {
      control: 'radio',
      description:
        'Visual variant. `solid` has a thick track and a filled thumb, `outline` a thin track and a hollow thumb. `unstyled` renders only the native inputs, so you can bring your own styles.',
      options: ['solid', 'outline', 'unstyled'],
      table: {
        type: { summary: `"solid" | "outline" | "unstyled"` },
        defaultValue: { summary: 'solid' },
      },
    },
    id: {
      control: false,
      description:
        'Id of the input. A range gives the second thumb the same id with `-1` at the end.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    name: {
      control: 'text',
      description: 'Name of the input in a form. A range sends both values with the same name.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    title: {
      control: 'text',
      description: 'Native tooltip of the Slider.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    hidden: {
      control: false,
      description: 'Hides the Slider.',
      table: { category: 'HTML attributes', type: { summary: 'boolean' } },
    },
    'aria-label': {
      control: 'text',
      description:
        'Accessible name of the slider. In a range it names the group, and the thumbs are named from `labels.thumb`.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    'aria-labelledby': {
      control: false,
      description: 'Id of the element that names the slider (or the group of a range).',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    'aria-describedby': {
      control: false,
      description: 'Id of the element that describes the slider. A `Field` sets it.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    'aria-invalid': {
      control: false,
      description: 'Marks the slider as invalid. A `Field` with an error sets it.',
      table: { category: 'Accessibility', type: { summary: 'boolean | "true" | "false"' } },
    },
    labels: {
      control: false,
      description:
        'The texts of the Slider, for other languages: `thumb(index)` is the accessible name of a thumb of a range, from its index (`Minimum` and `Maximum` by default).',
      table: {
        category: 'Accessibility',
        type: { summary: 'Partial<SliderLabels>' },
      },
    },
  },
  args: {
    'aria-label': 'Volume',
    defaultValue: 40,
    style: frame,
  },
} satisfies Meta<typeof Slider>

type Story = StoryObj<typeof Slider>

/**
 * This is the default Slider, from 0 to 100.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick how the Slider looks. `unstyled` renders only the native input, to style it
 * yourself.
 */
export const Variants: Story = {
  render: () => (
    <div style={stack('1.5rem')}>
      {(['solid', 'outline'] as const).map((variant) => (
        <Slider aria-label={variant} defaultValue={40} key={variant} variant={variant} />
      ))}
      <Slider
        aria-label="unstyled"
        classNames={{ thumb: 'w-full accent-purple-600' }}
        defaultValue={40}
        variant="unstyled"
      />
    </div>
  ),
}

/**
 * Use the **size** prop to change the size of the thumb and the track.
 */
export const Sizes: Story = {
  render: () => (
    <div style={stack('1.5rem')}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Slider aria-label={`Size ${size}`} defaultValue={40} key={size} size={size} />
      ))}
    </div>
  ),
}

/**
 * Use the **colorScheme** prop to pick a color from the theme. It colors the filled part and the thumb.
 */
export const Colors: Story = {
  render: () => (
    <div style={stack('1rem')}>
      {colorSchemes.map((scheme) => (
        <Slider
          aria-label={scheme}
          colorScheme={scheme as keyof typeof defaultTheme.colors}
          defaultValue={60}
          key={scheme}
          size="sm"
        />
      ))}
    </div>
  ),
}

/**
 * Pass a pair in **defaultValue** or **value** for a range with two thumbs. They are named "Minimum" and
 * "Maximum" (change it with **labels.thumb**) inside a group named by the `aria-label`, and they can't cross.
 */
export const Range: Story = {
  args: {
    'aria-label': 'Price',
    defaultValue: [20, 70],
    formatValue: (value: number) => `$${value}`,
  },
}

/**
 * **step** sets the distance between values, and **marks** shows them on the track. Use a list of
 * `{ value, label }` to write something under a mark.
 */
export const Marks: Story = {
  render: () => (
    <div style={stack('3rem')}>
      <Slider aria-label="Every step" defaultValue={30} marks max={50} step={10} />
      <Slider
        aria-label="Temperature"
        defaultValue={20}
        formatValue={(value) => `${value} degrees`}
        marks={[
          { label: '0°', value: 0 },
          { label: '20°', value: 20 },
          { label: '50°', value: 50 },
          { label: '100°', value: 100 },
        ]}
      />
      <Slider aria-label="Budget" defaultValue={[25, 75]} marks={[0, 25, 50, 75, 100]} step={25} />
    </div>
  ),
}

/**
 * A vertical slider is 12rem high, with the minimum at the bottom. Use it where the height is the natural way to
 * think about the value, like a volume or a zoom.
 */
export const Vertical: Story = {
  render: () => (
    <div style={{ alignItems: 'flex-start', display: 'flex', gap: '3rem' }}>
      <Slider aria-label="Volume" defaultValue={40} orientation="vertical" style={undefined} />
      <Slider
        aria-label="Range"
        defaultValue={[20, 70]}
        marks={[
          { label: 'Low', value: 0 },
          { label: 'High', value: 100 },
        ]}
        orientation="vertical"
        style={undefined}
      />
    </div>
  ),
}

function ControlledSlider(): React.ReactNode {
  const [value, setValue] = useState<SliderValue>(40)
  return (
    <div style={stack('0.75rem')}>
      <Slider aria-label="Opacity" onValueChange={setValue} value={value} />
      <p className="text-sm">Opacity: {String(value)}%</p>
      <div className="flex gap-2">
        {[0, 50, 100].map((preset) => (
          <button
            className="rounded border border-gray-400 px-2 py-1 text-sm"
            key={preset}
            onClick={() => setValue(preset)}
            type="button"
          >
            {preset}%
          </button>
        ))}
      </div>
    </div>
  )
}

/**
 * Pass **value** and **onValueChange** to control the Slider, for example to show the number or to set it from
 * outside.
 */
export const Controlled: Story = {
  render: () => <ControlledSlider />,
}

function CommitSlider(): React.ReactNode {
  const [value, setValue] = useState<SliderValue>(30)
  const [committed, setCommitted] = useState<SliderValue>(30)
  return (
    <div style={stack('0.75rem')}>
      <Slider
        aria-label="Zoom"
        onValueChange={setValue}
        onValueCommit={setCommitted}
        value={value}
      />
      <p className="text-sm">
        Dragging: {String(value)}. Last committed: {String(committed)}.
      </p>
    </div>
  )
}

/**
 * **onValueChange** fires all the time while the user drags. Use **onValueCommit** to act once, with the final
 * value: to save it or to fetch results.
 */
export const Commit: Story = {
  render: () => <CommitSlider />,
}

/**
 * A disabled slider can't be used. A read only one shows the value, can be focused and says so with
 * `aria-readonly`.
 */
export const Disabled: Story = {
  render: () => (
    <div style={stack('1.5rem')}>
      <Slider aria-label="Disabled" defaultValue={40} disabled />
      <Slider aria-label="Read only" defaultValue={40} readOnly />
    </div>
  ),
}

/**
 * **invalid** (or `aria-invalid`) turns the slider to the error color.
 */
export const Invalid: Story = {
  args: { invalid: true },
}

/**
 * Inside a `Field` it gets its label, its helper and error text, and the disabled, read only and invalid states.
 */
export const WithField: Story = {
  render: () => (
    <div style={stack('1.5rem')}>
      <Field helperText="Between 0 and 100" label="Volume">
        <Slider defaultValue={40} />
      </Field>
      <Field errorText="Choose a lower price" label="Price" required>
        <Slider defaultValue={[20, 90]} />
      </Field>
    </div>
  ),
}

/**
 * Some examples of Slider with Tailwind classes. With `variant="unstyled"` only the native input is rendered, so
 * Tailwind's `accent-*` utilities color it, and `classNames.thumb` is where its classes go.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Slider
  aria-label="Volume"
  classNames={{ thumb: "h-2 w-full cursor-pointer accent-primary-solid" }}
  defaultValue={40}
  variant="unstyled"
/>`,
      },
    },
  },
  render: () => (
    <div style={stack('1.5rem')}>
      <Slider
        aria-label="Volume"
        classNames={{ thumb: 'h-2 w-full cursor-pointer accent-primary-solid' }}
        defaultValue={40}
        variant="unstyled"
      />
      <Slider
        aria-label="Quality"
        classNames={{ thumb: 'h-2 w-full cursor-pointer accent-success-solid' }}
        defaultValue={70}
        variant="unstyled"
      />
    </div>
  ),
}

/**
 * Some examples of Slider with Bootstrap classes: `form-range` styles the native input. Bootstrap's own range
 * can't have two thumbs, which is one reason to use Plume's variants for a range.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Slider
  aria-label="Volume"
  classNames={{ thumb: "form-range" }}
  defaultValue={40}
  variant="unstyled"
/>`,
      },
    },
  },
  render: () => (
    <div style={stack('1.5rem')}>
      <Slider
        aria-label="Volume"
        classNames={{ thumb: 'form-range' }}
        defaultValue={40}
        variant="unstyled"
      />
      <Slider
        aria-label="Quality"
        classNames={{ thumb: 'form-range' }}
        defaultValue={70}
        variant="unstyled"
      />
    </div>
  ),
}
