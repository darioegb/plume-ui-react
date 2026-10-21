import type { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { defaultTheme } from '../../../../theme'
import { Step, StepDescription, StepIndicator, Stepper, StepSeparator, StepTitle } from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

const steps = [
  { description: 'Your email and password', title: 'Account' },
  { description: 'Tell us about you', title: 'Profile' },
  { description: 'Check everything', title: 'Review' },
]

function renderSteps(withDescription = true): React.ReactNode {
  return steps.map(({ description, title }) => (
    <Step key={title}>
      <StepIndicator />
      <StepTitle>{title}</StepTitle>
      {withDescription ? <StepDescription>{description}</StepDescription> : null}
      <StepSeparator />
    </Step>
  ))
}

/**
 * A row (or a column) of numbered steps that shows how far the user is in a process, like a checkout or a setup
 * wizard. The Stepper shows the progress; the content of each step and the buttons to move are yours.
 *
 * It is an ordered list: every `Step` is a `<li>`, and the one the user is on has `aria-current="step"`. A screen
 * reader says "Completed" for the steps already done and "Not started" for the ones to come, which you can
 * translate with `statusLabels`. The numbers, the check and the separators are decorative and hidden from
 * assistive technology. The state is also in `data-state` (`completed`, `current` or `upcoming`) on the step, the
 * indicator, the title, the description and the separator, so you can style any of them.
 *
 * **activeStep** is the index (starting at 0) of the current step. Everything before it is completed, and an index
 * past the last step completes them all. Every child of the Stepper is one step, and it takes its position from
 * where it is: a `Step` can be wrapped in a component of your own that renders a single one, but a component that
 * renders several counts as one, so map the steps inline instead.
 *
 * With `orientation="horizontal"` (the default) the steps share the width. On a screen narrower than 640px only
 * the current step keeps its title and description visible (the others stay for screen readers), so the row fits;
 * `vertical` has room for all of them.
 *
 * ### Subcomponents
 *
 * | Component | Props |
 * | --- | --- |
 * | `Step` | `id`, `title`, `hidden`, `className`, `style`, `children`. One `<li>`. It has `data-state`. |
 * | `StepIndicator` | `className`, `style`, `children`. The circle: the number, or a check when the step is completed. `children` replaces the content, for example with an icon. |
 * | `StepTitle` | `id`, `title`, `className`, `style`, `children`. The name of the step. |
 * | `StepDescription` | `id`, `title`, `className`, `style`, `children`. A line of detail under the title. |
 * | `StepSeparator` | `className`, `style`. The line to the next step. The last one is not shown. |
 */
export default {
  title: 'Components/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  parameters: {
    docs: {
      importNames: [
        'Stepper',
        'Step',
        'StepIndicator',
        'StepTitle',
        'StepDescription',
        'StepSeparator',
      ],
      toc: {
        title: 'On this page',
        disable: false,
      },
    },
    layout: 'centered',
  },
  argTypes: {
    children: {
      control: false,
      description: 'The `Step` parts of the Stepper.',
      table: { type: { summary: 'ReactNode' } },
    },
    className: {
      control: 'text',
      description: 'Custom CSS class for the Stepper.',
      table: { type: { summary: 'string' } },
    },
    style: {
      control: false,
      description:
        'Inline styles for the Stepper. They are applied after the color variables, so they can override them (e.g. `--stepper-solid`).',
      table: { type: { summary: 'CSSProperties' } },
    },
    activeStep: {
      control: { max: 3, min: 0, type: 'number' },
      description:
        'Index of the current step, starting at 0. The steps before it are completed and the ones after it are upcoming. An index past the last step completes all of them.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '0' } },
    },
    orientation: {
      control: 'radio',
      description: 'Whether the steps go in a row or in a column.',
      options: ['horizontal', 'vertical'],
      table: {
        type: { summary: `"horizontal" | "vertical"` },
        defaultValue: { summary: 'horizontal' },
      },
    },
    statusLabels: {
      control: false,
      description:
        'The text a screen reader says for each status. Pass only the ones you want to change; use an empty string to say nothing for a status.',
      table: {
        type: { summary: 'Partial<Record<"completed" | "current" | "upcoming", string>>' },
        defaultValue: { summary: '{ completed: "Completed", upcoming: "Not started" }' },
      },
    },
    colorScheme: {
      control: 'select',
      description:
        'Color scheme from the theme palette, including custom schemes added to it. It colors the completed and the current steps.',
      options: colorSchemes,
      table: { type: { summary: 'ColorScheme' }, defaultValue: { summary: 'primary' } },
    },
    size: {
      control: 'radio',
      description: 'Size of the Stepper.',
      options: ['sm', 'md', 'lg'],
      table: { type: { summary: `"sm" | "md" | "lg"` }, defaultValue: { summary: 'md' } },
    },
    variant: {
      control: 'radio',
      description:
        'Visual variant. `solid` fills the indicators of the completed and current steps, `outline` only draws their border. `unstyled` drops the Plume styles so you can bring your own; the layout and the hidden last separator keep working.',
      options: ['solid', 'outline', 'unstyled'],
      table: {
        type: { summary: `"solid" | "outline" | "unstyled"` },
        defaultValue: { summary: 'solid' },
      },
    },
    id: {
      control: false,
      description: 'Id of the Stepper.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    title: {
      control: 'text',
      description: 'Native tooltip of the Stepper.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    hidden: {
      control: false,
      description: 'Hides the Stepper.',
      table: { category: 'HTML attributes', type: { summary: 'boolean' } },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible name of the list, for example "Checkout progress".',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    'aria-labelledby': {
      control: false,
      description: 'Id of the element that names the list.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
  },
  args: {
    'aria-label': 'Sign up progress',
    activeStep: 1,
    children: renderSteps(),
    style: { width: '36rem', maxWidth: '100%' },
  },
} satisfies Meta<typeof Stepper>

type Story = StoryObj<typeof Stepper>

/**
 * This is the default Stepper: horizontal, with the second step as the current one.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick how the Stepper looks. `unstyled` drops the Plume styles so you can style it
 * yourself with the `data-state` of every part.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-8" style={{ width: '36rem', maxWidth: '100%' }}>
      <Stepper activeStep={1} aria-label="Solid" variant="solid">
        {renderSteps(false)}
      </Stepper>
      <Stepper activeStep={1} aria-label="Outline" variant="outline">
        {renderSteps(false)}
      </Stepper>
      <Stepper activeStep={1} aria-label="Unstyled" variant="unstyled">
        {steps.map(({ title }) => (
          <Step className="flex-1" key={title}>
            <StepIndicator className="mr-2 font-bold data-[state=completed]:text-green-600" />
            <StepTitle className="data-[state=current]:font-bold">{title}</StepTitle>
          </Step>
        ))}
      </Stepper>
    </div>
  ),
}

/**
 * Use the **size** prop to change the size.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-8" style={{ width: '36rem', maxWidth: '100%' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Stepper activeStep={1} aria-label={`Size ${size}`} key={size} size={size}>
          {renderSteps(false)}
        </Stepper>
      ))}
    </div>
  ),
}

/**
 * Use the **colorScheme** prop to pick a color from the theme. It colors the completed and the current steps.
 */
export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-6" style={{ width: '36rem', maxWidth: '100%' }}>
      {colorSchemes.map((scheme) => (
        <Stepper
          activeStep={1}
          aria-label={scheme}
          colorScheme={scheme as keyof typeof defaultTheme.colors}
          key={scheme}
        >
          {renderSteps(false)}
        </Stepper>
      ))}
    </div>
  ),
}

