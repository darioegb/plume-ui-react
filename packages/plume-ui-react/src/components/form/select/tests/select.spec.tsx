import { act, render, screen, within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { Field } from '../../field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectOption,
  SelectTrigger,
  SelectValue,
  type SelectProps,
} from '..'

function Example({
  content,
  placeholder = 'Pick a fruit',
  ...props
}: Readonly<
  Partial<SelectProps> & { content?: React.ReactNode; placeholder?: string }
>): React.ReactNode {
  return (
    <Select {...(props as SelectProps)}>
      <SelectTrigger aria-label="Fruit" placeholder={placeholder} />
      <SelectContent>
        {content ?? (
          <>
            <SelectOption value="apple">Apple</SelectOption>
            <SelectOption value="banana">Banana</SelectOption>
            <SelectOption disabled value="cherry">
              Cherry
            </SelectOption>
            <SelectOption value="date">Date</SelectOption>
          </>
        )}
      </SelectContent>
    </Select>
  )
}

const trigger = (): HTMLElement => screen.getByRole('combobox', { name: 'Fruit' })
const control = (): HTMLElement =>
  trigger().closest<HTMLElement>('[data-plume-select-control]') as HTMLElement
const chips = (): string[] =>
  screen
    .queryAllByRole('button', { name: /^Remove / })
    .map((button) => button.getAttribute('aria-label')?.replace('Remove ', '') ?? '')
const listbox = (): HTMLElement => screen.getByRole('listbox')
const option = (name: string): HTMLElement => screen.getByRole('option', { name })
const active = (): string | null => trigger().getAttribute('aria-activedescendant')

