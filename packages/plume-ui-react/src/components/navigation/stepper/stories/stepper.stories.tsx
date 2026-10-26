import type { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { defaultTheme } from '../../../../theme'
import {
  Step,
  StepDescription,
  StepIndicator,
  StepIndicatorContent,
  StepIndicatorLabel,
  Stepper,
  StepSeparator,
  StepTitle,
} from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

const steps = [
  { description: 'Your email and password', title: 'Account' },
  { description: 'Tell us about you', title: 'Profile' },
  { description: 'Check everything', title: 'Review' },
]

const stack = (gap: string): React.CSSProperties => ({
  display: 'flex',
  flexDirection: 'column',
  gap,
  maxWidth: '100%',
  width: '36rem',
})

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
 * translate with `labels`. The numbers, the check and the separators are decorative and hidden from
 * assistive technology. The state is also in `data-state` (`completed`, `current` or `upcoming`) on the step, the
 * indicator, the title, the description and the separator, so you can style any of them.
 *
 * **activeStep** is the index (starting at 0) of the current step. Everything before it is completed, and an index
 * past the last step completes them all. Every child of the Stepper is one step, and it takes its position from
 * where it is: a `Step` can be wrapped in a component of your own that renders a single one, but a component that
 * renders several counts as one, so map the steps inline instead.
 *
 * With `orientation="horizontal"` (the default) the steps share the width. On a screen narrower than 640px only the title of the current step is shown, and the descriptions are hidden (screen readers still read them all),
 * so the row fits; `vertical` has room for the text.
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
    children: { control: false },
    className: { control: 'text' },
    style: { control: false },
    activeStep: { control: { max: 3, min: 0, type: 'number' } },
    orientation: { control: 'radio', options: ['horizontal', 'vertical'] },
    labels: { control: false },
    colorScheme: { control: 'select', options: colorSchemes },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'radio', options: ['solid', 'outline', 'unstyled'] },
    id: { control: false },
    title: { control: 'text' },
    hidden: { control: false },
    'aria-label': { control: 'text' },
    'aria-labelledby': { control: false },
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
    <div style={stack('2rem')}>
      <Stepper activeStep={1} aria-label="Solid" variant="solid">
        {renderSteps(false)}
      </Stepper>
      <Stepper activeStep={1} aria-label="Outline" variant="outline">
        {renderSteps(false)}
      </Stepper>
      <Stepper
        activeStep={1}
        aria-label="Unstyled"
        className="flex-wrap gap-x-6 gap-y-2"
        variant="unstyled"
      >
        {steps.map(({ title }) => (
          <Step className="flex-none" key={title}>
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
    <div style={stack('2rem')}>
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
    <div style={stack('1.5rem')}>
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
    <div style={stack('2rem')}>
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
 * Use **labels** to translate what a screen reader says. Nothing is said for the current step because
 * `aria-current="step"` already announces it.
 */
export const StatusLabels: Story = {
  args: {
    labels: { completed: 'Completado', upcoming: 'Pendiente' },
  },
}

function InteractiveStepper(): React.ReactNode {
  const [active, setActive] = useState(0)
  return (
    <div style={stack('1.5rem')}>
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
 * The circle is made of two parts, **StepIndicatorContent** (what is drawn) and **StepIndicatorLabel** (what only a
 * screen reader gets). Compose them to style the content on its own, or to give the label your own text.
 */
export const Compound: Story = {
  render: () => (
    <Stepper activeStep={1} aria-label="Order" style={{ width: '36rem', maxWidth: '100%' }}>
      {steps.map(({ description, title }) => (
        <Step key={title}>
          <StepIndicator>
            <StepIndicatorContent className="font-bold" />
            <StepIndicatorLabel>{`Step: ${title}`}</StepIndicatorLabel>
          </StepIndicator>
          <StepTitle>{title}</StepTitle>
          <StepDescription>{description}</StepDescription>
          <StepSeparator />
        </Step>
      ))}
    </Stepper>
  ),
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
  <Step className="gap-x-2 sm:gap-x-3">
    <StepIndicator className="size-8 rounded-full border-2 border-border font-semibold data-[state=completed]:border-primary-solid data-[state=completed]:bg-primary-solid data-[state=completed]:text-primary-on-solid data-[state=current]:border-primary-solid data-[state=current]:text-primary-text" />
    <StepTitle className="hidden font-medium data-[state=current]:block data-[state=upcoming]:text-muted sm:block">Account</StepTitle>
    <StepSeparator className="h-0.5 bg-border data-[state=completed]:bg-primary-solid" />
  </Step>
  <Step className="gap-x-2 sm:gap-x-3">
    <StepIndicator className="size-8 rounded-full border-2 border-border font-semibold data-[state=completed]:border-primary-solid data-[state=completed]:bg-primary-solid data-[state=completed]:text-primary-on-solid data-[state=current]:border-primary-solid data-[state=current]:text-primary-text" />
    <StepTitle className="hidden font-medium data-[state=current]:block data-[state=upcoming]:text-muted sm:block">Profile</StepTitle>
    <StepSeparator className="h-0.5 bg-border data-[state=completed]:bg-primary-solid" />
  </Step>
  <Step className="gap-x-2 sm:gap-x-3">
    <StepIndicator className="size-8 rounded-full border-2 border-border font-semibold data-[state=completed]:border-primary-solid data-[state=completed]:bg-primary-solid data-[state=completed]:text-primary-on-solid data-[state=current]:border-primary-solid data-[state=current]:text-primary-text" />
    <StepTitle className="hidden font-medium data-[state=current]:block data-[state=upcoming]:text-muted sm:block">Review</StepTitle>
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
        <Step className="gap-x-2 sm:gap-x-3" key={title}>
          <StepIndicator className="size-8 rounded-full border-2 border-border font-semibold data-[state=completed]:border-primary-solid data-[state=completed]:bg-primary-solid data-[state=completed]:text-primary-on-solid data-[state=current]:border-primary-solid data-[state=current]:text-primary-text" />
          <StepTitle className="hidden font-medium data-[state=current]:block data-[state=upcoming]:text-muted sm:block">
            {title}
          </StepTitle>
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
            <StepTitle
              className={`d-sm-block ${index === active ? 'fw-semibold' : 'd-none'} ${index > active ? 'text-body-secondary' : ''}`}
            >
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
    <StepTitle className="d-none d-sm-block">Account</StepTitle>
    <StepSeparator className="border-top border-success" />
  </Step>
  <Step className="flex-fill align-items-center gap-2">
    <StepIndicator className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white" style={{ height: "2rem", width: "2rem" }} />
    <StepTitle className="d-sm-block fw-semibold">Profile</StepTitle>
    <StepSeparator className="border-top" />
  </Step>
  <Step className="flex-fill align-items-center gap-2">
    <StepIndicator className="rounded-circle d-flex align-items-center justify-content-center bg-secondary-subtle text-secondary-emphasis" style={{ height: "2rem", width: "2rem" }} />
    <StepTitle className="d-none d-sm-block text-body-secondary">Review</StepTitle>
  </Step>
</Stepper>`,
      },
    },
  },
  render: () => <BootstrapStepper />,
}
