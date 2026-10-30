import type { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { defaultTheme, type ColorScheme } from '../../../../theme'
import { Button } from '../../../interaction/button'
import { ChipLabel, ChipRemove } from '../../../presentation/chip'
import { Field } from '../../field'
import {
  Select,
  SelectChevron,
  SelectChip,
  SelectChips,
  SelectClear,
  SelectCombobox,
  SelectContent,
  SelectEmpty,
  SelectField,
  SelectGroup,
  SelectGroupLabel,
  SelectList,
  SelectOption,
  SelectOptionBody,
  SelectOptionCheck,
  SelectOptionDescription,
  SelectOptionIcon,
  SelectOptionText,
  SelectSearch,
  SelectSearchInput,
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
 * Every part takes `className`, `style` and `ref`, carries a `data-plume-select-<part>` attribute, and with `variant="unstyled"` it has no Plume class.
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
    },
    labels: {
      control: false,
    },
    value: {
      control: false,
    },
    defaultValue: {
      control: false,
    },
    onValueChange: {
      control: false,
    },
    multiple: {
      control: 'boolean',
    },
    searchable: {
      control: 'boolean',
    },
    clearable: {
      control: 'boolean',
    },
    closeOnSelect: {
      control: 'boolean',
    },
    variant: {
      control: 'radio',
      options: ['outline', 'filled', 'underline', 'unstyled'],
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
    shape: {
      control: 'radio',
      options: ['rounded', 'pill'],
    },
    colorScheme: {
      control: 'select',
      options: colorSchemes,
    },
    placement: {
      control: 'select',
      options: ['bottom-start', 'bottom', 'bottom-end', 'top-start', 'top', 'top-end'],
    },
    offset: {
      control: 'number',
    },
    flip: {
      control: 'boolean',
    },
    shift: {
      control: 'boolean',
    },
    name: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
    readOnly: {
      control: 'boolean',
    },
    id: {
      control: false,
    },
    'aria-describedby': {
      control: false,
    },
    'aria-invalid': {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
    open: {
      control: 'boolean',
    },
    defaultOpen: {
      control: 'boolean',
    },
    onOpenChange: {
      control: false,
    },
  },
  render: (args) => <Example {...args} />,
} satisfies Meta<typeof Select>

type Story = StoryObj<typeof Select>

/**
 * This is the default Select. Open it with the mouse, <kbd>Enter</kbd>, <kbd>Space</kbd> or the arrows.
 */
export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Select>
  <SelectTrigger aria-label="Fruit" placeholder="Pick a fruit" />
  <SelectContent>
    <SelectOption value="apple">Apple</SelectOption>
    <SelectOption value="banana">Banana</SelectOption>
    <SelectOption value="cherry">Cherry</SelectOption>
  </SelectContent>
</Select>`,
      },
    },
  },
}

/**
 * Use the **variant** prop to pick how the field looks: `outline`, `filled` or `underline`, as in the `Input`.
 * `unstyled` drops the Plume styles so you can style it yourself.
 */
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-4">
  <Select variant="outline">
    <SelectTrigger aria-label="Outline" placeholder="Pick a fruit" />
    <SelectContent>
      <SelectOption value="apple">Apple</SelectOption>
      <SelectOption value="banana">Banana</SelectOption>
      <SelectOption value="cherry">Cherry</SelectOption>
    </SelectContent>
  </Select>
  <Select variant="filled">
    <SelectTrigger aria-label="Filled" placeholder="Pick a fruit" />
    <SelectContent>
      <SelectOption value="apple">Apple</SelectOption>
      <SelectOption value="banana">Banana</SelectOption>
      <SelectOption value="cherry">Cherry</SelectOption>
    </SelectContent>
  </Select>
  <Select variant="unstyled">
    <SelectTrigger
      aria-label="Unstyled"
      className="w-full rounded-sm border border-border bg-surface px-3 py-2 text-foreground"
      placeholder="Unstyled"
    >
      <SelectField>
        <SelectCombobox className="data-[placeholder]:text-[var(--plume-muted)]" />
      </SelectField>
      <SelectChevron className="text-[var(--plume-muted)]" />
    </SelectTrigger>
    <SelectContent className="rounded-sm border border-border bg-surface p-1 text-foreground shadow-sm">
      <SelectOption
        className="cursor-pointer rounded-sm px-3 py-1 data-[active]:bg-surface-muted"
        value="apple"
      >
        Apple
      </SelectOption>
      <SelectOption
        className="cursor-pointer rounded-sm px-3 py-1 data-[active]:bg-surface-muted"
        value="banana"
      >
        Banana
      </SelectOption>
    </SelectContent>
  </Select>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Example label="Outline" variant="outline" />
      <Example label="Filled" variant="filled" />
      <Example label="Underline" variant="underline" />
      <Select variant="unstyled">
        <SelectTrigger
          aria-label="Unstyled"
          className="w-full rounded-sm border border-border bg-surface px-3 py-2 text-foreground"
          placeholder="Unstyled"
        >
          <SelectField>
            <SelectCombobox className="data-[placeholder]:text-[var(--plume-muted)]" />
          </SelectField>
          <SelectChevron className="text-[var(--plume-muted)]" />
        </SelectTrigger>
        <SelectContent className="rounded-sm border border-border bg-surface p-1 text-foreground shadow-sm">
          {fruits.map((fruit) => (
            <SelectOption
              className="cursor-pointer rounded-sm px-3 py-1 data-[active]:bg-surface-muted"
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
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-4">
  <Select size="sm">
    <SelectTrigger aria-label="Size sm" placeholder="Size sm" />
    <SelectContent>
      <SelectOption value="apple">Apple</SelectOption>
      <SelectOption value="banana">Banana</SelectOption>
      <SelectOption value="cherry">Cherry</SelectOption>
    </SelectContent>
  </Select>
  <Select size="md">
    <SelectTrigger aria-label="Size md" placeholder="Size md" />
    <SelectContent>
      <SelectOption value="apple">Apple</SelectOption>
      <SelectOption value="banana">Banana</SelectOption>
      <SelectOption value="cherry">Cherry</SelectOption>
    </SelectContent>
  </Select>
  <Select size="lg">
    <SelectTrigger aria-label="Size lg" placeholder="Size lg" />
    <SelectContent>
      <SelectOption value="apple">Apple</SelectOption>
      <SelectOption value="banana">Banana</SelectOption>
      <SelectOption value="cherry">Cherry</SelectOption>
    </SelectContent>
  </Select>
</div>`,
      },
    },
  },
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
 * the ones you add. Tab to a field to see it. Here every color of the theme in the default `outline` variant.
 */
