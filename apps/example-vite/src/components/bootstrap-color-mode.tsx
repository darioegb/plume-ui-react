import type { ReactNode } from "react";
import { useLayoutEffect } from "react";
import { useTheme } from "plume-ui-react";

export function BootstrapColorMode(): ReactNode {
  const { colorMode } = useTheme();

  useLayoutEffect(() => {
    const root = document.documentElement;
    const previous = root.getAttribute("data-bs-theme");
    root.setAttribute("data-bs-theme", colorMode);
    return () => {
      if (previous === null) root.removeAttribute("data-bs-theme");
      else root.setAttribute("data-bs-theme", previous);
    };
  }, [colorMode]);

  return null;
}
