import type { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { defaultTheme } from '../../../../theme'
import { Button } from '../../../interaction/button'
import { Field } from '../../field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectOption,
  SelectTrigger,
  type SelectProps,
} from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

const avatar = (letter: string, color: string): React.ReactNode => (
  <img
    alt=""
    height={24}
    src={`data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="${color}"/><text x="12" y="16.5" font-family="sans-serif" font-size="12" font-weight="700" text-anchor="middle" fill="white">${letter}</text></svg>`,
    )}`}
    width={24}
  />
)

const people = [
  {
    color: '#6d28d9',
    description: 'Engineering',
    icon: avatar('A', '#6d28d9'),
    name: 'Ada Lovelace',
    value: 'ada',
  },
  {
    color: '#b45309',
    description: 'Design',
    icon: avatar('G', '#b45309'),
    name: 'Grace Hopper',
    value: 'grace',
  },
  {
    color: '#047857',
    description: 'Research',
    icon: avatar('L', '#047857'),
    name: 'Linus Torvalds',
    value: 'linus',
  },
  {
    color: '#be123c',
    description: 'Product',
    icon: avatar('M', '#be123c'),
    name: 'Margaret Hamilton',
    value: 'margaret',
  },
]

const fruits = ['Apple', 'Banana', 'Cherry', 'Grape', 'Mango', 'Orange', 'Peach']

function Fruits(): React.ReactNode {
  return (
    <>
      {fruits.map((fruit) => (
        <SelectOption key={fruit} value={fruit.toLowerCase()}>
          {fruit}
        </SelectOption>
      ))}
    </>
  )
}

function Example({
  children,
  label = 'Fruit',
  placeholder = 'Pick a fruit',
  ...props
}: Readonly<
  Partial<SelectProps> & { children?: React.ReactNode; label?: string; placeholder?: string }
>): React.ReactNode {
  return (
    <Select {...(props as SelectProps)}>
      <SelectTrigger aria-label={label} placeholder={placeholder} />
      <SelectContent>{children ?? <Fruits />}</SelectContent>
    </Select>
  )
}

/**
 * Choose one option, or several, from a list that opens under a field. Use it when there are too many options for
 * radio buttons and the user has to pick a value, and a `Dropdown` when each item is an action.
 *
 * It is the WAI-ARIA select-only combobox: the focus stays on the trigger and the list is followed with
 * `aria-activedescendant`. A click, <kbd>Enter</kbd>, <kbd>Space</kbd> or the arrows open it. The arrows,
 * <kbd>Home</kbd>, <kbd>End</kbd>, <kbd>PageUp</kbd> and <kbd>PageDown</kbd> move through the options (a disabled
 * one is skipped), typing a few letters jumps to the option that starts with them, <kbd>Enter</kbd> or
 * <kbd>Space</kbd> choose, and <kbd>Esc</kbd> closes it. With the list closed, typing changes a single value without
 * opening it, and <kbd>Backspace</kbd> removes the last option of a `multiple` select.
 *
 * The options are mounted (and hidden) while the list is closed, so the trigger can show the label of the value
 * from the start, but the server renders no label: it appears when the page hydrates.
 *
 * ### Subcomponents
 *
 * | Component | Props |
 * | --- | --- |
 * | `SelectTrigger` | `placeholder`, `display`, `maxDisplay`, `removeLabel`, `clearLabel`, `aria-label`, `aria-labelledby`, `classNames`, `className`, `style`, `children`. The field the user clicks. It needs a name: an `aria-label`, an `aria-labelledby` or a `Field` label. `className` and `style` go to the field and `ref` to its button; `classNames` styles its parts (`field`, `trigger`, `chip`, `chipRemove`, `clear` and `chevron`). `display` is how a `multiple` value shows (`chips`, each with a button to remove it, or `text`) and `maxDisplay` how many chips before a `+N`. |
 * | `SelectValue` | `placeholder`, `children`. What the button of the trigger shows: the chosen option with its icon, or the labels of a `multiple` select as text. `SelectTrigger` renders one by default; use your own to render the value yourself with a function of the chosen options. |
 * | `SelectContent` | `emptyText`, `searchLabel`, `searchPlaceholder`, `aria-label`, `classNames`, `className`, `style`, `children`. The list. It is as wide as the trigger and scrolls when it is long. `classNames` styles its parts (`search`, `searchInput`, `list` and `empty`). |
 * | `SelectOption` | `value`, `label`, `description`, `icon`, `disabled`, `classNames`, `className`, `style`, `children`. An option. `children` is its content and `label` the text used for the search, the typeahead and the value, when the content is more than text. An `icon` can be an icon or an image (give it `alt=""`: it is decorative and the label names the option). `classNames` styles `icon`, `description`, `checkbox` and `check`. The option has `data-active` while the arrows are on it, plus `aria-selected` and `aria-disabled`, to style them. |
 * | `SelectGroup` | `label`, `labelClassName`, `className`, `style`, `children`. A titled set of options. It hides itself when the search leaves it empty. |
 */
export default {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    docs: {
      story: { inline: false, iframeHeight: 380 },
      importNames: [
        'Select',
        'SelectTrigger',
        'SelectValue',
        'SelectContent',
        'SelectOption',
        'SelectGroup',
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
      description: 'The `SelectTrigger` and the `SelectContent`.',
      table: { type: { summary: 'ReactNode' } },
    },
    value: {
      control: false,
      description:
        'The value of a controlled select: the `value` of the chosen option, or an array of them when it is `multiple`. Pair it with `onValueChange`.',
      table: { type: { summary: 'string | string[]' } },
    },
    defaultValue: {
      control: false,
      description: 'The value of an uncontrolled select at first.',
      table: { type: { summary: 'string | string[]' } },
    },
    onValueChange: {
      control: false,
      description:
        'Called with the new value: a string, or an array of strings when it is `multiple`. It is an empty string, or an empty array, when the value is cleared.',
      table: {
        category: 'Events',
        type: { summary: '(value: string) => void | (value: string[]) => void' },
      },
    },
    multiple: {
      control: 'boolean',
      description:
        'Lets the user choose several options. The list stays open after each choice, each option shows a check box and the trigger shows the chosen options as chips.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    searchable: {
      control: 'boolean',
      description:
        'Adds a search box to the list that filters the options as the user types. Typing on the closed trigger opens it with that text.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    clearable: {
      control: 'boolean',
      description: 'Shows a button to clear the value, and lets Backspace clear a single value.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    closeOnSelect: {
      control: 'boolean',
      description:
        'Whether choosing an option closes the list. `true` for one value, `false` for several.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true (false when multiple)' },
      },
    },
    variant: {
      control: 'radio',
      description:
        'Visual variant, the same ones as `Input`. `unstyled` drops the Plume styles so you can bring your own.',
      options: ['outline', 'filled', 'underline', 'unstyled'],
      table: {
        type: { summary: `"outline" | "filled" | "underline" | "unstyled"` },
        defaultValue: { summary: 'outline' },
      },
    },
    size: {
      control: 'radio',
      description: 'Height and text size of the field.',
      options: ['sm', 'md', 'lg'],
      table: { type: { summary: `"sm" | "md" | "lg"` }, defaultValue: { summary: 'md' } },
    },
    shape: {
      control: 'radio',
      description: 'Shape of the `outline` field.',
      options: ['rounded', 'pill'],
      table: { type: { summary: `"rounded" | "pill"` }, defaultValue: { summary: 'rounded' } },
    },
    colorScheme: {
      control: 'select',
      description: 'Color of the focus ring, from the theme palette (custom schemes included).',
      options: colorSchemes,
      table: { type: { summary: 'ColorScheme' }, defaultValue: { summary: 'secondary' } },
    },
    placement: {
      control: 'select',
      description: 'Where the list opens, relative to the field.',
      options: ['bottom-start', 'bottom', 'bottom-end', 'top-start', 'top', 'top-end'],
      table: { type: { summary: 'Placement' }, defaultValue: { summary: 'bottom-start' } },
    },
    offset: {
      control: 'number',
      description: 'Distance in pixels between the field and the list.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '4' } },
    },
    flip: {
      control: 'boolean',
      description: 'Opens on the opposite side when there is no room on the one asked for.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
    shift: {
      control: 'boolean',
      description: 'Slides the list along its side to keep it inside the screen.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
    name: {
      control: 'text',
      description:
        'Name of the field in a form. The select adds hidden inputs with the chosen values: one for a single value, one for each value when it is `multiple`.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Indicates whether the select is disabled.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    readOnly: {
      control: 'boolean',
      description: 'The value is shown and focusable, but the list does not open.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    id: {
      control: false,
      description:
        'Id of the button of the trigger. A `Field` sets it, to link its label to the select.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    'aria-describedby': {
      control: false,
      description:
        'Id of the elements that describe the select. A `Field` adds its helper text and its error.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    'aria-invalid': {
      control: 'boolean',
      description:
        'Marks the value as invalid, and the field draws its border with the error color. A `Field` sets it.',
      table: { category: 'Accessibility', type: { summary: 'boolean' } },
    },
    required: {
      control: 'boolean',
      description: 'Marks the select as required for assistive technology.',
      table: {
        category: 'HTML attributes',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    open: {
      control: 'boolean',
      description:
        'Whether the list is open, for a controlled select. Pair it with `onOpenChange`.',
      table: { type: { summary: 'boolean' } },
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Whether the list is open at first, for an uncontrolled select.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    onOpenChange: {
      control: false,
      description: 'Called with the new state when the list opens or closes.',
      table: { category: 'Events', type: { summary: '(open: boolean) => void' } },
    },
  },
  render: (args) => <Example {...args} />,
} satisfies Meta<typeof Select>

type Story = StoryObj<typeof Select>

/**
 * This is the default Select. Open it with the mouse, <kbd>Enter</kbd>, <kbd>Space</kbd> or the arrows.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick how the field looks: `outline`, `filled` or `underline`, as in the `Input`.
 * `unstyled` drops the Plume styles so you can style it yourself.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Example label="Outline" variant="outline" />
      <Example label="Filled" variant="filled" />
      <Example label="Underline" variant="underline" />
      <Select variant="unstyled">
        <SelectTrigger
          aria-label="Unstyled"
          className="w-full rounded border border-border bg-surface px-3 py-2 text-foreground"
          classNames={{
            chevron: 'text-[var(--plume-muted)]',
            trigger: 'data-[placeholder]:text-[var(--plume-muted)]',
          }}
          placeholder="Unstyled"
        />
        <SelectContent className="rounded border border-border bg-surface p-1 text-foreground shadow">
          {fruits.map((fruit) => (
            <SelectOption
              className="cursor-pointer rounded px-3 py-1 data-[active]:bg-surface-muted"
              key={fruit}
              value={fruit.toLowerCase()}
            >
              {fruit}
            </SelectOption>
          ))}
        </SelectContent>
      </Select>
    </div>
  ),
}

/**
 * Use the **size** prop to change the height and the text of the field.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Example key={size} label={`Size ${size}`} placeholder={`Size ${size}`} size={size} />
      ))}
    </div>
  ),
}

/**
 * Use the **colorScheme** prop to change the color of the focus ring. It takes any color of the theme, including
 * the ones you add. Tab to a field to see it.
 */
export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(['primary', 'success', 'error'] as const).map((colorScheme) => (
        <Example
          colorScheme={colorScheme}
          key={colorScheme}
          label={colorScheme}
          placeholder={colorScheme}
        />
      ))}
    </div>
  ),
}

/**
 * With **multiple** the user can choose several options. The list stays open, each option has a check box and the
 * trigger shows the chosen options as chips, each with a button to remove just that one. <kbd>Backspace</kbd>
 * removes the last one. **onValueChange** receives an array. On the trigger, **maxDisplay** shows at most that many
 * chips with a `+N` for the rest, and `display="text"` shows the labels as text instead of chips.
 */
export const Multiple: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Example
        defaultValue={['apple', 'mango']}
        label="Fruits"
        multiple
        placeholder="Pick fruits"
      />
      <Select defaultValue={['apple', 'banana', 'cherry', 'grape']} multiple>
        <SelectTrigger aria-label="At most two chips" maxDisplay={2} />
        <SelectContent>
          <Fruits />
        </SelectContent>
      </Select>
      <Select defaultValue={['apple', 'banana']} multiple>
        <SelectTrigger aria-label="As text" display="text" />
        <SelectContent>
          <Fruits />
        </SelectContent>
      </Select>
    </div>
  ),
}

/**
 * An **icon** goes before the text of an option, and it can be an image: give it `alt=""`, because it is
 * decorative and the text names the option. A **description** adds a second line, which is read as the description
 * of the option. The trigger shows the icon of what is chosen, also in the chips of a `multiple` select.
 */
export const ImagesAndDescriptions: Story = {
  parameters: { docs: { story: { inline: false, iframeHeight: 420 } } },
  render: () => (
    <div className="flex flex-col gap-4">
      <Select defaultValue="grace">
        <SelectTrigger aria-label="Person" />
        <SelectContent>
          {people.map((person) => (
            <SelectOption
              description={person.description}
              icon={person.icon}
              key={person.value}
              value={person.value}
            >
              {person.name}
            </SelectOption>
          ))}
        </SelectContent>
      </Select>
      <Select defaultValue={['ada', 'linus']} multiple>
        <SelectTrigger aria-label="People" placeholder="Pick people" />
        <SelectContent>
          {people.map((person) => (
            <SelectOption
              description={person.description}
              icon={person.icon}
              key={person.value}
              value={person.value}
            >
              {person.name}
            </SelectOption>
          ))}
        </SelectContent>
      </Select>
    </div>
  ),
}

/**
 * **searchable** adds a search box that filters the options while the user types, and a message when none is
 * left (**emptyText** in the `SelectContent`). The arrows and <kbd>Enter</kbd> work from the search box, and typing
 * on the closed trigger opens it with that text. The text of an option, or its `label`, is what is searched.
 */
export const Searchable: Story = {
  parameters: { docs: { story: { inline: false, iframeHeight: 420 } } },
  render: () => (
    <div className="flex flex-col gap-4">
      <Select searchable>
        <SelectTrigger aria-label="Person" placeholder="Search a person" />
        <SelectContent
          emptyText="Nobody with that name"
          searchLabel="Search people"
          searchPlaceholder="Search…"
        >
          {people.map((person) => (
            <SelectOption
              description={person.description}
              icon={person.icon}
              key={person.value}
              value={person.value}
            >
              {person.name}
            </SelectOption>
          ))}
        </SelectContent>
      </Select>
      <Select clearable multiple searchable>
        <SelectTrigger aria-label="Fruits" placeholder="Search fruits" />
        <SelectContent searchLabel="Search fruits">
          <Fruits />
        </SelectContent>
      </Select>
    </div>
  ),
}

/**
 * A **SelectGroup** gives a title to a set of options. When the search leaves a group without options it hides.
 */
export const Groups: Story = {
  parameters: { docs: { story: { inline: false, iframeHeight: 460 } } },
  render: () => (
    <Select searchable>
      <SelectTrigger aria-label="Food" placeholder="Pick a food" />
      <SelectContent>
        <SelectGroup label="Fruits">
          <SelectOption value="apple">Apple</SelectOption>
          <SelectOption value="mango">Mango</SelectOption>
        </SelectGroup>
        <SelectGroup label="Vegetables">
          <SelectOption value="carrot">Carrot</SelectOption>
          <SelectOption value="leek">Leek</SelectOption>
        </SelectGroup>
        <SelectGroup label="Grains">
          <SelectOption value="rice">Rice</SelectOption>
          <SelectOption disabled value="quinoa">
            Quinoa (out of stock)
          </SelectOption>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}

/**
 * **clearable** shows a button that clears the whole value, and lets <kbd>Backspace</kbd> clear a single one. A
 * `multiple` select can also remove one option at a time with the button of its chip. The value becomes an empty
 * string, or an empty array when it is `multiple`.
 */
export const Clearable: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Example clearable defaultValue="mango" label="Single" />
      <Example clearable defaultValue={['apple', 'mango']} label="Multiple" multiple />
    </div>
  ),
}

function ControlledExample(): React.ReactNode {
  const [value, setValue] = useState<string[]>(['apple'])
  const [open, setOpen] = useState(false)
  return (
    <div className="flex flex-col items-center gap-3">
      <Select multiple onOpenChange={setOpen} onValueChange={setValue} open={open} value={value}>
        <SelectTrigger aria-label="Fruits" placeholder="Pick fruits" />
        <SelectContent>
          <Fruits />
        </SelectContent>
      </Select>
      <small>Chosen: {value.length > 0 ? value.join(', ') : 'nothing'}</small>
      <div className="flex gap-2">
        <Button
          label="Choose all"
          onClick={() => setValue(fruits.map((fruit) => fruit.toLowerCase()))}
          size="sm"
          variant="outline"
        />
        <Button
          label={open ? 'Close the list' : 'Open the list'}
          onClick={() => setOpen(!open)}
          size="sm"
          variant="outline"
        />
      </div>
    </div>
  )
}

/**
 * Pass **value** and **onValueChange** to control the value, and **open** and **onOpenChange** to control the
 * list, from your own state.
 */
export const Controlled: Story = {
  render: () => <ControlledExample />,
}

/**
 * A select can be **disabled**, **readOnly**, **required** and invalid (`aria-invalid`, which a `Field` sets). A
 * disabled option stays in the list, can't be chosen and is skipped by the arrows.
 */
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Example defaultValue="apple" disabled label="Disabled" />
      <Example defaultValue="apple" label="Read only" readOnly />
      <Example aria-invalid label="Invalid" required />
      <Example label="With a disabled option">
        <SelectOption value="apple">Apple</SelectOption>
        <SelectOption disabled value="banana">
          Banana (sold out)
        </SelectOption>
        <SelectOption value="cherry">Cherry</SelectOption>
      </Example>
    </div>
  ),
}

function FormExample(): React.ReactNode {
  const [data, setData] = useState('Submit the form to see what it sends.')
  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        const entries = new FormData(event.currentTarget)
        setData(JSON.stringify({ colors: entries.getAll('colors'), size: entries.get('size') }))
      }}
    >
      <Select defaultValue="m" name="size">
        <SelectTrigger aria-label="Size" />
        <SelectContent>
          <SelectOption value="s">Small</SelectOption>
          <SelectOption value="m">Medium</SelectOption>
          <SelectOption value="l">Large</SelectOption>
        </SelectContent>
      </Select>
      <Select defaultValue={['red']} multiple name="colors">
        <SelectTrigger aria-label="Colors" placeholder="Colors" />
        <SelectContent>
          <SelectOption value="red">Red</SelectOption>
          <SelectOption value="green">Green</SelectOption>
          <SelectOption value="blue">Blue</SelectOption>
        </SelectContent>
      </Select>
      <Button label="Submit" type="submit" />
      <small>{data}</small>
    </form>
  )
}

/**
 * With a **name** the select adds hidden inputs, so it works in a plain `<form>`: one for a single value and one for
 * each chosen option when it is `multiple`. Use `FormData` or `getAll` to read them. Native validation doesn't apply
 * to them, so validate `required` yourself.
 */
export const InAForm: Story = {
  render: () => <FormExample />,
}

/**
 * Wrap the select in a `Field` to give it a label, a helper text and an error message. The Field names the select,
 * links its helper text and sets `disabled`, `readOnly`, `required` and `aria-invalid`.
 */
export const WithField: Story = {
  parameters: { docs: { story: { inline: false, iframeHeight: 460 } } },
  render: () => (
    <div className="flex flex-col gap-6">
      <Field helperText="You can change it later." label="Favorite fruit">
        <Select>
          <SelectTrigger placeholder="Pick a fruit" />
          <SelectContent>
            <Fruits />
          </SelectContent>
        </Select>
      </Field>
      <Field errorText="Pick at least one fruit." invalid label="Fruits" required>
        <Select multiple>
          <SelectTrigger placeholder="Pick fruits" />
          <SelectContent>
            <Fruits />
          </SelectContent>
        </Select>
      </Field>
    </div>
  ),
}

/**
 * Some examples of Select with Tailwind classes. With `variant="unstyled"` the select has none of the Plume classes: `className` styles the field, `classNames` its parts and the parts of the list and of the options, and the option the arrows are on has `data-active`, so `data-[active]:` styles it, as `aria-selected:` and `aria-disabled:` do for the chosen and the disabled ones.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex w-72 max-w-full flex-col gap-4">
  <Select variant="unstyled">
    <SelectTrigger
      aria-label="Fruit"
      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus-within:border-blue-500 focus-within:ring focus-within:ring-blue-200"
      classNames={{ chevron: "text-[var(--plume-muted)]", trigger: "data-[placeholder]:text-[var(--plume-muted)]" }}
      placeholder="Pick a fruit"
    />
    <SelectContent className="rounded-lg border border-border bg-surface p-1 shadow-lg">
      {fruits.map((fruit) => (
        <SelectOption
          className="cursor-pointer rounded px-3 py-1.5 text-sm text-foreground data-[active]:bg-surface-muted aria-selected:font-semibold"
          classNames={{ check: "text-blue-600" }}
          key={fruit}
          value={fruit.toLowerCase()}
        >
          {fruit}
        </SelectOption>
      ))}
    </SelectContent>
  </Select>
  <Select clearable defaultValue={["apple", "mango"]} multiple searchable variant="unstyled">
    <SelectTrigger
      aria-label="Fruits"
      className="w-full rounded-lg border border-border bg-surface px-2 py-1.5 text-sm text-foreground focus-within:border-emerald-500 focus-within:ring focus-within:ring-emerald-200"
      classNames={{
        chevron: "text-[var(--plume-muted)]",
        chip: "rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-900",
        chipRemove: "ml-1 rounded-full hover:bg-emerald-200",
        clear: "mr-1 rounded p-1 text-[var(--plume-muted)] hover:text-foreground",
        trigger: "px-1 data-[placeholder]:text-[var(--plume-muted)]",
      }}
      placeholder="Search fruits"
    />
    <SelectContent
      className="rounded-lg border border-border bg-surface shadow-lg"
      classNames={{
        empty: "p-3 text-center text-sm text-[var(--plume-muted)]",
        list: "p-1",
        search: "border-b border-border p-2",
        searchInput: "w-full rounded border border-border bg-transparent px-2 py-1 text-sm",
      }}
      searchLabel="Search fruits"
    >
      {fruits.map((fruit) => (
        <SelectOption
          className="flex cursor-pointer items-center gap-2 rounded px-3 py-1.5 text-sm text-foreground data-[active]:bg-surface-muted"
          classNames={{ checkbox: "flex h-4 w-4 items-center justify-center rounded border border-border text-[10px] text-emerald-700" }}
          key={fruit}
          value={fruit.toLowerCase()}
        >
          {fruit}
        </SelectOption>
      ))}
    </SelectContent>
  </Select>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex w-72 max-w-full flex-col gap-4">
      <Select variant="unstyled">
        <SelectTrigger
          aria-label="Fruit"
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus-within:border-blue-500 focus-within:ring focus-within:ring-blue-200"
          classNames={{
            chevron: 'text-[var(--plume-muted)]',
            trigger: 'data-[placeholder]:text-[var(--plume-muted)]',
          }}
          placeholder="Pick a fruit"
        />
        <SelectContent className="rounded-lg border border-border bg-surface p-1 shadow-lg">
          {fruits.map((fruit) => (
            <SelectOption
              className="cursor-pointer rounded px-3 py-1.5 text-sm text-foreground data-[active]:bg-surface-muted aria-selected:font-semibold"
              classNames={{ check: 'text-blue-600' }}
              key={fruit}
              value={fruit.toLowerCase()}
            >
              {fruit}
            </SelectOption>
          ))}
        </SelectContent>
      </Select>
      <Select clearable defaultValue={['apple', 'mango']} multiple searchable variant="unstyled">
        <SelectTrigger
          aria-label="Fruits"
          className="w-full rounded-lg border border-border bg-surface px-2 py-1.5 text-sm text-foreground focus-within:border-emerald-500 focus-within:ring focus-within:ring-emerald-200"
          classNames={{
            chevron: 'text-[var(--plume-muted)]',
            chip: 'rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-900',
            chipRemove: 'ml-1 rounded-full hover:bg-emerald-200',
            clear: 'mr-1 rounded p-1 text-[var(--plume-muted)] hover:text-foreground',
            trigger: 'px-1 data-[placeholder]:text-[var(--plume-muted)]',
          }}
          placeholder="Search fruits"
        />
        <SelectContent
          className="rounded-lg border border-border bg-surface shadow-lg"
          classNames={{
            empty: 'p-3 text-center text-sm text-[var(--plume-muted)]',
            list: 'p-1',
            search: 'border-b border-border p-2',
            searchInput: 'w-full rounded border border-border bg-transparent px-2 py-1 text-sm',
          }}
          searchLabel="Search fruits"
        >
          {fruits.map((fruit) => (
            <SelectOption
              className="flex cursor-pointer items-center gap-2 rounded px-3 py-1.5 text-sm text-foreground data-[active]:bg-surface-muted"
              classNames={{
                checkbox:
                  'flex h-4 w-4 items-center justify-center rounded border border-border text-[10px] text-emerald-700',
              }}
              key={fruit}
              value={fruit.toLowerCase()}
            >
              {fruit}
            </SelectOption>
          ))}
        </SelectContent>
      </Select>
    </div>
  ),
}

/**
 * Some examples of Select with Bootstrap classes: `form-control d-flex` on the field (`form-control` is `display: block`), `dropdown-menu show` and `dropdown-item` on the list and its options, and `badge` for the chips. The option the arrows are on has `data-active`, which Bootstrap does not know, so a rule styles it.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="d-flex flex-column gap-3" style={{ width: '18rem', maxWidth: '100%' }}>
  <style>{".dropdown-item[data-active] { background-color: var(--bs-tertiary-bg); }"}</style>
  <Select variant="unstyled">
    <SelectTrigger
      aria-label="Fruit"
      className="form-control d-flex align-items-center ps-3 pe-0"
      classNames={{ chevron: "px-3 text-body-secondary", trigger: "bg-transparent border-0 p-0" }}
      placeholder="Pick a fruit"
    />
    <SelectContent className="dropdown-menu show p-1">
      {fruits.map((fruit) => (
        <SelectOption
          className="dropdown-item rounded"
          classNames={{ check: "text-primary" }}
          key={fruit}
          value={fruit.toLowerCase()}
        >
          {fruit}
        </SelectOption>
      ))}
    </SelectContent>
  </Select>
  <Select clearable defaultValue={["apple", "mango"]} multiple variant="unstyled">
    <SelectTrigger
      aria-label="Fruits"
      className="form-control d-flex align-items-center ps-2 pe-0"
      classNames={{
        chevron: "px-3 text-body-secondary",
        chip: "badge text-bg-primary fw-normal",
        chipRemove: "ms-1 text-white",
        clear: "btn btn-sm border-0 text-body-secondary",
        trigger: "bg-transparent border-0 p-1",
      }}
      placeholder="Pick fruits"
    />
    <SelectContent className="dropdown-menu show p-1">
      {fruits.map((fruit) => (
        <SelectOption
          className="dropdown-item rounded"
          classNames={{ checkbox: "me-2 border rounded px-1" }}
          key={fruit}
          value={fruit.toLowerCase()}
        >
          {fruit}
        </SelectOption>
      ))}
    </SelectContent>
  </Select>
</div>`,
      },
    },
  },
  render: () => (
    <div className="d-flex flex-column gap-3" style={{ width: '18rem', maxWidth: '100%' }}>
      <style>{'.dropdown-item[data-active] { background-color: var(--bs-tertiary-bg); }'}</style>
      <Select variant="unstyled">
        <SelectTrigger
          aria-label="Fruit"
          className="form-control d-flex align-items-center ps-3 pe-0"
          classNames={{
            chevron: 'px-3 text-body-secondary',
            trigger: 'bg-transparent border-0 p-0',
          }}
          placeholder="Pick a fruit"
        />
        <SelectContent className="dropdown-menu show p-1">
          {fruits.map((fruit) => (
            <SelectOption
              className="dropdown-item rounded"
              classNames={{ check: 'text-primary' }}
              key={fruit}
              value={fruit.toLowerCase()}
            >
              {fruit}
            </SelectOption>
          ))}
        </SelectContent>
      </Select>
      <Select clearable defaultValue={['apple', 'mango']} multiple variant="unstyled">
        <SelectTrigger
          aria-label="Fruits"
          className="form-control d-flex align-items-center ps-2 pe-0"
          classNames={{
            chevron: 'px-3 text-body-secondary',
            chip: 'badge text-bg-primary fw-normal',
            chipRemove: 'ms-1 text-white',
            clear: 'btn btn-sm border-0 text-body-secondary',
            trigger: 'bg-transparent border-0 p-1',
          }}
          placeholder="Pick fruits"
        />
        <SelectContent className="dropdown-menu show p-1">
          {fruits.map((fruit) => (
            <SelectOption
              className="dropdown-item rounded"
              classNames={{ checkbox: 'me-2 border rounded px-1' }}
              key={fruit}
              value={fruit.toLowerCase()}
            >
              {fruit}
            </SelectOption>
          ))}
        </SelectContent>
      </Select>
    </div>
  ),
}
