import type { StoryObj, Meta } from '@storybook/react-vite'
import { useEffect, useState } from 'react'
import { defaultTheme } from '../../../../theme'
import { ProgressBar } from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

/**
 * Shows how far a task has got: an upload, a form with several steps, a quota. Use `indeterminate` when you can't
 * tell how long it will take.
 *
 * It has `role="progressbar"` with `aria-valuenow`, `aria-valuemin` (always `0`) and `aria-valuemax`. A progress bar
 * needs a name, so give it an `aria-label` or an `aria-labelledby`, and `valueText` when the percentage is not the
 * best way to say it ("3 of 10 files"). The value is kept between `0` and `max`. An indeterminate bar has no
 * `aria-valuenow`, which is how screen readers know it is busy. The transitions and the stripes stop with
 * `prefers-reduced-motion`, and an indeterminate bar then shows a still segment.
 */
export default {
  title: 'Components/ProgressBar',
  component: ProgressBar,
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
      description: 'Custom CSS class for the track, the box that holds the bar.',
      table: { type: { summary: 'string' } },
    },
    indicatorClassName: {
      control: 'text',
      description:
        'Custom CSS class for the bar that fills the track, in every variant. With `variant="unstyled"` it is the only class the bar has; its width is set for you.',
      table: { type: { summary: 'string' } },
    },
    style: {
      control: false,
      description:
        'Inline styles for the track. They are applied after the color variables, so they can override them (e.g. `--progressbar-solid`).',
      table: { type: { summary: 'CSSProperties' } },
    },
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'How much is done, from `0` to `max`. A value out of range is kept inside it.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '0' } },
    },
    max: {
      control: 'number',
      description:
        'The value that means the task is done. It has to be positive, or it falls back to `100`.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '100' } },
    },
    indeterminate: {
      control: 'boolean',
      description:
        'For a task of unknown length. The bar moves back and forth and the progress bar has no value.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    animated: {
      control: 'boolean',
      description: 'Moves the stripes. It only applies to the `striped` variant.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    showValue: {
      control: 'boolean',
      description:
        'Shows the percentage next to the bar. The text is hidden from screen readers, who already get the value from the progress bar. An indeterminate bar has no text.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    formatValue: {
      control: false,
      description:
        'Returns the text that **showValue** shows, from the value (kept between 0 and `max`) and the `max`.',
      table: {
        type: { summary: '(value: number, max: number) => string' },
        defaultValue: { summary: '(v, max) => `${Math.round((v / max) * 100)}%`' },
      },
    },
    valueClassName: {
      control: 'text',
      description: 'Custom CSS class for the text of **showValue**.',
      table: { type: { summary: 'string' } },
    },
    valueText: {
      control: 'text',
      description: 'A text for the value, when the number is not enough: `3 of 10 files`.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    colorScheme: {
      control: 'select',
      description: 'Color scheme from the theme palette, including custom schemes added to it.',
      options: colorSchemes,
      table: { type: { summary: 'ColorScheme' }, defaultValue: { summary: 'primary' } },
    },
    size: {
      control: 'radio',
      description: 'Thickness of the bar.',
      options: ['sm', 'md', 'lg'],
      table: { type: { summary: `"sm" | "md" | "lg"` }, defaultValue: { summary: 'md' } },
    },
    shape: {
      control: 'radio',
      description: 'Corners of the bar.',
      options: ['rounded', 'pill'],
      table: { type: { summary: `"rounded" | "pill"` }, defaultValue: { summary: 'pill' } },
    },
    variant: {
      control: 'radio',
      description:
        'Visual variant. `solid` fills the bar with one color and `striped` adds stripes. `unstyled` drops the Plume styles so you can bring your own.',
      options: ['solid', 'striped', 'unstyled'],
      table: {
        type: { summary: `"solid" | "striped" | "unstyled"` },
        defaultValue: { summary: 'solid' },
      },
    },
    id: {
      control: false,
      description: 'Id of the progress bar.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    title: {
      control: 'text',
      description: 'Native tooltip of the progress bar.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    hidden: {
      control: false,
      description: 'Hides the progress bar.',
      table: { category: 'HTML attributes', type: { summary: 'boolean' } },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible name of the progress bar. It needs this or `aria-labelledby`.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    'aria-labelledby': {
      control: false,
      description: 'Id of the element that names the progress bar.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
  },
  args: {
    'aria-label': 'Upload progress',
    style: { width: '20rem' },
    value: 40,
  },
} satisfies Meta<typeof ProgressBar>

type Story = StoryObj<typeof ProgressBar>

/**
 * This is the default ProgressBar.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick how the bar looks. `unstyled` drops the Plume styles so you can style it
 * yourself.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4" style={{ width: '20rem' }}>
      <ProgressBar aria-label="Solid" value={60} variant="solid" />
      <ProgressBar aria-label="Striped" value={60} variant="striped" />
      <ProgressBar
        aria-label="Unstyled"
        className="h-2 rounded bg-gray-200"
        indicatorClassName="rounded bg-black"
        value={60}
        variant="unstyled"
      />
    </div>
  ),
}

/**
 * Use the **size** prop to change the thickness of the bar.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4" style={{ width: '20rem' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <ProgressBar aria-label={size} key={size} size={size} value={60} />
      ))}
    </div>
  ),
}

/**
 * Use the **colorScheme** prop to pick a color from the theme.
 */
