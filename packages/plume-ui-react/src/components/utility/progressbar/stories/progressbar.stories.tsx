import type { StoryObj, Meta } from '@storybook/react-vite'
import { useEffect, useState } from 'react'
import { defaultTheme } from '../../../../theme'
import { ProgressBar, ProgressBarIndicator, ProgressBarTrack, ProgressBarValue } from '..'

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
    className: { control: 'text' },
    style: { control: false },
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    max: { control: 'number' },
    indeterminate: { control: 'boolean' },
    animated: { control: 'boolean' },
    showValue: { control: 'boolean' },
    formatValue: { control: false },
    valueText: { control: 'text' },
    colorScheme: { control: 'select', options: colorSchemes },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    shape: { control: 'radio', options: ['rounded', 'pill'] },
    variant: { control: 'radio', options: ['solid', 'striped', 'unstyled'] },
    id: { control: false },
    title: { control: 'text' },
    hidden: { control: false },
    'aria-label': { control: 'text' },
    'aria-labelledby': { control: false },
  },
  args: {
    'aria-label': 'Upload progress',
    style: { maxWidth: '100%', width: '20rem' },
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
    <div className="flex flex-col gap-4" style={{ maxWidth: '100%', width: '20rem' }}>
      <ProgressBar aria-label="Solid" value={60} variant="solid" />
      <ProgressBar aria-label="Striped" value={60} variant="striped" />
      <ProgressBar
        aria-label="Unstyled"
        className="h-2 rounded bg-gray-200"
        value={60}
        variant="unstyled"
      >
        <ProgressBarIndicator className="rounded bg-black" />
      </ProgressBar>
    </div>
  ),
}

/**
 * Use the **size** prop to change the thickness of the bar.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4" style={{ maxWidth: '100%', width: '20rem' }}>
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
    <div className="flex flex-col gap-3" style={{ maxWidth: '100%', width: '20rem' }}>
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
    <div className="flex flex-col gap-4" style={{ maxWidth: '100%', width: '20rem' }}>
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
      style={{ maxWidth: '100%', width: '20rem' }}
      value={value}
      valueText={`${value}%`}
    />
  )
}

/**
 * The bar follows `value` with a short transition, so it can be fed from state, an upload or a timer.
 */
export const Live: Story = {
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => setValue((current) => (current >= 100 ? 0 : current + 5)), 400)
    return () => clearInterval(timer)
  }, [])
  return (
    <ProgressBar
      aria-label="Upload progress"
      style={{ maxWidth: '100%', width: '20rem' }}
      value={value}
      valueText={\`\${value}%\`}
    />
  )
}`,
      },
    },
  },
  render: () => <LiveBar />,
}

/**
 * Use the `ProgressBarTrack`, `ProgressBarIndicator` and `ProgressBarValue` parts to give each element its own
 * class or style, or to put the text with the value before the bar. With a `ProgressBarTrack` among its children,
 * the ProgressBar wraps them in an element that takes its `className` and `style`.
 */
export const Compound: Story = {
  parameters: {
    docs: {
      source: {
        code: `<ProgressBar aria-label="Upload" className="gap-3" value={65}>
  <ProgressBarValue className="font-semibold" />
  <ProgressBarTrack className="h-3">
    <ProgressBarIndicator className="bg-emerald-500" />
  </ProgressBarTrack>
</ProgressBar>`,
      },
    },
  },
  render: () => (
    <div style={{ maxWidth: '100%', width: '20rem' }}>
      <ProgressBar aria-label="Upload" className="gap-3" value={65}>
        <ProgressBarValue className="font-semibold" />
        <ProgressBarTrack className="h-3">
          <ProgressBarIndicator className="bg-emerald-500" />
        </ProgressBarTrack>
      </ProgressBar>
    </div>
  ),
}

/**
 * Some examples of ProgressBar with Tailwind classes. With `variant="unstyled"` the track and the bar have none of
 * the Plume classes and keep their structure: the bar fills the track and its width follows the value. `className`
 * styles the track and `ProgressBarIndicator` the bar.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex w-80 max-w-full flex-col gap-4">
  <ProgressBar aria-label="Storage" className="h-2 rounded-full bg-surface-muted" value={70} variant="unstyled">
    <ProgressBarIndicator className="rounded-full bg-primary-solid" />
  </ProgressBar>
  <ProgressBar aria-label="Quota" className="h-4 rounded-md border border-border bg-surface" value={35} variant="unstyled">
    <ProgressBarIndicator className="bg-emerald-500" />
  </ProgressBar>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex w-80 max-w-full flex-col gap-4">
      <ProgressBar
        aria-label="Storage"
        className="h-2 rounded-full bg-surface-muted"
        value={70}
        variant="unstyled"
      >
        <ProgressBarIndicator className="rounded-full bg-primary-solid" />
      </ProgressBar>
      <ProgressBar
        aria-label="Quota"
        className="h-4 rounded-md border border-border bg-surface"
        value={35}
        variant="unstyled"
      >
        <ProgressBarIndicator className="bg-emerald-500" />
      </ProgressBar>
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
  <ProgressBar aria-label="Storage" className="progress" value={70} variant="unstyled">
    <ProgressBarIndicator className="progress-bar" />
  </ProgressBar>
  <ProgressBar aria-label="Quota" className="progress" value={35} variant="unstyled">
    <ProgressBarIndicator className="progress-bar bg-success progress-bar-striped progress-bar-animated" />
  </ProgressBar>
</div>`,
      },
    },
  },
  render: () => (
    <div className="d-flex flex-column gap-3" style={{ maxWidth: '100%', width: '20rem' }}>
      <ProgressBar aria-label="Storage" className="progress" value={70} variant="unstyled">
        <ProgressBarIndicator className="progress-bar" />
      </ProgressBar>
      <ProgressBar aria-label="Quota" className="progress" value={35} variant="unstyled">
        <ProgressBarIndicator className="progress-bar bg-success progress-bar-striped progress-bar-animated" />
      </ProgressBar>
    </div>
  ),
}
