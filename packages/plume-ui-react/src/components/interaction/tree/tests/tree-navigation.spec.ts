import { findTypeaheadMatch, labelOf, parentItem, visibleItems } from '../tree-navigation'

const build = (html: string): HTMLElement => {
  const root = document.createElement('div')
  root.innerHTML = html
  document.body.append(root)
  return root
}

afterEach(() => {
  document.body.innerHTML = ''
})

const item = (value: string, label: string, extra = '', group = ''): string =>
  `<div><div role="treeitem" data-plume-tree-value="${value}" ${extra}><span data-plume-tree-label>${label}</span></div>${group}</div>`

describe('tree navigation', () => {
  it('lists the items in document order', () => {
    const root = build(item('a', 'Alpha') + item('b', 'Beta'))
    expect(visibleItems(root).map((node) => node.dataset.plumeTreeValue)).toEqual(['a', 'b'])
  })

  it('skips the items of a closed group, but not those of an open one', () => {
    const closed = `<div role="group">${item('a1', 'Inner')}</div>`
    const open = `<div role="group" data-open>${item('b1', 'Inner')}</div>`
    const root = build(item('a', 'A', '', closed) + item('b', 'B', '', open))
    expect(visibleItems(root).map((node) => node.dataset.plumeTreeValue)).toEqual(['a', 'b', 'b1'])
  })

  it('skips the items of a group inside a closed group', () => {
    const inner = `<div role="group" data-open>${item('c', 'C')}</div>`
    const outer = `<div role="group">${item('b', 'B', '', inner)}</div>`
    const root = build(item('a', 'A', '', outer))
    expect(visibleItems(root).map((node) => node.dataset.plumeTreeValue)).toEqual(['a'])
  })

  it('skips disabled items', () => {
    const root = build(item('a', 'A', 'aria-disabled="true"') + item('b', 'B'))
    expect(visibleItems(root).map((node) => node.dataset.plumeTreeValue)).toEqual(['b'])
  })

  it('has no items without a root', () => {
    expect(visibleItems(null)).toEqual([])
  })

  it('finds the parent item', () => {
    const root = build(item('a', 'A', '', `<div role="group" data-open>${item('b', 'B')}</div>`))
    const [parent, child] = Array.from(root.querySelectorAll<HTMLElement>('[role="treeitem"]'))
    expect(parentItem(child)).toBe(parent)
    expect(parentItem(parent)).toBeNull()
  })

  it('reads the label of an item and not the one of its children', () => {
    const root = build(item('a', ' Alpha ', '', `<div role="group">${item('b', 'Beta')}</div>`))
    expect(labelOf(root.querySelector('[role="treeitem"]') as HTMLElement)).toBe('alpha')
  })

  it('has an empty label without a label element', () => {
    const root = build('<div role="treeitem"></div>')
    expect(labelOf(root.firstElementChild as HTMLElement)).toBe('')
  })

  describe('typeahead', () => {
    const items = (): HTMLElement[] =>
      visibleItems(
        build(item('a', 'Apple') + item('b', 'Banana') + item('c', 'Avocado') + item('d', 'Berry')),
      )

    it('finds the next item that starts with the letter, after the current one', () => {
      const list = items()
      expect(findTypeaheadMatch(list, 0, 'a')).toBe(list[2])
      expect(findTypeaheadMatch(list, 2, 'a')).toBe(list[0])
    })

    it('wraps around to the start', () => {
      const list = items()
      expect(findTypeaheadMatch(list, 3, 'b')).toBe(list[1])
    })

    it('matches a longer text from the current item', () => {
      const list = items()
      expect(findTypeaheadMatch(list, 2, 'av')).toBe(list[2])
      expect(findTypeaheadMatch(list, 0, 'ber')).toBe(list[3])
    })

    it('cycles with the same letter repeated', () => {
      const list = items()
      expect(findTypeaheadMatch(list, 0, 'aa')).toBe(list[2])
    })

    it('ignores the case', () => {
      const list = items()
      expect(findTypeaheadMatch(list, 0, 'B')).toBe(list[1])
    })

    it('finds nothing when no item matches', () => {
      expect(findTypeaheadMatch(items(), 0, 'z')).toBeUndefined()
    })
  })
})