export const Colors: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-4">
  <Select colorScheme="primary">
    <SelectTrigger aria-label="primary" placeholder="primary" />
    <SelectContent>
      <SelectOption value="apple">Apple</SelectOption>
      <SelectOption value="banana">Banana</SelectOption>
      <SelectOption value="cherry">Cherry</SelectOption>
    </SelectContent>
  </Select>
  <Select colorScheme="success">
    <SelectTrigger aria-label="success" placeholder="success" />
    <SelectContent>
      <SelectOption value="apple">Apple</SelectOption>
      <SelectOption value="banana">Banana</SelectOption>
      <SelectOption value="cherry">Cherry</SelectOption>
    </SelectContent>
  </Select>
  <Select colorScheme="error">
    <SelectTrigger aria-label="error" placeholder="error" />
    <SelectContent>
      <SelectOption value="apple">Apple</SelectOption>
      <SelectOption value="banana">Banana</SelectOption>
      <SelectOption value="cherry">Cherry</SelectOption>
    </SelectContent>
  </Select>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      {colorSchemes.map((colorScheme) => (
        <Example
          colorScheme={colorScheme as ColorScheme}
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
 * chips with a `+N` for the rest (its text is the `overflow` label of `labels`), and `display="text"` shows the labels as
 * text instead of chips. The combobox announces the chosen options through a visually hidden `SelectChipsSummary`.
 */
export const Multiple: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-4">
  <Select defaultValue={['apple', 'mango']} multiple>
    <SelectTrigger aria-label="Fruits" placeholder="Pick fruits" />
    <SelectContent>
      <SelectOption value="apple">Apple</SelectOption>
      <SelectOption value="banana">Banana</SelectOption>
      <SelectOption value="cherry">Cherry</SelectOption>
      <SelectOption value="mango">Mango</SelectOption>
    </SelectContent>
  </Select>
  <Select defaultValue={['apple', 'banana', 'cherry', 'mango']} multiple>
    <SelectTrigger aria-label="At most two chips" maxDisplay={2} />
    <SelectContent>
      <SelectOption value="apple">Apple</SelectOption>
      <SelectOption value="banana">Banana</SelectOption>
      <SelectOption value="cherry">Cherry</SelectOption>
      <SelectOption value="mango">Mango</SelectOption>
    </SelectContent>
  </Select>
  <Select defaultValue={['apple', 'banana']} multiple>
    <SelectTrigger aria-label="As text" display="text" />
    <SelectContent>
      <SelectOption value="apple">Apple</SelectOption>
      <SelectOption value="banana">Banana</SelectOption>
      <SelectOption value="cherry">Cherry</SelectOption>
      <SelectOption value="mango">Mango</SelectOption>
    </SelectContent>
  </Select>
</div>`,
      },
    },
  },
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
 * left (**labels.empty** in the `Select`). The arrows and <kbd>Enter</kbd> work from the search box, and typing
 * on the closed trigger opens it with that text. The text of an option, or its `label`, is what is searched.
 */
export const Searchable: Story = {
  parameters: {
    docs: {
      story: { inline: false, iframeHeight: 420 },
      source: {
        code: `<div className="flex flex-col gap-4">
  <Select labels={{ empty: 'Nobody with that name', search: 'Search people' }} searchable>
    <SelectTrigger aria-label="Person" placeholder="Search a person" />
    <SelectContent searchPlaceholder="Search…">
      <SelectOption description="Engineering" value="ada">
        Ada Lovelace
      </SelectOption>
      <SelectOption description="Design" value="grace">
        Grace Hopper
      </SelectOption>
      <SelectOption description="Research" value="linus">
        Linus Torvalds
      </SelectOption>
    </SelectContent>
  </Select>
  <Select clearable labels={{ search: 'Search fruits' }} multiple searchable>
    <SelectTrigger aria-label="Fruits" placeholder="Search fruits" />
    <SelectContent>
      <SelectOption value="apple">Apple</SelectOption>
      <SelectOption value="banana">Banana</SelectOption>
      <SelectOption value="cherry">Cherry</SelectOption>
    </SelectContent>
  </Select>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Select labels={{ empty: 'Nobody with that name', search: 'Search people' }} searchable>
        <SelectTrigger aria-label="Person" placeholder="Search a person" />
        <SelectContent searchPlaceholder="Search…">
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
      <Select clearable labels={{ search: 'Search fruits' }} multiple searchable>
        <SelectTrigger aria-label="Fruits" placeholder="Search fruits" />
        <SelectContent>
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
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-4">
  <Select clearable defaultValue="mango">
    <SelectTrigger aria-label="Single" placeholder="Pick a fruit" />
    <SelectContent>
      <SelectOption value="apple">Apple</SelectOption>
      <SelectOption value="banana">Banana</SelectOption>
      <SelectOption value="mango">Mango</SelectOption>
    </SelectContent>
  </Select>
  <Select clearable defaultValue={['apple', 'mango']} multiple>
    <SelectTrigger aria-label="Multiple" placeholder="Pick a fruit" />
    <SelectContent>
      <SelectOption value="apple">Apple</SelectOption>
      <SelectOption value="banana">Banana</SelectOption>
      <SelectOption value="mango">Mango</SelectOption>
    </SelectContent>
  </Select>
</div>`,
      },
    },
  },
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
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [value, setValue] = useState(['apple'])
  const [open, setOpen] = useState(false)
  return (
    <div className="flex flex-col items-center gap-3">
      <Select multiple onOpenChange={setOpen} onValueChange={setValue} open={open} value={value}>
        <SelectTrigger aria-label="Fruits" placeholder="Pick fruits" />
        <SelectContent>
          <SelectOption value="apple">Apple</SelectOption>
          <SelectOption value="banana">Banana</SelectOption>
          <SelectOption value="cherry">Cherry</SelectOption>
        </SelectContent>
      </Select>
      <small>Chosen: {value.length > 0 ? value.join(', ') : 'nothing'}</small>
      <div className="flex gap-2">
        <Button
          label="Choose all"
          onClick={() => setValue(['apple', 'banana', 'cherry'])}
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
}`,
      },
    },
  },
  render: () => <ControlledExample />,
}

