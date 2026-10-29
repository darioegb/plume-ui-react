import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import type StackBlitzSdk from "@stackblitz/sdk"
import { Button } from "plume-ui-react"

type Sdk = typeof StackBlitzSdk
type Files = Record<string, string>

interface Loaded {
  files: Files
  sdk: Sdk
}

const STACKBLITZ_LOGO = (
  <svg aria-hidden="true" fill="currentColor" focusable="false" height="1.25rem" viewBox="0 0 28 28" width="1.25rem">
    <path d="M12.747 16.273h-7.46L18.925 1.5l-3.671 10.227h7.46L9.075 26.5l3.671-10.227z" />
  </svg>
)

interface OpenInStackBlitzProps {
  label?: string
}

function OpenInStackBlitz({ label = "Open in StackBlitz" }: Readonly<OpenInStackBlitzProps>): ReactNode {
  const [loaded, setLoaded] = useState<Loaded | null>(null)

  useEffect(() => {
    let active = true
    Promise.all([import("@stackblitz/sdk"), import("./stackblitz-example.generated.json")])
      .then(([{ default: sdk }, { files }]) => {
        if (active) setLoaded({ files, sdk })
      })
      .catch(() => undefined)
    return () => {
      active = false
    }
  }, [])

  const open = (): void => {
    loaded?.sdk.openProject(
      {
        title: "Plume Projects (Vite)",
        description: "A Vite and React SPA built with plume-ui-react",
        template: "node",
        files: loaded.files,
      },
      { openFile: "src/main.tsx", newWindow: true },
    )
  }

  return (
    <Button disabled={!loaded} iconLeft={STACKBLITZ_LOGO} onClick={open} size="sm" variant="outline">
      {label}
    </Button>
  )
}

export default OpenInStackBlitz
