import type { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { defaultTheme } from '../../../../theme'
import { Field } from '../../field'
import { Rating } from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

const heart = (
  <svg aria-hidden="true" fill="currentColor" height="1em" viewBox="0 0 24 24" width="1em">
    <path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.2 3 4.5 6.6 4.5c2 0 3.7 1.1 5.4 3.1 1.7-2 3.4-3.1 5.4-3.1 3.6 0 5.7 3.7 4.2 7.2C19.5 16.4 12 21 12 21Z" />
  </svg>
)

const heartOutline = (
  <svg
    aria-hidden="true"
    fill="none"
    height="1em"
    stroke="currentColor"
    strokeWidth="1.6"
    viewBox="0 0 24 24"
    width="1em"
  >
    <path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.2 3 4.5 6.6 4.5c2 0 3.7 1.1 5.4 3.1 1.7-2 3.4-3.1 5.4-3.1 3.6 0 5.7 3.7 4.2 7.2C19.5 16.4 12 21 12 21Z" />
  </svg>
)

/**
 * A row of stars (or any icon) to give or show a score. Use it for reviews, quality or priority. It can be
 * interactive, to let the user pick a score, or read only, to show one.
 *
 * It is a group of radio buttons, one for each star, so it works with the keyboard and the assistive technology of
 * a radio group: <kbd>Tab</kbd> enters the group, the arrows change the score and every star has a name
 * (`3 stars`). With `allowHalf` there are two radios per star and the arrows move by half. The stars follow the
 * pointer as a preview, and with `clearable` clicking the chosen star again, or pressing <kbd>Backspace</kbd>,
 * removes the score.
 *
 * A **read only** rating is not a group of disabled radios, which a screen reader announces as something that
 * cannot be used: it is text (`3 out of 5`) with the icons hidden from assistive technology.
 */
export default {
  title: 'Components/Rating',
  component: Rating,
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
      description: 'Custom CSS class for the Rating.',
      table: { type: { summary: 'string' } },
    },
    classNames: {
      control: false,
      description:
        'Custom CSS classes for the parts, in every variant: `item` (each star), `empty` (the outline layer) and `filled` (the colored layer, which shows on top of it, whole or clipped to half). A star has `data-state` (`empty`, `half` or `full`) to style it. With `variant="unstyled"` they are the only classes the parts have.',
      table: { type: { summary: `Partial<Record<RatingPart, string>>` } },
    },
    style: {
      control: false,
      description:
        'Inline styles for the Rating. They are applied after the color variables, so they can override them (e.g. `--rating-solid` and `--rating-empty`).',
      table: { type: { summary: 'CSSProperties' } },
    },
    value: {
      control: false,
      description:
        'The score, from `0` to `max`. Makes the Rating controlled: pass `onValueChange` to update it.',
      table: { type: { summary: 'number' } },
    },
    defaultValue: {
      control: { type: 'number', min: 0, max: 5, step: 0.5 },
      description:
        'The score the Rating starts with, when it is not controlled. It is rounded to a whole number, or to a half with `allowHalf`.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '0' } },
    },
    onValueChange: {
      control: false,
      description: 'Called with the new score. It is `0` when the score is cleared.',
      table: { category: 'Events', type: { summary: '(value: number) => void' } },
    },
    max: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'How many stars there are, which is also the highest score.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '5' } },
    },
    allowHalf: {
      control: 'boolean',
      description: 'Lets the user pick half a star: every star gets two radios, one for each half.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    clearable: {
      control: 'boolean',
      description:
        'Lets the user remove the score, by clicking the chosen star again or pressing <kbd>Backspace</kbd> or <kbd>Delete</kbd>. The score goes to `0`.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    readOnly: {
      control: 'boolean',
      description:
        "Shows the score without letting the user change it. It renders text, not radio buttons, so it can't be focused.",
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the radios and dims the Rating.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    icon: {
      control: false,
      description:
        'The icon of a star, in the color of the Rating. A custom one is also used for the empty stars unless you give `emptyIcon`.',
      table: { type: { summary: 'ReactNode' } },
    },
    emptyIcon: {
      control: false,
      description:
        'The icon of an empty star. By default it is an outline of the star, or of your `icon`.',
      table: { type: { summary: 'ReactNode' } },
    },
    getItemLabel: {
      control: false,
      description:
        'The accessible name of a star, from its score and the max. The default says `3 stars`. Use it to translate it or to name the scores: `Good`.',
      table: {
        category: 'Accessibility',
        type: { summary: '(value: number, max: number) => string' },
      },
    },
    readOnlyLabel: {
      control: false,
      description:
        'The text a read only Rating says, from its score and the max. The default says `3 out of 5`.',
      table: {
        category: 'Accessibility',
        type: { summary: '(value: number, max: number) => string' },
      },
    },
    colorScheme: {
      control: 'select',
      description: 'Color scheme from the theme palette, including custom schemes added to it.',
      options: colorSchemes,
      table: { type: { summary: 'ColorScheme' }, defaultValue: { summary: 'warning' } },
    },
    size: {
      control: 'radio',
      description: 'Size of the stars.',
      options: ['sm', 'md', 'lg'],
      table: { type: { summary: `"sm" | "md" | "lg"` }, defaultValue: { summary: 'md' } },
    },
    variant: {
      control: 'radio',
      description:
        'Visual variant. `solid` colors the stars. `unstyled` drops the Plume styles so you can bring your own; the stars keep working and have `data-state`.',
      options: ['solid', 'unstyled'],
      table: { type: { summary: `"solid" | "unstyled"` }, defaultValue: { summary: 'solid' } },
    },
    name: {
      control: 'text',
      description:
        "Name of the radios in a form. It is generated when you don't give one. A form submits the chosen score.",
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    required: {
      control: 'boolean',
      description: 'Marks the group as required (`aria-required`).',
      table: { category: 'HTML attributes', type: { summary: 'boolean' } },
    },
    id: {
      control: false,
      description: 'Id of the group.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    title: {
      control: 'text',
      description: 'Native tooltip of the Rating.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    hidden: {
      control: false,
      description: 'Hides the Rating.',
      table: { category: 'HTML attributes', type: { summary: 'boolean' } },
    },
    'aria-label': {
      control: 'text',
      description:
        'Accessible name of the group. It needs this, an `aria-labelledby` or a `Field` label.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    'aria-labelledby': {
      control: false,
      description: 'Id of the element that names the group.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    'aria-describedby': {
      control: false,
      description: 'Id of the element that describes the group.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    'aria-invalid': {
      control: 'boolean',
      description: 'Marks the group as invalid.',
      table: { category: 'Accessibility', type: { summary: 'boolean' } },
    },
  },
  args: {
    'aria-label': 'Rate this product',
    defaultValue: 3,
  },
} satisfies Meta<typeof Rating>

