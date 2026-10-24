import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef, type CSSProperties } from 'react'
import {
  Paginator,
  PaginatorEllipsis,
  PaginatorFirst,
  PaginatorItem,
  PaginatorLast,
  PaginatorList,
  PaginatorNext,
  PaginatorPage,
  PaginatorPages,
  PaginatorPrevious,
} from '..'

const attr = (name: string): HTMLElement[] =>
  Array.from(document.querySelectorAll<HTMLElement>(`[data-plume-paginator-${name}]`))

describe('Paginator parts', () => {
  it('builds the default from the same parts', () => {
    render(<Paginator count={20} defaultPage={10} showEdges />)
    expect(attr('list')).toHaveLength(1)
    expect(attr('item')).toHaveLength(attr('page').length + attr('ellipsis').length + 4)
    expect(attr('first')).toHaveLength(1)
    expect(attr('previous')).toHaveLength(1)
    expect(attr('next')).toHaveLength(1)
    expect(attr('last')).toHaveLength(1)
    expect(attr('ellipsis')).toHaveLength(2)
    expect(attr('page')[0]).toHaveAttribute('aria-label', 'Page 1')
  })

  it('leaves out the edges when showEdges is off', () => {
    render(<Paginator count={5} />)
    expect(attr('first')).toHaveLength(0)
    expect(attr('last')).toHaveLength(0)
  })

  it('renders its children instead of the default', () => {
    render(
      <Paginator count={5}>
        <PaginatorList>
          <PaginatorItem>
            <PaginatorNext />
          </PaginatorItem>
          <PaginatorItem>
            <PaginatorPrevious />
          </PaginatorItem>
        </PaginatorList>
        <span>Page 1 of 5</span>
      </Paginator>,
    )
    expect(attr('page')).toHaveLength(0)
    const buttons = screen.getAllByRole('button').map((button) => button.getAttribute('aria-label'))
    expect(buttons).toEqual(['Next page', 'Previous page'])
    expect(screen.getByText('Page 1 of 5')).toBeInTheDocument()
  })

  it('finds its root when a part is wrapped in a component of its own', async () => {
    function Mine(): React.ReactNode {
      return (
        <PaginatorItem>
          <PaginatorNext className="mine" />
        </PaginatorItem>
      )
    }
    render(
      <Paginator count={3}>
        <PaginatorList>
          <Mine />
        </PaginatorList>
      </Paginator>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }))
    expect(screen.getByRole('button', { name: 'Next page' })).toHaveClass('mine')
  })

  it('composes the pages with a function', () => {
    render(
      <Paginator count={20} defaultPage={10}>
        <PaginatorList>
          <PaginatorPages>
            {(entry, position) =>
              typeof entry === 'number' ? (
                <PaginatorItem className={`entry-${position}`}>
                  <PaginatorPage page={entry}>#{entry}</PaginatorPage>
                </PaginatorItem>
              ) : (
                <PaginatorItem>
                  <PaginatorEllipsis>~</PaginatorEllipsis>
                </PaginatorItem>
              )
            }
          </PaginatorPages>
        </PaginatorList>
      </Paginator>,
    )
    expect(attr('page')[0]).toHaveTextContent('#1')
    expect(attr('ellipsis')[0]).toHaveTextContent('~')
    expect(attr('item')[0]).toHaveClass('entry-0')
  })

  describe.each<[string, string, () => React.ReactNode]>([
    ['PaginatorList', 'list', () => <PaginatorList className="mine" style={{ opacity: 0.5 }} />],
    ['PaginatorItem', 'item', () => <PaginatorItem className="mine" style={{ opacity: 0.5 }} />],
    [
      'PaginatorPage',
      'page',
      () => <PaginatorPage className="mine" page={1} style={{ opacity: 0.5 }} />,
    ],
    [
      'PaginatorEllipsis',
      'ellipsis',
      () => <PaginatorEllipsis className="mine" style={{ opacity: 0.5 }} />,
    ],
    ['PaginatorFirst', 'first', () => <PaginatorFirst className="mine" style={{ opacity: 0.5 }} />],
    [
      'PaginatorPrevious',
      'previous',
      () => <PaginatorPrevious className="mine" style={{ opacity: 0.5 }} />,
    ],
    ['PaginatorNext', 'next', () => <PaginatorNext className="mine" style={{ opacity: 0.5 }} />],
    ['PaginatorLast', 'last', () => <PaginatorLast className="mine" style={{ opacity: 0.5 }} />],
  ])('%s', (name, part, bare) => {
    it('takes the class and the style, and carries its data attribute', () => {
      render(
        <Paginator count={5}>
          {part === 'list' ? bare() : <PaginatorList>{bare()}</PaginatorList>}
        </Paginator>,
      )
      const element = attr(part)[0]
      expect(element).toHaveClass('mine')
      expect(element).toHaveStyle({ opacity: '0.5' })
    })

    it('throws outside the Paginator', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
      expect(() => render(bare())).toThrow(`${name} must be used within a <Paginator>`)
      error.mockRestore()
    })
  })

  it('forwards the ref of every part to its element', () => {
    const refs = {
      ellipsis: createRef<HTMLSpanElement>(),
      first: createRef<HTMLButtonElement>(),
      item: createRef<HTMLLIElement>(),
      last: createRef<HTMLButtonElement>(),
      list: createRef<HTMLUListElement>(),
      next: createRef<HTMLButtonElement>(),
      page: createRef<HTMLButtonElement>(),
      previous: createRef<HTMLButtonElement>(),
    }
    render(
      <Paginator count={5}>
        <PaginatorList ref={refs.list}>
          <PaginatorItem ref={refs.item}>
            <PaginatorFirst ref={refs.first} />
            <PaginatorPrevious ref={refs.previous} />
            <PaginatorPage page={2} ref={refs.page} />
            <PaginatorEllipsis ref={refs.ellipsis} />
            <PaginatorNext ref={refs.next} />
            <PaginatorLast ref={refs.last} />
          </PaginatorItem>
        </PaginatorList>
      </Paginator>,
    )
    for (const [part, ref] of Object.entries(refs)) expect(ref.current).toBe(attr(part)[0])
  })

  describe('PaginatorPage', () => {
    it('shows the number, marks the current page and goes to its page', async () => {
      render(
        <Paginator count={5} defaultPage={2}>
          <PaginatorList>
            <PaginatorPage page={2} />
            <PaginatorPage page={3} />
          </PaginatorList>
        </Paginator>,
      )
      const [two, three] = attr('page')
      expect(two).toHaveAttribute('aria-current', 'page')
      expect(two).toHaveAttribute('data-current')
      expect(two).toHaveAttribute('aria-label', 'Page 2, current page')
      expect(three).not.toHaveAttribute('aria-current')
      expect(three).toHaveTextContent('3')
      await userEvent.click(three)
      expect(three).toHaveAttribute('aria-current', 'page')
    })

    it('uses the name and the children of the user', () => {
      render(
        <Paginator count={5}>
          <PaginatorList>
            <PaginatorPage aria-label="First one" page={1}>
              one
            </PaginatorPage>
          </PaginatorList>
        </Paginator>,
      )
      expect(screen.getByRole('button', { name: 'First one' })).toHaveTextContent('one')
    })

    it('runs onClick first and stays when it prevents the default', async () => {
      const onClick = vi.fn((event: React.MouseEvent) => event.preventDefault())
      render(
        <Paginator count={5}>
          <PaginatorList>
            <PaginatorPage onClick={onClick} page={1} />
            <PaginatorPage onClick={onClick} page={2} />
          </PaginatorList>
        </Paginator>,
      )
      await userEvent.click(attr('page')[1])
      expect(onClick).toHaveBeenCalledTimes(1)
      expect(attr('page')[0]).toHaveAttribute('aria-current', 'page')
    })

    it('is disabled with the root or by itself', () => {
      render(
        <Paginator count={5} disabled>
          <PaginatorList>
            <PaginatorPage page={1} />
          </PaginatorList>
        </Paginator>,
      )
      expect(attr('page')[0]).toBeDisabled()
      render(
        <Paginator count={5}>
          <PaginatorList>
            <PaginatorPage disabled page={1} />
          </PaginatorList>
        </Paginator>,
      )
      expect(attr('page')[1]).toBeDisabled()
    })
  })

  describe('edges', () => {
    const edges = (): React.ReactNode => (
      <Paginator count={5} defaultPage={3}>
        <PaginatorList>
          <PaginatorFirst />
          <PaginatorPrevious />
          <PaginatorNext />
          <PaginatorLast />
        </PaginatorList>
      </Paginator>
    )

    it('go to the first, previous, next and last page', async () => {
      const onPageChange = vi.fn<(page: number) => void>()
      render(
        <Paginator count={5} defaultPage={3} onPageChange={onPageChange}>
          <PaginatorList>
            <PaginatorFirst />
            <PaginatorPrevious />
            <PaginatorNext />
            <PaginatorLast />
          </PaginatorList>
        </Paginator>,
      )
      await userEvent.click(screen.getByRole('button', { name: 'Previous page' }))
      await userEvent.click(screen.getByRole('button', { name: 'Last page' }))
      await userEvent.click(screen.getByRole('button', { name: 'First page' }))
      await userEvent.click(screen.getByRole('button', { name: 'Next page' }))
      expect(onPageChange.mock.calls.map(([page]) => page)).toEqual([2, 5, 1, 2])
    })

    it('are disabled where there is nowhere to go', () => {
      render(
        <Paginator count={3} defaultPage={1}>
          <PaginatorList>
            <PaginatorFirst />
            <PaginatorPrevious />
            <PaginatorNext />
            <PaginatorLast />
          </PaginatorList>
        </Paginator>,
      )
      expect(attr('first')[0]).toBeDisabled()
      expect(attr('previous')[0]).toBeDisabled()
      expect(attr('next')[0]).toBeEnabled()
      expect(attr('last')[0]).toBeEnabled()
    })

    it('have a name from the labels, and the children replace the icon', () => {
      render(
        <Paginator count={5} defaultPage={3} labels={{ next: 'Siguiente' }}>
          <PaginatorList>
            <PaginatorNext>Go</PaginatorNext>
            <PaginatorPrevious aria-label="Back" />
          </PaginatorList>
        </Paginator>,
      )
      expect(screen.getByRole('button', { name: 'Siguiente' })).toHaveTextContent('Go')
      expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument()
    })

    it('run onClick first and stay when it prevents the default', async () => {
      const onClick = vi.fn((event: React.MouseEvent) => event.preventDefault())
      render(
        <Paginator count={5} defaultPage={3}>
          <PaginatorList>
            <PaginatorNext onClick={onClick} />
            <PaginatorPage page={3} />
          </PaginatorList>
        </Paginator>,
      )
      await userEvent.click(screen.getByRole('button', { name: 'Next page' }))
      expect(onClick).toHaveBeenCalledTimes(1)
      expect(attr('page')[0]).toHaveAttribute('aria-current', 'page')
    })

    it('are disabled with the root', () => {
      render(
        <Paginator count={5} defaultPage={3} disabled>
          <PaginatorList>
            <PaginatorNext />
          </PaginatorList>
        </Paginator>,
      )
      expect(attr('next')[0]).toBeDisabled()
    })

    it('render in the order they are written', () => {
      render(edges())
      expect(
        screen.getAllByRole('button').map((button) => button.getAttribute('aria-label')),
      ).toEqual(['First page', 'Previous page', 'Next page', 'Last page'])
    })
  })

  describe('unstyled', () => {
    it('drops the Plume classes of every part and keeps the structure', () => {
      const style: CSSProperties = { opacity: 0.5 }
      render(
        <Paginator count={20} defaultPage={10} variant="unstyled">
          <PaginatorList className="mine" style={style}>
            <PaginatorItem>
              <PaginatorEllipsis />
            </PaginatorItem>
            <PaginatorItem className="item">
              <PaginatorPage page={1} />
            </PaginatorItem>
          </PaginatorList>
        </Paginator>,
      )
      expect(attr('list')[0].className).toBe('mine')
      expect(attr('item')[0].className).toBe('')
      expect(attr('item')[1].className).toBe('item')
      expect(attr('ellipsis')[0].className).toBe('')
      expect(attr('page')[0].className).toBe('')
    })
  })
})
