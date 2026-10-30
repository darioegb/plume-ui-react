import type { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { defaultTheme } from '../../../../theme'
import { Field } from '../../field'
import { Rating, RatingEmpty, RatingFilled, RatingItem, RatingRadio, RatingValueText } from '..'

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
 * cannot be used: it is a group with the score as text (`3 out of 5`) and the icons hidden from assistive
 * technology.
 *
 * The root is always a `<fieldset>`: a `role="radiogroup"` while it is interactive, a plain group when it is read
 * only. Its `ref`, `id`, `aria-describedby`, `aria-invalid`, `disabled` and `required` go to that fieldset, which
 * is what a `Field` names, and it has `data-disabled`, `data-invalid` and `data-readonly` to style.
 *
 * Every element of a star is a part you can import and style or move. Without children the Rating renders one
 * `RatingItem` for each star, with its `RatingEmpty`, `RatingFilled` and `RatingRadio`. When a direct child is a
 * `RatingItem` or a `RatingValueText`, it renders your children instead, and a function child is called once for each
 * star. A part takes `className`, `style` and `ref`, and `icon`, `emptyIcon` and `labels` of the Rating keep filling
 * the defaults.
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
    },
    style: {
      control: false,
    },
    value: {
      control: false,
    },
    defaultValue: {
      control: { type: 'number', min: 0, max: 5, step: 0.5 },
    },
    onValueChange: {
      control: false,
    },
    max: {
      control: { type: 'number', min: 1, max: 10 },
    },
    allowHalf: {
      control: 'boolean',
    },
    clearable: {
      control: 'boolean',
    },
    readOnly: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    icon: {
      control: false,
    },
    emptyIcon: {
      control: false,
    },
    labels: {
      control: false,
    },
    colorScheme: {
      control: 'select',
      options: colorSchemes,
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'radio',
      options: ['solid', 'outline', 'unstyled'],
    },
    name: {
      control: 'text',
    },
    required: {
      control: 'boolean',
    },
    id: {
      control: false,
    },
    title: {
      control: 'text',
    },
    hidden: {
      control: false,
    },
    'aria-label': {
      control: 'text',
    },
    'aria-labelledby': {
      control: false,
    },
    'aria-describedby': {
      control: false,
    },
    'aria-invalid': {
      control: 'boolean',
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
 * Use the **variant** prop to pick how the Rating looks. `solid` fills the chosen stars with the color of the
 * Rating, and `outline` draws them as a thicker outline in that color, next to the grey outline of the empty ones.
 * A custom `icon` keeps its shape in both and takes the color. `unstyled` drops the Plume styles so you can style
 * the stars yourself.
 */
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Rating aria-label="Solid" defaultValue={3} variant="solid" />
<Rating aria-label="Outline" defaultValue={3} variant="outline" />
<Rating aria-label="Unstyled" className="gap-1 text-3xl" defaultValue={3} variant="unstyled">
  {(position) => (
    <RatingItem position={position}>
      <RatingEmpty className="text-gray-300" />
      <RatingFilled className="text-black" />
      <RatingRadio />
    </RatingItem>
  )}
</Rating>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3">
      <Rating aria-label="Solid" defaultValue={3} variant="solid" />
      <Rating aria-label="Outline" defaultValue={3} variant="outline" />
      <Rating aria-label="Unstyled" className="gap-1 text-3xl" defaultValue={3} variant="unstyled">
        {(position) => (
          <RatingItem position={position}>
            <RatingEmpty className="text-gray-300" />
            <RatingFilled className="text-black" />
            <RatingRadio />
          </RatingItem>
        )}
      </Rating>
    </div>
  ),
}

/**
 * Use the **size** prop to change the size of the stars.
 */
