import type { DeepPartial, Theme } from "plume-ui-react";

const salmon = {
  "50": "#fef3f1",
  "100": "#fee6e2",
  "200": "#fdd0c9",
  "300": "#fcb0a5",
  "400": "#fb9588",
  "500": "#fa8072",
  "600": "#f06a5a",
  "700": "#e25a49",
  "800": "#bf4333",
  "900": "#8f3329",
  "950": "#4d1712",
};

// Each brand is a palette for `primary`, so the whole app changes color with it.
export const brands = {
  blue: {
    label: "Blue",
    palette: {
      "50": "#e8f1ff",
      "100": "#d5e4ff",
      "200": "#b3ccff",
      "300": "#85a8ff",
      "400": "#5676ff",
      "500": "#2f45ff",
      "600": "#0c0eff",
      "700": "#0000ff",
      "800": "#0609cd",
      "900": "#10169f",
      "950": "#0a0b5c",
    },
  },
  emerald: {
    label: "Emerald",
    palette: {
      "50": "#ecfdf5",
      "100": "#d1fae5",
      "200": "#a7f3d0",
      "300": "#6ee7b7",
      "400": "#34d399",
      "500": "#10b981",
      "600": "#059669",
      "700": "#047857",
      "800": "#065f46",
      "900": "#064e3b",
      "950": "#022c22",
    },
  },
  violet: {
    label: "Violet",
    palette: {
      "50": "#f5f3ff",
      "100": "#ede9fe",
      "200": "#ddd6fe",
      "300": "#c4b5fd",
      "400": "#a78bfa",
      "500": "#8b5cf6",
      "600": "#7c3aed",
      "700": "#6d28d9",
      "800": "#5b21b6",
      "900": "#4c1d95",
      "950": "#2e1065",
    },
  },
  rose: {
    label: "Rose",
    palette: {
      "50": "#fff1f2",
      "100": "#ffe4e6",
      "200": "#fecdd3",
      "300": "#fda4af",
      "400": "#fb7185",
      "500": "#f43f5e",
      "600": "#e11d48",
      "700": "#be123c",
      "800": "#9f1239",
      "900": "#881337",
      "950": "#4c0519",
    },
  },
  amber: {
    label: "Amber",
    palette: {
      "50": "#fffbeb",
      "100": "#fef3c7",
      "200": "#fde68a",
      "300": "#fcd34d",
      "400": "#fbbf24",
      "500": "#f59e0b",
      "600": "#d97706",
      "700": "#b45309",
      "800": "#92400e",
      "900": "#78350f",
      "950": "#451a03",
    },
  },
};

export type BrandId = keyof typeof brands;

export const defaultBrand: BrandId = "blue";

export const isBrand = (value: unknown): value is BrandId =>
  typeof value === "string" && value in brands;

export const themeFor = (brand: BrandId): DeepPartial<Theme> => ({
  colors: { primary: brands[brand].palette, salmon },
});