/**
 * A select can be **disabled**, **readOnly**, **required** and invalid (`aria-invalid`, which a `Field` sets). A
 * disabled option stays in the list, can't be chosen and is skipped by the arrows.
 */
export const States: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-4">
  <Select defaultValue="apple" disabled>
    <SelectTrigger aria-label="Disabled" placeholder="Pick a fruit" />
    <SelectContent>
      <SelectOption value="apple">Apple</SelectOption>
      <SelectOption value="banana">Banana</SelectOption>
      <SelectOption value="cherry">Cherry</SelectOption>
    </SelectContent>
  </Select>
  <Select defaultValue="apple" readOnly>
    <SelectTrigger aria-label="Read only" placeholder="Pick a fruit" />
    <SelectContent>
      <SelectOption value="apple">Apple</SelectOption>
      <SelectOption value="banana">Banana</SelectOption>
      <SelectOption value="cherry">Cherry</SelectOption>
    </SelectContent>
  </Select>
  <Select aria-invalid required>
    <SelectTrigger aria-label="Invalid" placeholder="Pick a fruit" />
    <SelectContent>
      <SelectOption value="apple">Apple</SelectOption>
      <SelectOption value="banana">Banana</SelectOption>
      <SelectOption value="cherry">Cherry</SelectOption>
    </SelectContent>
  </Select>
  <Select>
    <SelectTrigger aria-label="With a disabled option" placeholder="Pick a fruit" />
    <SelectContent>
      <SelectOption value="apple">Apple</SelectOption>
      <SelectOption disabled value="banana">
        Banana (sold out)
      </SelectOption>
      <SelectOption value="cherry">Cherry</SelectOption>
    </SelectContent>
  </Select>
