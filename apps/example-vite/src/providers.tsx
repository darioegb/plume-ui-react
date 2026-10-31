import type { ReactNode } from "react";
import { createContext, useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  LocaleProvider,
  ThemeProvider,
  ToastProvider,
  type ColorModeSetting,
} from "plume-ui-react";
import { BootstrapColorMode } from "./components/bootstrap-color-mode";
import { plumeMessages } from "./i18n/plume-messages";
import { read, write } from "./lib/storage";
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
  const { i18n, t } = useTranslation();
  const theme = useMemo(() => themeFor(brand), [brand]);
  const messages = useMemo(() => plumeMessages(t), [t]);
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
        <BootstrapColorMode />
        <LocaleProvider locale={i18n.language} messages={messages}>
          <ToastProvider>{children}</ToastProvider>
        </LocaleProvider>
      </ThemeProvider>
    </PreferencesContext.Provider>
  );
}
