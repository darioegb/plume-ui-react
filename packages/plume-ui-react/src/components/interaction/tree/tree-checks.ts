export interface TreeDescendant {
  disabled: boolean
  value: string
}

export type TreeStructure = Record<string, TreeDescendant[]>

export type TreeCheckState = boolean | 'mixed'

export const expandChecked = (
  checked: readonly string[],
  structure: TreeStructure,
  cascade: boolean,
): Set<string> => {
  const result = new Set(checked)
  if (!cascade) return result
  for (const value of checked) {
    for (const descendant of structure[value] ?? []) result.add(descendant.value)
  }
  return result
}

export const checkStateOf = (
  value: string,
  checked: ReadonlySet<string>,
  structure: TreeStructure,
  cascade: boolean,
): TreeCheckState => {
  const descendants = structure[value]
  if (!cascade || !descendants || descendants.length === 0) return checked.has(value)
  const count = descendants.filter((descendant) => checked.has(descendant.value)).length
  if (count === descendants.length) return true
  return count === 0 ? false : 'mixed'
}

const normalize = (checked: Set<string>, structure: TreeStructure): string[] => {
  const parents = Object.entries(structure).sort(([, a], [, b]) => a.length - b.length)
  for (const [value, descendants] of parents) {
    if (descendants.every((descendant) => checked.has(descendant.value))) checked.add(value)
    else checked.delete(value)
  }
  return Array.from(checked)
}

export const toggleChecked = (
  value: string,
  checked: ReadonlySet<string>,
  structure: TreeStructure,
  cascade: boolean,
): string[] => {
  const free = cascade ? (structure[value] ?? []).filter((item) => !item.disabled) : []
  const isChecked =
    free.length > 0
      ? free.every((item) => checked.has(item.value))
      : checkStateOf(value, checked, structure, cascade) === true
  const next = new Set(checked)
  for (const target of [value, ...free.map((item) => item.value)]) {
    if (isChecked) next.delete(target)
    else next.add(target)
  }
  return cascade ? normalize(next, structure) : Array.from(next)
}

export const readStructure = (root: HTMLElement | null): TreeStructure => {
  const structure: TreeStructure = {}
  if (!root) return structure
  for (const item of Array.from(root.querySelectorAll<HTMLElement>('[role="treeitem"]'))) {
    const group = item.nextElementSibling
    const value = item.dataset.plumeTreeValue
    if (value === undefined || group?.getAttribute('role') !== 'group') continue
    structure[value] = Array.from(group.querySelectorAll<HTMLElement>('[role="treeitem"]')).map(
      (descendant) => ({
        disabled: descendant.getAttribute('aria-disabled') === 'true',
        value: descendant.dataset.plumeTreeValue ?? '',
      }),
    )
  }
  return structure
}
