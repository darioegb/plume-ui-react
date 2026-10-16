import type { ReactNode } from 'react'

const REPO_URL = 'https://github.com/darioegb/plume-ui-react'

// Only what the header doesn't already offer (brand, GitHub and npm live there).
const LINKS = [
  { label: 'Changelog', href: `${REPO_URL}/blob/main/CHANGELOG.md` },
  { label: 'Report an issue', href: `${REPO_URL}/issues/new` },
  { label: 'MIT License', href: `${REPO_URL}/blob/main/LICENSE` },
]

// Rendered by the docs container (see .storybook/preview.tsx), so it closes every docs page.
function Footer(): ReactNode {
  return (
    <footer className="plume-footer">
      <div className="plume-footer-content">
        <span>© 2023–{new Date().getFullYear()} Dario E Gonzalez B · Made&nbsp;in&nbsp;🇦🇷</span>
        <nav aria-label="Project links" className="plume-footer-links">
          {LINKS.map(({ label, href }) => (
            <a href={href} key={label} rel="noopener noreferrer" target="_blank">
              {label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}

export default Footer
