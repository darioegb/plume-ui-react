import { render } from '@testing-library/react'
import {
  Paginator,
  PaginatorItem,
  PaginatorList,
  PaginatorNext,
  PaginatorPageSize,
  PaginatorPrevious,
} from '..'

const BUTTON_WIDTH = 28

const mockLayout = (width: number): void => {
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(function (
    this: HTMLElement,
  ) {
    return this.hasAttribute('data-plume-paginator') ? width : 0
  })
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: Element,
  ) {
    const isButton = this.hasAttribute('data-plume-paginator-item')
    const isOther = this.hasAttribute('data-plume-paginator-page-size')
    const measured = isButton ? BUTTON_WIDTH : isOther ? 100 : 0
    return { width: measured } as DOMRect
  })
}

const pageNumbers = (): string[] =>
  Array.from(document.querySelectorAll('[data-plume-paginator-page]')).map(
    (page) => page.textContent ?? '',
  )

afterEach(() => vi.restoreAllMocks())

describe('Paginator fit', () => {
  it('shows every page it was asked for when it has no way to measure the row', () => {
    render(<Paginator pageSize={10} total={240} />)
    expect(pageNumbers()).toEqual(['1', '2', '3', '4', '5', '24'])
  })

  it('shows every page it was asked for when the row has room', () => {
    mockLayout(1000)
    render(<Paginator pageSize={10} total={240} />)
    expect(pageNumbers()).toEqual(['1', '2', '3', '4', '5', '24'])
  })

  it('shows fewer pages when the row is narrow, keeping it on one line', () => {
    mockLayout(BUTTON_WIDTH * 7)
    render(<Paginator pageSize={10} total={240} />)
    expect(pageNumbers()).toEqual(['1', '2', '3', '24'])
  })

  it('shows only what is around the current page when there is almost no room', () => {
    mockLayout(BUTTON_WIDTH * 4)
    render(<Paginator defaultPage={12} pageSize={10} total={240} />)
    expect(pageNumbers()).toEqual(['12'])
  })

  it('leaves room for the other parts of the row', () => {
    mockLayout(260)
    const { unmount } = render(
      <Paginator pageSize={10} total={240}>
        <PaginatorList />
      </Paginator>,
    )
    expect(pageNumbers()).toEqual(['1', '2', '3', '4', '5', '24'])
    unmount()

    render(
      <Paginator pageSize={10} total={240}>
        <PaginatorList />
        <PaginatorPageSize options={[10, 25]} />
      </Paginator>,
    )
    expect(pageNumbers().length).toBeLessThan(6)
  })

  it('leaves a list without page numbers as it is', () => {
    mockLayout(50)
    render(
      <Paginator pageSize={10} total={240}>
        <PaginatorList>
          <PaginatorItem>
            <PaginatorPrevious />
          </PaginatorItem>
          <PaginatorItem>
            <PaginatorNext />
          </PaginatorItem>
        </PaginatorList>
      </Paginator>,
    )
    expect(document.querySelectorAll('[data-plume-paginator-item]')).toHaveLength(2)
  })

  it('shows more pages when the row gets wider', () => {
    mockLayout(BUTTON_WIDTH * 7)
    const { rerender } = render(<Paginator pageSize={10} total={240} />)
    expect(pageNumbers()).toEqual(['1', '2', '3', '24'])
    vi.restoreAllMocks()
    mockLayout(BUTTON_WIDTH * 12)
    rerender(<Paginator pageSize={10} total={250} />)
    expect(pageNumbers()).toEqual(['1', '2', '3', '4', '5', '25'])
  })
})
