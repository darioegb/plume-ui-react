import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { Paginator, PaginatorList, PaginatorPageSize, PaginatorSummary } from '..'
import { SelectContent, SelectOption, SelectTrigger } from '../../../form/select'
import { LocaleProvider } from '../../../../locale/locale-provider'

const attr = (name: string): HTMLElement | null =>
  document.querySelector<HTMLElement>(`[data-plume-paginator-${name}]`)

const chooseSize = async (size: number): Promise<void> => {
  await userEvent.click(screen.getByRole('combobox', { name: 'Items per page' }))
  await userEvent.click(screen.getByRole('option', { name: String(size) }))
}

describe('PaginatorSummary', () => {
  it('shows the range of the current page', async () => {
    render(
      <Paginator total={54}>
        <PaginatorSummary />
        <PaginatorList />
      </Paginator>,
    )
    expect(attr('summary')).toHaveTextContent('1–10 of 54')
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }))
    expect(attr('summary')).toHaveTextContent('11–20 of 54')
  })

  it('ends at the total on the last page', () => {
    render(
      <Paginator defaultPage={6} total={54}>
        <PaginatorSummary />
      </Paginator>,
    )
    expect(attr('summary')).toHaveTextContent('51–54 of 54')
  })

  it('starts at zero when there is nothing to show', () => {
    render(
      <Paginator total={0}>
        <PaginatorSummary />
      </Paginator>,
    )
    expect(attr('summary')).toHaveTextContent('0–0 of 0')
  })

  it('takes its text from labels.summary', () => {
    render(
      <Paginator
        labels={{ summary: (from, to, total) => `${from} a ${to} de ${total}` }}
        total={54}
      >
        <PaginatorSummary />
      </Paginator>,
    )
    expect(attr('summary')).toHaveTextContent('1 a 10 de 54')
  })

  it('takes its text from the LocaleProvider', () => {
    render(
      <LocaleProvider messages={{ paginator: { summary: (from, to) => `Del ${from} al ${to}` } }}>
        <Paginator total={54}>
          <PaginatorSummary />
        </Paginator>
      </LocaleProvider>,
    )
    expect(attr('summary')).toHaveTextContent('Del 1 al 10')
  })

  it('replaces the text with its children', () => {
    render(
      <Paginator total={54}>
        <PaginatorSummary>54 results</PaginatorSummary>
      </Paginator>,
    )
    expect(attr('summary')).toHaveTextContent('54 results')
  })

  it('takes the class, the style and the ref, and carries its data attribute', () => {
    const ref = createRef<HTMLSpanElement>()
    render(
      <Paginator total={54}>
        <PaginatorSummary className="mine" ref={ref} style={{ opacity: 0.5 }} />
      </Paginator>,
    )
    expect(attr('summary')).toHaveClass('mine')
    expect(attr('summary')).toHaveStyle({ opacity: '0.5' })
    expect(ref.current).toBe(attr('summary'))
  })

  it('throws outside the Paginator', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => render(<PaginatorSummary />)).toThrow(
      'PaginatorSummary must be used within a <Paginator>',
    )
    error.mockRestore()
  })
})

