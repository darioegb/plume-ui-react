import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { DatePicker } from '../../../form/datepicker'
import { Select, SelectContent, SelectOption, SelectTrigger, SelectValue } from '../../../form/select'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '../../../interaction/dropdown'
import { Popover, PopoverContent, PopoverTrigger } from '../../popover'
import { Tooltip } from '../../tooltip'
import { Modal, ModalContent } from '..'

function Page(): React.ReactNode {
  return (
    <>
      <button>Behind</button>
      <Modal defaultOpen>
        <ModalContent aria-label="Form">
          <Select aria-label="Plan" defaultValue="a">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectOption value="a">Alpha</SelectOption>
              <SelectOption value="b">Beta</SelectOption>
            </SelectContent>
          </Select>
          <DatePicker onValueChange={() => undefined} />
          <Dropdown>
            <DropdownTrigger>
              <button>Menu</button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Actions">
              <DropdownItem>One</DropdownItem>
              <DropdownItem>Two</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Popover>
            <PopoverTrigger>
              <button>Details</button>
            </PopoverTrigger>
            <PopoverContent aria-label="More">
              <input aria-label="Note" />
            </PopoverContent>
          </Popover>
          <Tooltip content="Helpful">
            <button>Hint</button>
          </Tooltip>
          <button>Last</button>
        </ModalContent>
      </Modal>
    </>
  )
}

const form = (): HTMLElement => screen.getByRole('dialog', { name: 'Form' })

describe('popups inside a Modal', () => {
  it('keeps the focus in the calendar of a DatePicker while tabbing', async () => {
    render(<Page />)
    await userEvent.click(screen.getByRole('button', { name: /calendar/i }))
    const calendar = screen.getAllByRole('dialog').find((element) => element !== form())
    expect(calendar).toBeDefined()
    expect(calendar).toContainElement(document.activeElement as HTMLElement)
    for (let step = 0; step < 12; step += 1) {
      await userEvent.tab()
      expect(screen.getByText('Behind')).not.toHaveFocus()
      expect(document.activeElement).not.toBe(document.body)
    }
    expect(calendar).toContainElement(document.activeElement as HTMLElement)
  })

  it('closes the calendar with Escape and keeps the Modal open', async () => {
    render(<Page />)
    await userEvent.click(screen.getByRole('button', { name: /calendar/i }))
    await userEvent.keyboard('{Escape}')
    expect(screen.getAllByRole('dialog')).toHaveLength(1)
    expect(form()).toContainElement(document.activeElement as HTMLElement)
  })

  it('closes a Select with Escape and keeps the Modal open', async () => {
    render(<Page />)
    screen.getByRole('combobox').focus()
    await userEvent.keyboard('{ArrowDown}')
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true')
    await userEvent.keyboard('{Escape}')
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false')
    expect(form()).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toHaveFocus()
  })

  it('closes a Dropdown with Escape and gives the focus back to its trigger', async () => {
    render(<Page />)
    await userEvent.click(screen.getByText('Menu'))
    expect(screen.getByRole('menu')).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('menu')).toBeNull()
    expect(screen.getByText('Menu')).toHaveFocus()
    expect(form()).toBeInTheDocument()
  })

  it('reaches the Popover and comes back to the Modal when it closes with Tab', async () => {
    render(<Page />)
    await userEvent.click(screen.getByText('Details'))
    expect(screen.getByLabelText('Note')).toHaveFocus()
    await userEvent.tab()
    expect(screen.queryByRole('dialog', { name: 'More' })).toBeNull()
    expect(screen.getByText('Details')).toHaveFocus()
    await userEvent.tab()
    expect(form()).toContainElement(document.activeElement as HTMLElement)
  })

  it('closes a Tooltip with Escape without closing the Modal', async () => {
    render(<Page />)
    await userEvent.tab()
    screen.getByText('Hint').focus()
    await userEvent.keyboard('{Escape}')
    expect(form()).toBeInTheDocument()
  })

  it('keeps the focus inside the Modal when tabbing from the last control while a Tooltip is open', async () => {
    render(<Page />)
    await userEvent.hover(screen.getByText('Hint'))
    expect(await screen.findByRole('tooltip')).toBeInTheDocument()
    screen.getByText('Last').focus()
    await userEvent.keyboard('{Tab}')
    expect(form()).toContainElement(document.activeElement as HTMLElement)
    expect(screen.getByText('Behind')).not.toHaveFocus()
  })

  it('keeps the focus inside the Modal when tabbing out of an open Select', async () => {
    render(<Page />)
    const combobox = screen.getByRole('combobox')
    combobox.focus()
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.tab({ shift: true })
    expect(screen.getByText('Behind')).not.toHaveFocus()
    expect(form()).toContainElement(document.activeElement as HTMLElement)
  })

  it('wraps the focus inside the Modal when nothing else is open', async () => {
    render(<Page />)
    screen.getByText('Last').focus()
    await userEvent.tab()
    expect(form()).toContainElement(document.activeElement as HTMLElement)
    expect(screen.getByText('Behind')).not.toHaveFocus()
  })
})