export const Sizes: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Rating aria-label="sm" defaultValue={3} size="sm" />
<Rating aria-label="md" defaultValue={3} size="md" />
<Rating aria-label="lg" defaultValue={3} size="lg" />`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Rating aria-label={size} defaultValue={3} key={size} size={size} />
      ))}
    </div>
  ),
}

/**
 * Use the **colorScheme** prop to pick a color from the theme. It fills the chosen stars in `solid`, and colors
 * their outline in `outline`.
 */
export const Colors: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Rating aria-label="primary" colorScheme="primary" defaultValue={3} />
<Rating aria-label="success" colorScheme="success" defaultValue={3} />
<Rating aria-label="error" colorScheme="error" defaultValue={3} />`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3">
      {colorSchemes.map((scheme) => (
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
 * **labels.item** names every star for a screen reader. The default says `3 stars`; here the scores have names.
 */
export const CustomLabels: Story = {
  args: {
    labels: { item: (value) => ['Terrible', 'Bad', 'Fine', 'Good', 'Great'][value - 1] },
  },
}

/**
 * A **read only** Rating shows a score. It is a group named by its `aria-label` (or its `Field`) with the score as
 * text (`3.5 out of 5`) and the stars hidden from assistive technology, so it is not a control that can't be used.
 * Use **labels.readOnly** to say it another way.
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
        className="rounded-sm border border-gray-400 px-2 py-1 text-sm"
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
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [value, setValue] = useState(2)
  return (
    <div className="flex flex-col items-start gap-3">
      <Rating aria-label="Rate this product" onValueChange={setValue} value={value} />
      <p className="text-sm">Score: {value}</p>
      <button onClick={() => setValue(5)} type="button">
        Give it five
      </button>
    </div>
  )
}`,
      },
    },
  },
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
      <button className="rounded-sm border border-gray-400 px-3 py-1 text-sm" type="submit">
        Send
      </button>
    </form>
  ),
}

/**
 * Wrap the Rating in a `Field` to give it a label, a helper text and an error message. The Field names the group,
 * links its texts and sets `disabled`, `readOnly`, `required` and `aria-invalid`, all on the `<fieldset>` that is
 * also the `ref` of the Rating, read only or not. With react-hook-form, render it in a `Controller` and pass
 * `field.value`, `field.onChange` and `field.ref`.
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
      <Field helperText="From 128 reviews." label="Average rating" readOnly>
        <Rating allowHalf defaultValue={4.5} />
      </Field>
    </div>
  ),
}

/**
 * Give the Rating its parts to style or move every element of a star. A function is called once for each star, or
 * you write the items yourself next to a `RatingValueText`. A `RatingRadio` inside the item is what makes it
 * clickable, so leaving it out makes the stars a display only.
 */
export const Compound: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Rating aria-label="Rate this product" className="gap-2" defaultValue={3}>
  {(position) => (
    <RatingItem position={position}>
      <RatingEmpty style={{ opacity: 0.4 }} />
      <RatingFilled style={{ filter: 'drop-shadow(0 1px 1px rgb(0 0 0 / 0.3))' }} />
      <RatingRadio />
    </RatingItem>
  )}
</Rating>

<Rating aria-label="Rating" defaultValue={4} readOnly>
  <RatingValueText>Four stars out of five</RatingValueText>
  {[1, 2, 3, 4, 5].map((position) => (
    <RatingItem key={position} position={position} />
  ))}
</Rating>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Rating aria-label="Rate this product" className="gap-2" defaultValue={3}>
        {(position) => (
          <RatingItem position={position}>
            <RatingEmpty style={{ opacity: 0.4 }} />
            <RatingFilled style={{ filter: 'drop-shadow(0 1px 1px rgb(0 0 0 / 0.3))' }} />
            <RatingRadio />
          </RatingItem>
        )}
      </Rating>
      <Rating aria-label="Rating" defaultValue={4} readOnly>
        <RatingValueText>Four stars out of five</RatingValueText>
        {[1, 2, 3, 4, 5].map((position) => (
          <RatingItem key={position} position={position} />
        ))}
      </Rating>
    </div>
  ),
}

/**
 * Some examples of Rating with Tailwind classes. With `variant="unstyled"` the Plume classes are gone and the stars
 * keep working: `className` styles the group, and `RatingItem`, `RatingEmpty` and `RatingFilled` the parts of every
 * star: the empty one is the outline and the filled one the colored layer on top of it, which a half star clips to
 * half. A star has `data-state` (`empty`, `half` or `full`), so `data-[state=full]:` styles it.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Rating aria-label="Rate this product" className="gap-1 text-3xl" defaultValue={3} variant="unstyled">
  {(position) => (
    <RatingItem position={position}>
      <RatingEmpty className="text-gray-300 dark:text-gray-600" />
      <RatingFilled className="text-amber-500" />
      <RatingRadio />
    </RatingItem>
  )}
</Rating>`,
      },
    },
  },
  render: () => (
    <Rating
      aria-label="Rate this product"
      className="gap-1 text-3xl"
      defaultValue={3}
      variant="unstyled"
    >
      {(position) => (
        <RatingItem position={position}>
          <RatingEmpty className="text-gray-300 dark:text-gray-600" />
          <RatingFilled className="text-amber-500" />
          <RatingRadio />
        </RatingItem>
      )}
    </Rating>
  ),
}

/**
 * Some examples of Rating with Bootstrap classes: `d-inline-flex gap-1 fs-3` on the group, which sets the size,
 * and `text-warning` and `text-body-tertiary` on the filled and the empty part of every star.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Rating aria-label="Rate this product" className="d-inline-flex gap-1 fs-3" defaultValue={3} variant="unstyled">
  {(position) => (
    <RatingItem position={position}>
      <RatingEmpty className="text-body-tertiary" />
      <RatingFilled className="text-warning" />
      <RatingRadio />
    </RatingItem>
  )}
</Rating>`,
      },
    },
  },
  render: () => (
    <Rating
      aria-label="Rate this product"
      className="d-inline-flex gap-1 fs-3"
      defaultValue={3}
      variant="unstyled"
    >
      {(position) => (
        <RatingItem position={position}>
          <RatingEmpty className="text-body-tertiary" />
          <RatingFilled className="text-warning" />
          <RatingRadio />
        </RatingItem>
      )}
    </Rating>
  ),
}
