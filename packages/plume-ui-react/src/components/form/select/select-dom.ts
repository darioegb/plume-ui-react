const optionSelector = '[role="option"]:not([aria-disabled="true"]):not([hidden])'

export const getEnabledOptions = (listbox: HTMLElement | null): HTMLElement[] =>
  listbox ? Array.from(listbox.querySelectorAll<HTMLElement>(optionSelector)) : []

export function stepOption(
  options: readonly HTMLElement[],
  activeId: string | undefined,
  step: number,
): HTMLElement | undefined {
  if (options.length === 0) return undefined
  const current = options.findIndex((option) => option.id === activeId)
  if (current === -1) return options[step < 0 ? options.length - 1 : 0]
  const next = Math.min(Math.max(current + step, 0), options.length - 1)
  const wraps = Math.abs(step) === 1
  if (wraps && current + step < 0) return options[options.length - 1]
  if (wraps && current + step > options.length - 1) return options[0]
  return options[next]
}

export const scrollOptionIntoView = (option: HTMLElement | undefined): void => {
  if (typeof option?.scrollIntoView === 'function') option.scrollIntoView({ block: 'nearest' })
}
