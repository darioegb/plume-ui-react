import type { ReactNode } from "react"
import { useEffect, useState } from "react"

const THRESHOLD = 400

// Rendered by the docs container (see .storybook/preview.tsx), so every docs page gets it.
function ScrollToTop(): ReactNode {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const update = (): void => setVisible(window.scrollY > THRESHOLD)
    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [])

  if (!visible) return null

  const scrollToTop = (): void => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    window.scrollTo({ behavior: reduce ? "auto" : "smooth", top: 0 })
  }

  return (
    <button aria-label="Scroll to the top" className="plume-scroll-top" onClick={scrollToTop} type="button">
      <svg aria-hidden="true" fill="none" height="22" viewBox="0 0 24 24" width="22">
        <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
      </svg>
    </button>
  )
}

export default ScrollToTop
