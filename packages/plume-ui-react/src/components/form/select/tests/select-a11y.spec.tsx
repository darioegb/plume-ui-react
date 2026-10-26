import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { Select, SelectContent, SelectOption, SelectTrigger } from '..'

const fruits = (
  <>
    <SelectOption value="apple">Apple</SelectOption>
    <SelectOption value="banana">Banana</SelectOption>
  </>
)

describe('Select accessibility', () => {
  it('keeps the message of an empty search in a live region that is always there', async () => {
    render(
      <Select searchable>
        <SelectTrigger aria-label="Fruit" />
        <SelectContent>{fruits}</SelectContent>
      </Select>,
    )
    await userEvent.click(screen.getByRole('combobox', { name: 'Fruit' }))
    const status = screen.getByRole('status')
    expect(status).toBeEmptyDOMElement()
    await userEvent.type(screen.getByRole('combobox', { name: 'Search' }), 'zzz')
    expect(screen.getByRole('status')).toBe(status)
    expect(status).toHaveTextContent('No results')
    await userEvent.clear(screen.getByRole('combobox', { name: 'Search' }))
    expect(status).toBeEmptyDOMElement()
  })

  it('gives the focus back to the trigger on Tab from the search, so the Tab goes on from it', async () => {
    render(
      <>
        <button type="button">before</button>
        <Select searchable>
          <SelectTrigger aria-label="Fruit" />
          <SelectContent>{fruits}</SelectContent>
        </Select>
        <button type="button">after</button>
      </>,
    )
    await userEvent.click(screen.getByRole('combobox', { name: 'Fruit' }))
    expect(screen.getByRole('combobox', { name: 'Search' })).toHaveFocus()
    await userEvent.tab()
    expect(screen.getByRole('button', { name: 'after' })).toHaveFocus()
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('goes back to its default value when the form is reset', async () => {
    render(
      <form>
        <Select defaultValue="apple" name="fruit">
          <SelectTrigger aria-label="Fruit" />
          <SelectContent>{fruits}</SelectContent>
        </Select>
        <button type="reset">Reset</button>
      </form>,
    )
    const trigger = screen.getByRole('combobox', { name: 'Fruit' })
    await userEvent.click(trigger)
    await userEvent.click(screen.getByRole('option', { name: 'Banana' }))
    expect(trigger).toHaveTextContent('Banana')
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }))
    expect(trigger).toHaveTextContent('Apple')
  })

  it('goes back to nothing chosen when a form is reset and there is no default', async () => {
    render(
      <form>
        <Select multiple>
          <SelectTrigger aria-label="Fruits" placeholder="Pick" />
          <SelectContent>{fruits}</SelectContent>
        </Select>
        <button type="reset">Reset</button>
      </form>,
    )
    const trigger = screen.getByRole('combobox', { name: 'Fruits' })
    await userEvent.click(trigger)
    await userEvent.click(screen.getByRole('option', { name: 'Apple' }))
    expect(trigger).toHaveTextContent('Apple')
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }))
    expect(trigger).toHaveTextContent('Pick')
  })

  it('does not reset a controlled select: its owner decides', async () => {
    render(
      <form>
        <Select value="banana">
          <SelectTrigger aria-label="Fruit" />
          <SelectContent>{fruits}</SelectContent>
        </Select>
        <button type="reset">Reset</button>
      </form>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }))
    expect(screen.getByRole('combobox', { name: 'Fruit' })).toHaveTextContent('Banana')
  })
})
