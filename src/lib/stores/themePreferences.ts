import { createLocalStorageStore } from "$lib/hooks/localStorage";

export const THEME = {
  Base: "Base",
  Default: "Default",
  Corporate: "Corporate",
};

export type theme = keyof typeof THEME;

export const themeLables: Record<theme, string> = {
  Base: "Base Theme",
  Default: "Default Theme",
  Corporate: "Corporate Theme",
};

export interface ThemePreferences {
  theme: theme;
}

export const themePreferences = createLocalStorageStore<ThemePreferences>(
  "themePreferences",
  {
    theme: "Base",
  },
);