describe('Select component', () => {
  describe('single', () => {
    it('is closed at first and shows the placeholder', () => {
      render(<Example />)
      expect(trigger()).toHaveAttribute('aria-expanded', 'false')
      expect(trigger().getAttribute('aria-controls')).toBe(
        screen.getByRole('listbox', { hidden: true }).id,
      )
      expect(trigger()).toHaveTextContent('Pick a fruit')
      expect(screen.queryByRole('listbox')).toBeNull()
    })

    it('opens with a click and marks the first option as active', async () => {
      render(<Example />)
      await userEvent.click(trigger())
      expect(trigger()).toHaveAttribute('aria-expanded', 'true')
      expect(listbox()).toBeVisible()
      expect(screen.getAllByRole('option')).toHaveLength(4)
      expect(active()).toBe(option('Apple').id)
    })

    it('names the listbox after the trigger', async () => {
      render(<Example />)
      await userEvent.click(trigger())
      expect(listbox()).toHaveAccessibleName('Fruit')
    })

    it('selects an option with a click, shows it and closes', async () => {
      const onValueChange = vi.fn()
      render(<Example onValueChange={onValueChange} />)
      await userEvent.click(trigger())
      await userEvent.click(option('Banana'))
      expect(onValueChange).toHaveBeenCalledWith('banana')
      expect(trigger()).toHaveTextContent('Banana')
      expect(screen.queryByRole('listbox')).toBeNull()
      expect(trigger()).toHaveFocus()
    })

    it('marks the chosen option as selected', async () => {
      render(<Example defaultValue="banana" />)
      await userEvent.click(trigger())
      expect(option('Banana')).toHaveAttribute('aria-selected', 'true')
      expect(option('Apple')).toHaveAttribute('aria-selected', 'false')
      expect(active()).toBe(option('Banana').id)
    })

    it('does not report a change when the same option is chosen', async () => {
      const onValueChange = vi.fn()
      render(<Example defaultValue="banana" onValueChange={onValueChange} />)
      await userEvent.click(trigger())
      await userEvent.click(option('Banana'))
      expect(onValueChange).not.toHaveBeenCalled()
    })

    it('shows the label of the default value', () => {
      render(<Example defaultValue="date" />)
      expect(trigger()).toHaveTextContent('Date')
    })

    it('follows the value prop', async () => {
      const onValueChange = vi.fn()
      const { rerender } = render(<Example onValueChange={onValueChange} value="apple" />)
      expect(trigger()).toHaveTextContent('Apple')
      await userEvent.click(trigger())
      await userEvent.click(option('Banana'))
      expect(onValueChange).toHaveBeenCalledWith('banana')
      expect(trigger()).toHaveTextContent('Apple')

      rerender(<Example onValueChange={onValueChange} value="banana" />)
      expect(trigger()).toHaveTextContent('Banana')
    })

    it('does not select a disabled option', async () => {
      const onValueChange = vi.fn()
      render(<Example onValueChange={onValueChange} />)
      await userEvent.click(trigger())
      await userEvent.click(option('Cherry'))
      expect(onValueChange).not.toHaveBeenCalled()
      expect(listbox()).toBeVisible()
      expect(option('Cherry')).toHaveAttribute('aria-disabled', 'true')
    })

    it('closes when the trigger is clicked again', async () => {
      render(<Example />)
      await userEvent.click(trigger())
      await userEvent.click(trigger())
      expect(screen.queryByRole('listbox')).toBeNull()
    })

    it('closes on a press outside without taking the focus back', async () => {
      render(
        <>
          <Example />
          <button>Other</button>
        </>,
      )
      await userEvent.click(trigger())
      await userEvent.click(screen.getByRole('button', { name: 'Other' }))
      expect(screen.queryByRole('listbox')).toBeNull()
      expect(screen.getByRole('button', { name: 'Other' })).toHaveFocus()
    })

    it('can be open at first', () => {
      render(<Example defaultOpen />)
      expect(listbox()).toBeVisible()
    })

    it('follows the open prop and reports the changes', async () => {
      const onOpenChange = vi.fn()
      const { rerender } = render(<Example onOpenChange={onOpenChange} open={false} />)
      await userEvent.click(trigger())
      expect(onOpenChange).toHaveBeenCalledWith(true)
      expect(screen.queryByRole('listbox')).toBeNull()

      rerender(<Example onOpenChange={onOpenChange} open />)
      expect(listbox()).toBeVisible()
    })

    it('stays open with closeOnSelect={false}', async () => {
      render(<Example closeOnSelect={false} />)
      await userEvent.click(trigger())
      await userEvent.click(option('Banana'))
      expect(listbox()).toBeVisible()
      expect(trigger()).toHaveTextContent('Banana')
    })

    it('shows the value through a render function', () => {
      render(
        <Select defaultValue="apple">
          <SelectTrigger aria-label="Fruit">
            <SelectValue>
              {(chosen) => <b>{chosen.map((item) => item.label).join('+')}</b>}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectOption value="apple">Apple</SelectOption>
          </SelectContent>
        </Select>,
      )
      expect(trigger()).toHaveTextContent('Apple')
      expect(within(trigger()).getByText('Apple').tagName).toBe('B')
    })

    it('uses the label prop of an option over its content', () => {
      render(
        <Select defaultValue="us">
          <SelectTrigger aria-label="Country" />
          <SelectContent>
            <SelectOption label="United States" value="us">
              <b>US</b>
            </SelectOption>
          </SelectContent>
        </Select>,
      )
      expect(screen.getByRole('combobox', { name: 'Country' })).toHaveTextContent('United States')
    })

    it('shows nothing when there is no placeholder and no value', () => {
      render(
        <Select>
          <SelectTrigger aria-label="Fruit" />
          <SelectContent>
            <SelectOption value="apple">Apple</SelectOption>
          </SelectContent>
        </Select>,
      )
      expect(trigger().textContent).toBe('')
    })
  })

  describe('keyboard', () => {
    it.each(['{ArrowDown}', '{ArrowUp}', '{Enter}', ' '])('opens with %s', async (key) => {
      render(<Example />)
      await userEvent.tab()
      await userEvent.keyboard(key)
      expect(listbox()).toBeVisible()
    })

    it('moves the active option with the arrows, skipping the disabled one, in a loop', async () => {
      render(<Example />)
      await userEvent.tab()
      await userEvent.keyboard('{ArrowDown}')
      expect(active()).toBe(option('Apple').id)
      await userEvent.keyboard('{ArrowDown}')
      expect(active()).toBe(option('Banana').id)
      await userEvent.keyboard('{ArrowDown}')
      expect(active()).toBe(option('Date').id)
      await userEvent.keyboard('{ArrowDown}')
      expect(active()).toBe(option('Apple').id)
      await userEvent.keyboard('{ArrowUp}')
      expect(active()).toBe(option('Date').id)
    })

    it('goes to the first and last option with Home and End', async () => {
      render(<Example />)
      await userEvent.tab()
      await userEvent.keyboard('{Enter}{End}')
      expect(active()).toBe(option('Date').id)
      await userEvent.keyboard('{Home}')
      expect(active()).toBe(option('Apple').id)
    })

    it('moves ten options with PageDown and PageUp, stopping at the ends', async () => {
      render(<Example />)
      await userEvent.tab()
      await userEvent.keyboard('{Enter}{PageDown}')
      expect(active()).toBe(option('Date').id)
      await userEvent.keyboard('{PageUp}')
      expect(active()).toBe(option('Apple').id)
    })

    it('selects the active option with Enter', async () => {
      const onValueChange = vi.fn()
      render(<Example onValueChange={onValueChange} />)
      await userEvent.tab()
      await userEvent.keyboard('{Enter}{ArrowDown}{Enter}')
      expect(onValueChange).toHaveBeenCalledWith('banana')
      expect(screen.queryByRole('listbox')).toBeNull()
      expect(trigger()).toHaveFocus()
    })

    it('selects the active option with Space', async () => {
      render(<Example />)
      await userEvent.tab()
      await userEvent.keyboard('{Enter}{ArrowDown} ')
      expect(trigger()).toHaveTextContent('Banana')
    })

    it('moves to the option that starts with the typed text', async () => {
      render(<Example />)
      await userEvent.tab()
      await userEvent.keyboard('{Enter}')
      await userEvent.keyboard('d')
      expect(active()).toBe(option('Date').id)
    })

    it('changes the value with typeahead while it is closed', async () => {
      const onValueChange = vi.fn()
      render(<Example onValueChange={onValueChange} />)
      await userEvent.tab()
      await userEvent.keyboard('b')
      expect(onValueChange).toHaveBeenCalledWith('banana')
      expect(screen.queryByRole('listbox')).toBeNull()
      expect(trigger()).toHaveTextContent('Banana')
    })

    it('does not change the value for text that matches nothing', async () => {
      render(<Example />)
      await userEvent.tab()
      await userEvent.keyboard('z')
      expect(trigger()).toHaveTextContent('Pick a fruit')
    })

    it('closes with Escape and gives the focus back to the trigger', async () => {
      render(<Example />)
      await userEvent.tab()
      await userEvent.keyboard('{Enter}{Escape}')
      expect(screen.queryByRole('listbox')).toBeNull()
      expect(trigger()).toHaveFocus()
    })

    it('closes with Tab', async () => {
      render(<Example />)
      await userEvent.tab()
      await userEvent.keyboard('{Enter}')
      await userEvent.keyboard('{Tab}')
      expect(screen.queryByRole('listbox')).toBeNull()
    })

    it('ignores the other keys', async () => {
      render(<Example />)
      await userEvent.tab()
      await userEvent.keyboard('{ArrowLeft}')
      expect(screen.queryByRole('listbox')).toBeNull()
    })

    it('marks the hovered option as active', async () => {
      render(<Example />)
      await userEvent.click(trigger())
      await userEvent.hover(option('Date'))
      expect(active()).toBe(option('Date').id)
      expect(option('Date')).toHaveAttribute('data-active')
    })

    it('selects a focused option with Enter or Space and ignores the other keys', async () => {
      render(<Example closeOnSelect={false} multiple />)
      await userEvent.click(trigger())
      act(() => option('Banana').focus())
      await userEvent.keyboard('a')
      expect(option('Banana')).toHaveAttribute('aria-selected', 'false')
      await userEvent.keyboard('{Enter}')
      expect(option('Banana')).toHaveAttribute('aria-selected', 'true')
      await userEvent.keyboard(' ')
      expect(option('Banana')).toHaveAttribute('aria-selected', 'false')
    })

    it('ignores Enter on a disabled option', async () => {
      render(<Example closeOnSelect={false} multiple />)
      await userEvent.click(trigger())
      act(() => option('Cherry').focus())
      await userEvent.keyboard('{Enter}')
      expect(option('Cherry')).toHaveAttribute('aria-selected', 'false')
    })

    it('keeps the focus on the trigger while open', async () => {
      render(<Example />)
      await userEvent.click(trigger())
      await userEvent.click(option('Banana'))
      await userEvent.click(trigger())
      expect(trigger()).toHaveFocus()
    })
  })

  describe('multiple', () => {
    it('toggles options and keeps the list open', async () => {
      const onValueChange = vi.fn()
      render(<Example multiple onValueChange={onValueChange} />)
      await userEvent.click(trigger())
      await userEvent.click(option('Apple'))
      await userEvent.click(option('Banana'))
      expect(onValueChange).toHaveBeenLastCalledWith(['apple', 'banana'])
      expect(listbox()).toBeVisible()
      expect(listbox()).toHaveAttribute('aria-multiselectable', 'true')

      await userEvent.click(option('Apple'))
      expect(onValueChange).toHaveBeenLastCalledWith(['banana'])
      expect(option('Apple')).toHaveAttribute('aria-selected', 'false')
    })

    it('shows the chosen options as chips', () => {
      render(<Example defaultValue={['apple', 'banana']} multiple />)
      expect(chips()).toEqual(['Apple', 'Banana'])
      expect(trigger()).toHaveTextContent('Apple, Banana')
      expect(control()).toHaveTextContent('AppleBanana')
    })

    it('limits the chips and counts the rest', () => {
      render(
        <Select defaultValue={['apple', 'banana', 'date']} multiple>
          <SelectTrigger aria-label="Fruit" maxDisplay={2} />
          <SelectContent>
            <SelectOption value="apple">Apple</SelectOption>
            <SelectOption value="banana">Banana</SelectOption>
            <SelectOption value="date">Date</SelectOption>
          </SelectContent>
        </Select>,
      )
      expect(chips()).toEqual(['Apple', 'Banana'])
      expect(control()).toHaveTextContent('+1')
    })

    it('shows the labels as text with display="text"', () => {
      render(
        <Select defaultValue={['a', 'b']} multiple>
          <SelectTrigger aria-label="Letters" display="text" />
          <SelectContent>
            <SelectOption value="a">A</SelectOption>
            <SelectOption value="b">B</SelectOption>
          </SelectContent>
        </Select>,
      )
      expect(screen.getByRole('combobox', { name: 'Letters' })).toHaveTextContent('A, B')
      expect(screen.queryByRole('button', { name: /^Remove / })).toBeNull()
    })

    it('shows the value of a multiple select through a SelectValue render function', () => {
      render(
        <Select defaultValue={['a', 'b']} multiple>
          <SelectTrigger aria-label="Letters">
            <SelectValue>{(chosen) => `${chosen.length} chosen`}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectOption value="a">A</SelectOption>
            <SelectOption value="b">B</SelectOption>
          </SelectContent>
        </Select>,
      )
      expect(screen.getByRole('combobox', { name: 'Letters' })).toHaveTextContent('2 chosen')
    })

    it('puts the chips before the field in the tab order', async () => {
      render(<Example defaultValue={['apple', 'banana']} multiple />)
      await userEvent.tab()
      expect(screen.getByRole('button', { name: 'Remove Apple' })).toHaveFocus()
      await userEvent.tab()
      expect(screen.getByRole('button', { name: 'Remove Banana' })).toHaveFocus()
      await userEvent.tab()
      expect(trigger()).toHaveFocus()
    })

    it('removes one option with the button of its chip', async () => {
      const onValueChange = vi.fn()
      render(<Example defaultValue={['apple', 'banana']} multiple onValueChange={onValueChange} />)
      await userEvent.click(screen.getByRole('button', { name: 'Remove Apple' }))
      expect(onValueChange).toHaveBeenCalledWith(['banana'])
      expect(chips()).toEqual(['Banana'])
      expect(screen.queryByRole('listbox')).toBeNull()
    })

    it('has no remove buttons when it is disabled or read only', () => {
      const { rerender } = render(<Example defaultValue={['apple']} disabled multiple />)
      expect(chips()).toEqual([])
      rerender(<Example defaultValue={['apple']} multiple readOnly />)
      expect(chips()).toEqual([])
    })

    it('names the remove buttons with removeLabel', () => {
      render(
        <Select defaultValue={['a']} multiple>
          <SelectTrigger aria-label="Letters" removeLabel={(label) => `Quitar ${label}`} />
          <SelectContent>
            <SelectOption value="a">A</SelectOption>
          </SelectContent>
        </Select>,
      )
      expect(screen.getByRole('button', { name: 'Quitar A' })).toBeInTheDocument()
    })

    it('removes the last option with Backspace and Delete', async () => {
      const onValueChange = vi.fn()
      render(<Example defaultValue={['apple', 'banana']} multiple onValueChange={onValueChange} />)
      act(() => trigger().focus())
      await userEvent.keyboard('{Backspace}')
      expect(onValueChange).toHaveBeenLastCalledWith(['apple'])
      await userEvent.keyboard('{Delete}')
      expect(onValueChange).toHaveBeenLastCalledWith([])
      await userEvent.keyboard('{Backspace}')
      expect(onValueChange).toHaveBeenCalledTimes(2)
    })

    it('does not choose by typeahead while closed', async () => {
      render(<Example multiple />)
      await userEvent.tab()
      await userEvent.keyboard('b')
      expect(trigger()).toHaveTextContent('Pick a fruit')
    })

    it('can close after each choice with closeOnSelect', async () => {
      render(<Example closeOnSelect multiple />)
      await userEvent.click(trigger())
      await userEvent.click(option('Apple'))
      expect(screen.queryByRole('listbox')).toBeNull()
    })

    it('follows the value array', async () => {
      function Controlled(): React.ReactNode {
        const [value, setValue] = useState<string[]>(['apple'])
        return <Example multiple onValueChange={setValue} value={value} />
      }
      render(<Controlled />)
      await userEvent.click(trigger())
      await userEvent.click(option('Banana'))
      expect(chips()).toEqual(['Apple', 'Banana'])
    })
  })

  describe('clearable', () => {
    it('clears the value with the clear button', async () => {
      const onValueChange = vi.fn()
      render(<Example clearable defaultValue="apple" onValueChange={onValueChange} />)
      await userEvent.click(screen.getByRole('button', { name: 'Clear' }))
      expect(onValueChange).toHaveBeenCalledWith('')
      expect(trigger()).toHaveTextContent('Pick a fruit')
      expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull()
    })

    it('has no clear button when there is no value or it is not clearable', () => {
      const { rerender } = render(<Example clearable />)
      expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull()
      rerender(<Example defaultValue="apple" />)
      expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull()
    })

    it('clears a single value with Backspace', async () => {
      render(<Example clearable defaultValue="apple" />)
      await userEvent.tab()
      await userEvent.keyboard('{Backspace}')
      expect(trigger()).toHaveTextContent('Pick a fruit')
    })

    it('keeps a single value that is not clearable on Backspace', async () => {
      render(<Example defaultValue="apple" />)
      await userEvent.tab()
      await userEvent.keyboard('{Backspace}')
      expect(trigger()).toHaveTextContent('Apple')
    })

    it('clears every option of a multiple select', async () => {
      const onValueChange = vi.fn()
      render(
        <Example
          clearable
          defaultValue={['apple', 'banana']}
          multiple
          onValueChange={onValueChange}
        />,
      )
      await userEvent.click(screen.getByRole('button', { name: 'Clear' }))
      expect(onValueChange).toHaveBeenCalledWith([])
    })

    it('names the clear button', () => {
      render(
        <Select clearable defaultValue="apple">
          <SelectTrigger aria-label="Fruit" clearLabel="Remove the fruit" />
          <SelectContent>
            <SelectOption value="apple">Apple</SelectOption>
          </SelectContent>
        </Select>,
      )
      expect(screen.getByRole('button', { name: 'Remove the fruit' })).toBeInTheDocument()
    })
  })

  describe('states', () => {
    it('does not open when it is disabled', async () => {
      render(<Example disabled />)
      expect(trigger()).toBeDisabled()
      await userEvent.click(trigger())
      expect(screen.queryByRole('listbox')).toBeNull()
    })

    it('does not open when it is read only', async () => {
      render(<Example defaultValue="apple" readOnly />)
      expect(trigger()).toHaveAttribute('aria-readonly', 'true')
      await userEvent.click(trigger())
      await userEvent.keyboard('{ArrowDown}')
      expect(screen.queryByRole('listbox')).toBeNull()
      expect(trigger()).toHaveTextContent('Apple')
    })

    it('does not change by typeahead when it is read only', async () => {
      render(<Example defaultValue="apple" readOnly />)
      await userEvent.tab()
      await userEvent.keyboard('b')
      expect(trigger()).toHaveTextContent('Apple')
    })

    it('is required and invalid for assistive technology', () => {
      render(<Example aria-invalid required />)
      expect(trigger()).toHaveAttribute('aria-required', 'true')
      expect(trigger()).toHaveAttribute('aria-invalid', 'true')
    })

    it('is not invalid with aria-invalid false', () => {
      render(<Example aria-invalid="false" />)
      expect(trigger()).not.toHaveAttribute('aria-invalid')
    })

    it('takes the described by of the Field', () => {
      render(<Example aria-describedby="hint" />)
      expect(trigger()).toHaveAttribute('aria-describedby', 'hint')
    })
  })

  describe('search', () => {
    it('shows a search box that takes the focus', async () => {
      render(<Example searchable />)
      await userEvent.click(trigger())
      const search = within(document.body).getByRole('combobox', { name: 'Search' })
      expect(search).toHaveFocus()
      expect(search).toHaveAttribute('aria-controls', listbox().id)
    })

    it('filters the options as the user types and shows a message when there are none', async () => {
      render(<Example searchable />)
      await userEvent.click(trigger())
      await userEvent.keyboard('ban')
      expect(screen.getAllByRole('option')).toHaveLength(1)
      expect(option('Banana')).toBeVisible()

      await userEvent.keyboard('x')
      expect(screen.queryByRole('option')).toBeNull()
      expect(screen.getByText('No results')).toBeInTheDocument()
    })

    it('uses its own empty text, label and placeholder', async () => {
      render(
        <Select searchable>
          <SelectTrigger aria-label="Fruit" />
          <SelectContent emptyText="Nothing" searchLabel="Find" searchPlaceholder="Type…">
            <SelectOption value="apple">Apple</SelectOption>
          </SelectContent>
        </Select>,
      )
      await userEvent.click(trigger())
      const search = screen.getByRole('combobox', { name: 'Find' })
      expect(search).toHaveAttribute('placeholder', 'Type…')
      await userEvent.keyboard('zz')
      expect(screen.getByText('Nothing')).toBeInTheDocument()
    })

    it('moves with the arrows and selects with Enter from the search box', async () => {
      render(<Example searchable />)
      await userEvent.click(trigger())
      await userEvent.keyboard('{ArrowDown}')
      const search = screen.getByRole('combobox', { name: 'Search' })
      expect(search.getAttribute('aria-activedescendant')).toBe(option('Banana').id)
      await userEvent.keyboard('{Enter}')
      expect(trigger()).toHaveTextContent('Banana')
      expect(trigger()).toHaveFocus()
    })

    it('does not use Home, End or Space as list keys in the search box', async () => {
      render(<Example searchable />)
      await userEvent.click(trigger())
      await userEvent.keyboard('{Home}{End} ')
      expect(listbox()).toBeVisible()
      expect(screen.getByRole('combobox', { name: 'Search' })).toHaveValue(' ')
    })

    it('closes with Escape and gives the focus back to the trigger', async () => {
      render(<Example searchable />)
      await userEvent.click(trigger())
      await userEvent.keyboard('{Escape}')
      expect(trigger()).toHaveFocus()
    })

    it('opens with the typed character on the closed trigger', async () => {
      render(<Example searchable />)
      await userEvent.tab()
      await userEvent.keyboard('d')
      expect(screen.getByRole('combobox', { name: 'Search' })).toHaveValue('d')
      expect(screen.getAllByRole('option')).toHaveLength(1)
    })

    it('clears the search when it closes', async () => {
      render(<Example searchable />)
      await userEvent.click(trigger())
      await userEvent.keyboard('ban{Escape}')
      await userEvent.click(trigger())
      expect(screen.getByRole('combobox', { name: 'Search' })).toHaveValue('')
      expect(screen.getAllByRole('option')).toHaveLength(4)
    })

    it('hides a group when none of its options match', async () => {
      render(
        <Example
          content={
            <>
              <SelectGroup label="Fruits">
                <SelectOption value="apple">Apple</SelectOption>
              </SelectGroup>
              <SelectGroup label="Vegetables">
                <SelectOption value="carrot">Carrot</SelectOption>
              </SelectGroup>
            </>
          }
          searchable
        />,
      )
      await userEvent.click(trigger())
      await userEvent.keyboard('car')
      expect(screen.getAllByRole('option')).toHaveLength(1)
      expect(option('Carrot')).toBeVisible()
    })
  })

  describe('options', () => {
    it('shows an icon and a description', async () => {
      render(
        <Example
          content={
            <SelectOption
              description="Red or green"
              icon={<img alt="" data-testid="icon" src="apple.png" />}
              value="apple"
            >
              Apple
            </SelectOption>
          }
          defaultValue="apple"
        />,
      )
      expect(within(trigger()).getAllByTestId('icon')).toHaveLength(1)
      await userEvent.click(trigger())
      expect(option('Apple Red or green')).toBeInTheDocument()
      const icons = screen.getAllByTestId('icon')
      icons.forEach((icon) => expect(icon.parentElement).toHaveAttribute('aria-hidden', 'true'))
    })

    it('shows the icon of an option in its chip', () => {
      render(
        <Example
          content={
            <SelectOption icon={<i data-testid="icon" />} value="apple">
              Apple
            </SelectOption>
          }
          defaultValue={['apple']}
          multiple
        />,
      )
      expect(within(control()).getAllByTestId('icon')).toHaveLength(1)
    })

    it('groups options under a label', async () => {
      render(
        <Example
          content={
            <SelectGroup label="Fruits">
              <SelectOption value="apple">Apple</SelectOption>
            </SelectGroup>
          }
        />,
      )
      await userEvent.click(trigger())
      expect(screen.getByRole('group', { name: 'Fruits' })).toContainElement(option('Apple'))
    })

    it('updates when an option changes its label and when it unmounts', async () => {
      function Dynamic(): React.ReactNode {
        const [items, setItems] = useState(['apple', 'banana'])
        return (
          <>
            <button onClick={() => setItems(['banana'])}>Remove</button>
            <Select defaultValue="apple">
              <SelectTrigger aria-label="Fruit" />
              <SelectContent>
                {items.map((item) => (
                  <SelectOption key={item} value={item}>
                    {item}
                  </SelectOption>
                ))}
              </SelectContent>
            </Select>
          </>
        )
      }
      render(<Dynamic />)
      expect(trigger()).toHaveTextContent('apple')
      await userEvent.click(screen.getByRole('button', { name: 'Remove' }))
      expect(trigger().textContent).toBe('')
    })
  })

  describe('forms', () => {
    it('submits the value with its name', () => {
      const { container } = render(<Example defaultValue="apple" name="fruit" />)
      const input = container.querySelector<HTMLInputElement>('input[name="fruit"]')
      expect(input).toHaveValue('apple')
    })

    it('submits an empty value when nothing is chosen', () => {
      const { container } = render(<Example name="fruit" />)
      expect(container.querySelector('input[name="fruit"]')).toHaveValue('')
    })

    it('submits one value for each chosen option when it is multiple', () => {
      const { container } = render(
        <Example defaultValue={['apple', 'date']} multiple name="fruit" />,
      )
      const values = Array.from(
        container.querySelectorAll<HTMLInputElement>('input[name="fruit"]'),
      ).map((input) => input.value)
      expect(values).toEqual(['apple', 'date'])
    })

    it('renders no input without a name', () => {
      const { container } = render(<Example defaultValue="apple" />)
      expect(container.querySelector('input')).toBeNull()
    })
  })

  describe('inside a Field', () => {
    it('is named by the label and described by the helper text', async () => {
      render(
        <Field helperText="Pick one" label="Favorite fruit">
          <Select>
            <SelectTrigger placeholder="Pick a fruit" />
            <SelectContent>
              <SelectOption value="apple">Apple</SelectOption>
            </SelectContent>
          </Select>
        </Field>,
      )
      const control = screen.getByRole('combobox', { name: 'Favorite fruit' })
      expect(control).toHaveAccessibleDescription('Pick one')
      await userEvent.click(control)
      expect(screen.getByRole('listbox')).toHaveAccessibleName('Favorite fruit')
    })

    it('is disabled, required and invalid like the Field says', () => {
      render(
        <Field disabled errorText="Required" invalid label="Fruit" required>
          <Select>
            <SelectTrigger placeholder="Pick a fruit" />
            <SelectContent>
              <SelectOption value="apple">Apple</SelectOption>
            </SelectContent>
          </Select>
        </Field>,
      )
      const control = screen.getByRole('combobox')
      expect(control).toBeDisabled()
      expect(control).toHaveAttribute('aria-required', 'true')
      expect(control).toHaveAttribute('aria-invalid', 'true')
      expect(control).toHaveAccessibleDescription('Required')
    })

    it('keeps its own aria-label over the label of the Field', () => {
      render(
        <Field label="Fruit">
          <Select>
            <SelectTrigger aria-label="Mine" />
            <SelectContent>
              <SelectOption value="apple">Apple</SelectOption>
            </SelectContent>
          </Select>
        </Field>,
      )
      expect(screen.getByRole('combobox', { name: 'Mine' })).toBeInTheDocument()
    })

    it('uses its own aria-labelledby', () => {
      render(
        <>
          <span id="title">Title</span>
          <Select>
            <SelectTrigger aria-labelledby="title" />
            <SelectContent>
              <SelectOption value="apple">Apple</SelectOption>
            </SelectContent>
          </Select>
        </>,
      )
      expect(screen.getByRole('combobox', { name: 'Title' })).toBeInTheDocument()
    })
  })

  describe('rendering', () => {
    it('is an outline medium select by default', () => {
      render(<Example />)
      expect(control()).toHaveClass('control', 'outline', 'md', 'rounded')
    })

    it.each(['outline', 'filled', 'underline'] as const)('supports the %s variant', (variant) => {
      render(<Example variant={variant} />)
      expect(control()).toHaveClass(variant)
    })

    it.each(['sm', 'md', 'lg'] as const)('supports the %s size', (size) => {
      render(<Example size={size} />)
      expect(control()).toHaveClass(size)
    })

    it('supports the pill shape and the invalid and disabled looks', () => {
      render(<Example aria-invalid disabled shape="pill" />)
      expect(control()).toHaveClass('pill', 'invalid', 'disabled')
    })

    it('sets the color of the focus ring from the color scheme', () => {
      render(<Example colorScheme="primary" />)
      expect(control()).toHaveStyle({
        '--select-color': 'var(--plume-color-primary-text)',
      })
    })

    it('keeps the className and style of the trigger, the content, the option and the group', async () => {
      render(
        <Select>
          <SelectTrigger aria-label="Fruit" className="trigger-mine" style={{ width: '200px' }} />
          <SelectContent className="content-mine">
            <SelectGroup className="group-mine" label="Fruits">
              <SelectOption className="option-mine" style={{ color: 'red' }} value="apple">
                Apple
              </SelectOption>
            </SelectGroup>
          </SelectContent>
        </Select>,
      )
      expect(control()).toHaveClass('control', 'trigger-mine')
      expect(control()).toHaveStyle({ width: '200px' })
      await userEvent.click(trigger())
      expect(listbox().parentElement).toHaveClass('panel', 'content-mine')
      expect(option('Apple')).toHaveClass('option', 'option-mine')
      expect(option('Apple')).toHaveStyle({ color: 'rgb(255, 0, 0)' })
      expect(screen.getByRole('group')).toHaveClass('group', 'group-mine')
    })

    it('drops the Plume classes when unstyled', async () => {
      render(
        <Select clearable defaultValue={['apple']} multiple searchable variant="unstyled">
          <SelectTrigger aria-label="Fruit" className="trigger-mine" />
          <SelectContent className="content-mine">
            <SelectGroup label="Fruits">
              <SelectOption description="d" icon={<i />} value="apple">
                Apple
              </SelectOption>
            </SelectGroup>
          </SelectContent>
        </Select>,
      )
      expect(control()).toHaveAttribute('class', 'trigger-mine')
      expect(trigger()).not.toHaveAttribute('class')
      await userEvent.click(trigger())
      expect(listbox().parentElement).toHaveAttribute('class', 'content-mine')
      expect(screen.getByRole('option')).not.toHaveAttribute('class')
      expect(screen.getByRole('group')).not.toHaveAttribute('class')
    })

    it('places the list with a fixed position', async () => {
      render(<Example />)
      await userEvent.click(trigger())
      expect(listbox().parentElement).toHaveStyle({ position: 'fixed' })
      expect(listbox().parentElement).toHaveAttribute('data-placement')
    })

    it('forwards the refs of the trigger, the content, the option and the group', () => {
      const triggerRef = createRef<HTMLButtonElement>()
      const contentRef = createRef<HTMLDivElement>()
      const optionRef = createRef<HTMLDivElement>()
      const groupRef = createRef<HTMLDivElement>()
      render(
        <Select>
          <SelectTrigger aria-label="Fruit" ref={triggerRef} />
          <SelectContent ref={contentRef}>
            <SelectGroup label="Fruits" ref={groupRef}>
              <SelectOption ref={optionRef} value="apple">
                Apple
              </SelectOption>
            </SelectGroup>
          </SelectContent>
        </Select>,
      )
      expect(triggerRef.current).toBe(trigger())
      expect(contentRef.current).toBe(screen.getByRole('listbox', { hidden: true }).parentElement)
      expect(optionRef.current).toBe(screen.getByRole('option', { hidden: true }))
      expect(groupRef.current).toBe(screen.getByRole('group', { hidden: true }))
    })
  })

  describe('usage', () => {
    it.each([
      ['SelectTrigger', <SelectTrigger key="a" />],
      ['SelectContent', <SelectContent key="b">x</SelectContent>],
      [
        'SelectOption',
        <SelectOption key="c" value="a">
          x
        </SelectOption>,
      ],
      ['SelectGroup', <SelectGroup key="d" label="x" />],
      ['SelectValue', <SelectValue key="e" />],
    ])('throws when %s is outside of a Select', (name, part) => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
      expect(() => render(part)).toThrow(`${name} must be used within a <Select>`)
      error.mockRestore()
    })
  })

  describe('classNames', () => {
    function Parts({ variant }: Readonly<{ variant?: 'unstyled' }>): React.ReactNode {
      return (
        <Select clearable defaultValue={['apple']} multiple searchable variant={variant}>
          <SelectTrigger
            aria-label="Fruit"
            classNames={{
              chevron: 'my-chevron',
              chip: 'my-chip',
              chipRemove: 'my-remove',
              clear: 'my-clear',
              field: 'my-field',
              trigger: 'my-trigger',
            }}
            maxDisplay={1}
          />
          <SelectContent
            classNames={{
              empty: 'my-empty',
              list: 'my-list',
              search: 'my-search',
              searchInput: 'my-search-input',
            }}
          >
            <SelectGroup classNames={{ label: 'my-group-label' }} label="Fruits">
              <SelectOption
                classNames={{
                  check: 'my-check',
                  description: 'my-description',
                  icon: 'my-icon',
                }}
                description="Red"
                icon={<i />}
                value="apple"
              >
                Apple
              </SelectOption>
              <SelectOption value="banana">Banana</SelectOption>
            </SelectGroup>
          </SelectContent>
        </Select>
      )
    }

    it('adds a class to each part', async () => {
      render(<Parts />)
      await userEvent.click(trigger())
      await userEvent.keyboard('zz')
      expect(trigger()).toHaveClass('trigger', 'my-trigger')
      expect(trigger().parentElement).toHaveClass('field', 'my-field')
      expect(screen.getByRole('button', { name: 'Remove Apple' })).toHaveClass('my-remove')
      expect(screen.getByRole('button', { name: 'Clear' })).toHaveClass('my-clear')
      expect(control().querySelector('[data-plume-select-chevron]')).toHaveClass(
        'chevron',
        'my-chevron',
      )
      expect(control().querySelector('[data-plume-chip]')).toHaveClass('chip', 'my-chip')
      expect(listbox()).toHaveClass('list', 'my-list')
      expect(screen.getByRole('combobox', { name: 'Search' }).parentElement).toHaveClass(
        'search',
        'my-search',
      )
      expect(screen.getByRole('combobox', { name: 'Search' })).toHaveClass('my-search-input')
      expect(screen.getByText('No results')).toHaveClass('empty', 'my-empty')
      expect(screen.getByText('Fruits')).toHaveClass('groupLabel', 'my-group-label')
    })

    it('adds a class to the parts of an option', async () => {
      render(<Parts />)
      await userEvent.click(trigger())
      const apple = screen.getByRole('option', { name: /Apple/ })
      expect(apple.querySelector('.my-icon')).not.toBeNull()
      expect(apple.querySelector('.my-description')).not.toBeNull()
    })

    it('marks a chosen option with the same check in a multiple select', async () => {
      render(
        <Select defaultValue={['apple']} multiple>
          <SelectTrigger aria-label="Fruit" />
          <SelectContent>
            <SelectOption classNames={{ check: 'my-check' }} value="apple">
              Apple
            </SelectOption>
            <SelectOption classNames={{ check: 'my-check' }} value="banana">
              Banana
            </SelectOption>
          </SelectContent>
        </Select>,
      )
      await userEvent.click(trigger())
      expect(option('Apple').querySelector('.my-check')).not.toBeNull()
      expect(option('Banana').querySelector('.my-check')).toBeNull()
      expect(option('Apple').querySelector('input')).toBeNull()
    })

    it('adds a class to the check of a single option', async () => {
      render(
        <Select defaultValue="apple">
          <SelectTrigger aria-label="Fruit" />
          <SelectContent>
            <SelectOption classNames={{ check: 'my-check' }} value="apple">
              Apple
            </SelectOption>
          </SelectContent>
        </Select>,
      )
      await userEvent.click(trigger())
      expect(option('Apple').querySelector('.my-check')).not.toBeNull()
    })

    it('are the only classes of the parts when unstyled', async () => {
      render(<Parts variant="unstyled" />)
      await userEvent.click(trigger())
      expect(trigger()).toHaveAttribute('class', 'my-trigger')
      expect(trigger().parentElement).toHaveAttribute('class', 'my-field')
      expect(screen.getByRole('button', { name: 'Remove Apple' })).toHaveAttribute(
        'class',
        'my-remove',
      )
      expect(listbox()).toHaveAttribute('class', 'my-list')
    })
  })
})