describe('PaginatorPageSize', () => {
  it('shows the current size in a select named by labels.pageSize', () => {
    render(
      <Paginator defaultPageSize={20} total={100}>
        <PaginatorPageSize />
      </Paginator>,
    )
    expect(screen.getByRole('combobox', { name: 'Items per page' })).toHaveTextContent('20')
  })

  it('offers the options, with the current size added when it is missing', async () => {
    render(
      <Paginator defaultPageSize={25} total={100}>
        <PaginatorPageSize options={[10, 50]} />
      </Paginator>,
    )
    await userEvent.click(screen.getByRole('combobox', { name: 'Items per page' }))
    expect(screen.getAllByRole('option').map((item) => item.textContent)).toEqual([
      '10',
      '25',
      '50',
    ])
  })

  it('changes the page size, the pages and the summary', async () => {
    const onPageSizeChange = vi.fn()
    render(
      <Paginator onPageSizeChange={onPageSizeChange} total={100}>
        <PaginatorSummary />
        <PaginatorList />
        <PaginatorPageSize />
      </Paginator>,
    )
    expect(screen.getAllByRole('button', { name: /^Page \d/ })).toHaveLength(6)
    await chooseSize(50)
    expect(onPageSizeChange).toHaveBeenCalledWith(50)
    expect(attr('summary')).toHaveTextContent('1–50 of 100')
    expect(screen.getAllByRole('button', { name: /^Page \d/ })).toHaveLength(2)
  })

  it('keeps the first item of the old page in view', async () => {
    const onPageChange = vi.fn()
    render(
      <Paginator defaultPage={3} onPageChange={onPageChange} total={100}>
        <PaginatorSummary />
        <PaginatorPageSize />
      </Paginator>,
    )
    expect(attr('summary')).toHaveTextContent('21–30 of 100')
    await chooseSize(20)
    expect(onPageChange).toHaveBeenCalledWith(2)
    expect(attr('summary')).toHaveTextContent('21–40 of 100')
  })

  it('stays on the page when it still holds the first item', async () => {
    const onPageChange = vi.fn()
    render(
      <Paginator onPageChange={onPageChange} total={100}>
        <PaginatorPageSize />
      </Paginator>,
    )
    await chooseSize(20)
    expect(onPageChange).not.toHaveBeenCalled()
  })

  it('is controlled by pageSize', async () => {
    const onPageSizeChange = vi.fn()
    render(
      <Paginator onPageSizeChange={onPageSizeChange} pageSize={10} total={100}>
        <PaginatorSummary />
        <PaginatorPageSize />
      </Paginator>,
    )
    await chooseSize(20)
    expect(onPageSizeChange).toHaveBeenCalledWith(20)
    expect(attr('summary')).toHaveTextContent('1–10 of 100')
  })

  it('follows the size of its parent when it is controlled', async () => {
    function Controlled(): React.ReactNode {
      const [size, setSize] = useState(10)
      return (
        <Paginator onPageSizeChange={setSize} pageSize={size} total={100}>
          <PaginatorSummary />
          <PaginatorPageSize />
        </Paginator>
      )
    }
    render(<Controlled />)
    await chooseSize(20)
    expect(attr('summary')).toHaveTextContent('1–20 of 100')
  })

  it('names the select with aria-label and labels.pageSize', () => {
    render(
      <Paginator labels={{ pageSize: 'Por página' }} total={100}>
        <PaginatorPageSize />
        <PaginatorPageSize aria-label="Rows" />
      </Paginator>,
    )
    expect(screen.getByRole('combobox', { name: 'Por página' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Rows' })).toBeInTheDocument()
  })

  it('is disabled with the Paginator', () => {
    render(
      <Paginator disabled total={100}>
        <PaginatorPageSize />
      </Paginator>,
    )
    expect(screen.getByRole('combobox', { name: 'Items per page' })).toBeDisabled()
  })

  it('takes the class, the style and the ref, and carries its data attribute', () => {
    const ref = createRef<HTMLSpanElement>()
    render(
      <Paginator total={100}>
        <PaginatorPageSize className="mine" ref={ref} style={{ opacity: 0.5 }} />
      </Paginator>,
    )
    expect(attr('page-size')).toHaveClass('mine')
    expect(attr('page-size')).toHaveStyle({ opacity: '0.5' })
    expect(ref.current).toBe(attr('page-size'))
  })

  it('renders the parts of the Select it is given instead of the default ones', async () => {
    const onPageSizeChange = vi.fn()
    render(
      <Paginator onPageSizeChange={onPageSizeChange} total={100}>
        <PaginatorPageSize>
          <SelectTrigger aria-label="Rows" className="my-trigger" />
          <SelectContent>
            <SelectOption value="5">5 rows</SelectOption>
            <SelectOption value="10">10 rows</SelectOption>
          </SelectContent>
        </PaginatorPageSize>
      </Paginator>,
    )
    expect(screen.queryByRole('combobox', { name: 'Items per page' })).toBeNull()
    await userEvent.click(screen.getByRole('combobox', { name: 'Rows' }))
    await userEvent.click(screen.getByRole('option', { name: '5 rows' }))
    expect(onPageSizeChange).toHaveBeenCalledWith(5)
    expect(document.querySelector('.my-trigger')).not.toBeNull()
  })

  it('drops its Plume class when the Paginator is unstyled', () => {
    render(
      <Paginator total={100} variant="unstyled">
        <PaginatorPageSize className="mine" />
      </Paginator>,
    )
    expect(attr('page-size')).toHaveAttribute('class', 'mine')
  })

  it('exposes the disabled state', () => {
    render(
      <Paginator disabled total={100}>
        <PaginatorPageSize />
      </Paginator>,
    )
    expect(attr('page-size')).toHaveAttribute('data-disabled', '')
  })

  it('throws outside the Paginator', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => render(<PaginatorPageSize />)).toThrow(
      'PaginatorPageSize must be used within a <Paginator>',
    )
    error.mockRestore()
  })
})
