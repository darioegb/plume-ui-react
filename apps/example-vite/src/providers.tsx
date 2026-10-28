import type { ReactNode } from "react";
import { createContext, useContext, useMemo, useState } from "react";
import {
  ThemeProvider,
  ToastProvider,
  type ColorModeSetting,
} from "plume-ui-react";
import { defaultBrand, isBrand, themeFor, type BrandId } from "./theme";

const BRAND_KEY = "plume-projects:brand";
const COLOR_MODE_KEY = "plume-projects:color-mode";

interface PreferencesContextValue {
  brand: BrandId;
  setBrand: (brand: BrandId) => void;
  setColorModeSetting: (setting: ColorModeSetting) => void;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function usePreferences(): PreferencesContextValue {
  const context = useContext(PreferencesContext);
  if (!context)
    throw new Error("usePreferences must be used within <Providers>");
  return context;
}

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn("Could not read demo preferences.", error);
    return null;
  }
}

function write(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn("Could not save demo preferences; the choice is temporary.", error);
  }
}

const isColorMode = (value: string | null): value is ColorModeSetting =>
  value === "light" || value === "dark" || value === "system";

// The app only runs in the browser, so the saved choices are read before the first render.
export function Providers({
  children,
}: Readonly<{ children: ReactNode }>): ReactNode {
  const [brand, setBrandState] = useState<BrandId>(() => {
    const saved = read(BRAND_KEY);
    return isBrand(saved) ? saved : defaultBrand;
  });
  const [colorMode] = useState<ColorModeSetting>(() => {
    const saved = read(COLOR_MODE_KEY);
    return isColorMode(saved) ? saved : "system";
  });
  const theme = useMemo(() => themeFor(brand), [brand]);
  const value = useMemo(
    () => ({
      brand,
      setBrand: (next: BrandId) => {
        setBrandState(next);
        write(BRAND_KEY, next);
      },
      setColorModeSetting: (next: ColorModeSetting) =>
        write(COLOR_MODE_KEY, next),
    }),
    [brand],
  );

  return (
    <PreferencesContext.Provider value={value}>
      <ThemeProvider
        defaultColorMode={colorMode}
        style={{ minHeight: "100vh" }}
        theme={theme}
      >
        <ToastProvider>{children}</ToastProvider>
      </ThemeProvider>
    </PreferencesContext.Provider>
  );
}