/**
 * With `orientation="vertical"` the steps go in a column, which fits a narrow screen and long descriptions.
 */
export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    style: { width: '20rem', maxWidth: '100%' },
  },
}

/**
 * The steps before **activeStep** are completed and show a check, the current one has a ring, and the rest are
 * dimmed. An index past the last step completes all of them.
 */
export const Progress: Story = {
  render: () => (
    <div className="flex flex-col gap-8" style={{ width: '36rem', maxWidth: '100%' }}>
      {[0, 1, 2, 3].map((activeStep) => (
        <Stepper activeStep={activeStep} aria-label={`Step ${activeStep}`} key={activeStep}>
          {renderSteps(false)}
        </Stepper>
      ))}
    </div>
  ),
}

/**
 * Put anything in a **StepIndicator** to replace the number, for example an icon. The completed steps keep their
 * check unless you give them children too.
 */
export const CustomIndicator: Story = {
  render: () => (
    <Stepper activeStep={1} aria-label="Order" style={{ width: '36rem', maxWidth: '100%' }}>
      {[
        ['🛒', 'Cart'],
        ['📦', 'Shipping'],
        ['💳', 'Payment'],
      ].map(([icon, title]) => (
        <Step key={title}>
          <StepIndicator>{icon}</StepIndicator>
          <StepTitle>{title}</StepTitle>
          <StepSeparator />
        </Step>
      ))}
    </Stepper>
  ),
}

