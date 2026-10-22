const TREE_ITEM = '[role="treeitem"]'

export const visibleItems = (root: HTMLElement | null): HTMLElement[] =>
  root
    ? Array.from(root.querySelectorAll<HTMLElement>(TREE_ITEM)).filter(
        (item) =>
          item.getAttribute('aria-disabled') !== 'true' &&
          !item.parentElement?.closest('[role="group"]:not([data-open])'),
      )
    : []

export const parentItem = (item: HTMLElement): HTMLElement | null => {
  const sibling = item.closest('[role="group"]')?.previousElementSibling
  return sibling?.matches(TREE_ITEM) ? (sibling as HTMLElement) : null
}

export const labelOf = (item: HTMLElement): string =>
  item.querySelector('[data-plume-tree-label]')?.textContent?.trim().toLowerCase() ?? ''

export const findTypeaheadMatch = (
  items: HTMLElement[],
  current: number,
  query: string,
): HTMLElement | undefined => {
  const text = query.toLowerCase()
  const repeated = [...text].every((letter) => letter === text[0])
  const needle = repeated ? (text[0] ?? '') : text
  const start = repeated || text.length === 1 ? current + 1 : current
  const ordered = [...items.slice(start), ...items.slice(0, start)]
  return ordered.find((item) => labelOf(item).startsWith(needle))
}
