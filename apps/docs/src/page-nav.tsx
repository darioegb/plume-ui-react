import type { ReactNode } from "react"
import { useEffect, useState } from "react"

interface Page {
  id: string
  title: string
}

interface IndexEntry {
  id: string
  title: string
  type: string
}

const labelOf = (title: string): string => title.split("/").at(-1) ?? title

const ChevronLeft = (): ReactNode => (
  <svg aria-hidden="true" fill="none" height="1em" viewBox="0 0 24 24" width="1em">
    <path d="m15 18-6-6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
  </svg>
)

const ChevronRight = (): ReactNode => (
  <svg aria-hidden="true" fill="none" height="1em" viewBox="0 0 24 24" width="1em">
    <path d="m9 18 6-6-6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
  </svg>
)

// Rendered by the docs container (see .storybook/preview.tsx); the index is already in sidebar order.
function PageNav(): ReactNode {
  const [pages, setPages] = useState<Page[]>([])

  useEffect(() => {
    let cancelled = false
    fetch("./index.json")
      .then((response) => response.json() as Promise<{ entries: Record<string, IndexEntry> }>)
      .then(({ entries }) => {
        if (cancelled) return
        setPages(
          Object.values(entries)
            .filter((entry) => entry.type === "docs")
            .map(({ id, title }) => ({ id, title })),
        )
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [])

  const currentId = typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("id")
  const index = pages.findIndex((page) => page.id === currentId)
  if (index === -1) return null
  const previous = pages[index - 1]
  const next = pages[index + 1]
  if (!previous && !next) return null

  return (
    <nav aria-label="Pages" className="plume-page-nav">
      {previous ? (
        <a className="plume-page-nav-link" href={`./?path=/docs/${previous.id}`} rel="prev" target="_top">
          <span className="plume-page-nav-hint">Previous</span>
          <span className="plume-page-nav-title">
            <ChevronLeft />
            {labelOf(previous.title)}
          </span>
        </a>
      ) : (
        <span />
      )}
      {next ? (
        <a className="plume-page-nav-link plume-page-nav-next" href={`./?path=/docs/${next.id}`} rel="next" target="_top">
          <span className="plume-page-nav-hint">Next</span>
          <span className="plume-page-nav-title">
            {labelOf(next.title)}
            <ChevronRight />
          </span>
        </a>
      ) : null}
    </nav>
  )
}

export default PageNav
