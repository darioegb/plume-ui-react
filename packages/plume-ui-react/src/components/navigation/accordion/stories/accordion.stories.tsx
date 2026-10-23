import type { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { defaultTheme } from '../../../../theme'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

const questions = [
  {
    answer: 'Install the package and wrap your app in the ThemeProvider.',
    title: 'How do I install it?',
  },
  {
    answer: 'Yes. Every component has an unstyled variant that keeps only your classes.',
    title: 'Can I use Tailwind?',
  },
  {
    answer: 'It follows the WAI-ARIA accordion pattern, with the keyboard shortcuts it describes.',
    title: 'Is it accessible?',
  },
]

function Items({ disabled }: Readonly<{ disabled?: string }>): React.ReactNode {
  return questions.map(({ answer, title }) => (
    <AccordionItem disabled={disabled === title} key={title} value={title}>
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent>{answer}</AccordionContent>
    </AccordionItem>
  ))
}

/**
 * A stack of headings that each show or hide a section of content. Use it to shorten a page with content the
 * reader may not need, like an FAQ or a settings panel.
 *
 * It follows the WAI-ARIA accordion pattern: every trigger is a `<button>` inside a heading, with
 * `aria-expanded` and `aria-controls`, and its panel is a `region` named by the trigger. <kbd>Enter</kbd> and
 * <kbd>Space</kbd> toggle the item, <kbd>↑</kbd> and <kbd>↓</kbd> move between the triggers (a disabled one is
 * skipped), and <kbd>Home</kbd> and <kbd>End</kbd> go to the first and the last. A closed panel is not
 * reachable with the keyboard or a screen reader, and the height animation is turned off with
 * `prefers-reduced-motion`.
 *
 * Every open panel is a `region` named by its title, so two open items with the same title leave the page with
 * landmarks that can't be told apart: give each item its own title. With many panels, a long list of landmarks is
 * noise for a screen reader user, so keep an accordion to a handful of items or open only the ones that matter.
 *
 * With `type="single"` (the default) one item is open at a time; with `type="multiple"` any number. Every item
 * has a `value`, and the accordion keeps the open ones in `value` / `defaultValue` (a string, or a list of
 * strings with `multiple`).
 *
 * ### Subcomponents
 *
 * | Component | Props |
 * | --- | --- |
 * | `AccordionItem` | `value`, `disabled`, `id`, `title`, `hidden`, `className`, `style`, `children`. One section. `value` identifies it and is required. It has `data-open` and `data-disabled` to style it. |
 * | `AccordionTrigger` | `headingLevel`, `icon`, `classNames`, `title`, `className`, `style`, `children`. The button that toggles the item. `headingLevel` (`1` to `6`, `3` by default) is the heading around it, so choose the one that fits your page. `icon` replaces the chevron, and `null` removes it. `className` goes to the button and `classNames` styles its parts, `heading` and `icon`. The button has `data-open` while its item is open. |
 * | `AccordionContent` | `classNames.body`, `title`, `className`, `style`, `children`. The panel, a `<section>`. `className` goes to the panel, which only animates its height, and `classNames.body` to the box with the content, which is where the padding goes. |
 */
export default {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    docs: {
      importNames: ['Accordion', 'AccordionItem', 'AccordionTrigger', 'AccordionContent'],
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
      description: 'The `AccordionItem` parts of the Accordion.',
      table: { type: { summary: 'ReactNode' } },
    },
    className: {
      control: 'text',
      description: 'Custom CSS class for the Accordion.',
      table: { type: { summary: 'string' } },
    },
    style: {
      control: false,
      description:
        'Inline styles for the Accordion. They are applied after the color variables, so they can override them (e.g. `--accordion-text`).',
      table: { type: { summary: 'CSSProperties' } },
    },
    type: {
      control: 'radio',
      description: 'With `single` one item is open at a time, with `multiple` any number can be.',
      options: ['single', 'multiple'],
      table: { type: { summary: `"single" | "multiple"` }, defaultValue: { summary: 'single' } },
    },
    value: {
      control: false,
      description:
        'The open item, or the open items with `type="multiple"`. Makes the Accordion controlled: pass `onValueChange` to update it. An empty string means none.',
      table: { type: { summary: 'string | string[]' } },
    },
    defaultValue: {
      control: false,
      description:
        'The item that starts open, or the items with `type="multiple"`, when it is not controlled.',
      table: { type: { summary: 'string | string[]' } },
    },
    onValueChange: {
      control: false,
      description:
        'Called with the new value: the open item (an empty string when all close) or, with `multiple`, the list of open items.',
      table: { category: 'Events', type: { summary: '(value: string | string[]) => void' } },
    },
    collapsible: {
      control: 'boolean',
      description:
        'With `type="single"`, lets the user close the open item. Without it one item always stays open. It has no effect with `multiple`.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables every item. An item can also be disabled on its own.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    colorScheme: {
      control: 'select',
      description:
        'Color scheme from the theme palette, including custom schemes added to it. It colors the open title and the focus ring.',
      options: colorSchemes,
      table: { type: { summary: 'ColorScheme' }, defaultValue: { summary: 'primary' } },
    },
    size: {
      control: 'radio',
      description: 'Size of the Accordion.',
      options: ['sm', 'md', 'lg'],
      table: { type: { summary: `"sm" | "md" | "lg"` }, defaultValue: { summary: 'md' } },
    },
    variant: {
      control: 'radio',
      description:
        'Visual variant. `outline` draws one border around the items, `filled` gives each item its own background. `unstyled` drops the Plume styles so you can bring your own; the animation keeps working.',
      options: ['outline', 'filled', 'unstyled'],
      table: {
        type: { summary: `"outline" | "filled" | "unstyled"` },
        defaultValue: { summary: 'outline' },
      },
    },
    id: {
      control: false,
      description: 'Id of the Accordion.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    title: {
      control: 'text',
      description: 'Native tooltip of the Accordion.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    hidden: {
      control: false,
      description: 'Hides the Accordion.',
      table: { category: 'HTML attributes', type: { summary: 'boolean' } },
    },
    'aria-label': {
      control: false,
      description: 'Accessible name of the Accordion.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    'aria-labelledby': {
      control: false,
      description: 'Id of the element that names the Accordion.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
  },
  args: {
    children: <Items />,
    style: { width: '28rem', maxWidth: '100%' },
  },
} satisfies Meta<typeof Accordion>

type Story = StoryObj<typeof Accordion>

/**
 * This is the default Accordion: one item open at a time, and the open one can be closed.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick how the Accordion looks. `unstyled` drops the Plume styles so you can style it
 * yourself.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-6" style={{ width: '28rem', maxWidth: '100%' }}>
      <Accordion defaultValue={questions[0].title} variant="outline">
        <Items />
      </Accordion>
      <Accordion defaultValue={questions[1].title} variant="filled">
        <Items />
      </Accordion>
      <Accordion defaultValue={questions[2].title} variant="unstyled">
        {questions.map(({ answer, title }) => (
          <AccordionItem className="border-b border-gray-300" key={title} value={title}>
            <AccordionTrigger className="py-2 text-left font-bold">{title}</AccordionTrigger>
            <AccordionContent classNames={{ body: 'pb-2' }}>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  ),
}

/**
 * Use the **size** prop to change the size.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6" style={{ width: '28rem', maxWidth: '100%' }}>
      {(['sm', 'md', 'lg'] as const).map((size, position) => (
        <Accordion defaultValue={questions[position].title} key={size} size={size}>
          <Items />
        </Accordion>
      ))}
    </div>
  ),
}

/**
 * Use the **colorScheme** prop to pick a color from the theme. It colors the title of the open item and the focus
 * ring.
 */
export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-4" style={{ width: '28rem', maxWidth: '100%' }}>
      {colorSchemes.map((scheme) => (
        <Accordion
          colorScheme={scheme as keyof typeof defaultTheme.colors}
          defaultValue={scheme}
          key={scheme}
        >
          <AccordionItem value={scheme}>
            <AccordionTrigger>{scheme}</AccordionTrigger>
            <AccordionContent>The title of the open item uses the {scheme} color.</AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  ),
}

/**
 * With `type="multiple"` any number of items can be open at once. `defaultValue` is then a list.
 */
export const Multiple: Story = {
  args: {
    defaultValue: [questions[0].title, questions[2].title],
    type: 'multiple',
  },
}

/**
 * Without **collapsible**, one item always stays open: clicking the open item does nothing.
 */
export const NotCollapsible: Story = {
  args: {
    collapsible: false,
    defaultValue: questions[0].title,
  },
}

function ControlledAccordion(): React.ReactNode {
  const [value, setValue] = useState(questions[1].title)
  return (
    <div className="flex flex-col items-start gap-4" style={{ width: '28rem', maxWidth: '100%' }}>
      <div className="flex flex-wrap gap-2">
        {questions.map(({ title }) => (
          <button
            className="rounded border border-gray-400 px-2 py-1 text-sm"
            key={title}
            onClick={() => setValue(title)}
            type="button"
          >
            Open “{title}”
          </button>
        ))}
      </div>
      <div style={{ width: '100%' }}>
        <Accordion onValueChange={setValue} value={value}>
          <Items />
        </Accordion>
      </div>
      <p className="text-sm">Open item: {value || 'none'}</p>
    </div>
  )
}

/**
 * Pass **value** and **onValueChange** to control the Accordion, for example to open an item from outside. With
 * `type="single"` the value is a string, and an empty one means that none is open.
 */
export const Controlled: Story = {
  render: () => <ControlledAccordion />,
}

/**
 * Use **icon** on a trigger to replace the chevron, or `icon={null}` to remove it. The icon is decorative and
 * hidden from screen readers. The trigger has `data-open` while its item is open, so you can style the icon with
 * it.
 */
export const CustomIcon: Story = {
  render: () => (
    <Accordion defaultValue="plus" style={{ width: '28rem', maxWidth: '100%' }}>
      <AccordionItem value="plus">
        <AccordionTrigger classNames={{ icon: 'font-bold' }} icon={<span>+</span>}>
          With a plus sign
        </AccordionTrigger>
        <AccordionContent>The icon is whatever you pass.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="none">
        <AccordionTrigger icon={null}>Without an icon</AccordionTrigger>
        <AccordionContent>Nothing next to the title.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

/**
 * A disabled item can't be opened or focused. Use **disabled** on the Accordion to disable all of them.
 */
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-6" style={{ width: '28rem', maxWidth: '100%' }}>
      <Accordion defaultValue={questions[0].title}>
        <Items disabled={questions[1].title} />
      </Accordion>
      <Accordion disabled>
        <Items />
      </Accordion>
    </div>
  ),
}

/**
 * Some examples of Accordion with Tailwind classes. With `variant="unstyled"` the Plume classes are gone and the
 * structure that makes it work stays (the panel animates its height by itself). Style the parts with their own
 * classes, and use `data-[open]:` on the trigger and the item for the open state.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Accordion
  className="w-96 max-w-full divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface text-sm text-foreground"
  defaultValue="install"
  variant="unstyled"
>
  <AccordionItem value="install">
    <AccordionTrigger
      className="group px-4 py-3 font-semibold hover:bg-surface-muted data-[open]:text-primary-text"
      classNames={{ icon: "transition-transform group-data-[open]:rotate-180" }}
    >
      How do I install it?
    </AccordionTrigger>
    <AccordionContent classNames={{ body: 'px-4 pb-4' }} className="transition-[grid-template-rows] duration-200">
      Run pnpm add plume-ui-react.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="tailwind">
    <AccordionTrigger
      className="group px-4 py-3 font-semibold hover:bg-surface-muted data-[open]:text-primary-text"
      classNames={{ icon: "transition-transform group-data-[open]:rotate-180" }}
    >
      Can I use Tailwind?
    </AccordionTrigger>
    <AccordionContent classNames={{ body: 'px-4 pb-4' }} className="transition-[grid-template-rows] duration-200">
      Yes, that is what this is.
    </AccordionContent>
  </AccordionItem>
</Accordion>`,
      },
    },
  },
  render: () => (
    <Accordion
      className="w-96 max-w-full divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface text-sm text-foreground"
      defaultValue={questions[0].title}
      variant="unstyled"
    >
      {questions.slice(0, 2).map(({ answer, title }) => (
        <AccordionItem key={title} value={title}>
          <AccordionTrigger
            className="group px-4 py-3 font-semibold hover:bg-surface-muted data-[open]:text-primary-text"
            classNames={{ icon: 'transition-transform group-data-[open]:rotate-180' }}
          >
            {title}
          </AccordionTrigger>
          <AccordionContent classNames={{ body: 'px-4 pb-4' }}
           
            className="transition-[grid-template-rows] duration-200"
          >
            {answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
}

function BootstrapAccordion(): React.ReactNode {
  const [value, setValue] = useState(questions[0].title)
  return (
    <Accordion
      className="accordion"
      onValueChange={setValue}
      style={{ width: '28rem', maxWidth: '100%' }}
      value={value}
      variant="unstyled"
    >
      {questions.slice(0, 2).map(({ answer, title }) => (
        <AccordionItem className="accordion-item" key={title} value={title}>
          <AccordionTrigger
            className={`accordion-button${value === title ? '' : ' collapsed'}`}
            classNames={{ heading: 'accordion-header' }}
            icon={null}
          >
            {title}
          </AccordionTrigger>
          <AccordionContent classNames={{ body: 'accordion-body' }}>{answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

/**
 * Some examples of Accordion with Bootstrap classes: `accordion`, `accordion-item`, `accordion-header`,
 * `accordion-button` and `accordion-body`. Bootstrap styles the open button with `:not(.collapsed)` and draws its
 * own arrow, so the trigger has `icon={null}` and the story adds `collapsed` to the closed ones, from the value
 * it controls.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `const [value, setValue] = useState("install")

<Accordion className="accordion" onValueChange={setValue} value={value} variant="unstyled">
  <AccordionItem className="accordion-item" value="install">
    <AccordionTrigger
      className={\`accordion-button\${value === "install" ? "" : " collapsed"}\`}
      classNames={{ heading: "accordion-header" }}
      icon={null}
    >
      How do I install it?
    </AccordionTrigger>
    <AccordionContent classNames={{ body: 'accordion-body' }}>Run pnpm add plume-ui-react.</AccordionContent>
  </AccordionItem>
</Accordion>`,
      },
    },
  },
  render: () => <BootstrapAccordion />,
}