type Story = StoryObj<typeof Rating>

/**
 * This is the default Rating: five stars.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick how the Rating looks. `unstyled` drops the Plume styles so you can style the
 * stars yourself.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Rating aria-label="Solid" defaultValue={3} variant="solid" />
      <Rating
        aria-label="Unstyled"
        className="gap-1 text-3xl"
        defaultValue={3}
        classNames={{ empty: 'text-gray-300', filled: 'text-black' }}
        variant="unstyled"
      />
    </div>
  ),
}

/**
 * Use the **size** prop to change the size of the stars.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Rating aria-label={size} defaultValue={3} key={size} size={size} />
      ))}
    </div>
  ),
}

/**
 * Use the **colorScheme** prop to pick a color from the theme.
 */
export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {colorSchemes.slice(0, 6).map((scheme) => (
        <Rating
          aria-label={scheme}
          colorScheme={scheme as keyof typeof defaultTheme.colors}
          defaultValue={3}
          key={scheme}
        />
      ))}
    </div>
  ),
}

/**
 * **max** is the number of stars, and the highest score.
 */
export const Max: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Rating aria-label="Out of three" defaultValue={2} max={3} />
      <Rating aria-label="Out of ten" defaultValue={7} max={10} size="sm" />
    </div>
  ),
}

/**
 * With **allowHalf** the user can pick half a star: move the pointer over the left half of a star, or press the
 * arrows, which then move by half.
 */
export const HalfStars: Story = {
  args: { allowHalf: true, defaultValue: 3.5 },
}

/**
 * With **clearable** the user can remove the score, by clicking the chosen star again or pressing
 * <kbd>Backspace</kbd>. The score goes back to `0`.
 */
export const Clearable: Story = {
  args: { clearable: true },
}

/**
 * Use **icon** (and **emptyIcon**) for something other than a star. The icon takes the color of the Rating, and
 * the empty ones are grey. Give the icons `aria-hidden`: the stars are named by their radios.
 */