</div>`,
      },
    },
  },
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
  parameters: {
    docs: {
      source: {
        code: `function Example() {
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
}`,
      },
    },
  },
  render: () => <FormExample />,
}

/**
 * Wrap the select in a `Field` to give it a label, a helper text and an error message. The Field names the select,
 * links its helper text and sets `disabled`, `readOnly`, `required` and `aria-invalid`.
 */
export const WithField: Story = {
  parameters: {
    docs: {
      story: { inline: false, iframeHeight: 460 },
      source: {
        code: `<div className="flex flex-col gap-6">
  <Field helperText="You can change it later." label="Favorite fruit">
    <Select>
      <SelectTrigger placeholder="Pick a fruit" />
      <SelectContent>
        <SelectOption value="apple">Apple</SelectOption>
        <SelectOption value="banana">Banana</SelectOption>
        <SelectOption value="cherry">Cherry</SelectOption>
      </SelectContent>
    </Select>
  </Field>
  <Field errorText="Pick at least one fruit." invalid label="Fruits" required>
    <Select multiple>
      <SelectTrigger placeholder="Pick fruits" />
      <SelectContent>
        <SelectOption value="apple">Apple</SelectOption>
        <SelectOption value="banana">Banana</SelectOption>
        <SelectOption value="cherry">Cherry</SelectOption>
      </SelectContent>
    </Select>
  </Field>