export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-3" style={{ width: '20rem' }}>
      {colorSchemes.map((scheme) => (
        <ProgressBar
          aria-label={scheme}
          colorScheme={scheme as keyof typeof defaultTheme.colors}
          key={scheme}
          value={60}
        />
      ))}
    </div>
  ),
}

/**
 * Use the **shape** prop to pick the corners: `pill` (the default) or `rounded`.
 */
export const Shapes: Story = {
  render: () => (
    <div className="flex flex-col gap-4" style={{ width: '20rem' }}>
      <ProgressBar aria-label="Pill" shape="pill" size="lg" value={60} />
      <ProgressBar aria-label="Rounded" shape="rounded" size="lg" value={60} />
    </div>
  ),
}

/**
 * Use **max** when the value is not a percentage, and **valueText** to say it in words. Screen readers read the
 * text instead of the number.
 */
export const WithMax: Story = {
  args: {
    'aria-label': 'Files uploaded',
    max: 10,
    value: 3,
    valueText: '3 of 10 files',
  },
}

/**
 * Use **showValue** to write the percentage next to the bar, and **formatValue** to say it in another way, for
 * example "3 of 10". The text is for the eyes only: screen readers read the value of the progress bar.
 */
export const ShowValue: Story = {
  render: () => (
    <div className="flex flex-col gap-3" style={{ maxWidth: '100%', width: '20rem' }}>
      <ProgressBar aria-label="Upload" showValue value={65} />
      <ProgressBar
        aria-label="Files uploaded"
        formatValue={(value, max) => `${value} of ${max}`}
        max={10}
        showValue
        value={3}
        valueText="3 of 10 files"
      />
    </div>
  ),
}

/**
 * `striped` adds stripes, and **animated** moves them.
 */
export const Striped: Story = {
  args: {
    animated: true,
    variant: 'striped',
  },
}

/**
 * Use **indeterminate** when you can't tell how long the task will take. The progress bar then has no value, which
 * is how assistive technology knows it is busy.
 */
export const Indeterminate: Story = {
  args: {
    'aria-label': 'Loading',
    indeterminate: true,
  },
}

function LiveBar(): React.ReactNode {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => setValue((current) => (current >= 100 ? 0 : current + 5)), 400)
    return () => clearInterval(timer)
  }, [])
  return (
    <ProgressBar
      aria-label="Upload progress"
      style={{ width: '20rem' }}
      value={value}
      valueText={`${value}%`}
    />
  )
}

/**
 * The bar follows `value` with a short transition, so it can be fed from state, an upload or a timer.
 */
export const Live: Story = {
  render: () => <LiveBar />,
}

/**
 * Some examples of ProgressBar with Tailwind classes. With `variant="unstyled"` the track and the bar have none of
 * the Plume classes and keep their structure: the bar fills the track and its width follows the value. `className`
 * styles the track and `indicatorClassName` the bar.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex w-80 flex-col gap-4">
  <ProgressBar
    aria-label="Storage"
    className="h-2 rounded-full bg-surface-muted"
    indicatorClassName="rounded-full bg-primary-solid"
    value={70}
    variant="unstyled"
  />
  <ProgressBar
    aria-label="Quota"
    className="h-4 rounded-md border border-border bg-surface"
    indicatorClassName="bg-emerald-500"
    value={35}
    variant="unstyled"
  />
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <ProgressBar
        aria-label="Storage"
        className="h-2 rounded-full bg-surface-muted"
        indicatorClassName="rounded-full bg-primary-solid"
        value={70}
        variant="unstyled"
      />
      <ProgressBar
        aria-label="Quota"
        className="h-4 rounded-md border border-border bg-surface"
        indicatorClassName="bg-emerald-500"
        value={35}
        variant="unstyled"
      />
    </div>
  ),
}

/**
 * Some examples of ProgressBar with Bootstrap classes: `progress` on the track and `progress-bar` with a `bg-*`
 * color on the bar, plus `progress-bar-striped` and `progress-bar-animated` for the stripes.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="d-flex flex-column gap-3" style={{ width: "20rem" }}>
  <ProgressBar aria-label="Storage" className="progress" indicatorClassName="progress-bar" value={70} variant="unstyled" />
  <ProgressBar
    aria-label="Quota"
    className="progress"
    indicatorClassName="progress-bar bg-success progress-bar-striped progress-bar-animated"
    value={35}
    variant="unstyled"
  />
</div>`,
      },
    },
  },
  render: () => (
    <div className="d-flex flex-column gap-3" style={{ width: '20rem' }}>
      <ProgressBar
        aria-label="Storage"
        className="progress"
        indicatorClassName="progress-bar"
        value={70}
        variant="unstyled"
      />
      <ProgressBar
        aria-label="Quota"
        className="progress"
        indicatorClassName="progress-bar bg-success progress-bar-striped progress-bar-animated"
        value={35}
        variant="unstyled"
      />
    </div>
  ),
}