export const CustomIcon: Story = {
  render: () => (
    <Rating
      aria-label="How much do you like it"
      colorScheme="error"
      defaultValue={3}
      emptyIcon={heartOutline}
      icon={heart}
    />
  ),
}

/**
 * **getItemLabel** names every star for a screen reader. The default says `3 stars`; here the scores have names.
 */
export const CustomLabels: Story = {
  args: {
    getItemLabel: (value) => ['Terrible', 'Bad', 'Fine', 'Good', 'Great'][value - 1],
  },
}

/**
 * A **read only** Rating shows a score. It is text (`3.5 out of 5`) with the stars hidden from assistive
 * technology, so it is not a control that can't be used. Use **readOnlyLabel** to say it another way.
 */
export const ReadOnly: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Rating aria-label="Average rating" allowHalf defaultValue={3.5} readOnly size="sm" />
      <span aria-hidden="true" className="text-sm">
        3.5 (128 reviews)
      </span>
    </div>
  ),
}

function ControlledRating(): React.ReactNode {
  const [value, setValue] = useState(2)
  return (
    <div className="flex flex-col items-start gap-3">
      <Rating aria-label="Rate this product" onValueChange={setValue} value={value} />
      <p className="text-sm">Score: {value}</p>
      <button
        className="rounded border border-gray-400 px-2 py-1 text-sm"
        onClick={() => setValue(5)}
        type="button"
      >
        Give it five
      </button>
    </div>
  )
}

/**
 * Pass **value** and **onValueChange** to control the Rating.
 */
export const Controlled: Story = {
  render: () => <ControlledRating />,
}

/**
 * A Rating can be disabled, or marked as invalid.
 */
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Rating aria-label="Disabled" defaultValue={3} disabled />
      <Rating aria-invalid aria-label="Invalid" />
    </div>
  ),
}

/**
 * With a **name** the Rating takes part in a form: the radios share it and the form submits the chosen score.
 */
export const InAForm: Story = {
  render: () => (
    <form
      className="flex flex-col items-start gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        const score = new FormData(event.currentTarget).get('score')
        window.alert(`score = "${typeof score === 'string' ? score : 'nothing'}"`)
      }}
    >
      <Rating aria-label="Score" name="score" />
      <button className="rounded border border-gray-400 px-3 py-1 text-sm" type="submit">
        Send
      </button>
    </form>
  ),
}

/**
 * Wrap the Rating in a `Field` to give it a label, a helper text and an error message. The Field names the group,
 * links its texts and sets `disabled`, `readOnly`, `required` and `aria-invalid`.
 */
export const WithField: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Field helperText="One to five stars." label="Your rating">
        <Rating />
      </Field>
      <Field errorText="Please rate it." invalid label="Your rating" required>
        <Rating />
      </Field>
    </div>
  ),
}

/**
 * Some examples of Rating with Tailwind classes. With `variant="unstyled"` the Plume classes are gone and the stars
 * keep working: `className` styles the group and `classNames` the parts of every star: `empty` is the outline
 * and `filled` the colored layer on top of it, which a half star clips to half. A star has `data-state`
 * (`empty`, `half` or `full`), so `data-[state=full]:` styles it.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Rating
  aria-label="Rate this product"
  className="gap-1 text-3xl"
  classNames={{ empty: "text-gray-300 dark:text-gray-600", filled: "text-amber-500" }}
  defaultValue={3}
  variant="unstyled"
/>`,
      },
    },
  },
  render: () => (
    <Rating
      aria-label="Rate this product"
      className="gap-1 text-3xl"
      classNames={{ empty: 'text-gray-300 dark:text-gray-600', filled: 'text-amber-500' }}
      defaultValue={3}
      variant="unstyled"
    />
  ),
}

/**
 * Some examples of Rating with Bootstrap classes: `d-inline-flex gap-1 fs-3` on the group, which sets the size,
 * and `text-warning` and `text-body-tertiary` on the filled and the empty layer of every star.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Rating
  aria-label="Rate this product"
  className="d-inline-flex gap-1 fs-3"
  classNames={{ empty: "text-body-tertiary", filled: "text-warning" }}
  defaultValue={3}
  variant="unstyled"
/>`,
      },
    },
  },
  render: () => (
    <Rating
      aria-label="Rate this product"
      className="d-inline-flex gap-1 fs-3"
      classNames={{ empty: 'text-body-tertiary', filled: 'text-warning' }}
      defaultValue={3}
      variant="unstyled"
    />
  ),
}