</div>`,
      },
    },
  },
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
 * Every element of the Select is a part you can place yourself. Here the arrow comes first, the group has its own
 * title, and the options show their icon, their text and their description in the order written. A part you leave
 * out is not rendered (this one has no clear button and no hidden input), and one you give `children` shows them
 * instead of its default content.
 */
export const Compound: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Select defaultValue="ada" searchable>
  <SelectTrigger aria-label="Person" placeholder="Pick a person">
    <SelectChevron />
    <SelectField>
      <SelectCombobox />
    </SelectField>
  </SelectTrigger>
  <SelectContent>
    <SelectSearch>
      <SelectSearchInput placeholder="Find a person" />
    </SelectSearch>
    <SelectList>
      <SelectGroup>
        <SelectGroupLabel>People</SelectGroupLabel>
        {people.map((person) => (
          <SelectOption key={person.value} value={person.value} icon={person.icon} description={person.description}>
            <SelectOptionIcon />
            <SelectOptionBody>
              <SelectOptionText>{person.name}</SelectOptionText>
              <SelectOptionDescription />
            </SelectOptionBody>
            <SelectOptionCheck />
          </SelectOption>
        ))}
      </SelectGroup>
    </SelectList>
    <SelectEmpty>Nobody with that name</SelectEmpty>
  </SelectContent>
</Select>`,
      },
    },
  },
  render: () => (
    <Select defaultValue="ada" searchable>
      <SelectTrigger aria-label="Person" placeholder="Pick a person">
        <SelectChevron />
        <SelectField>
          <SelectCombobox />
        </SelectField>
      </SelectTrigger>
      <SelectContent>
        <SelectSearch>
          <SelectSearchInput placeholder="Find a person" />
        </SelectSearch>
        <SelectList>
          <SelectGroup>
            <SelectGroupLabel>People</SelectGroupLabel>
            {people.map((person) => (
              <SelectOption
                description={person.description}
                icon={person.icon}
                key={person.value}
                value={person.value}
              >
                <SelectOptionIcon />
                <SelectOptionBody>
                  <SelectOptionText>{person.name}</SelectOptionText>
                  <SelectOptionDescription />
                </SelectOptionBody>
                <SelectOptionCheck />
              </SelectOption>
            ))}
          </SelectGroup>
        </SelectList>
        <SelectEmpty>Nobody with that name</SelectEmpty>
      </SelectContent>
    </Select>
  ),
}

