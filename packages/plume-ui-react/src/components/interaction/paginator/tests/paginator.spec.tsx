import { render, screen, within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { Paginator } from '..'
import type { PaginatorProps } from '..'

const pageButtons = (): HTMLElement[] =>
  screen
    .getAllByRole('button')
    .filter((button) => button.hasAttribute('data-plume-paginator-part'))
    .filter((button) => button.getAttribute('data-plume-paginator-part') === 'page')

const current = (): HTMLElement | null => document.querySelector('[aria-current="page"]')

function Controlled(props: Readonly<Partial<PaginatorProps>>) {
  const [page, setPage] = useState(1)
  return <Paginator count={10} onPageChange={setPage} page={page} {...props} />
}

describe('Paginator component', () => {
  describe('rendering', () => {
    it('is a navigation landmark named Pagination with a list inside', () => {
      render(<Paginator count={5} />)
      const nav = screen.getByRole('navigation', { name: 'Pagination' })
      expect(within(nav).getByRole('list')).toBeInTheDocument()
      expect(within(nav).getAllByRole('listitem').length).toBeGreaterThan(0)
    })

    it('uses the name of the user', () => {
      render(<Paginator aria-label="Results" count={5} />)
      expect(screen.getByRole('navigation', { name: 'Results' })).toBeInTheDocument()
    })

    it('can be named by another element', () => {
      render(
        <>
          <h2 id="results">Results</h2>
          <Paginator aria-labelledby="results" count={5} />
        </>,
      )
      expect(screen.getByRole('navigation', { name: 'Results' })).toBeInTheDocument()
    })

    it('shows the pages, the previous button and the next button', () => {
      render(<Paginator count={3} />)
      expect(screen.getByRole('button', { name: 'Previous page' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Next page' })).toBeInTheDocument()
      expect(pageButtons().map((button) => button.textContent)).toEqual(['1', '2', '3'])
    })

    it('renders nothing without pages', () => {
      const { container } = render(<Paginator count={0} />)
      expect(container).toBeEmptyDOMElement()
    })

    it('computes the pages from the total and the page size', () => {
      render(<Paginator pageSize={25} total={60} />)
      expect(pageButtons().map((button) => button.textContent)).toEqual(['1', '2', '3'])
    })

    it('uses ten items per page by default', () => {
      render(<Paginator total={21} />)
      expect(pageButtons()).toHaveLength(3)
    })

    it('prefers count over total', () => {
      render(<Paginator count={2} total={500} />)
      expect(pageButtons()).toHaveLength(2)
    })

    it('folds the middle of a long list behind ellipses', () => {
      render(<Paginator count={20} defaultPage={10} />)
      expect(pageButtons().map((button) => button.textContent)).toEqual([
        '1',
        '9',
        '10',
        '11',
        '20',
      ])
      expect(document.querySelectorAll('[data-plume-paginator-part="ellipsis"]')).toHaveLength(2)
    })

    it('hides the ellipses from assistive technology', () => {
      render(<Paginator count={20} defaultPage={10} />)
      document
        .querySelectorAll('[data-plume-paginator-part="ellipsis"]')
        .forEach((node) => expect(node).toHaveAttribute('aria-hidden', 'true'))
    })

    it('shows more siblings and boundaries on request', () => {
      render(<Paginator boundaryCount={2} count={20} defaultPage={10} siblingCount={2} />)
      expect(pageButtons().map((button) => button.textContent)).toEqual([
        '1',
        '2',
        '8',
        '9',
        '10',
        '11',
        '12',
        '19',
        '20',
      ])
    })

    it('adds the first and last buttons with showEdges', () => {
      render(<Paginator count={5} showEdges />)
      expect(screen.getByRole('button', { name: 'First page' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Last page' })).toBeInTheDocument()
    })

    it('does not show the edges by default', () => {
      render(<Paginator count={5} />)
      expect(screen.queryByRole('button', { name: 'First page' })).not.toBeInTheDocument()
    })
  })

  describe('current page', () => {
    it('starts on the first page', () => {
      render(<Paginator count={5} />)
      expect(current()).toHaveTextContent('1')
    })

    it('starts on defaultPage', () => {
      render(<Paginator count={5} defaultPage={3} />)
      expect(current()).toHaveTextContent('3')
    })

    it('marks only the current page with aria-current', () => {
      render(<Paginator count={5} defaultPage={2} />)
      expect(document.querySelectorAll('[aria-current]')).toHaveLength(1)
      expect(current()).toHaveAttribute('data-current')
    })

    it('says that a page is the current one in its name', () => {
      render(<Paginator count={5} defaultPage={2} />)
      expect(screen.getByRole('button', { name: 'Page 2, current page' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Page 3' })).toBeInTheDocument()
    })

    it('keeps the page between the first and the last', () => {
      const { rerender } = render(<Paginator count={5} page={99} />)
      expect(current()).toHaveTextContent('5')
      rerender(<Paginator count={5} page={-4} />)
      expect(current()).toHaveTextContent('1')
    })
  })

  describe('navigation', () => {
    it('goes to the page that is pressed', async () => {
      const onPageChange = vi.fn()
      render(<Paginator count={5} onPageChange={onPageChange} />)
      await userEvent.click(screen.getByRole('button', { name: 'Page 4' }))
      expect(onPageChange).toHaveBeenCalledWith(4)
      expect(current()).toHaveTextContent('4')
    })

    it('goes to the next and the previous page', async () => {
      render(<Paginator count={5} defaultPage={3} />)
      await userEvent.click(screen.getByRole('button', { name: 'Next page' }))
      expect(current()).toHaveTextContent('4')
      await userEvent.click(screen.getByRole('button', { name: 'Previous page' }))
      await userEvent.click(screen.getByRole('button', { name: 'Previous page' }))
      expect(current()).toHaveTextContent('2')
    })

    it('goes to the first and the last page', async () => {
      render(<Paginator count={9} defaultPage={5} showEdges />)
      await userEvent.click(screen.getByRole('button', { name: 'Last page' }))
      expect(current()).toHaveTextContent('9')
      await userEvent.click(screen.getByRole('button', { name: 'First page' }))
      expect(current()).toHaveTextContent('1')
    })

    it('disables the previous and first buttons on the first page', () => {
      render(<Paginator count={5} showEdges />)
      expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled()
      expect(screen.getByRole('button', { name: 'First page' })).toBeDisabled()
      expect(screen.getByRole('button', { name: 'Next page' })).toBeEnabled()
    })

    it('disables the next and last buttons on the last page', () => {
      render(<Paginator count={5} defaultPage={5} showEdges />)
      expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled()
      expect(screen.getByRole('button', { name: 'Last page' })).toBeDisabled()
      expect(screen.getByRole('button', { name: 'Previous page' })).toBeEnabled()
    })

    it('does not call onPageChange for the page that is already current', async () => {
      const onPageChange = vi.fn()
      render(<Paginator count={5} onPageChange={onPageChange} />)
      await userEvent.click(screen.getByRole('button', { name: 'Page 1, current page' }))
      expect(onPageChange).not.toHaveBeenCalled()
    })

    it('can be reached and used with the keyboard', async () => {
      render(<Paginator count={5} />)
      await userEvent.tab()
      expect(screen.getByRole('button', { name: 'Page 1, current page' })).toHaveFocus()
      await userEvent.tab()
      await userEvent.keyboard('{Enter}')
      expect(current()).toHaveTextContent('2')
    })
  })

  describe('controlled', () => {
    it('follows page and reports changes without changing by itself', async () => {
      const onPageChange = vi.fn()
      render(<Paginator count={5} onPageChange={onPageChange} page={2} />)
      await userEvent.click(screen.getByRole('button', { name: 'Page 4' }))
      expect(onPageChange).toHaveBeenCalledWith(4)
      expect(current()).toHaveTextContent('2')
    })

    it('updates when the parent changes the page', async () => {
      render(<Controlled />)
      await userEvent.click(screen.getByRole('button', { name: 'Next page' }))
      expect(current()).toHaveTextContent('2')
    })
  })

  describe('disabled', () => {
    it('disables every button', () => {
      render(<Paginator count={5} defaultPage={2} disabled showEdges />)
      screen.getAllByRole('button').forEach((button) => expect(button).toBeDisabled())
    })
  })

  describe('translation', () => {
    it('names the navigation with labels.pagination', () => {
      render(<Paginator count={5} labels={{ pagination: 'Paginación' }} />)
      expect(screen.getByRole('navigation', { name: 'Paginación' })).toBeInTheDocument()
    })

    it('uses the labels of the user', () => {
      render(
        <Paginator
          aria-label="Paginación"
          count={5}
          defaultPage={2}
          labels={{
            first: 'Primera',
            last: 'Última',
            next: 'Siguiente',
            page: (page, isCurrent) => (isCurrent ? `Página ${page}, actual` : `Página ${page}`),
            previous: 'Anterior',
          }}
          showEdges
        />,
      )
      expect(screen.getByRole('navigation', { name: 'Paginación' })).toBeInTheDocument()
      ;['Primera', 'Anterior', 'Siguiente', 'Última', 'Página 2, actual', 'Página 3'].forEach(
        (name) => expect(screen.getByRole('button', { name })).toBeInTheDocument(),
      )
    })
  })

  describe('appearance', () => {
    it('is solid and medium by default', () => {
      render(<Paginator count={5} />)
      expect(screen.getByRole('navigation')).toHaveClass('paginator', 'solid', 'md')
    })

    it.each(['ghost', 'outline', 'solid'] as const)('applies the %s variant', (variant) => {
      render(<Paginator count={5} variant={variant} />)
      expect(screen.getByRole('navigation')).toHaveClass(variant)
    })

    it('fills the current page of the solid variant and leaves the others flat', () => {
      render(<Paginator count={5} />)
      expect(current()).toHaveClass('solid')
      expect(screen.getByRole('button', { name: 'Page 2' })).toHaveClass('ghost')
    })

    it('outlines every page of the outline variant', () => {
      render(<Paginator count={5} variant="outline" />)
      pageButtons().forEach((button) => expect(button).toHaveClass('outline'))
    })

    it('colors only the current page', () => {
      render(<Paginator colorScheme="success" count={5} />)
      expect(current()).toHaveStyle('--button-solid-bg: var(--plume-color-success-solid)')
      expect(screen.getByRole('button', { name: 'Page 2' })).toHaveStyle(
        '--button-color: var(--plume-color-secondary-text)',
      )
    })

    it('applies the size and the shape to the buttons', () => {
      render(<Paginator count={5} shape="pill" size="lg" />)
      expect(screen.getByRole('navigation')).toHaveClass('lg')
      expect(current()).toHaveClass('lg', 'pill')
    })

    it('keeps the class and the style of the user on the root', () => {
      render(<Paginator className="mine" count={5} style={{ color: 'red' }} />)
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('paginator', 'mine')
      expect(nav).toHaveStyle({ color: 'rgb(255, 0, 0)' })
    })

    it('adds the classes of the user to every part', () => {
      render(
        <Paginator
          classNames={{
            ellipsis: 'e',
            first: 'f',
            item: 'i',
            last: 'l',
            list: 'ul',
            next: 'n',
            page: 'p',
            previous: 'pr',
          }}
          count={20}
          defaultPage={10}
          showEdges
        />,
      )
      expect(screen.getByRole('list')).toHaveClass('list', 'ul')
      expect(screen.getAllByRole('listitem')[0]).toHaveClass('item', 'i')
      expect(screen.getByRole('button', { name: 'First page' })).toHaveClass('f')
      expect(screen.getByRole('button', { name: 'Last page' })).toHaveClass('l')
      expect(screen.getByRole('button', { name: 'Next page' })).toHaveClass('n')
      expect(screen.getByRole('button', { name: 'Previous page' })).toHaveClass('pr')
      expect(current()).toHaveClass('page', 'p')
      expect(document.querySelector('[data-plume-paginator-part="ellipsis"]')).toHaveClass(
        'ellipsis',
        'e',
      )
    })

    it('drops every Plume class when it is unstyled and keeps the user ones', () => {
      render(
        <Paginator
          className="root"
          classNames={{ list: 'ul', page: 'p' }}
          count={20}
          defaultPage={10}
          variant="unstyled"
        />,
      )
      expect(screen.getByRole('navigation')).toHaveAttribute('class', 'root')
      expect(screen.getByRole('list')).toHaveAttribute('class', 'ul')
      expect(current()).toHaveAttribute('class', 'p')
      expect(screen.getAllByRole('listitem')[0]).not.toHaveAttribute('class')
      expect(document.querySelector('[data-plume-paginator-part="ellipsis"]')).not.toHaveAttribute(
        'class',
      )
    })
  })

  describe('root', () => {
    it('forwards the ref to the nav', () => {
      const ref = createRef<HTMLElement>()
      render(<Paginator count={5} ref={ref} />)
      expect(ref.current).toBe(screen.getByRole('navigation'))
    })

    it('forwards the id, the title and hidden', () => {
      render(<Paginator count={5} id="pages" title="Pages" />)
      expect(screen.getByRole('navigation')).toHaveAttribute('id', 'pages')
      expect(screen.getByRole('navigation')).toHaveAttribute('title', 'Pages')
    })
  })
})