/**
 * Use **statusLabels** to translate what a screen reader says. Nothing is said for the current step because
 * `aria-current="step"` already announces it.
 */
export const StatusLabels: Story = {
  args: {
    statusLabels: { completed: 'Completado', upcoming: 'Pendiente' },
  },
}

function InteractiveStepper(): React.ReactNode {
  const [active, setActive] = useState(0)
  return (
    <div className="flex flex-col gap-6" style={{ width: '36rem', maxWidth: '100%' }}>
      <Stepper activeStep={active} aria-label="Sign up progress">
        {renderSteps(false)}
      </Stepper>
      <p className="text-sm">
        {active < steps.length
          ? `${steps[active].title}: ${steps[active].description}`
          : 'All done'}
      </p>
      <div className="flex gap-2">
        <button
          className="rounded border border-gray-400 px-3 py-1 text-sm disabled:opacity-50"
          disabled={active === 0}
          onClick={() => setActive(active - 1)}
          type="button"
        >
          Back
        </button>
        <button
          className="rounded border border-gray-400 px-3 py-1 text-sm disabled:opacity-50"
          disabled={active === steps.length}
          onClick={() => setActive(active + 1)}
          type="button"
        >
          {active === steps.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  )
}

/**
 * The Stepper doesn't move by itself: keep the index in your state and change it from your own buttons.
 */
export const Controlled: Story = {
  render: () => <InteractiveStepper />,
}

/**
 * Some examples of Stepper with Tailwind classes. With `variant="unstyled"` the Plume classes are gone and the
 * layout stays. Style every part from its own classes, with `data-[state=completed]:` and `data-[state=current]:`
 * for the state.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Stepper activeStep={1} aria-label="Sign up progress" className="w-[36rem] max-w-full text-sm text-foreground" variant="unstyled">
  <Step className="gap-x-3">
    <StepIndicator className="size-8 rounded-full border-2 border-border font-semibold data-[state=completed]:border-primary-solid data-[state=completed]:bg-primary-solid data-[state=completed]:text-primary-on-solid data-[state=current]:border-primary-solid data-[state=current]:text-primary-text" />
    <StepTitle className="font-medium data-[state=upcoming]:text-muted">Account</StepTitle>
    <StepSeparator className="h-0.5 bg-border data-[state=completed]:bg-primary-solid" />
  </Step>
  <Step className="gap-x-3">
    <StepIndicator className="size-8 rounded-full border-2 border-border font-semibold data-[state=completed]:border-primary-solid data-[state=completed]:bg-primary-solid data-[state=completed]:text-primary-on-solid data-[state=current]:border-primary-solid data-[state=current]:text-primary-text" />
    <StepTitle className="font-medium data-[state=upcoming]:text-muted">Profile</StepTitle>
    <StepSeparator className="h-0.5 bg-border data-[state=completed]:bg-primary-solid" />
  </Step>
  <Step className="gap-x-3">
    <StepIndicator className="size-8 rounded-full border-2 border-border font-semibold data-[state=completed]:border-primary-solid data-[state=completed]:bg-primary-solid data-[state=completed]:text-primary-on-solid data-[state=current]:border-primary-solid data-[state=current]:text-primary-text" />
    <StepTitle className="font-medium data-[state=upcoming]:text-muted">Review</StepTitle>
  </Step>
</Stepper>`,
      },
    },
  },
  render: () => (
    <Stepper
      activeStep={1}
      aria-label="Sign up progress"
      className="w-[36rem] max-w-full text-sm text-foreground"
      variant="unstyled"
    >
      {steps.map(({ title }, index) => (
        <Step className="gap-x-3" key={title}>
          <StepIndicator className="size-8 rounded-full border-2 border-border font-semibold data-[state=completed]:border-primary-solid data-[state=completed]:bg-primary-solid data-[state=completed]:text-primary-on-solid data-[state=current]:border-primary-solid data-[state=current]:text-primary-text" />
          <StepTitle className="font-medium data-[state=upcoming]:text-muted">{title}</StepTitle>
          {index < steps.length - 1 ? (
            <StepSeparator className="h-0.5 bg-border data-[state=completed]:bg-primary-solid" />
          ) : null}
        </Step>
      ))}
    </Stepper>
  ),
}

function BootstrapStepper(): React.ReactNode {
  const active = 1
  return (
    <Stepper
      activeStep={active}
      aria-label="Sign up progress"
      className="d-flex"
      style={{ width: '36rem', maxWidth: '100%' }}
      variant="unstyled"
    >
      {steps.map(({ title }, index) => {
        let badge = 'bg-secondary-subtle text-secondary-emphasis'
        if (index < active) badge = 'bg-success text-white'
        else if (index === active) badge = 'bg-primary text-white'
        return (
          <Step className="flex-fill align-items-center gap-2" key={title}>
            <StepIndicator
              className={`rounded-circle d-flex align-items-center justify-content-center ${badge}`}
              style={{ height: '2rem', width: '2rem' }}
            />
            <StepTitle className={index > active ? 'text-body-secondary' : 'fw-semibold'}>
              {title}
            </StepTitle>
            {index < steps.length - 1 ? (
              <StepSeparator className={`border-top ${index < active ? 'border-success' : ''}`} />
            ) : null}
          </Step>
        )
      })}
    </Stepper>
  )
}

/**
 * Some examples of Stepper with Bootstrap classes. Bootstrap has no stepper, so the story composes its utilities
 * (`d-flex`, `rounded-circle`, `border-top`...). Bootstrap can't style from a data attribute, so the story picks the class
 * of each part from the `activeStep` it already has.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `const active = 1

<Stepper activeStep={active} aria-label="Sign up progress" className="d-flex" variant="unstyled">
  <Step className="flex-fill align-items-center gap-2">
    <StepIndicator className="rounded-circle d-flex align-items-center justify-content-center bg-success text-white" style={{ height: "2rem", width: "2rem" }} />
    <StepTitle className="fw-semibold">Account</StepTitle>
    <StepSeparator className="border-top border-success" />
  </Step>
  <Step className="flex-fill align-items-center gap-2">
    <StepIndicator className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white" style={{ height: "2rem", width: "2rem" }} />
    <StepTitle className="fw-semibold">Profile</StepTitle>
    <StepSeparator className="border-top" />
  </Step>
  <Step className="flex-fill align-items-center gap-2">
    <StepIndicator className="rounded-circle d-flex align-items-center justify-content-center bg-secondary-subtle text-secondary-emphasis" style={{ height: "2rem", width: "2rem" }} />
    <StepTitle className="text-body-secondary">Review</StepTitle>
  </Step>
</Stepper>`,
      },
    },
  },
  render: () => <BootstrapStepper />,
}