/**
 * Some examples of Select with Tailwind classes. With `variant="unstyled"` the select has none of the Plume classes: `className` styles the control, each part takes its own `className`, and the option the arrows are on has `data-active`, so `data-[active]:` styles it, as `aria-selected:` and `aria-disabled:` do for the chosen and the disabled ones.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex w-72 max-w-full flex-col gap-4">
  <Select variant="unstyled">
    <SelectTrigger
      aria-label="Fruit"
      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus-within:border-blue-500 focus-within:ring-3 focus-within:ring-blue-200"
      placeholder="Pick a fruit"
    >
      <SelectField>
        <SelectCombobox className="data-[placeholder]:text-[var(--plume-muted)]" />
      </SelectField>
      <SelectChevron className="text-[var(--plume-muted)]" />
    </SelectTrigger>
    <SelectContent className="rounded-lg border border-border bg-surface p-1 shadow-lg">
      {fruits.map((fruit) => (
        <SelectOption
          className="cursor-pointer rounded-sm px-3 py-1.5 text-sm text-foreground data-[active]:bg-surface-muted aria-selected:font-semibold"
          key={fruit}
          value={fruit.toLowerCase()}
        >
          <SelectOptionBody>
            <SelectOptionText>{fruit}</SelectOptionText>
          </SelectOptionBody>
          <SelectOptionCheck className="text-blue-600" />
        </SelectOption>
      ))}
    </SelectContent>
  </Select>
  <Select
    clearable
    defaultValue={["apple", "mango"]}
    labels={{ search: "Search fruits" }}
    multiple
    searchable
    variant="unstyled"
  >
    <SelectTrigger
      aria-label="Fruits"
      className="w-full rounded-lg border border-border bg-surface px-2 py-1.5 text-sm text-foreground focus-within:border-emerald-500 focus-within:ring-3 focus-within:ring-emerald-200"
      placeholder="Search fruits"
    >
      <SelectField>
        <SelectChips>
          {(chosen) => (
            <SelectChip className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-900" option={chosen}>
              <ChipLabel>
                <span aria-hidden="true">{chosen.label}</span>
              </ChipLabel>
              <ChipRemove className="ml-1 rounded-full hover:bg-emerald-200" />
            </SelectChip>
          )}
        </SelectChips>
        <SelectCombobox className="px-1 data-[placeholder]:text-[var(--plume-muted)]" />
      </SelectField>
      <SelectClear className="mr-1 rounded-sm p-1 text-[var(--plume-muted)] hover:text-foreground" />
      <SelectChevron className="text-[var(--plume-muted)]" />
    </SelectTrigger>
    <SelectContent className="rounded-lg border border-border bg-surface shadow-lg">
      <SelectSearch className="border-b border-border p-2">
        <SelectSearchInput className="w-full rounded-sm border border-border bg-transparent px-2 py-1 text-sm" />
      </SelectSearch>
      <SelectList className="p-1">
        {fruits.map((fruit) => (
          <SelectOption
            className="flex cursor-pointer items-center gap-2 rounded-sm px-3 py-1.5 text-sm text-foreground data-[active]:bg-surface-muted"
            key={fruit}
            value={fruit.toLowerCase()}
          >
            <SelectOptionBody>
              <SelectOptionText>{fruit}</SelectOptionText>
            </SelectOptionBody>
            <SelectOptionCheck className="text-emerald-600" />
          </SelectOption>
        ))}
      </SelectList>
      <SelectEmpty className="p-3 text-center text-sm text-[var(--plume-muted)]" />
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
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus-within:border-blue-500 focus-within:ring-3 focus-within:ring-blue-200"
          placeholder="Pick a fruit"
        >
          <SelectField>
            <SelectCombobox className="data-[placeholder]:text-[var(--plume-muted)]" />
          </SelectField>
          <SelectChevron className="text-[var(--plume-muted)]" />
        </SelectTrigger>
        <SelectContent className="rounded-lg border border-border bg-surface p-1 shadow-lg">
          {fruits.map((fruit) => (
            <SelectOption
              className="cursor-pointer rounded-sm px-3 py-1.5 text-sm text-foreground data-[active]:bg-surface-muted aria-selected:font-semibold"
              key={fruit}
              value={fruit.toLowerCase()}
            >
              <SelectOptionBody>
                <SelectOptionText>{fruit}</SelectOptionText>
              </SelectOptionBody>
              <SelectOptionCheck className="text-blue-600" />
            </SelectOption>
          ))}
        </SelectContent>
      </Select>
      <Select
        clearable
        defaultValue={['apple', 'mango']}
        labels={{ search: 'Search fruits' }}
        multiple
        searchable
        variant="unstyled"
      >
        <SelectTrigger
          aria-label="Fruits"
          className="w-full rounded-lg border border-border bg-surface px-2 py-1.5 text-sm text-foreground focus-within:border-emerald-500 focus-within:ring-3 focus-within:ring-emerald-200"
          placeholder="Search fruits"
        >
          <SelectField>
            <SelectChips>
              {(chosen) => (
                <SelectChip className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-900" option={chosen}>
                  <ChipLabel>
                    <span aria-hidden="true">{chosen.label}</span>
                  </ChipLabel>
                  <ChipRemove className="ml-1 rounded-full hover:bg-emerald-200" />
                </SelectChip>
              )}
            </SelectChips>
            <SelectCombobox className="px-1 data-[placeholder]:text-[var(--plume-muted)]" />
          </SelectField>
          <SelectClear className="mr-1 rounded-sm p-1 text-[var(--plume-muted)] hover:text-foreground" />
          <SelectChevron className="text-[var(--plume-muted)]" />
        </SelectTrigger>
        <SelectContent className="rounded-lg border border-border bg-surface shadow-lg">
          <SelectSearch className="border-b border-border p-2">
            <SelectSearchInput className="w-full rounded-sm border border-border bg-transparent px-2 py-1 text-sm" />
          </SelectSearch>
          <SelectList className="p-1">
            {fruits.map((fruit) => (
              <SelectOption
                className="flex cursor-pointer items-center gap-2 rounded-sm px-3 py-1.5 text-sm text-foreground data-[active]:bg-surface-muted"
                key={fruit}
                value={fruit.toLowerCase()}
              >
                <SelectOptionBody>
                  <SelectOptionText>{fruit}</SelectOptionText>
                </SelectOptionBody>
                <SelectOptionCheck className="text-emerald-600" />
              </SelectOption>
            ))}
          </SelectList>
          <SelectEmpty className="p-3 text-center text-sm text-[var(--plume-muted)]" />
        </SelectContent>
      </Select>
    </div>
  ),
}

/**
 * Some examples of Select with Bootstrap classes: `form-control d-flex` on the control (`form-control` is `display: block`), `dropdown-menu show` and `dropdown-item` on the panel and its options, and `badge` for the chips. The option the arrows are on has `data-active`, which Bootstrap does not know, so a rule styles it.
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
      placeholder="Pick a fruit"
    >
      <SelectField>
        <SelectCombobox className="bg-transparent border-0 p-0" />
      </SelectField>
      <SelectChevron className="px-3 text-body-secondary" />
    </SelectTrigger>
    <SelectContent className="dropdown-menu show p-1">
      {fruits.map((fruit) => (
        <SelectOption className="dropdown-item rounded" key={fruit} value={fruit.toLowerCase()}>
          <SelectOptionBody>
            <SelectOptionText>{fruit}</SelectOptionText>
          </SelectOptionBody>
          <SelectOptionCheck className="text-primary" />
        </SelectOption>
      ))}
    </SelectContent>
  </Select>
  <Select clearable defaultValue={["apple", "mango"]} multiple variant="unstyled">
    <SelectTrigger
      aria-label="Fruits"
      className="form-control d-flex align-items-center ps-2 pe-0"
      placeholder="Pick fruits"
    >
      <SelectField>
        <SelectChips>
          {(chosen) => (
            <SelectChip className="badge text-bg-primary fw-normal" option={chosen}>
              <ChipLabel>
                <span aria-hidden="true">{chosen.label}</span>
              </ChipLabel>
              <ChipRemove className="ms-1 border-0 bg-transparent text-white" />
            </SelectChip>
          )}
        </SelectChips>
        <SelectCombobox className="bg-transparent border-0 p-1" />
      </SelectField>
      <SelectClear className="btn btn-sm border-0 text-body-secondary" />
      <SelectChevron className="px-3 text-body-secondary" />
    </SelectTrigger>
    <SelectContent className="dropdown-menu show p-1">
      {fruits.map((fruit) => (
        <SelectOption className="dropdown-item rounded" key={fruit} value={fruit.toLowerCase()}>
          <SelectOptionBody>
            <SelectOptionText>{fruit}</SelectOptionText>
          </SelectOptionBody>
          <SelectOptionCheck className="ms-auto text-success" />
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
          placeholder="Pick a fruit"
        >
          <SelectField>
            <SelectCombobox className="bg-transparent border-0 p-0" />
          </SelectField>
          <SelectChevron className="px-3 text-body-secondary" />
        </SelectTrigger>
        <SelectContent className="dropdown-menu show p-1">
          {fruits.map((fruit) => (
            <SelectOption
              className="dropdown-item rounded"
              key={fruit}
              value={fruit.toLowerCase()}
            >
              <SelectOptionBody>
                <SelectOptionText>{fruit}</SelectOptionText>
              </SelectOptionBody>
              <SelectOptionCheck className="text-primary" />
            </SelectOption>
          ))}
        </SelectContent>
      </Select>
      <Select clearable defaultValue={['apple', 'mango']} multiple variant="unstyled">
        <SelectTrigger
          aria-label="Fruits"
          className="form-control d-flex align-items-center ps-2 pe-0"
          placeholder="Pick fruits"
        >
          <SelectField>
            <SelectChips>
              {(chosen) => (
                <SelectChip className="badge text-bg-primary fw-normal" option={chosen}>
                  <ChipLabel>
                    <span aria-hidden="true">{chosen.label}</span>
                  </ChipLabel>
                  <ChipRemove className="ms-1 border-0 bg-transparent text-white" />
                </SelectChip>
              )}
            </SelectChips>
            <SelectCombobox className="bg-transparent border-0 p-1" />
          </SelectField>
          <SelectClear className="btn btn-sm border-0 text-body-secondary" />
          <SelectChevron className="px-3 text-body-secondary" />
        </SelectTrigger>
        <SelectContent className="dropdown-menu show p-1">
          {fruits.map((fruit) => (
            <SelectOption
              className="dropdown-item rounded"
              key={fruit}
              value={fruit.toLowerCase()}
            >
              <SelectOptionBody>
                <SelectOptionText>{fruit}</SelectOptionText>
              </SelectOptionBody>
              <SelectOptionCheck className="ms-auto text-success" />
            </SelectOption>
          ))}
        </SelectContent>
      </Select>
    </div>
  ),
}
